"use client";

import { useEffect, useState } from "react";
import { MapPin, Navigation } from "lucide-react";

interface RadarMapProps {
  isScanning: boolean;
  hasLocation: boolean;
}

export const RadarMap = ({ isScanning, hasLocation }: RadarMapProps) => {
  const [points, setPoints] = useState<{ x: number; y: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate random mock restaurant pins when location is active
    if (hasLocation && !isScanning) {
      const newPoints = Array.from({ length: 6 }).map(() => ({
        x: 20 + Math.random() * 60, // 20% to 80%
        y: 20 + Math.random() * 60,
        delay: Math.random() * 2,
      }));
      setPoints(newPoints);
    } else {
      setPoints([]);
    }
  }, [hasLocation, isScanning]);

  return (
    <div className="relative w-full h-[250px] md:h-[300px] bg-black/40 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden mt-6 shadow-[0_0_40px_rgba(59,130,246,0.15)]">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* Center User Pin */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
        <div className="relative">
          {isScanning && (
            <div className="absolute inset-0 border-[3px] border-blue-500 rounded-full animate-ping opacity-75" />
          )}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.8)] z-10 relative transition-colors duration-500 ${hasLocation ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/50'}`}>
            <Navigation size={14} className={hasLocation && !isScanning ? "transform -rotate-45" : ""} />
          </div>
        </div>
        {hasLocation && !isScanning && (
          <span className="text-[10px] font-bold text-blue-400 mt-2 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 backdrop-blur-md">You</span>
        )}
      </div>

      {/* Radar Sweep Animation */}
      {isScanning && (
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 origin-center animate-spin" style={{ animationDuration: '3s', animationTimingFunction: 'linear' }}>
          <div className="w-1/2 h-1/2 border-r-[2px] border-b-[2px] border-blue-500 rounded-br-full bg-gradient-to-tl from-blue-500/30 to-transparent" />
        </div>
      )}

      {/* Concentric Rings */}
      <div className="absolute top-1/2 left-1/2 w-[100px] h-[100px] -translate-x-1/2 -translate-y-1/2 border border-blue-500/20 rounded-full" />
      <div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] -translate-x-1/2 -translate-y-1/2 border border-blue-500/20 rounded-full" />
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 border border-blue-500/10 rounded-full" />

      {/* Discovered Restaurant Pins */}
      {points.map((point, i) => (
        <div 
          key={i}
          className="absolute z-10 flex flex-col items-center animate-fade-in"
          style={{ 
            left: `${point.x}%`, 
            top: `${point.y}%`, 
            animationDelay: `${point.delay}s`,
            animationFillMode: 'both'
          }}
        >
          <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)] animate-pulse" />
          <div className="mt-1 flex flex-col items-center opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-[1px] rounded border border-amber-500/20 backdrop-blur-md whitespace-nowrap">
              Match
            </span>
          </div>
        </div>
      ))}

      {/* Overlay Status */}
      <div className="absolute bottom-4 left-4 z-30">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-white/50">STATUS:</span>
          {isScanning ? (
            <span className="text-blue-400 animate-pulse">Acquiring Satellites...</span>
          ) : hasLocation ? (
            <span className="text-green-400">Target Area Locked.</span>
          ) : (
            <span className="text-red-400">Offline. Awaiting Request.</span>
          )}
        </div>
      </div>
    </div>
  );
};
