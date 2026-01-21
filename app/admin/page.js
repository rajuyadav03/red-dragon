'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LogOut, Plus, Edit, Trash2, Save, X, Menu as MenuIcon,
  Home, UtensilsCrossed, Settings, Image, Phone, MapPin,
  Clock, Link as LinkIcon, FileText, Eye, EyeOff, Loader2,
  ChefHat, Store, LayoutDashboard, Star
} from 'lucide-react';

// Login Component
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

// Sidebar Component
function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'dishes', label: 'Manage Dishes', icon: UtensilsCrossed },
    { id: 'categories', label: 'Categories', icon: ChefHat },
    { id: 'restaurant', label: 'Restaurant Info', icon: Store },
  ];

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-[#1A1A1A] border-r border-gray-800 transition-all duration-300 flex flex-col`}>
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C41E3A] to-[#8B0000] flex items-center justify-center flex-shrink-0">
            <span className="text-xl">🐉</span>
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-display font-bold text-white">Red Dragon</h2>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
              ? 'bg-[#C41E3A] text-white'
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
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
          {!collapsed && <span>View Site</span>}
        </a>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

// Dashboard Component
function Dashboard({ dishes, categories, info }) {
  const stats = [
    { label: 'Total Dishes', value: dishes?.length || 0, icon: UtensilsCrossed, color: 'from-[#C41E3A] to-[#8B0000]' },
    { label: 'Categories', value: categories?.length || 0, icon: ChefHat, color: 'from-[#D4AF37] to-[#B8860B]' },
    { label: 'Available', value: dishes?.filter(d => d.available)?.length || 0, icon: Eye, color: 'from-green-500 to-green-700' },
    { label: 'Featured', value: dishes?.filter(d => d.isFeatured && d.available)?.length || 0, icon: Star, color: 'from-yellow-500 to-orange-500' },
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

        <Card className="bg-[#1A1A1A] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Featured Dishes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dishes?.filter(d => d.isFeatured && d.available).slice(0, 5).map((dish) => (
                <div key={dish.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={dish.image || 'https://via.placeholder.com/40'}
                      alt={dish.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <span className="text-gray-300">{dish.name}</span>
                  </div>
                  <Badge className="bg-[#D4AF37] text-black">
                    ₹{dish.price}
                  </Badge>
                </div>
              ))}
              {dishes?.filter(d => d.isFeatured && d.available).length === 0 && (
                <p className="text-gray-500 text-sm">No featured dishes yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Dishes Management Component
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

// Categories Manager Component
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

// Restaurant Info Manager Component
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
      <h1 className="text-2xl font-bold text-white mb-6">Restaurant Information</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-[#1A1A1A] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Store size={20} className="text-[#C41E3A]" /> Basic Info
              </CardTitle>
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
                  placeholder="Best Chinese Food in Mira Road"
                  className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-300">Address</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-300">Business Hours</Label>
                <Input
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                  placeholder="7 AM – 1 AM"
                  className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Phone size={20} className="text-[#C41E3A]" /> Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Phone Number</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 99458 71208"
                  className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-300">WhatsApp Number</Label>
                <Input
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="+919945871208"
                  className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-300">Zomato Link</Label>
                <Input
                  value={formData.zomato}
                  onChange={(e) => setFormData({ ...formData, zomato: e.target.value })}
                  placeholder="https://zomato.com/..."
                  className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-300">Swiggy Link</Label>
                <Input
                  value={formData.swiggy}
                  onChange={(e) => setFormData({ ...formData, swiggy: e.target.value })}
                  placeholder="https://swiggy.com/..."
                  className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-gray-800 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Image size={20} className="text-[#C41E3A]" /> Hero Banner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label className="text-gray-300">Hero Image URL</Label>
                <Input
                  value={formData.heroImage}
                  onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                  placeholder="https://..."
                  className="bg-[#0A0A0A] border-gray-700 text-white mt-1"
                />
                {formData.heroImage && (
                  <img src={formData.heroImage} alt="Hero Preview" className="mt-3 h-40 rounded-xl object-cover w-full" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-gray-800 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText size={20} className="text-[#C41E3A]" /> About Us Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.aboutText}
                onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
                className="bg-[#0A0A0A] border-gray-700 text-white min-h-[200px]"
                placeholder="Write about your restaurant..."
              />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#C41E3A] hover:bg-[#a01830] px-8"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save size={18} className="mr-2" />}
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Main Admin Page Component
export default function AdminPage() {
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [info, setInfo] = useState(null);
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
        fetchAllData(savedToken);
      } else {
        localStorage.removeItem('adminToken');
        setLoading(false);
      }
    } catch (error) {
      localStorage.removeItem('adminToken');
      setLoading(false);
    }
  };

  const fetchAllData = async (authToken) => {
    try {
      const [dishesRes, categoriesRes, infoRes] = await Promise.all([
        fetch('/api/dishes?all=true', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        }),
        fetch('/api/categories'),
        fetch('/api/restaurant-info')
      ]);

      const dishesData = await dishesRes.json();
      const categoriesData = await categoriesRes.json();
      const infoData = await infoRes.json();

      setDishes(Array.isArray(dishesData) ? dishesData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setInfo(infoData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (newToken) => {
    setToken(newToken);
    fetchAllData(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    setToken(null);
  };

  const refreshData = () => {
    if (token) {
      fetchAllData(token);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C41E3A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      <main className="flex-1 p-8 overflow-auto">
        {activeTab === 'dashboard' && (
          <Dashboard dishes={dishes} categories={categories} info={info} />
        )}
        {activeTab === 'dishes' && (
          <DishesManager
            dishes={dishes}
            categories={categories}
            token={token}
            onRefresh={refreshData}
          />
        )}
        {activeTab === 'categories' && (
          <CategoriesManager
            categories={categories}
            token={token}
            onRefresh={refreshData}
          />
        )}
        {activeTab === 'restaurant' && (
          <RestaurantInfoManager
            info={info}
            token={token}
            onRefresh={refreshData}
          />
        )}
      </main>
    </div>
  );
}
