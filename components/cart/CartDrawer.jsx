'use client';

import { useRouter } from 'next/navigation';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/cart-context';
import { CartItem } from './CartItem';

export function CartDrawer() {
    const router = useRouter();
    const {
        items,
        isOpen,
        closeCart,
        itemCount,
        subtotal,
        tax,
        total,
        updateQuantity,
        removeItem,
        clearCart
    } = useCart();

    const handleCheckout = () => {
        closeCart();
        router.push('/checkout');
    };

    return (
        <Sheet open={isOpen} onOpenChange={closeCart}>
            <SheetContent className="w-full sm:max-w-md bg-[#1A1A1A] border-gray-800 p-0 flex flex-col">
                {/* Header */}
                <SheetHeader className="p-4 border-b border-gray-800">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-white flex items-center gap-2">
                            <ShoppingBag size={20} className="text-[#C41E3A]" />
                            Your Cart
                            {itemCount > 0 && (
                                <span className="bg-[#C41E3A] text-white text-xs px-2 py-0.5 rounded-full">
                                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                                </span>
                            )}
                        </SheetTitle>
                        {items.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                onClick={clearCart}
                            >
                                <Trash2 size={16} className="mr-1" />
                                Clear
                            </Button>
                        )}
                    </div>
                </SheetHeader>

                {/* Cart Items */}
                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-24 h-24 rounded-full bg-[#0A0A0A] flex items-center justify-center mb-4">
                            <ShoppingBag size={40} className="text-gray-600" />
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-2">Your cart is empty</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            Add some delicious dishes to get started!
                        </p>
                        <Button
                            onClick={closeCart}
                            className="bg-[#C41E3A] hover:bg-[#a8182f]"
                        >
                            Browse Menu
                        </Button>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 px-4">
                            <div className="py-2">
                                {items.map((item) => (
                                    <CartItem
                                        key={item.dishId}
                                        item={item}
                                        onUpdateQuantity={updateQuantity}
                                        onRemove={removeItem}
                                    />
                                ))}
                            </div>
                        </ScrollArea>

                        {/* Footer with totals */}
                        <div className="border-t border-gray-800 p-4 bg-[#0A0A0A] space-y-3">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="text-white">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">GST (5%)</span>
                                    <span className="text-white">₹{tax}</span>
                                </div>
                                <Separator className="bg-gray-800" />
                                <div className="flex justify-between">
                                    <span className="text-white font-semibold">Total</span>
                                    <span className="text-[#D4AF37] font-bold text-lg">₹{total}</span>
                                </div>
                            </div>

                            <Button
                                className="w-full bg-[#C41E3A] hover:bg-[#a8182f] h-12 text-base font-semibold group"
                                onClick={handleCheckout}
                            >
                                Proceed to Checkout
                                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>

                            <p className="text-center text-gray-500 text-xs">
                                Delivery charges may apply
                            </p>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
