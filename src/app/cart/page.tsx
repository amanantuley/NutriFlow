
"use client";

import { useCart } from '@/context/CartContext';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, Minus, ArrowLeft, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart, isHydrated } = useCart();
  const router = useRouter();
  const [checkingOut, setCheckingOut] = useState(false);

  const deliveryFee = cart.length > 0 ? 2.99 : 0;
  const platformFee = cart.length > 0 ? 0.50 : 0;
  const grandTotal = totalPrice + deliveryFee + platformFee;

  const generateOrderId = () => {
    return `FF-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  };

  const handleCheckout = () => {
    setCheckingOut(true);
    // Simulate API call
    setTimeout(() => {
      const orderId = generateOrderId();
      clearCart();
      router.push(`/track/${orderId}`);
    }, 1500);
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <p className="text-sm text-muted-foreground">Loading your cart...</p>
        </main>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="text-center max-w-sm">
            <div className="bg-muted/30 h-32 w-32 rounded-full flex items-center justify-center mx-auto mb-6">
              <Truck size={48} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg">
                Explore Restaurants
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold mb-4">Your Items</h2>
            {cart.map((item) => (
              <Card key={item.lineId} className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-20 w-20 bg-muted rounded-xl relative overflow-hidden flex-shrink-0">
                    <Image
                      src={`https://picsum.photos/seed/${encodeURIComponent(item.lineId)}/200/200`}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-xs text-muted-foreground">{item.restaurantName}</p>
                        {item.customization && (
                          <p className="text-xs text-primary italic mt-1 font-medium">Note: {item.customization}</p>
                        )}
                      </div>
                      <span className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center bg-muted/50 rounded-lg p-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:bg-white rounded-md"
                          onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:bg-white rounded-md"
                          onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                        onClick={() => removeFromCart(item.lineId)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Summary */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
              <div className="bg-primary/5 p-4 border-b border-primary/10">
                <h3 className="font-bold text-lg">Order Summary</h3>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Platform Fee</span>
                    <span className="font-medium">${platformFee.toFixed(2)}</span>
                  </div>
                  <div className="pt-4 border-t flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-primary">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-muted/20 p-4 rounded-xl space-y-3">
                    <div className="flex items-center gap-3 text-sm font-medium">
                      <CreditCard size={18} className="text-primary" />
                      <span>Credit Card •••• 4242</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium">
                      <Truck size={18} className="text-primary" />
                      <span>Deliver to: 123 Pizza Way, NY</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-xl text-lg font-bold"
                    onClick={handleCheckout}
                    disabled={checkingOut}
                  >
                    {checkingOut ? 'Processing...' : `Place Order • $${grandTotal.toFixed(2)}`}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck size={14} className="text-green-500" />
                    <span>Secure Checkout SSL Encrypted</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
