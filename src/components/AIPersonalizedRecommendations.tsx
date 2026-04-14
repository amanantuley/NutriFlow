
"use client";

import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, Dna } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export const AIPersonalizedRecommendations = () => {
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const res = await fetch('/api/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'Current GPS',
            pastOrders: [],
            cuisinePreferences: ['Healthy', 'High Protein'],
            dietaryPreferences: ['Low Carb']
          })
        });
        const result = await res.json();
        if (result.success) {
          setRecommendations(result.data);
        }
      } catch (error) {
        console.error('Failed to load AI recommendations', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <section className="py-8">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  if (!recommendations) return null;

  return (
    <section className="py-8 bg-secondary/10 rounded-3xl px-6 my-8 border border-secondary/20">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-secondary rounded-full">
          <Sparkles className="text-foreground h-5 w-5" />
        </div>
        <h2 className="text-2xl font-bold">Personalized for You</h2>
        <Badge variant="outline" className="ml-2 border-secondary text-secondary-foreground">AI Powered</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.recommendedDishes.slice(0, 3).map((dish, idx) => (
          <Card key={idx} className="overflow-hidden hover:shadow-md transition-shadow border-none shadow-sm">
            <CardContent className="p-0 flex h-full">
              <div className="w-1/3 relative bg-muted">
                 <Image 
                    src={`https://picsum.photos/seed/${idx + 50}/400/400`} 
                    alt={dish.dishName} 
                    fill 
                    className="object-cover"
                    data-ai-hint="delicious food"
                  />
              </div>
              <div className="w-2/3 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg leading-tight">{dish.dishName}</h3>
                  <p className="text-xs text-muted-foreground mb-2">at {dish.restaurantName}</p>
                  <p className="text-sm text-foreground/80 line-clamp-2">{dish.reason}</p>
                </div>
                <div className="mt-2 flex items-center text-primary font-medium text-sm cursor-pointer hover:underline">
                  Order Now <ArrowRight size={14} className="ml-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
