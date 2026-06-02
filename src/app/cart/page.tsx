"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag, Trash2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import CartItem from '@/components/CartItem';
import { useCart } from '@/contexts/CartContext';
import { fetchAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

// Define types for Razorpay integration
declare global {
  interface Window {
    Razorpay: RazorpayConstructor;
  }
}

interface RazorpayConstructor {
  new(options: RazorpayOptions): RazorpayInstance;
}

interface RazorpayInstance {
  on(event: string, callback: (response: RazorpayResponse) => void): void;
  open(): void;
}

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    address: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  error?: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: Record<string, any>;
  };
  [key: string]: any;
}

const Cart = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const { user, isAuthenticated, token } = useAuth(); // Get token directly from AuthContext
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    try {
      // Check if the user is authenticated, redirect to login if not
      if (!isAuthenticated || !user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to your account before completing your purchase.",
          variant: "destructive",
        });

        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 1500);

        return;
      }

      // Log user information to help with debugging
      console.log("User authenticated:", isAuthenticated);
      console.log("User ID for order:", user?._id);
      console.log("Auth token available:", !!token);

      setIsProcessing(true);

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast({
          title: "Error",
          description: "Razorpay SDK failed to load. Please try again.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Create order on server with token from context
      const response = await fetchAPI('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Use token from context
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            projectId: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            customization: item.customization || '',
            category: item.category || '',
            subcategory: item.subcategory || '',
            image: item.image || ''
          })),
          userId: user._id, // Always use the authenticated user ID
        }),
      });

      // Initialize Razorpay payment
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: response.amount,
        currency: response.currency,
        name: "Project Marketplace",
        description: "Purchase of digital projects",
        order_id: response.id,
        handler: async function (paymentResponse: RazorpayResponse) {
          try {
            // Verify payment on server
            const paymentVerification = await fetchAPI('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Use token from context
              },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                orderId: response.orderId,
                userId: user._id, // Always use the actual user ID
                // Send complete cart items data for storage in MongoDB
                cartItems: cartItems.map(item => ({
                  projectId: item.id,
                  title: item.title,
                  price: item.price,
                  quantity: item.quantity,
                  customization: item.customization || '',
                  category: item.category || '',
                  subcategory: item.subcategory || '',
                  image: item.image || ''
                }))
              }),
            });

            // Clear cart and show success message
            clearCart();
            toast({
              title: "Payment Successful",
              description: "Your order has been placed successfully!",
              variant: "default",
            });
          } catch (error) {
            console.error("Payment verification error:", error);
            toast({
              title: "Error",
              description: "Payment verification failed. Please contact support.",
              variant: "destructive",
            });
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        notes: {
          address: "Project Marketplace Corporate Office",
        },
        theme: {
          color: "#3B82F6",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment process. Your cart items are still available.",
              variant: "default",
            });
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response: RazorpayResponse) {
        toast({
          title: "Payment Failed",
          description: response.error?.description || "Your payment failed. Please try again.",
          variant: "destructive",
        });
        setIsProcessing(false);
      });
      paymentObject.open();

    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred during checkout. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any projects to your cart yet.
          </p>
          <Button asChild>
            <Link href="/shop">Browse Projects</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
      <Link
        href="/shop"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Continue Shopping
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {cartItems.map(item => (
            <CartItem key={item.id} item={item} />
          ))}

          <div className="mt-6 flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              className="text-muted-foreground"
              onClick={clearCart}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Clear Cart
            </Button>

            <span className="text-sm text-muted-foreground">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in cart
            </span>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-muted-foreground">
                    {item.title} x {item.quantity}
                  </span>
                  <span>Rs {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>Rs {cartTotal.toFixed(2)}</span>
            </div>

            <Button
              className="w-full mt-6"
              size="lg"
              disabled={isProcessing || cartItems.length === 0}
              onClick={handleCheckout}
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" /> Pay with Razorpay
                </>
              )}
            </Button>

            <Alert className="mt-6">
              <AlertTitle>Secure Checkout</AlertTitle>
              <AlertDescription>
                Your payment information is processed securely with Razorpay. We do not store credit card details.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
