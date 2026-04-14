
"use client";

import Link from 'next/link';
import { ShoppingCart, Search, User, MapPin, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export const Navbar = () => {
  const { totalItems, isHydrated } = useCart();
  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/40">
      <div className="container mx-auto px-4 h-[72px] md:h-[88px] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="bg-gradient-to-tr from-primary to-amber-400 p-2 rounded-xl shadow-[0_0_20px_rgba(255,100,0,0.4)] group-hover:scale-105 transition-all duration-300">
            <span className="text-white text-xl md:text-2xl font-black tracking-tighter">FF</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 leading-none tracking-tight">NutriFlow</span>
            <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-bold leading-none mt-1.5 opacity-80">Premium Discovery</p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center flex-1 max-w-3xl gap-3">
          <div className="h-12 px-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap">
            <MapPin size={18} className="text-primary" />
            <span className="text-sm font-medium">New York, NY</span>
          </div>

          <div className="relative flex-1 group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-amber-500/50 rounded-full blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
            <div className="relative flex items-center">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search premium restaurants or dishes..."
                className="h-12 rounded-full pl-11 bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-transparent transition-all shadow-inner"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden hover:bg-white/10 text-foreground rounded-full">
            <Search size={22} />
          </Button>

          <Button variant="outline" className="hidden xl:flex items-center gap-2 rounded-full border-white/10 bg-gradient-to-r from-primary/10 to-transparent hover:from-primary/20 hover:border-primary/50 transition-all">
            <Sparkles size={16} className="text-primary animate-pulse" />
            <span className="font-semibold text-primary">AI Picks</span>
          </Button>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-white/10 text-foreground">
              <ShoppingCart size={24} />
              {isHydrated && totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground border-none shadow-[0_0_10px_rgba(255,100,0,0.5)] animate-bounce">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>

          {!user ? (
            <Link href="/login">
              <Button variant="outline" className="hidden md:flex items-center gap-2 rounded-full border-white/10 hover:bg-white/10 hover:text-white transition-all px-6">
                <User size={18} />
                <span className="font-medium">Secure Login</span>
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard">
              <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 rounded-full pl-2 pr-4 py-1.5 hover:bg-white/10 transition-colors cursor-pointer ml-2">
                <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full bg-black/50" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white leading-none mb-1">{user.name}</span>
                  <span className="text-[10px] text-primary uppercase font-black tracking-wider leading-none">Dashboard</span>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
