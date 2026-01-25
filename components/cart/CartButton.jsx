'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';

export function CartButton() {
    const { itemCount, toggleCart, isLoaded } = useCart();

    if (!isLoaded) return null;

    return (
        <Button
            onClick={toggleCart}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#C41E3A] hover:bg-[#a8182f] shadow-lg shadow-[#C41E3A]/30 hover:shadow-[#C41E3A]/50 transition-all hover:scale-110 group"
            size="icon"
        >
            <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />

            {/* Item count badge */}
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#D4AF37] text-black text-xs font-bold rounded-full flex items-center justify-center animate-bounce-in">
                    {itemCount > 99 ? '99+' : itemCount}
                </span>
            )}
        </Button>
    );
}

// Optional: Mini cart preview that shows on hover
export function CartButtonWithPreview() {
    const { itemCount, total, toggleCart, isLoaded, items } = useCart();

    if (!isLoaded) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 group">
            {/* Preview tooltip */}
            {itemCount > 0 && (
                <div className="absolute bottom-full right-0 mb-3 bg-[#1A1A1A] border border-gray-800 rounded-xl p-3 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all translate-y-2 group-hover:translate-y-0 shadow-xl">
                    <p className="text-white text-sm font-medium mb-2">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
                    </p>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Total:</span>
                        <span className="text-[#D4AF37] font-bold">₹{total}</span>
                    </div>
                    <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-3 h-3 bg-[#1A1A1A] border-r border-b border-gray-800"></div>
                </div>
            )}

            <Button
                onClick={toggleCart}
                className="w-14 h-14 rounded-full bg-[#C41E3A] hover:bg-[#a8182f] shadow-lg shadow-[#C41E3A]/30 hover:shadow-[#C41E3A]/50 transition-all hover:scale-110"
                size="icon"
            >
                <ShoppingCart size={24} />

                {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#D4AF37] text-black text-xs font-bold rounded-full flex items-center justify-center">
                        {itemCount > 99 ? '99+' : itemCount}
                    </span>
                )}
            </Button>
        </div>
    );
}
