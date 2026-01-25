'use client';

import { useState } from 'react';
import { Plus, Minus, Star, Leaf, Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';

export function DishCard({ dish, category, onViewDetails }) {
    const { addItem, items, updateQuantity } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    // Check if item is in cart and get quantity
    const cartItem = items.find(item => item.dishId === dish.id);
    const quantityInCart = cartItem?.quantity || 0;

    const handleAddToCart = () => {
        setIsAdding(true);
        addItem(dish, 1);

        // Reset animation
        setTimeout(() => setIsAdding(false), 300);
    };

    const handleIncrement = (e) => {
        e.stopPropagation();
        addItem(dish, 1);
    };

    const handleDecrement = (e) => {
        e.stopPropagation();
        if (quantityInCart > 0) {
            updateQuantity(dish.id, quantityInCart - 1);
        }
    };

    return (
        <Card
            className={`bg-[#1A1A1A] border-gray-800 overflow-hidden group hover:border-[#C41E3A]/50 transition-all duration-300 cursor-pointer ${isAdding ? 'scale-95' : ''}`}
            onClick={() => onViewDetails?.(dish)}
        >
            {/* Image */}
            <div className="relative h-44 overflow-hidden">
                <img
                    src={dish.image || 'https://images.pexels.com/photos/2670327/pexels-photo-2670327.jpeg'}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Category badge */}
                <Badge className="absolute top-3 left-3 bg-[#C41E3A]/90 hover:bg-[#C41E3A] text-xs">
                    {category?.name || 'Special'}
                </Badge>

                {/* Featured badge */}
                {dish.isFeatured && (
                    <Badge className="absolute top-3 right-3 bg-[#D4AF37] text-black text-xs">
                        <Star size={10} className="mr-1" fill="currentColor" />
                        Popular
                    </Badge>
                )}

                {/* Veg/Non-veg indicator */}
                {dish.isVeg !== undefined && (
                    <div className={`absolute bottom-3 left-3 w-5 h-5 rounded border-2 flex items-center justify-center ${dish.isVeg ? 'border-green-500' : 'border-red-500'}`}>
                        <div className={`w-2.5 h-2.5 rounded-full ${dish.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                    </div>
                )}

                {/* Price tag */}
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-[#D4AF37] font-bold text-sm">₹{dish.price}</span>
                </div>
            </div>

            {/* Content */}
            <CardContent className="p-4">
                <h3 className="text-white font-semibold text-base mb-1 truncate group-hover:text-[#D4AF37] transition-colors">
                    {dish.name}
                </h3>

                {dish.description && (
                    <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">
                        {dish.description}
                    </p>
                )}

                {/* Add to cart section */}
                <div className="flex items-center justify-between mt-2" onClick={(e) => e.stopPropagation()}>
                    {quantityInCart === 0 ? (
                        <Button
                            onClick={handleAddToCart}
                            className="w-full bg-[#C41E3A] hover:bg-[#a8182f] h-9 text-sm font-medium transition-all hover:shadow-lg hover:shadow-[#C41E3A]/20"
                        >
                            <Plus size={16} className="mr-1" />
                            Add to Cart
                        </Button>
                    ) : (
                        <div className="w-full flex items-center justify-between bg-[#C41E3A] rounded-lg">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-9 w-9 text-white hover:bg-white/20 rounded-l-lg"
                                onClick={handleDecrement}
                            >
                                <Minus size={16} />
                            </Button>
                            <span className="text-white font-bold text-sm px-3">
                                {quantityInCart}
                            </span>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-9 w-9 text-white hover:bg-white/20 rounded-r-lg"
                                onClick={handleIncrement}
                            >
                                <Plus size={16} />
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

// Compact version for featured section
export function DishCardCompact({ dish, category, onViewDetails }) {
    const { addItem } = useCart();

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addItem(dish, 1);
    };

    return (
        <div
            className="flex items-center gap-3 p-3 bg-[#1A1A1A] rounded-xl border border-gray-800 hover:border-[#C41E3A]/50 transition-all cursor-pointer group"
            onClick={() => onViewDetails?.(dish)}
        >
            <img
                src={dish.image || 'https://images.pexels.com/photos/2670327/pexels-photo-2670327.jpeg'}
                alt={dish.name}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium text-sm truncate group-hover:text-[#D4AF37] transition-colors">
                    {dish.name}
                </h4>
                <p className="text-[#D4AF37] font-semibold text-sm">₹{dish.price}</p>
            </div>
            <Button
                size="icon"
                className="w-8 h-8 bg-[#C41E3A] hover:bg-[#a8182f] flex-shrink-0"
                onClick={handleAddToCart}
            >
                <Plus size={16} />
            </Button>
        </div>
    );
}
