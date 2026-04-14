"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Activity, Flame, Dumbbell, Droplet, LogOut } from "lucide-react";

const mockWeeklyData = [
  { name: "Mon", calories: 2100, target: 2100 },
  { name: "Tue", calories: 2350, target: 2100 },
  { name: "Wed", calories: 1900, target: 2100 },
  { name: "Thu", calories: 2050, target: 2100 },
  { name: "Fri", calories: 2400, target: 2100 },
  { name: "Sat", calories: 2600, target: 2100 },
  { name: "Sun", calories: 1850, target: 2100 },
];

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return <div className="min-h-screen bg-background" />;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20 selection:text-primary">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 animate-fade-in space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <img src={user.avatar} alt="Profile" className="w-16 h-16 rounded-full border-2 border-primary shadow-[0_0_15px_rgba(255,100,0,0.4)]" />
            <div>
              <h1 className="text-3xl font-extrabold text-white">Welcome back, {user.name}</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Activity size={16} className="text-primary" /> Active Goal: Muscle Synthesis + Maintenance
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors bg-red-400/10 px-4 py-2 rounded-full hover:bg-red-400/20">
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Daily Macros Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
          <Card className="border-white/10 bg-white/5 backdrop-blur-md overflow-hidden relative">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-amber-400" />
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Calories</p>
                <div className="p-2 bg-amber-400/20 rounded-lg text-amber-400"><Flame size={18} /></div>
              </div>
              <p className="text-3xl font-black text-white">1,850<span className="text-sm font-normal text-muted-foreground ml-1">/ {user.targetCalories}</span></p>
            </CardContent>
          </Card>
          
          <Card className="border-white/10 bg-white/5 backdrop-blur-md overflow-hidden relative">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-green-400" />
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Protein</p>
                <div className="p-2 bg-green-400/20 rounded-lg text-green-400"><Dumbbell size={18} /></div>
              </div>
              <p className="text-3xl font-black text-white">142<span className="text-sm font-normal text-muted-foreground ml-1">/ {user.targetProtein}g</span></p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur-md overflow-hidden relative">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-400" />
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Carbs</p>
                <div className="p-2 bg-blue-400/20 rounded-lg text-blue-400"><Droplet size={18} /></div>
              </div>
              <p className="text-3xl font-black text-white">110<span className="text-sm font-normal text-muted-foreground ml-1">/ {user.targetCarbs}g</span></p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur-md overflow-hidden relative">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-red-400" />
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Fats</p>
                <div className="p-2 bg-red-400/20 rounded-lg text-red-400"><Activity size={18} /></div>
              </div>
              <p className="text-3xl font-black text-white">45<span className="text-sm font-normal text-muted-foreground ml-1">/ {user.targetFats}g</span></p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Card className="border-white/10 bg-white/5 backdrop-blur-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-white mb-6">Weekly Caloric Adherence</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockWeeklyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#ffffff50" axisLine={false} tickLine={false} />
                    <YAxis stroke="#ffffff50" axisLine={false} tickLine={false} domain={['dataMin - 200', 'dataMax + 200']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', borderColor: '#ffffff20', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="target" stroke="#ffffff30" strokeDasharray="5 5" fill="none" strokeWidth={2} />
                    <Area type="monotone" dataKey="calories" stroke="#f59e0b" fillOpacity={1} fill="url(#colorCalories)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur-md flex flex-col justify-between">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-white mb-6">Recent Nutritional Impact</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=100&h=100&auto=format&fit=crop" alt="Salmon Bowl" className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className="font-bold text-white">Salmon Power Bowl</p>
                      <p className="text-xs text-muted-foreground">Green Bowl Studio • Today, 1:30 PM</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-amber-500 text-lg">510 kcal</p>
                    <p className="text-xs font-bold text-green-400">42g Protein</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 opacity-70">
                  <div className="flex items-center gap-4">
                    <img src="https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=100&h=100&auto=format&fit=crop" alt="Naan" className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className="font-bold text-white">Garlic Naan Trio</p>
                      <p className="text-xs text-muted-foreground">Spice Route • Yesterday, 8:15 PM</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-amber-500 text-lg">400 kcal</p>
                    <p className="text-xs font-bold text-blue-400">65g Carbs</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
