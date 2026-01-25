'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  LogOut, Plus, Edit, Trash2, Save, X,
  Home, UtensilsCrossed, Settings, Phone, MapPin,
  Clock, Eye, EyeOff, Loader2,
  ChefHat, Store, LayoutDashboard, Star, ShoppingBag,
  CheckCircle, XCircle, Timer, Truck, Package, Bell,
  RefreshCw, User, AlertCircle
} from 'lucide-react';

// ===== STATUS CONFIG =====
const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-yellow-500', textColor: 'text-yellow-500', icon: Package },
  confirmed: { label: 'Confirmed', color: 'bg-blue-500', textColor: 'text-blue-500', icon: CheckCircle },
  preparing: { label: 'Preparing', color: 'bg-orange-500', textColor: 'text-orange-500', icon: ChefHat },
  ready: { label: 'Ready', color: 'bg-green-500', textColor: 'text-green-500', icon: UtensilsCrossed },
  'out-for-delivery': { label: 'Out for Delivery', color: 'bg-purple-500', textColor: 'text-purple-500', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-600', textColor: 'text-green-600', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-500', textColor: 'text-red-500', icon: XCircle }
};

// ===== LOGIN COMPONENT =====
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminEmail', data.email);
      onLogin(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#1A1A1A] border-gray-800">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#C41E3A] to-[#8B0000] flex items-center justify-center">
            <span className="text-3xl">🐉</span>
          </div>
          <CardTitle className="text-2xl font-display text-white">Admin Login</CardTitle>
          <p className="text-gray-400 text-sm">Red Dragon Restaurant CMS</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@reddragon.com"
                className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#C41E3A] to-[#8B0000] hover:from-[#a01830] hover:to-[#6d0000]"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-[#0A0A0A] rounded-lg border border-gray-800">
            <p className="text-gray-400 text-xs mb-2">Default credentials:</p>
            <p className="text-gray-300 text-sm">Email: admin@reddragon.com</p>
            <p className="text-gray-300 text-sm">Password: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ===== SIDEBAR COMPONENT =====
function Sidebar({ activeTab, setActiveTab, onLogout, orderCount }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: orderCount },
    { id: 'dishes', label: 'Manage Dishes', icon: UtensilsCrossed },
    { id: 'categories', label: 'Categories', icon: ChefHat },
    { id: 'restaurant', label: 'Restaurant Info', icon: Store },
  ];

  return (
    <aside className="w-64 bg-[#1A1A1A] border-r border-gray-800 transition-all duration-300 flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C41E3A] to-[#8B0000] flex items-center justify-center flex-shrink-0">
            <span className="text-xl">🐉</span>
          </div>
          <div>
            <h2 className="font-display font-bold text-white">Red Dragon</h2>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
              ? 'bg-[#C41E3A] text-white'
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} />
              <span>{item.label}</span>
            </div>
            {item.badge > 0 && (
              <span className={`px-2 py-0.5 text-xs rounded-full ${activeTab === item.id ? 'bg-white text-[#C41E3A]' : 'bg-[#C41E3A] text-white'}`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-2">
        <a
          href="/"
          target="_blank"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <Eye size={20} />
          <span>View Site</span>
        </a>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

// ===== DASHBOARD COMPONENT =====
function Dashboard({ dishes, categories, info, orders }) {
  const pendingOrders = orders?.filter(o => o.status === 'pending')?.length || 0;
  const activeOrders = orders?.filter(o => ['confirmed', 'preparing', 'ready'].includes(o.status))?.length || 0;
  const todayTotal = orders?.filter(o => {
    const today = new Date().toDateString();
    return new Date(o.createdAt).toDateString() === today;
  })?.reduce((sum, o) => sum + o.total, 0) || 0;

  const stats = [
    { label: 'Total Dishes', value: dishes?.length || 0, icon: UtensilsCrossed, color: 'from-[#C41E3A] to-[#8B0000]' },
    { label: 'Pending Orders', value: pendingOrders, icon: Package, color: 'from-yellow-500 to-orange-500' },
    { label: 'Active Orders', value: activeOrders, icon: Timer, color: 'from-blue-500 to-purple-500' },
    { label: "Today's Revenue", value: `₹${todayTotal}`, icon: Star, color: 'from-[#D4AF37] to-[#B8860B]' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-[#1A1A1A] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-[#1A1A1A] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orders?.slice(0, 5).map((order) => {
                const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                return (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg">
                    <div>
                      <p className="text-white font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">{order.customer?.name}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                      <p className="text-[#D4AF37] font-semibold mt-1">₹{order.total}</p>
                    </div>
                  </div>
                );
              })}
              {(!orders || orders.length === 0) && (
                <p className="text-gray-500 text-sm text-center py-4">No orders yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Restaurant Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-gray-300">
              <Phone size={18} className="text-[#C41E3A]" />
              <span>{info?.phone || 'Not set'}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <MapPin size={18} className="text-[#C41E3A]" />
              <span>{info?.address || 'Not set'}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Clock size={18} className="text-[#C41E3A]" />
              <span>{info?.hours || 'Not set'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ===== ORDERS MANAGER COMPONENT =====
function OrdersManager({ orders, token, onRefresh }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState({});
  const audioRef = useRef(null);

  const filteredOrders = orders?.filter(order => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status);
    return order.status === statusFilter;
  }) || [];

  const updateOrderStatus = async (orderId, newStatus) => {
    setLoading(prev => ({ ...prev, [orderId]: true }));
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Failed to update status');
      onRefresh();
      if (selectedOrder?.id === orderId) {
        const updated = await res.json();
        setSelectedOrder(updated);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const getNextStatus = (currentStatus) => {
    const flow = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'delivered'
    };
    return flow[currentStatus];
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-[#1A1A1A] border-gray-700 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-gray-700">
              <SelectItem value="all" className="text-white hover:bg-gray-800">All Orders</SelectItem>
              <SelectItem value="active" className="text-white hover:bg-gray-800">Active Orders</SelectItem>
              <SelectItem value="pending" className="text-white hover:bg-gray-800">Pending</SelectItem>
              <SelectItem value="confirmed" className="text-white hover:bg-gray-800">Confirmed</SelectItem>
              <SelectItem value="preparing" className="text-white hover:bg-gray-800">Preparing</SelectItem>
              <SelectItem value="ready" className="text-white hover:bg-gray-800">Ready</SelectItem>
              <SelectItem value="delivered" className="text-white hover:bg-gray-800">Delivered</SelectItem>
              <SelectItem value="cancelled" className="text-white hover:bg-gray-800">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={onRefresh} variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            <RefreshCw size={18} className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <Card className="bg-[#1A1A1A] border-gray-800">
          <CardContent className="p-12 text-center">
            <ShoppingBag size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">No orders found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredOrders.map((order) => {
            const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const nextStatus = getNextStatus(order.status);
            const isLoading = loading[order.id];

            return (
              <Card
                key={order.id}
                className={`bg-[#1A1A1A] border-gray-800 overflow-hidden cursor-pointer hover:border-[#C41E3A]/50 transition-colors ${order.status === 'pending' ? 'border-yellow-500/50' : ''}`}
                onClick={() => setSelectedOrder(order)}
              >
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[#D4AF37] font-bold">{order.orderNumber}</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                  </div>

                  {/* Customer */}
                  <div className="flex items-center gap-2 mb-3">
                    <User size={14} className="text-gray-500" />
                    <span className="text-white text-sm">{order.customer?.name}</span>
                    <span className="text-gray-500 text-xs">• {order.type}</span>
                  </div>

                  {/* Items preview */}
                  <div className="bg-[#0A0A0A] rounded-lg p-3 mb-3">
                    <p className="text-gray-400 text-xs mb-1">{order.items?.length} items</p>
                    <p className="text-white text-sm truncate">
                      {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-[#D4AF37] font-bold text-lg">₹{order.total}</span>
                    {nextStatus && order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <Button
                        size="sm"
                        className="bg-[#C41E3A] hover:bg-[#a8182f]"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateOrderStatus(order.id, nextStatus);
                        }}
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader2 size={14} className="animate-spin" /> : (
                          <>
                            {nextStatus === 'confirmed' && 'Accept'}
                            {nextStatus === 'preparing' && 'Start Preparing'}
                            {nextStatus === 'ready' && 'Mark Ready'}
                            {nextStatus === 'delivered' && 'Complete'}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Order Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="bg-[#1A1A1A] border-gray-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Order {selectedOrder.orderNumber}</span>
                  <Badge className={STATUS_CONFIG[selectedOrder.status]?.color}>
                    {STATUS_CONFIG[selectedOrder.status]?.label}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Customer Info */}
                <div className="bg-[#0A0A0A] rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Customer</h4>
                  <p className="text-white font-medium">{selectedOrder.customer?.name}</p>
                  <p className="text-gray-400 text-sm">{selectedOrder.customer?.phone}</p>
                  {selectedOrder.customer?.address && (
                    <p className="text-gray-400 text-sm mt-1">{selectedOrder.customer?.address}</p>
                  )}
                </div>

                {/* Order Type & Time */}
                <div className="flex gap-4">
                  <div className="flex-1 bg-[#0A0A0A] rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Type</h4>
                    <p className="text-white capitalize">{selectedOrder.type}</p>
                  </div>
                  {selectedOrder.tableNumber && (
                    <div className="flex-1 bg-[#0A0A0A] rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Table</h4>
                      <p className="text-white">{selectedOrder.tableNumber}</p>
                    </div>
                  )}
                  <div className="flex-1 bg-[#0A0A0A] rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Time</h4>
                    <p className="text-white">{new Date(selectedOrder.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="bg-[#0A0A0A] rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-white">{item.quantity}x {item.name}</span>
                        <span className="text-gray-400">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-3 bg-gray-800" />
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="text-gray-300">₹{selectedOrder.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Tax</span>
                      <span className="text-gray-300">₹{selectedOrder.tax}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2">
                      <span className="text-white">Total</span>
                      <span className="text-[#D4AF37]">₹{selectedOrder.total}</span>
                    </div>
                  </div>
                </div>

                {/* Special Instructions */}
                {selectedOrder.instructions && (
                  <div className="bg-[#0A0A0A] rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Special Instructions</h4>
                    <p className="text-white italic">"{selectedOrder.instructions}"</p>
                  </div>
                )}

                {/* Actions */}
                {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                  <div className="flex gap-2 pt-2">
                    {getNextStatus(selectedOrder.status) && (
                      <Button
                        className="flex-1 bg-[#C41E3A] hover:bg-[#a8182f]"
                        onClick={() => {
                          updateOrderStatus(selectedOrder.id, getNextStatus(selectedOrder.status));
                        }}
                        disabled={loading[selectedOrder.id]}
                      >
                        {loading[selectedOrder.id] ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                        {getNextStatus(selectedOrder.status) === 'confirmed' && 'Accept Order'}
                        {getNextStatus(selectedOrder.status) === 'preparing' && 'Start Preparing'}
                        {getNextStatus(selectedOrder.status) === 'ready' && 'Mark Ready'}
                        {getNextStatus(selectedOrder.status) === 'delivered' && 'Complete Order'}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="border-red-800 text-red-400 hover:bg-red-500/10"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===== DISHES MANAGER COMPONENT =====
function DishesManager({ dishes, categories, token, onRefresh }) {
  const [editingDish, setEditingDish] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    category: '',
    description: '',
    available: true,
    isFeatured: false
  });

  const openNewDish = () => {
    setEditingDish(null);
    setFormData({
      name: '',
      price: '',
      image: '',
      category: categories?.[0]?.id || '',
      description: '',
      available: true,
      isFeatured: false
    });
    setIsDialogOpen(true);
  };

  const openEditDish = (dish) => {
    setEditingDish(dish);
    setFormData({
      name: dish.name,
      price: dish.price.toString(),
      image: dish.image || '',
      category: dish.category,
      description: dish.description || '',
      available: dish.available,
      isFeatured: dish.isFeatured || false
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingDish
        ? `/api/admin/dishes/${editingDish.id}`
        : '/api/admin/dishes';

      const res = await fetch(url, {
        method: editingDish ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      });

      if (!res.ok) throw new Error('Failed to save dish');

      setIsDialogOpen(false);
      onRefresh();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (dish) => {
    try {
      const res = await fetch(`/api/admin/dishes/${dish.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ available: !dish.available })
      });

      if (!res.ok) throw new Error('Failed to update');
      onRefresh();
    } catch (error) {
      alert(error.message);
    }
  };

  const toggleFeatured = async (dish) => {
    try {
      const res = await fetch(`/api/admin/dishes/${dish.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isFeatured: !dish.isFeatured })
      });

      if (!res.ok) throw new Error('Failed to update');
      onRefresh();
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteDish = async (dish) => {
    if (!confirm(`Delete "${dish.name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/dishes/${dish.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to delete');
      onRefresh();
    } catch (error) {
      alert(error.message);
    }
  };

  const getCategoryName = (catId) => {
    return categories?.find(c => c.id === catId)?.name || 'Unknown';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Dishes</h1>
        <Button onClick={openNewDish} className="bg-[#C41E3A] hover:bg-[#a01830]">
          <Plus size={18} className="mr-2" /> Add Dish
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dishes?.map((dish) => (
          <Card key={dish.id} className="bg-[#1A1A1A] border-gray-800 overflow-hidden">
            <div className="relative h-40">
              <img
                src={dish.image || 'https://images.pexels.com/photos/2670327/pexels-photo-2670327.jpeg'}
                alt={dish.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                {dish.isFeatured && (
                  <Badge className="bg-[#D4AF37] text-black">
                    <Star size={12} className="mr-1" fill="currentColor" /> Featured
                  </Badge>
                )}
                <Badge className={dish.available ? 'bg-green-600' : 'bg-gray-600'}>
                  {dish.available ? 'Available' : 'Hidden'}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-white">{dish.name}</h3>
                  <p className="text-sm text-gray-400">{getCategoryName(dish.category)}</p>
                </div>
                <span className="text-lg font-bold text-[#D4AF37]">₹{dish.price}</span>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleFeatured(dish)}
                  className={`flex-1 ${dish.isFeatured ? 'border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10' : 'border-gray-700 text-gray-300 hover:bg-gray-800'}`}
                >
                  <Star size={16} className="mr-1" fill={dish.isFeatured ? 'currentColor' : 'none'} />
                  {dish.isFeatured ? 'Featured' : 'Feature'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleAvailability(dish)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  {dish.available ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditDish(dish)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <Edit size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteDish(dish)}
                  className="border-red-800 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1A1A1A] border-gray-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>{editingDish ? 'Edit Dish' : 'Add New Dish'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-gray-300">Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-gray-300">Price (₹)</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-gray-300">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="bg-[#0A0A0A] border-gray-700 text-white mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-gray-700">
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className="text-white hover:bg-gray-800">
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-300">Image URL</Label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
                className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
              />
              {formData.image && (
                <img src={formData.image} alt="Preview" className="mt-2 h-24 rounded-lg object-cover" />
              )}
            </div>

            <div>
              <Label className="text-gray-300">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
                rows={2}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-gray-300">Available on Menu</Label>
              <Switch
                checked={formData.available}
                onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300">Featured on Homepage</Label>
                <p className="text-xs text-gray-500">Show this dish on the homepage</p>
              </div>
              <Switch
                checked={formData.isFeatured}
                onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1 border-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#C41E3A] hover:bg-[#a01830]"
              >
                {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save size={18} className="mr-2" />}
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===== CATEGORIES MANAGER COMPONENT =====
function CategoriesManager({ categories, token, onRefresh }) {
  const [editingCat, setEditingCat] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  const openNewCategory = () => {
    setEditingCat(null);
    setName('');
    setIsDialogOpen(true);
  };

  const openEditCategory = (cat) => {
    setEditingCat(cat);
    setName(cat.name);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingCat
        ? `/api/admin/categories/${editingCat.id}`
        : '/api/admin/categories';

      const res = await fetch(url, {
        method: editingCat ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });

      if (!res.ok) throw new Error('Failed to save category');

      setIsDialogOpen(false);
      onRefresh();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (cat) => {
    if (!confirm(`Delete category "${cat.name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to delete');
      onRefresh();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Categories</h1>
        <Button onClick={openNewCategory} className="bg-[#C41E3A] hover:bg-[#a01830]">
          <Plus size={18} className="mr-2" /> Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories?.map((cat) => (
          <Card key={cat.id} className="bg-[#1A1A1A] border-gray-800">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C41E3A] to-[#8B0000] flex items-center justify-center">
                  <ChefHat size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{cat.name}</h3>
                  <p className="text-sm text-gray-400">Order: {cat.order}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditCategory(cat)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <Edit size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteCategory(cat)}
                  className="border-red-800 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1A1A1A] border-gray-800 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle>{editingCat ? 'Edit Category' : 'Add New Category'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-gray-300">Category Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Appetizers"
                className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1 border-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#C41E3A] hover:bg-[#a01830]"
              >
                {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save size={18} className="mr-2" />}
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===== RESTAURANT INFO MANAGER COMPONENT =====
function RestaurantInfoManager({ info, token, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    phone: '',
    whatsapp: '',
    address: '',
    hours: '',
    zomato: '',
    swiggy: '',
    aboutText: '',
    heroImage: ''
  });

  useEffect(() => {
    if (info) {
      setFormData({
        name: info.name || '',
        tagline: info.tagline || '',
        phone: info.phone || '',
        whatsapp: info.whatsapp || '',
        address: info.address || '',
        hours: info.hours || '',
        zomato: info.zomato || '',
        swiggy: info.swiggy || '',
        aboutText: info.aboutText || '',
        heroImage: info.heroImage || ''
      });
    }
  }, [info]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/restaurant-info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to save');

      alert('Restaurant info updated successfully!');
      onRefresh();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Restaurant Info</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-[#1A1A1A] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">Basic Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Restaurant Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-300">Tagline</Label>
                <Input
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-300">Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-300">WhatsApp</Label>
                <Input
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">Location & Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Address</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-300">Hours</Label>
                <Input
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                  className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-300">Zomato URL</Label>
                <Input
                  value={formData.zomato}
                  onChange={(e) => setFormData({ ...formData, zomato: e.target.value })}
                  className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-300">Swiggy URL</Label>
                <Input
                  value={formData.swiggy}
                  onChange={(e) => setFormData({ ...formData, swiggy: e.target.value })}
                  className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-gray-800 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-white text-lg">About & Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Hero Image URL</Label>
                <Input
                  value={formData.heroImage}
                  onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                  className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
                />
                {formData.heroImage && (
                  <img src={formData.heroImage} alt="Preview" className="mt-2 h-32 rounded-lg object-cover" />
                )}
              </div>
              <div>
                <Label className="text-gray-300">About Text</Label>
                <Textarea
                  value={formData.aboutText}
                  onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
                  className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#C41E3A] hover:bg-[#a01830]"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save size={18} className="mr-2" />}
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}

// ===== MAIN ADMIN PAGE =====
export default function AdminPage() {
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [info, setInfo] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      verifyToken(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (savedToken) => {
    try {
      const res = await fetch('/api/admin/verify', {
        headers: { 'Authorization': `Bearer ${savedToken}` }
      });
      if (res.ok) {
        setToken(savedToken);
        fetchData(savedToken);
      } else {
        localStorage.removeItem('adminToken');
        setLoading(false);
      }
    } catch {
      localStorage.removeItem('adminToken');
      setLoading(false);
    }
  };

  const fetchData = async (authToken) => {
    try {
      const headers = { 'Authorization': `Bearer ${authToken}` };
      const [dishesRes, categoriesRes, infoRes, ordersRes] = await Promise.all([
        fetch('/api/dishes?all=true'),
        fetch('/api/categories'),
        fetch('/api/restaurant-info'),
        fetch('/api/admin/orders', { headers })
      ]);

      setDishes(await dishesRes.json());
      setCategories(await categoriesRes.json());
      setInfo(await infoRes.json());
      setOrders(await ordersRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (newToken) => {
    setToken(newToken);
    fetchData(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    setToken(null);
  };

  const handleRefresh = () => {
    fetchData(token);
  };

  // Auto-refresh orders every 15 seconds
  useEffect(() => {
    if (token) {
      const interval = setInterval(() => {
        fetch('/api/admin/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => setOrders(data))
          .catch(console.error);
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#C41E3A]" />
      </div>
    );
  }

  if (!token) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const pendingOrderCount = orders?.filter(o => o.status === 'pending')?.length || 0;

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        orderCount={pendingOrderCount}
      />

      <main className="flex-1 p-6 overflow-auto">
        {activeTab === 'dashboard' && (
          <Dashboard dishes={dishes} categories={categories} info={info} orders={orders} />
        )}
        {activeTab === 'orders' && (
          <OrdersManager orders={orders} token={token} onRefresh={handleRefresh} />
        )}
        {activeTab === 'dishes' && (
          <DishesManager dishes={dishes} categories={categories} token={token} onRefresh={handleRefresh} />
        )}
        {activeTab === 'categories' && (
          <CategoriesManager categories={categories} token={token} onRefresh={handleRefresh} />
        )}
        {activeTab === 'restaurant' && (
          <RestaurantInfoManager info={info} token={token} onRefresh={handleRefresh} />
        )}
      </main>
    </div>
  );
}
