'use client';

import { useState } from 'react';
import { X, Plus, Minus, Star, ShoppingCart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/cart-context';

export function DishModal({ dish, category, isOpen, onClose }) {
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [instructions, setInstructions] = useState('');

    if (!dish) return null;

    const handleAddToCart = () => {
        addItem(dish, quantity, instructions);
        onClose();
        // Reset state
        setQuantity(1);
        setInstructions('');
    };

    const incrementQuantity = () => setQuantity(prev => prev + 1);
    const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

    const totalPrice = dish.price * quantity;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#1A1A1A] border-gray-800 text-white max-w-md p-0 overflow-hidden">
                {/* Image Header */}
                <div className="relative h-56 overflow-hidden">
                    <img
                        src={dish.image || 'https://images.pexels.com/photos/2670327/pexels-photo-2670327.jpeg'}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className="bg-[#C41E3A]">{category?.name || 'Special'}</Badge>
                        {dish.isFeatured && (
                            <Badge className="bg-[#D4AF37] text-black">
                                <Star size={10} className="mr-1" fill="currentColor" />
                                Popular
                            </Badge>
                        )}
                    </div>

                    {/* Veg indicator */}
                    {dish.isVeg !== undefined && (
                        <div className={`absolute top-4 right-4 w-6 h-6 rounded border-2 flex items-center justify-center bg-black/50 ${dish.isVeg ? 'border-green-500' : 'border-red-500'}`}>
                            <div className={`w-3 h-3 rounded-full ${dish.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 -mt-8 relative">
                    <div className="flex items-start justify-between mb-3">
                        <h2 className="text-xl font-bold text-white pr-4">{dish.name}</h2>
                        <span className="text-[#D4AF37] font-bold text-xl flex-shrink-0">₹{dish.price}</span>
                    </div>

                    {dish.description && (
                        <p className="text-gray-400 text-sm leading-relaxed mb-5">
                            {dish.description}
                        </p>
                    )}

                    {/* Special Instructions */}
                    <div className="mb-5">
                        <Label className="text-gray-300 text-sm mb-2 block">
                            Special Instructions (optional)
                        </Label>
                        <Textarea
                            placeholder="e.g., Extra spicy, no onions..."
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            className="bg-[#0A0A0A] border-gray-700 text-white placeholder:text-gray-600 resize-none h-20"
                        />
                    </div>

                    {/* Quantity & Add to Cart */}
                    <div className="flex items-center gap-4">
                        {/* Quantity Selector */}
                        <div className="flex items-center bg-[#0A0A0A] rounded-xl border border-gray-800">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="w-10 h-10 text-gray-400 hover:text-white hover:bg-gray-800 rounded-l-xl"
                                onClick={decrementQuantity}
                            >
                                <Minus size={18} />
                            </Button>
                            <span className="w-12 text-center text-white font-bold text-lg">
                                {quantity}
                            </span>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="w-10 h-10 text-gray-400 hover:text-white hover:bg-gray-800 rounded-r-xl"
                                onClick={incrementQuantity}
                            >
                                <Plus size={18} />
                            </Button>
                        </div>

                        {/* Add to Cart Button */}
                        <Button
                            className="flex-1 h-10 bg-[#C41E3A] hover:bg-[#a8182f] font-semibold"
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart size={18} className="mr-2" />
                            Add ₹{totalPrice}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
