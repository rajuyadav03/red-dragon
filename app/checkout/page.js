'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, MapPin, Phone, User, Bike, Store, UtensilsCrossed,
    ShoppingBag, Loader2, CheckCircle, Clock, FileText, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/cart-context';

const ORDER_TYPES = [
    { id: 'delivery', label: 'Delivery', icon: Bike, description: 'Get it delivered to your doorstep' },
    { id: 'takeaway', label: 'Takeaway', icon: Store, description: 'Pick up from restaurant' },
    { id: 'dine-in', label: 'Dine In', icon: UtensilsCrossed, description: 'Enjoy at our restaurant' }
];

export default function CheckoutPage() {
    const router = useRouter();
    const { items, subtotal, tax, total, clearCart, itemCount } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [orderSuccess, setOrderSuccess] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        orderType: 'delivery',
        address: '',
        tableNumber: '',
        instructions: ''
    });

    // Redirect if cart is empty
    useEffect(() => {
        if (itemCount === 0 && !orderSuccess) {
            router.push('/');
        }
    }, [itemCount, router, orderSuccess]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Please enter your name');
            return false;
        }
        if (!formData.phone.trim() || formData.phone.length < 10) {
            setError('Please enter a valid phone number');
            return false;
        }
        if (formData.orderType === 'delivery' && !formData.address.trim()) {
            setError('Please enter your delivery address');
            return false;
        }
        if (formData.orderType === 'dine-in' && !formData.tableNumber.trim()) {
            setError('Please enter your table number');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const orderData = {
                items: items.map(item => ({
                    dishId: item.dishId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                    instructions: item.instructions
                })),
                customer: {
                    name: formData.name.trim(),
                    phone: formData.phone.trim(),
                    address: formData.orderType === 'delivery' ? formData.address.trim() : undefined
                },
                type: formData.orderType,
                tableNumber: formData.orderType === 'dine-in' ? formData.tableNumber : undefined,
                instructions: formData.instructions.trim() || undefined,
                subtotal,
                tax,
                total
            };

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to place order');
            }

            // Success!
            setOrderSuccess(data);
            clearCart();

        } catch (err) {
            console.error('Order error:', err);
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Success screen
    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
                <Card className="max-w-md w-full bg-[#1A1A1A] border-gray-800 text-center">
                    <CardContent className="p-8">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                            <CheckCircle size={48} className="text-green-500" />
                        </div>

                        <h1 className="text-2xl font-bold text-white mb-2">Order Placed!</h1>
                        <p className="text-gray-400 mb-6">
                            Your order has been received and is being prepared.
                        </p>

                        <div className="bg-[#0A0A0A] rounded-xl p-4 mb-6">
                            <p className="text-gray-400 text-sm mb-1">Order Number</p>
                            <p className="text-[#D4AF37] font-bold text-2xl">{orderSuccess.orderNumber}</p>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-gray-400 mb-6">
                            <Clock size={18} />
                            <span>Estimated time: {orderSuccess.estimatedTime || '30-45'} mins</span>
                        </div>

                        <div className="space-y-3">
                            <Button
                                className="w-full bg-[#C41E3A] hover:bg-[#a8182f]"
                                onClick={() => router.push(`/order/${orderSuccess.orderId}`)}
                            >
                                Track Order
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                                onClick={() => router.push('/')}
                            >
                                Back to Menu
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A]">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="flex items-center h-16">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="mr-4 text-gray-400 hover:text-white"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft size={24} />
                        </Button>
                        <h1 className="text-xl font-bold text-white">Checkout</h1>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Form Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <form onSubmit={handleSubmit}>
                            {/* Error Alert */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-center gap-3 mb-6">
                                    <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Customer Info */}
                            <Card className="bg-[#1A1A1A] border-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-white text-lg flex items-center gap-2">
                                        <User size={20} className="text-[#C41E3A]" />
                                        Your Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="name" className="text-gray-300">Full Name *</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            placeholder="John Doe"
                                            className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone" className="text-gray-300">Phone Number *</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleChange('phone', e.target.value)}
                                            placeholder="9876543210"
                                            className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
                                            required
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Order Type */}
                            <Card className="bg-[#1A1A1A] border-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-white text-lg flex items-center gap-2">
                                        <Store size={20} className="text-[#C41E3A]" />
                                        Order Type
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup
                                        value={formData.orderType}
                                        onValueChange={(value) => handleChange('orderType', value)}
                                        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                                    >
                                        {ORDER_TYPES.map((type) => (
                                            <label
                                                key={type.id}
                                                className={`relative flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.orderType === type.id
                                                    ? 'border-[#C41E3A] bg-[#C41E3A]/10'
                                                    : 'border-gray-700 hover:border-gray-600'
                                                    }`}
                                            >
                                                <RadioGroupItem value={type.id} className="sr-only" />
                                                <type.icon size={28} className={formData.orderType === type.id ? 'text-[#C41E3A]' : 'text-gray-400'} />
                                                <span className={`mt-2 font-medium ${formData.orderType === type.id ? 'text-white' : 'text-gray-300'}`}>
                                                    {type.label}
                                                </span>
                                                <span className="text-xs text-gray-500 text-center mt-1">{type.description}</span>
                                            </label>
                                        ))}
                                    </RadioGroup>

                                    {/* Conditional Fields */}
                                    {formData.orderType === 'delivery' && (
                                        <div className="mt-4">
                                            <Label htmlFor="address" className="text-gray-300">Delivery Address *</Label>
                                            <Textarea
                                                id="address"
                                                value={formData.address}
                                                onChange={(e) => handleChange('address', e.target.value)}
                                                placeholder="Enter your full address with landmark"
                                                className="bg-[#0A0A0A] border-gray-700 text-white mt-1 h-24"
                                                required
                                            />
                                        </div>
                                    )}

                                    {formData.orderType === 'dine-in' && (
                                        <div className="mt-4">
                                            <Label htmlFor="tableNumber" className="text-gray-300">Table Number *</Label>
                                            <Input
                                                id="tableNumber"
                                                type="text"
                                                value={formData.tableNumber}
                                                onChange={(e) => handleChange('tableNumber', e.target.value)}
                                                placeholder="e.g., Table 5"
                                                className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
                                                required
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Special Instructions */}
                            <Card className="bg-[#1A1A1A] border-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-white text-lg flex items-center gap-2">
                                        <FileText size={20} className="text-[#C41E3A]" />
                                        Special Instructions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        value={formData.instructions}
                                        onChange={(e) => handleChange('instructions', e.target.value)}
                                        placeholder="Any special requests for your order? (optional)"
                                        className="bg-[#0A0A0A] border-gray-700 text-white h-24"
                                    />
                                </CardContent>
                            </Card>

                            {/* Mobile Submit Button */}
                            <div className="lg:hidden">
                                <Button
                                    type="submit"
                                    className="w-full h-14 bg-[#C41E3A] hover:bg-[#a8182f] text-lg font-semibold"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2" size={20} />
                                            Placing Order...
                                        </>
                                    ) : (
                                        <>Place Order • ₹{total}</>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <Card className="bg-[#1A1A1A] border-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-white text-lg flex items-center gap-2">
                                        <ShoppingBag size={20} className="text-[#C41E3A]" />
                                        Order Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Items */}
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {items.map((item) => (
                                            <div key={item.dishId} className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <p className="text-white text-sm">{item.name}</p>
                                                    <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                                                </div>
                                                <span className="text-gray-300 text-sm">₹{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator className="bg-gray-800" />

                                    {/* Totals */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Subtotal</span>
                                            <span className="text-gray-300">₹{subtotal}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">GST (5%)</span>
                                            <span className="text-gray-300">₹{tax}</span>
                                        </div>
                                        {formData.orderType === 'delivery' && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Delivery</span>
                                                <span className="text-green-400">FREE</span>
                                            </div>
                                        )}
                                        <Separator className="bg-gray-800" />
                                        <div className="flex justify-between pt-2">
                                            <span className="text-white font-semibold">Total</span>
                                            <span className="text-[#D4AF37] font-bold text-xl">₹{total}</span>
                                        </div>
                                    </div>

                                    {/* Desktop Submit Button */}
                                    <Button
                                        type="submit"
                                        form="checkout-form"
                                        className="hidden lg:flex w-full h-12 bg-[#C41E3A] hover:bg-[#a8182f] text-base font-semibold"
                                        disabled={loading}
                                        onClick={handleSubmit}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin mr-2" size={18} />
                                                Placing Order...
                                            </>
                                        ) : (
                                            'Place Order'
                                        )}
                                    </Button>

                                    <p className="text-center text-gray-500 text-xs">
                                        By placing this order, you agree to our terms
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
