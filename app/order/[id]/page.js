'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Clock, MapPin, Phone, User, Package,
    CheckCircle, Loader2, ChefHat, Truck, UtensilsCrossed,
    RefreshCw, AlertCircle, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const STATUS_CONFIG = {
    pending: {
        label: 'Order Placed',
        color: 'bg-yellow-500',
        icon: Package,
        description: 'Waiting for restaurant to confirm'
    },
    confirmed: {
        label: 'Confirmed',
        color: 'bg-blue-500',
        icon: CheckCircle,
        description: 'Restaurant has accepted your order'
    },
    preparing: {
        label: 'Preparing',
        color: 'bg-orange-500',
        icon: ChefHat,
        description: 'Your food is being prepared'
    },
    ready: {
        label: 'Ready',
        color: 'bg-green-500',
        icon: UtensilsCrossed,
        description: 'Your order is ready for pickup/delivery'
    },
    'out-for-delivery': {
        label: 'Out for Delivery',
        color: 'bg-purple-500',
        icon: Truck,
        description: 'Your order is on the way'
    },
    delivered: {
        label: 'Delivered',
        color: 'bg-green-600',
        icon: CheckCircle,
        description: 'Order completed successfully'
    },
    cancelled: {
        label: 'Cancelled',
        color: 'bg-red-500',
        icon: AlertCircle,
        description: 'Order was cancelled'
    }
};

const STATUS_FLOW = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];

export default function OrderTrackingPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id;

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrder = async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);

            const res = await fetch(`/api/orders/${orderId}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Order not found');
            }

            setOrder(data);
            setError('');
        } catch (err) {
            console.error('Error fetching order:', err);
            setError(err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (orderId) {
            fetchOrder();

            // Auto-refresh every 30 seconds
            const interval = setInterval(() => {
                fetchOrder(true);
            }, 30000);

            return () => clearInterval(interval);
        }
    }, [orderId]);

    const getCurrentStatusIndex = () => {
        if (!order) return -1;
        return STATUS_FLOW.indexOf(order.status);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[#C41E3A] mx-auto mb-4" />
                    <p className="text-gray-400">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
                <Card className="max-w-md w-full bg-[#1A1A1A] border-gray-800 text-center">
                    <CardContent className="p-8">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                            <AlertCircle size={48} className="text-red-500" />
                        </div>
                        <h1 className="text-xl font-bold text-white mb-2">Order Not Found</h1>
                        <p className="text-gray-400 mb-6">{error}</p>
                        <Button
                            className="w-full bg-[#C41E3A] hover:bg-[#a8182f]"
                            onClick={() => router.push('/')}
                        >
                            <Home size={18} className="mr-2" />
                            Back to Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
    const currentStatusIndex = getCurrentStatusIndex();

    return (
        <div className="min-h-screen bg-[#0A0A0A]">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="mr-4 text-gray-400 hover:text-white"
                                onClick={() => router.push('/')}
                            >
                                <ArrowLeft size={24} />
                            </Button>
                            <div>
                                <h1 className="text-lg font-bold text-white">Order Tracking</h1>
                                <p className="text-xs text-gray-400">{order.orderNumber}</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-700 text-gray-300 hover:bg-gray-800"
                            onClick={() => fetchOrder(true)}
                            disabled={refreshing}
                        >
                            <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6 max-w-2xl">
                {/* Status Card */}
                <Card className="bg-[#1A1A1A] border-gray-800 mb-6">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`w-16 h-16 rounded-2xl ${statusConfig.color} flex items-center justify-center`}>
                                <statusConfig.icon size={32} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">{statusConfig.label}</h2>
                                <p className="text-gray-400 text-sm">{statusConfig.description}</p>
                            </div>
                        </div>

                        {/* Status Timeline */}
                        <div className="relative">
                            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-800" />

                            {STATUS_FLOW.map((status, index) => {
                                const config = STATUS_CONFIG[status];
                                const isCompleted = index <= currentStatusIndex;
                                const isCurrent = index === currentStatusIndex;

                                return (
                                    <div key={status} className="relative flex items-center gap-4 pb-6 last:pb-0">
                                        <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${isCompleted ? config.color : 'bg-gray-800'
                                            } ${isCurrent ? 'ring-4 ring-white/20' : ''}`}>
                                            <config.icon size={20} className={isCompleted ? 'text-white' : 'text-gray-600'} />
                                        </div>
                                        <div>
                                            <p className={`font-medium ${isCompleted ? 'text-white' : 'text-gray-600'}`}>
                                                {config.label}
                                            </p>
                                            {isCurrent && order.estimatedTime && (
                                                <p className="text-sm text-[#D4AF37] flex items-center gap-1 mt-1">
                                                    <Clock size={14} />
                                                    Est. {order.estimatedTime} mins
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Order Details */}
                <Card className="bg-[#1A1A1A] border-gray-800 mb-6">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Order Details</h3>

                        {/* Customer Info */}
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-gray-300">
                                <User size={18} className="text-[#C41E3A]" />
                                <span>{order.customer?.name}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <Phone size={18} className="text-[#C41E3A]" />
                                <span>{order.customer?.phone}</span>
                            </div>
                            {order.type === 'delivery' && order.customer?.address && (
                                <div className="flex items-start gap-3 text-gray-300">
                                    <MapPin size={18} className="text-[#C41E3A] flex-shrink-0 mt-0.5" />
                                    <span>{order.customer.address}</span>
                                </div>
                            )}
                            {order.type === 'dine-in' && order.tableNumber && (
                                <div className="flex items-center gap-3 text-gray-300">
                                    <UtensilsCrossed size={18} className="text-[#C41E3A]" />
                                    <span>Table {order.tableNumber}</span>
                                </div>
                            )}
                        </div>

                        <Separator className="bg-gray-800 my-4" />

                        {/* Order Type Badge */}
                        <div className="flex items-center gap-2 mb-4">
                            <Badge className="bg-[#C41E3A]">
                                {order.type === 'delivery' ? 'Delivery' : order.type === 'dine-in' ? 'Dine In' : 'Takeaway'}
                            </Badge>
                            <span className="text-gray-500 text-sm">
                                Ordered at {new Date(order.createdAt).toLocaleString()}
                            </span>
                        </div>

                        {/* Items */}
                        <div className="space-y-3">
                            {order.items?.map((item, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        {item.image && (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                        )}
                                        <div>
                                            <p className="text-white">{item.name}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <span className="text-gray-300">₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <Separator className="bg-gray-800 my-4" />

                        {/* Totals */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Subtotal</span>
                                <span className="text-gray-300">₹{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">GST</span>
                                <span className="text-gray-300">₹{order.tax}</span>
                            </div>
                            <Separator className="bg-gray-800" />
                            <div className="flex justify-between pt-2">
                                <span className="text-white font-semibold">Total</span>
                                <span className="text-[#D4AF37] font-bold text-xl">₹{order.total}</span>
                            </div>
                        </div>

                        {order.instructions && (
                            <>
                                <Separator className="bg-gray-800 my-4" />
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Special Instructions</p>
                                    <p className="text-gray-300 italic">"{order.instructions}"</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Contact Card */}
                <Card className="bg-[#1A1A1A] border-gray-800">
                    <CardContent className="p-6 text-center">
                        <p className="text-gray-400 mb-4">Need help with your order?</p>
                        <a
                            href="tel:+919945871208"
                            className="inline-flex items-center gap-2 bg-[#C41E3A] hover:bg-[#a8182f] text-white px-6 py-3 rounded-xl font-medium transition-colors"
                        >
                            <Phone size={18} />
                            Call Restaurant
                        </a>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
