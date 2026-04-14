
"use client";

import { useMemo, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { CUISINES, RESTAURANTS } from '@/lib/data';
import { AIPersonalizedRecommendations } from '@/components/AIPersonalizedRecommendations';
import { RadarMap } from '@/components/RadarMap';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowRight,
  Clock,
  Heart,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Timer,
  Trophy,
  Zap,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type SortKey = 'recommended' | 'rating' | 'delivery-time' | 'distance';

const averageDeliveryMinutes = (deliveryTime: string) => {
  const [first, second] = deliveryTime.replace(' min', '').split('-').map(Number);
  if (!second) return first || 0;
  return Math.round((first + second) / 2);
};

export default function Home() {
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('recommended');
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const requestLocation = () => {
    setLocationLoading(true);
    setLocationError("");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationLoading(false);
        },
        (error) => {
          setLocationError("Location access denied or unavailable.");
          setLocationLoading(false);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
      setLocationLoading(false);
    }
  };

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsAiLoading(true);
    setAiResponse("");

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, userMacros: null, userLocation })
      });
      const data = await res.json();
      if (data.success) {
        setAiResponse(data.assessment);
      } else {
        setAiResponse("NutriFlow AI is currently overwhelmed with hackathon requests. Please try again.");
      }
    } catch {
      setAiResponse("Connection to NutriFlow AI failed.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const filteredRestaurants = useMemo(() => {
    let normalizedQuery = query.trim().toLowerCase();
    
    // Add mock distances to restaurants via seeded calculation based on ID so it stays consistent
    let processedRestaurants = RESTAURANTS.map(r => {
      const charCode = r.id.charCodeAt(r.id.length - 1);
      // Generate standard mock distance between 0.5 to 12.0 miles based on ID
      const mockDistance = Number(((charCode % 12) + (charCode % 5) * 0.1).toFixed(1)) || 0.8;
      return { ...r, distance: mockDistance };
    });

    let filtered = processedRestaurants.filter((restaurant) => {
      const matchesSearch =
        normalizedQuery === '' ||
        restaurant.name.toLowerCase().includes(normalizedQuery) ||
        restaurant.cuisine.toLowerCase().includes(normalizedQuery) ||
        restaurant.description.toLowerCase().includes(normalizedQuery) ||
        restaurant.tags.join(' ').toLowerCase().includes(normalizedQuery);
      
      const matchesCuisine = selectedCuisine === 'all' || restaurant.cuisine.toLowerCase() === selectedCuisine.toLowerCase();
      const matchesOpen = !openNowOnly || restaurant.isOpenNow;

      // Geolocation PROXIMITY + HEALTH Algorithm Filter
      // If user enabled location, ONLY show the absolute best nearby spots
      let matchesLocationAlgorithm = true;
      if (userLocation) {
        matchesLocationAlgorithm = restaurant.distance < 5.0 && 
                                   (restaurant.healthScore ? restaurant.healthScore >= 80 : false) && 
                                   restaurant.rating >= 4.5;
      }
      
      return matchesSearch && matchesCuisine && matchesOpen && matchesLocationAlgorithm;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'delivery-time') {
        const avgDeliveryMinutes = (deliveryRange: string) => {
          const match = deliveryRange.match(/(\d+)-(\d+)/);
          return match ? (parseInt(match[1], 10) + parseInt(match[2], 10)) / 2 : 30;
        };
        return avgDeliveryMinutes(a.deliveryTime) - avgDeliveryMinutes(b.deliveryTime);
      }
      if (sortBy === 'distance') return a.distance - b.distance;
      // If location is enabled, default sort by distance instead of recommended
      if (userLocation && sortBy === 'recommended') return a.distance - b.distance;
      
      const avgDeliveryMinutes = (deliveryRange: string) => {
        const match = deliveryRange.match(/(\d+)-(\d+)/);
        return match ? (parseInt(match[1], 10) + parseInt(match[2], 10)) / 2 : 30;
      };
      // fallback for recommended
      return b.rating * 2 - avgDeliveryMinutes(b.deliveryTime) - (a.rating * 2 - avgDeliveryMinutes(a.deliveryTime));
    });
  }, [openNowOnly, query, selectedCuisine, sortBy, userLocation]);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20 selection:text-primary">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 space-y-16 lg:space-y-24 animate-fade-in">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 glassmorphism">
          <Image
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1400&h=900&auto=format&fit=crop"
            alt="FlavorFind hero"
            fill
            className="object-cover opacity-60 mix-blend-overlay"
            priority
            data-ai-hint="food table"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="relative z-10 px-8 py-16 md:px-16 md:py-24 animate-slide-up">
            <div className="max-w-3xl flex flex-col gap-6">
              <Badge className="w-fit font-medium tracking-wide bg-gradient-to-r from-green-500/20 to-primary/20 text-green-400 border-green-500/30 px-4 py-1.5 rounded-full uppercase text-[10px] tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                NutriFlow Hackathon Edition
              </Badge>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-2xl">
                Eat exactly what your body needs. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-primary to-amber-300 animate-pulse">Guided by AI.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl font-light drop-shadow-lg">
                The world's first culinary platform that actively reads your biometrics to curate local meals matching your exact daily macros.
              </p>

              {/* Dynamic Health Stats Mock UI */}
              <div className="grid grid-cols-4 gap-3 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-2xl p-4 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-primary/10 opacity-50" />
                <div className="relative z-10 flex flex-col items-center justify-center p-2">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Calories</div>
                  <div className="text-xl font-black text-white">1,850</div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden"><div className="bg-amber-400 h-full w-[65%] rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)]" /></div>
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center p-2">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Protein</div>
                  <div className="text-xl font-black text-white">142<span className="text-xs text-muted-foreground">g</span></div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden"><div className="bg-green-400 h-full w-[80%] rounded-full shadow-[0_0_10px_rgba(74,222,128,0.8)]" /></div>
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center p-2">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Carbs</div>
                  <div className="text-xl font-black text-white">110<span className="text-xs text-muted-foreground">g</span></div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden"><div className="bg-blue-400 h-full w-[45%] rounded-full shadow-[0_0_10px_rgba(96,165,250,0.8)]" /></div>
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center p-2">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Fats</div>
                  <div className="text-xl font-black text-white">45<span className="text-xs text-muted-foreground">g</span></div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden"><div className="bg-red-400 h-full w-[30%] rounded-full shadow-[0_0_10px_rgba(248,113,113,0.8)]" /></div>
                </div>
              </div>

              <div className="rounded-full bg-white/5 border border-white/10 backdrop-blur-xl p-2 max-w-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] mt-4">
                <form onSubmit={handleAiSearch} className="flex flex-col md:flex-row gap-2 items-center">
                  <div className="relative flex-1 w-full text-foreground">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ask NutriFlow AI (e.g. 'high protein post-workout meal')..."
                      className="pl-12 bg-transparent border-none text-base md:text-lg focus-visible:ring-0 shadow-none text-white placeholder:text-white/40 h-14"
                    />
                  </div>
                  <Button type="submit" disabled={isAiLoading} className="w-full md:w-auto h-12 md:h-14 px-8 rounded-full font-bold text-md bg-white text-black hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] disabled:opacity-50">
                    {isAiLoading ? 'Scanning...' : 'Scan Menu'}
                    <Sparkles className={`ml-2 w-5 h-5 text-primary ${isAiLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </form>
              </div>

              {aiResponse && (
                <div className="max-w-2xl mt-2 p-4 bg-primary/10 border border-primary/20 rounded-2xl backdrop-blur-md animate-slide-up flex gap-3 text-white">
                  <div className="bg-primary/20 p-2 rounded-full h-fit flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm font-medium leading-relaxed">{aiResponse}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Card className="border border-white/5 bg-white/5 backdrop-blur-md shadow-2xl overflow-hidden relative group hover:border-primary/50 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-6 relative z-10 flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center shadow-[0_0_15px_rgba(255,100,0,0.3)] group-hover:scale-110 transition-transform duration-300">
                <Timer className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Average delivery</p>
                <p className="font-extrabold text-3xl">29 <span className="text-lg text-muted-foreground font-medium">min</span></p>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-white/5 bg-white/5 backdrop-blur-md shadow-2xl overflow-hidden relative group hover:border-primary/50 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-6 relative z-10 flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform duration-300">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Top-rated partners</p>
                <p className="font-extrabold text-3xl">1200<span className="text-primary">+</span></p>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-white/5 bg-white/5 backdrop-blur-md shadow-2xl overflow-hidden relative group hover:border-primary/50 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-6 relative z-10 flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-green-500/20 text-green-400 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)] group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Order confidence</p>
                <p className="font-extrabold text-3xl">99.9<span className="text-primary">%</span></p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4" id="restaurants">
          <div className="flex flex-wrap items-center gap-3">
            {CUISINES.map((cuisine) => {
              const active = selectedCuisine === cuisine.id;
              return (
                <Button
                  key={cuisine.id}
                  variant={active ? 'default' : 'outline'}
                  className="rounded-full"
                  onClick={() => setSelectedCuisine(cuisine.id)}
                >
                  <span>{cuisine.icon}</span>
                  <span>{cuisine.name}</span>
                </Button>
              );
            })}
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Discover Restaurants</h2>
              <p className="text-muted-foreground text-sm">
                {filteredRestaurants.length} result{filteredRestaurants.length === 1 ? '' : 's'} tailored for you.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
              {!userLocation ? (
                <Button 
                  variant="outline"
                  className="rounded-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                  onClick={requestLocation}
                  disabled={locationLoading}
                >
                  <MapPin size={16} className={`mr-2 ${locationLoading ? 'animate-bounce' : ''}`} />
                  {locationLoading ? 'Scanning Area...' : 'Enable Location API'}
                </Button>
              ) : (
                <Badge className="rounded-full bg-blue-500/20 text-blue-400 border-none px-4 py-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  Live GPS Active
                </Badge>
              )}
              <Button
                variant={openNowOnly ? 'default' : 'outline'}
                className="rounded-full"
                onClick={() => setOpenNowOnly((prev) => !prev)}
              >
                <Zap size={16} />
                {openNowOnly ? 'Open now only' : 'Show all hours'}
              </Button>

              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortKey)}>
                <SelectTrigger className="w-full sm:w-[220px] bg-card">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="rating">Highest rated</SelectItem>
                  <SelectItem value="deliveryTime">Fastest delivery</SelectItem>
                  {userLocation && <SelectItem value="distance">Nearest First</SelectItem>}
                </SelectContent>
              </Select>
            </div>
          </div>

          {locationError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg mb-4">
              {locationError}
            </div>
          )}

          <div className="mb-10 w-full max-w-4xl mx-auto">
             <RadarMap isScanning={locationLoading} hasLocation={!!userLocation} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {filteredRestaurants.map((restaurant) => (
              <Card
                key={restaurant.id}
                className="group overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md shadow-lg hover:shadow-[0_0_30px_rgba(255,100,0,0.15)] hover:-translate-y-2 hover:border-primary/50 transition-all duration-500 rounded-2xl flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={restaurant.image}
                    alt={restaurant.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    data-ai-hint="restaurant dish"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
                  <div className="absolute inset-x-0 top-0 p-4 flex items-start justify-between z-10">
                    <Badge className={restaurant.isOpenNow ? 'bg-primary text-primary-foreground border-none font-bold tracking-wider shadow-[0_0_10px_rgba(255,100,0,0.5)]' : 'bg-muted/80 backdrop-blur-md text-foreground border-none'}>
                      {restaurant.isOpenNow ? 'OPEN NOW' : 'CLOSED'}
                    </Badge>
                    <button
                      type="button"
                      className="h-9 w-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-red-500 hover:bg-black/60 transition-all shadow-lg"
                      aria-label={`Save ${restaurant.name}`}
                    >
                      <Heart size={18} className="drop-shadow-md" />
                    </button>
                  </div>
                </div>

                <CardContent className="p-5 flex-grow flex flex-col gap-4 relative z-10 bg-gradient-to-b from-transparent to-background/50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-extrabold text-xl leading-tight group-hover:text-primary transition-colors">
                        {restaurant.name}
                      </h3>
                      <p className="text-sm text-primary/80 font-medium mt-1">
                        {restaurant.cuisine} <span className="text-muted-foreground ml-1">• {restaurant.priceRange}</span>
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <div className="text-sm font-bold flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        {restaurant.rating.toFixed(1)}
                      </div>
                      <div className={`text-[10px] font-black flex items-center gap-1 px-2 py-1 rounded-lg backdrop-blur-sm ${restaurant.healthScore && restaurant.healthScore > 80 ? 'bg-green-500/20 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : restaurant.healthScore && restaurant.healthScore > 50 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                        {restaurant.healthScore ? `H-Score ${restaurant.healthScore}` : 'Unrated'}
                      </div>
                      <div className="text-xs font-medium flex items-center gap-1 text-blue-400 bg-blue-500/10 px-2 py-1 rounded-lg backdrop-blur-sm">
                        <MapPin size={12} />
                        {restaurant.distance} mi
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-grow">{restaurant.description}</p>

                  <div className="flex flex-wrap gap-2 pt-1 border-t border-white/10">
                    {restaurant.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-white/5 hover:bg-white/10 border-none text-muted-foreground transition-colors px-2 py-0.5">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 divide-x divide-white/10 text-xs font-semibold text-muted-foreground border-t border-white/10 pt-4 mt-2">
                    <span className="flex flex-col items-center justify-center gap-1">
                      <Clock size={16} className="text-primary mb-0.5" />
                      {restaurant.deliveryTime}
                    </span>
                    <span className="flex flex-col items-center justify-center gap-1 text-center">
                      <Zap size={16} className="text-blue-400 mb-0.5" />
                      {restaurant.deliveryFee}
                    </span>
                    <span className="flex flex-col items-center justify-center gap-1 text-center">
                      <Search size={16} className="text-green-400 mb-0.5" />
                      {restaurant.distanceKm.toFixed(1)} km
                    </span>
                  </div>

                  <Button asChild className="w-full mt-2 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Link href={`/restaurant/${restaurant.id}`}>
                      Explore Menu
                      <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRestaurants.length === 0 && (
            <Card className="border bg-card">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold mb-2">No matches found</h3>
                <p className="text-muted-foreground mb-4">Try another cuisine, remove filters, or search with a different keyword.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCuisine('all');
                    setQuery('');
                    setOpenNowOnly(false);
                    setSortBy('recommended');
                  }}
                >
                  Reset discovery
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        <AIPersonalizedRecommendations />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border bg-card shadow-sm">
            <CardContent className="p-6">
              <Sparkles className="text-primary mb-3" />
              <h3 className="font-bold text-lg mb-2">Personalized Picks</h3>
              <p className="text-sm text-muted-foreground">AI adapts to your taste profile and surfaces dishes you are likely to love.</p>
            </CardContent>
          </Card>
          <Card className="border bg-card shadow-sm">
            <CardContent className="p-6">
              <Timer className="text-primary mb-3" />
              <h3 className="font-bold text-lg mb-2">Faster Decisions</h3>
              <p className="text-sm text-muted-foreground">Delivery-time intelligence and ranking help you choose in seconds.</p>
            </CardContent>
          </Card>
          <Card className="border bg-card shadow-sm">
            <CardContent className="p-6">
              <ShieldCheck className="text-primary mb-3" />
              <h3 className="font-bold text-lg mb-2">Reliable Orders</h3>
              <p className="text-sm text-muted-foreground">From checkout to doorstep, every step is built for consistency and trust.</p>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="bg-card border-t mt-8">
        <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <p className="text-2xl font-bold text-primary">NutriFlow</p>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Clinical-grade culinary discovery. Elevating human performance through precise macroscopic meal matching.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">How it works</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Partner network</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Track orders</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3">Popular Cuisines</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Italian</li>
              <li>Japanese</li>
              <li>Healthy</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>support@nutriflow.com</li>
              <li>1-800-NUTRI-AI</li>
              <li>24/7 AI-powered care</li>
            </ul>
          </div>
        </div>

        <div className="container mx-auto px-4 py-4 border-t border-white/10 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} NutriFlow Inc. All rights reserved. Medical disclaimer: Guidance platform only.
        </div>
      </footer>
    </div>
  );
}
