
"use client";

import { useParams } from 'next/navigation';
import { RESTAURANTS, MENU_ITEMS, type MenuItem } from '@/lib/data';
import { Navbar } from '@/components/Navbar';
import { Star, Clock, Info, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import Link from 'next/link';

export default function RestaurantDetail() {
  const params = useParams<{ id: string | string[] }>();
  const restaurantId = Array.isArray(params.id) ? params.id[0] : params.id;

  const restaurant = RESTAURANTS.find((entry) => entry.id === restaurantId);
  const menu = (restaurantId ? MENU_ITEMS[restaurantId] : undefined) ?? [];
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [customization, setCustomization] = useState<Record<string, string>>({});

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6 text-center space-y-4">
              <h1 className="text-2xl font-bold">Restaurant not found</h1>
              <p className="text-sm text-muted-foreground">This restaurant may no longer be available.</p>
              <Button asChild>
                <Link href="/">Back to discovery</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      customization: customization[item.id] || ''
    });
    toast({
      title: "Added to cart",
      description: `${item.name} from ${restaurant.name} added.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Banner Section */}
        <div className="h-64 md:h-80 relative">
          <Image 
            src={restaurant.image} 
            alt={restaurant.name} 
            fill 
            className="object-cover"
            priority
            data-ai-hint="restaurant background"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container mx-auto px-4 -mt-32 relative z-10 pb-12">
          {/* Info Card */}
          <Card className="bg-white rounded-3xl p-6 shadow-xl mb-8 border-none">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{restaurant.name}</h1>
                  <Badge className="bg-primary/10 text-primary border-none">{restaurant.cuisine}</Badge>
                </div>
                <p className="text-muted-foreground mb-4">{restaurant.description}</p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1 font-bold">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span>{restaurant.rating} (500+ ratings)</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock size={16} />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Info size={16} />
                    <span>{restaurant.address}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="rounded-full bg-primary hover:bg-primary/90">Follow</Button>
                <Button variant="outline" className="rounded-full">Share</Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Menu Items */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold mb-6">Popular Menu</h2>
              {menu.map((item) => (
                <Card key={item.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all rounded-2xl group bg-white">
                  <CardContent className="p-0 flex h-40">
                    <div className="w-1/3 relative bg-muted overflow-hidden">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        data-ai-hint="food dish"
                      />
                    </div>
                    <div className="w-2/3 p-4 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                        </div>
                        <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <input 
                            type="text"
                            placeholder="Add note (e.g. no onions)"
                            className="text-xs w-full bg-muted/50 rounded-md px-2 py-1 outline-none border-none focus:ring-1 ring-primary/30"
                            value={customization[item.id] || ''}
                            onChange={(e) => setCustomization(prev => ({...prev, [item.id]: e.target.value}))}
                          />
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-primary hover:bg-primary/90 text-white rounded-lg h-8 px-3"
                          onClick={() => handleAddToCart(item)}
                        >
                          <Plus size={16} className="mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sidebar / Offers */}
            <div className="space-y-6">
              <Card className="rounded-2xl border-none shadow-sm bg-primary/5 p-6">
                <h3 className="font-bold text-lg mb-4 text-primary flex items-center gap-2">
                  <Badge className="bg-primary text-white">SAVE 20%</Badge>
                  Limited Offer
                </h3>
                <p className="text-sm mb-4">Get 20% off on your first order with NutriFlow. Use code: <strong>NUTRI20</strong></p>
                <Button className="w-full bg-primary text-white hover:bg-primary/90">Apply Offer</Button>
              </Card>

              <Card className="rounded-2xl border-none shadow-sm bg-white p-6 sticky top-24">
                <h3 className="font-bold text-lg mb-4">Cart Summary</h3>
                <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-xl text-muted-foreground text-sm text-center px-4">
                  Add items to your cart to see total and checkout.
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
