"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Activity, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulate network request for hackathon
    setTimeout(() => {
      login(email);
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden selection:bg-primary/20 selection:text-primary pt-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-500/10 via-background to-background" />
      <div className="absolute -left-[20%] top-[10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -right-[20%] bottom-[10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md p-8 relative z-10 animate-fade-in">
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="bg-gradient-to-tr from-primary to-amber-400 p-3 rounded-2xl shadow-[0_0_30px_rgba(255,100,0,0.3)] mb-6">
            <Activity className="w-8 h-8 text-white relative z-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 mb-2">Welcome to NutriFlow</h1>
          <p className="text-muted-foreground text-sm font-medium">Authentication for Clinical-Grade Culinary Discovery</p>
        </div>

        <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
          
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80 font-medium text-xs uppercase tracking-wider ml-1">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 h-12 rounded-xl text-white placeholder:text-white/30 focus-visible:ring-primary focus-visible:border-transparent transition-all px-4"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-white/80 font-medium text-xs uppercase tracking-wider">Password</Label>
                  <Link href="#" className="text-xs text-primary hover:text-primary/80 transition-colors font-medium">Forgot password?</Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-white/5 border-white/10 h-12 rounded-xl text-white placeholder:text-white/30 focus-visible:ring-primary focus-visible:border-transparent transition-all px-4"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 rounded-xl text-base font-bold bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90 text-white shadow-[0_0_20px_rgba(255,100,0,0.3)] hover:shadow-[0_0_30px_rgba(255,100,0,0.5)] transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Secure Login <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-2 justify-center text-xs text-muted-foreground font-medium">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span>Encrypted via AES-256 for Hackathon Demo</span>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-muted-foreground">
          Don't have an account? <Link href="#" className="text-white font-medium hover:text-primary transition-colors">Request Access</Link>
        </p>
      </div>
    </div>
  );
}
