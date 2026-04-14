
"use client";

import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Truck, MapPin, Phone, MessageSquare, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function OrderTracking() {
  const params = useParams<{ orderId: string | string[] }>();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
  const [status, setStatus] = useState(0); // 0: Order Placed, 1: Preparing, 2: Out for delivery, 3: Arrived

  useEffect(() => {
    const timer = setInterval(() => {
      setStatus(prev => (prev < 3 ? prev + 1 : prev));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    { label: 'Order Placed', time: '12:30 PM', icon: <CheckCircle2 size={24} /> },
    { label: 'Preparing your meal', time: '12:35 PM', icon: <Clock size={24} /> },
    { label: 'Out for Delivery', time: '12:45 PM', icon: <Truck size={24} /> },
    { label: 'Arrived at your door', time: '12:55 PM', icon: <MapPin size={24} /> }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Track Order</h1>
              <p className="text-muted-foreground">Order ID: <span className="font-mono font-bold text-foreground">{orderId ?? 'Unavailable'}</span></p>
            </div>
            <Badge className="bg-secondary text-foreground text-sm py-1.5 px-4 h-fit">Arriving in 15-20 min</Badge>
          </div>

          {/* Map Placeholder */}
          <div className="h-64 bg-muted/50 rounded-3xl mb-8 relative overflow-hidden flex items-center justify-center border-2 border-dashed border-primary/20">
             <div className="text-center">
                <MapPin className="text-primary mx-auto mb-2 animate-bounce" size={48} />
                <p className="font-bold text-lg text-primary">Live Tracking Enabled</p>
                <p className="text-sm text-muted-foreground">Our delivery partner is on the way!</p>
             </div>
             {/* Simulated path */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <path d="M 50,50 Q 200,150 400,100 T 700,200" fill="none" stroke="var(--primary)" strokeWidth="4" strokeDasharray="8 8" />
             </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Status Timeline */}
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-xl font-bold mb-4">Order Status</h2>
              <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted">
                {steps.map((step, idx) => (
                  <div key={idx} className={`relative flex items-start gap-4 ${idx <= status ? 'text-foreground' : 'text-muted-foreground'}`}>
                    <div className={`absolute -left-8 h-6 w-6 rounded-full flex items-center justify-center z-10 ${idx <= status ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-muted text-muted-foreground'}`}>
                      {idx < status ? <CheckCircle2 size={14} /> : <div className="h-2 w-2 bg-current rounded-full" />}
                    </div>
                    <div>
                      <h3 className={`font-bold ${idx === status ? 'text-primary' : ''}`}>{step.label}</h3>
                      <p className="text-xs opacity-70">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Partner */}
            <div className="space-y-6">
              <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-4">Delivery Partner</h3>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-16 w-16 bg-muted rounded-full relative overflow-hidden">
                       <Image 
                          src="https://picsum.photos/seed/delivery/200/200" 
                          alt="Delivery Partner" 
                          fill 
                          className="object-cover"
                          data-ai-hint="delivery person"
                        />
                    </div>
                    <div>
                      <p className="font-bold text-lg leading-tight">Michael Santos</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        4.9 Rating
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 rounded-xl h-12 gap-2 border-primary text-primary hover:bg-primary/5">
                      <Phone size={18} />
                      Call
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-xl h-12 gap-2 border-primary text-primary hover:bg-primary/5">
                      <MessageSquare size={18} />
                      Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-none shadow-sm bg-primary text-white p-6">
                <h3 className="font-bold mb-2">Need help?</h3>
                <p className="text-sm opacity-90 mb-4">Something wrong with your order? Our 24/7 support is here for you.</p>
                <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-primary rounded-xl">Contact Support</Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
