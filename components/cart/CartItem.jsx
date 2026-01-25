'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CartItem({ item, onUpdateQuantity, onRemove }) {
    return (
        <div className="flex gap-3 py-4 border-b border-gray-800 last:border-0 animate-fade-in">
            {/* Image */}
            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-800">
                <img
                    src={item.image || 'https://images.pexels.com/photos/2670327/pexels-photo-2670327.jpeg'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white text-sm truncate pr-2">{item.name}</h4>
                <p className="text-[#D4AF37] font-semibold text-sm mt-1">₹{item.price}</p>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 bg-[#0A0A0A] rounded-lg p-1">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="w-7 h-7 text-gray-400 hover:text-white hover:bg-gray-800"
                            onClick={() => onUpdateQuantity(item.dishId, item.quantity - 1)}
                        >
                            <Minus size={14} />
                        </Button>
                        <span className="w-8 text-center text-white font-medium text-sm">
                            {item.quantity}
                        </span>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="w-7 h-7 text-gray-400 hover:text-white hover:bg-gray-800"
                            onClick={() => onUpdateQuantity(item.dishId, item.quantity + 1)}
                        >
                            <Plus size={14} />
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-white font-semibold text-sm">
                            ₹{item.price * item.quantity}
                        </span>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="w-7 h-7 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={() => onRemove(item.dishId)}
                        >
                            <Trash2 size={14} />
                        </Button>
                    </div>
                </div>

                {/* Special Instructions */}
                {item.instructions && (
                    <p className="text-gray-500 text-xs mt-2 italic truncate">
                        Note: {item.instructions}
                    </p>
                )}
            </div>
        </div>
    );
}
