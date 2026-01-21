'use client';

import { useState, useEffect } from 'react';
import { Phone, MapPin, Clock, ChevronRight, Star, Utensils, ShieldCheck, Award, Menu as MenuIcon, X, Facebook, Instagram, Twitter, Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Navigation Component - Modern Floating Design
function Navigation({ currentPage, setCurrentPage, info }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['Home', 'Menu', 'About', 'Contact', 'Order'];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-2' : 'py-4'}`}>
      <div className={`mx-auto max-w-6xl px-4 transition-all duration-500 ${isScrolled ? 'mx-4' : ''}`}>
        <div className={`flex items-center justify-between px-5 py-2.5 rounded-full transition-all duration-500 ${isScrolled ? 'bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/5 shadow-2xl shadow-black/50' : 'bg-transparent'}`}>

          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setCurrentPage('Home')}>
            <div className="w-9 h-9 rounded-full bg-[#C41E3A] flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-lg">🐉</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-base font-bold text-white leading-tight">Red Dragon</h1>
              <p className="text-[10px] text-gray-500 leading-tight">Chinese Restaurant</p>
            </div>
          </div>

          {/* Desktop Nav - Centered */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setCurrentPage(item)}
                className={`relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${currentPage === item
                  ? 'text-white bg-[#C41E3A]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <a
            href={`tel:${info?.phone || '+919945871208'}`}
            className="hidden md:flex items-center gap-2 bg-[#C41E3A] hover:bg-[#a8182f] px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#C41E3A]/20"
          >
            <Phone size={14} />
            <span>Call Now</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>

        {/* Mobile Nav - Slide Down */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-[400px] mt-2' : 'max-h-0'}`}>
          <div className="bg-[#0A0A0A]/95 backdrop-blur-xl rounded-2xl border border-white/5 p-4">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => { setCurrentPage(item); setIsMenuOpen(false); }}
                className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentPage === item
                  ? 'text-white bg-[#C41E3A]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {item}
              </button>
            ))}
            <a
              href={`tel:${info?.phone || '+919945871208'}`}
              className="flex items-center justify-center gap-2 mt-3 bg-[#C41E3A] hover:bg-[#a8182f] px-4 py-3 rounded-xl text-sm font-medium transition-all"
            >
              <Phone size={16} />
              <span>Call Now</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Hero Section - Premium Dark Design
function HeroSection({ info }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* Deep Dark Background with Visible Image */}
      <div className="absolute inset-0">
        <img
          src={info?.heroImage || "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=1920"}
          alt="Authentic Chinese Cuisine"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/70 via-[#050505]/50 to-[#050505]/95"></div>
      </div>

      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C41E3A]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-[#D4AF37]/3 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Main Content - Vertically Centered & Aligned */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-6 text-center">

        {/* Badge */}
        <div className="mb-6 animate-fade-in">
          <span className="inline-flex items-center gap-2.5 px-5 py-2 bg-[#0A0A0A]/80 backdrop-blur-sm border border-[#D4AF37]/20 rounded-full text-[#D4AF37] text-[11px] font-medium tracking-[0.15em] uppercase">
            <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse"></span>
            Authentic Chinese Cuisine
          </span>
        </div>

        {/* Main Title */}
        <div className="mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h1 className="font-display text-[3.5rem] sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] animate-title-glow">
            <span className="text-white inline-block animate-title-float">Red</span>
            <span className="text-[#C41E3A] inline-block animate-title-float" style={{ animationDelay: '0.15s' }}> Dragon</span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className="mb-3 animate-fade-in" style={{ animationDelay: '0.15s' }}>
          <p className="text-[#6B6B6B] text-sm md:text-base tracking-[0.25em] uppercase font-light">
            Chinese Restaurant
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#C41E3A]/40"></div>
          <div className="w-1.5 h-1.5 bg-[#C41E3A]/60 rotate-45"></div>
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#C41E3A]/40"></div>
        </div>

        {/* Tagline */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.25s' }}>
          <p className="text-gradient-gold text-lg md:text-xl font-display font-medium">
            {info?.tagline || "Best Chinese Food in Mira Road"}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <a
            href={`tel:${info?.phone || '+919945871208'}`}
            className="group relative overflow-hidden bg-[#C41E3A] hover:bg-[#a8182f] px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-[#C41E3A]/20"
          >
            <Phone size={15} />
            <span>Call Now</span>
          </a>
          <a
            href={`https://wa.me/${info?.whatsapp?.replace(/[^0-9]/g, '') || '919945871208'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#1A1A1A] hover:bg-[#222] border border-[#2A2A2A] px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
            <span className="text-gray-300">WhatsApp</span>
          </a>
        </div>

        {/* Location & Hours - Stacked on mobile */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-[#555] text-xs animate-fade-in" style={{ animationDelay: '0.35s' }}>
          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-[#C41E3A]/70" />
            <span>{info?.address || 'Mira Road East, Mumbai'}</span>
          </div>
          <span className="hidden sm:block text-[#333]">|</span>
          <div className="flex items-center gap-2">
            <Clock size={13} className="text-[#C41E3A]/70" />
            <span>{info?.hours || '7 AM – 1 AM'}</span>
          </div>
        </div>

      </div>
    </section>
  );
}

// Featured Dishes Section
function FeaturedDishes({ dishes, categories, setCurrentPage }) {
  // Filter to show only featured dishes, or first 6 if none marked as featured
  const featuredDishes = dishes?.filter(d => d.isFeatured) || [];
  const displayDishes = featuredDishes.length > 0 ? featuredDishes.slice(0, 6) : dishes?.slice(0, 6) || [];

  const getCategoryName = (catId) => {
    const cat = categories?.find(c => c.id === catId);
    return cat?.name || 'Special';
  };

  return (
    <section className="py-12 sm:py-20 bg-[#0A0A0A]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-[#C41E3A] text-xs sm:text-sm font-medium tracking-wider uppercase">Our Specialties</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-3 sm:mt-4 mb-4 sm:mb-6">
            <span className="text-white">Featured</span>{' '}
            <span className="text-gradient-gold">Dishes</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto px-4">
            Discover our chef's handpicked selection of authentic Chinese delicacies
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {displayDishes.map((dish, index) => (
            <Card key={dish.id} className="bg-[#1A1A1A] border-gray-800 overflow-hidden group hover:border-[#C41E3A] transition-all duration-300 hover-glow animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="relative h-56 overflow-hidden">
                <img
                  src={dish.image || 'https://images.pexels.com/photos/2670327/pexels-photo-2670327.jpeg'}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <Badge className="absolute top-4 left-4 bg-[#C41E3A] hover:bg-[#C41E3A]">
                  {getCategoryName(dish.category)}
                </Badge>
                {dish.isFeatured && (
                  <Badge className="absolute top-4 right-4 bg-[#D4AF37] text-black">
                    <Star size={12} className="mr-1" fill="currentColor" /> Chef's Pick
                  </Badge>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{dish.name}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{dish.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#D4AF37]">₹{dish.price}</span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <Button
            onClick={() => setCurrentPage('Menu')}
            className="gradient-red px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold hover-glow transition-all transform hover:scale-105"
          >
            View Full Menu <ChevronRight size={20} className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}

// Trust Section
function TrustSection() {
  const features = [
    { icon: ShieldCheck, title: 'Quality Assured', desc: 'Freshest ingredients sourced daily' },
    { icon: Utensils, title: 'Authentic Taste', desc: 'Traditional Chinese recipes' },
    { icon: Award, title: 'Highly Rated', desc: '4.5+ rating on Zomato' },
    { icon: Clock, title: 'Fast Delivery', desc: 'Quick service guaranteed' },
  ];

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl gradient-red flex items-center justify-center group-hover:scale-110 transition-transform">
                <feature.icon size={24} className="text-white sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-sm sm:text-lg font-semibold text-white mb-1 sm:mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-xs sm:text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Menu Page
function MenuPage({ dishes, categories }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredDishes = activeCategory === 'all'
    ? dishes
    : dishes?.filter(d => d.category === activeCategory);

  const getCategoryName = (catId) => {
    const cat = categories?.find(c => c.id === catId);
    return cat?.name || 'Special';
  };

  return (
    <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-[#C41E3A] text-xs sm:text-sm font-medium tracking-wider uppercase">Explore Our</span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold mt-3 sm:mt-4 mb-4 sm:mb-6">
            <span className="text-white">Delicious</span>{' '}
            <span className="text-gradient-gold">Menu</span>
          </h1>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          <Button
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            className={activeCategory === 'all' ? 'gradient-red border-0' : 'border-[#C41E3A] text-[#C41E3A] hover:bg-[#C41E3A] hover:text-white'}
            onClick={() => setActiveCategory('all')}
          >
            All Dishes
          </Button>
          {categories?.map(cat => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? 'default' : 'outline'}
              className={activeCategory === cat.id ? 'gradient-red border-0' : 'border-[#C41E3A] text-[#C41E3A] hover:bg-[#C41E3A] hover:text-white'}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDishes?.map((dish, index) => (
            <Card key={dish.id} className="bg-[#1A1A1A] border-gray-800 overflow-hidden group hover:border-[#C41E3A] transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="relative h-48 overflow-hidden">
                <img
                  src={dish.image || 'https://images.pexels.com/photos/2670327/pexels-photo-2670327.jpeg'}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <Badge className="absolute top-3 left-3 bg-[#C41E3A]/90 hover:bg-[#C41E3A] text-xs">
                  {getCategoryName(dish.category)}
                </Badge>
                {dish.available && (
                  <Badge className="absolute top-3 right-3 bg-green-600 hover:bg-green-600 text-xs">
                    Available
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-white mb-1">{dish.name}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{dish.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[#D4AF37]">₹{dish.price}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDishes?.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No dishes available in this category</p>
          </div>
        )}
      </div>
    </section>
  );
}

// About Page
function AboutPage({ info }) {
  return (
    <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-[#C41E3A] text-xs sm:text-sm font-medium tracking-wider uppercase">Our Story</span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold mt-3 sm:mt-4 mb-4 sm:mb-6">
            <span className="text-white">About</span>{' '}
            <span className="text-gradient-gold">Red Dragon</span>
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
              alt="Restaurant Interior"
              className="rounded-3xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 gradient-red rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <span className="text-3xl font-bold text-white">10+</span>
                <p className="text-xs text-white/80">Years of Excellence</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">
              A Legacy of Authentic Chinese Flavors
            </h2>
            <div className="prose prose-invert max-w-none">
              {info?.aboutText?.split('\n\n').map((para, i) => (
                <p key={i} className="text-gray-300 mb-4 leading-relaxed">{para}</p>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-6 mt-6 sm:mt-8">
              <div className="glass-effect p-4 sm:p-6 rounded-xl sm:rounded-2xl">
                <h4 className="text-[#D4AF37] text-sm sm:text-base font-semibold mb-1 sm:mb-2">Fresh Ingredients</h4>
                <p className="text-gray-400 text-xs sm:text-sm">Daily sourced vegetables and premium meats</p>
              </div>
              <div className="glass-effect p-4 sm:p-6 rounded-xl sm:rounded-2xl">
                <h4 className="text-[#D4AF37] text-sm sm:text-base font-semibold mb-1 sm:mb-2">Skilled Chefs</h4>
                <p className="text-gray-400 text-xs sm:text-sm">Trained in authentic Chinese cooking</p>
              </div>
              <div className="glass-effect p-4 sm:p-6 rounded-xl sm:rounded-2xl">
                <h4 className="text-[#D4AF37] text-sm sm:text-base font-semibold mb-1 sm:mb-2">Hygiene First</h4>
                <p className="text-gray-400 text-xs sm:text-sm">FSSAI certified kitchen</p>
              </div>
              <div className="glass-effect p-4 sm:p-6 rounded-xl sm:rounded-2xl">
                <h4 className="text-[#D4AF37] text-sm sm:text-base font-semibold mb-1 sm:mb-2">Family Recipes</h4>
                <p className="text-gray-400 text-xs sm:text-sm">Traditional recipes passed down generations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Contact Page
function ContactPage({ info }) {
  return (
    <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-[#C41E3A] text-xs sm:text-sm font-medium tracking-wider uppercase">Get in Touch</span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold mt-3 sm:mt-4 mb-4 sm:mb-6">
            <span className="text-white">Contact</span>{' '}
            <span className="text-gradient-gold">Us</span>
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
          <div>
            <div className="glass-effect p-5 sm:p-8 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Visit Us</h3>

              <div className="space-y-4 sm:space-y-6">
                <a href={`tel:${info?.phone || '+919945871208'}`} className="flex items-center gap-4 group">
                  <div className="w-14 h-14 gradient-red rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white text-lg font-semibold">{info?.phone || '+91 99458 71208'}</p>
                  </div>
                </a>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 gradient-red rounded-xl flex items-center justify-center">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Address</p>
                    <p className="text-white text-lg font-semibold">{info?.address || 'Mira Road East, Mumbai'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 gradient-red rounded-xl flex items-center justify-center">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Hours</p>
                    <p className="text-white text-lg font-semibold">{info?.hours || '7 AM – 1 AM'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <a href={`https://wa.me/${info?.whatsapp?.replace(/[^0-9]/g, '') || '919945871208'}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-green-600 hover:bg-green-700 p-4 rounded-xl flex items-center justify-center gap-3 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                WhatsApp
              </a>
              <a href={`tel:${info?.phone || '+919945871208'}`} className="flex-1 gradient-red p-4 rounded-xl flex items-center justify-center gap-3 transition-all hover-glow">
                <Phone size={24} />
                Call Now
              </a>
            </div>
          </div>

          <div>
            <div className="glass-effect p-4 rounded-3xl overflow-hidden h-full min-h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3764.5626173447137!2d72.8644067!3d19.2905648!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b0e5e9a9fdb1%3A0x5e5e5e5e5e5e5e5e!2sMira%20Road%20East%2C%20Mira%20Bhayandar%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px', borderRadius: '20px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Order Page
function OrderPage({ info }) {
  return (
    <section className="pt-32 pb-20 min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[#C41E3A] text-sm font-medium tracking-wider uppercase">Hungry?</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold mt-4 mb-6">
            <span className="text-white">Order</span>{' '}
            <span className="text-gradient-gold">Online</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Get your favorite Chinese dishes delivered to your doorstep
          </p>
        </div>

        <div className="max-w-3xl mx-auto grid gap-6">
          <a href={info?.zomato || 'https://www.zomato.com/mumbai/red-dragon-restaurant-mira-road'} target="_blank" rel="noopener noreferrer" className="glass-effect p-8 rounded-3xl flex items-center gap-6 hover:border-[#E23744] transition-all group">
            <div className="w-20 h-20 bg-[#E23744] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.5 17.5c-1.5 0-2.5-1-2.5-2.5s1-2.5 2.5-2.5 2.5 1 2.5 2.5-1 2.5-2.5 2.5zm-11 0c-1.5 0-2.5-1-2.5-2.5s1-2.5 2.5-2.5 2.5 1 2.5 2.5-1 2.5-2.5 2.5z" /></svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">Order on Zomato</h3>
              <p className="text-gray-400">Get exclusive offers and fast delivery</p>
            </div>
            <ChevronRight size={32} className="text-gray-400 group-hover:text-[#E23744] group-hover:translate-x-2 transition-all" />
          </a>

          <a href={info?.swiggy || 'https://www.swiggy.com'} target="_blank" rel="noopener noreferrer" className="glass-effect p-8 rounded-3xl flex items-center gap-6 hover:border-[#FF5722] transition-all group">
            <div className="w-20 h-20 bg-[#FF5722] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.5 17.5c-1.5 0-2.5-1-2.5-2.5s1-2.5 2.5-2.5 2.5 1 2.5 2.5-1 2.5-2.5 2.5zm-11 0c-1.5 0-2.5-1-2.5-2.5s1-2.5 2.5-2.5 2.5 1 2.5 2.5-1 2.5-2.5 2.5z" /></svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">Order on Swiggy</h3>
              <p className="text-gray-400">Super fast delivery at your door</p>
            </div>
            <ChevronRight size={32} className="text-gray-400 group-hover:text-[#FF5722] group-hover:translate-x-2 transition-all" />
          </a>

          <a href={`https://wa.me/${info?.whatsapp?.replace(/[^0-9]/g, '') || '919945871208'}`} target="_blank" rel="noopener noreferrer" className="glass-effect p-8 rounded-3xl flex items-center gap-6 hover:border-green-600 transition-all group">
            <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">WhatsApp Order</h3>
              <p className="text-gray-400">Direct order via WhatsApp</p>
            </div>
            <ChevronRight size={32} className="text-gray-400 group-hover:text-green-600 group-hover:translate-x-2 transition-all" />
          </a>

          <a href={`tel:${info?.phone || '+919945871208'}`} className="glass-effect p-8 rounded-3xl flex items-center gap-6 hover:border-[#C41E3A] transition-all group">
            <div className="w-20 h-20 gradient-red rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Phone size={40} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">Call to Order</h3>
              <p className="text-gray-400">{info?.phone || '+91 99458 71208'}</p>
            </div>
            <ChevronRight size={32} className="text-gray-400 group-hover:text-[#C41E3A] group-hover:translate-x-2 transition-all" />
          </a>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer({ info, setCurrentPage }) {
  return (
    <footer className="bg-[#0A0A0A] border-t border-gray-800 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full gradient-red flex items-center justify-center">
                <span className="text-2xl">🐉</span>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-white">Red Dragon</h3>
                <p className="text-xs text-gray-400">Chinese Restaurant</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Authentic Chinese cuisine in the heart of Mira Road. Experience the flavors of China with every bite.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Menu', 'About', 'Contact', 'Order'].map(item => (
                <li key={item}>
                  <button onClick={() => setCurrentPage(item)} className="text-gray-400 hover:text-[#C41E3A] transition-colors text-sm">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Contact Info</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-[#C41E3A]" />
                {info?.phone || '+91 99458 71208'}
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-[#C41E3A]" />
                {info?.address || 'Mira Road East, Mumbai'}
              </li>
              <li className="flex items-center gap-2">
                <Clock size={16} className="text-[#C41E3A]" />
                {info?.hours || '7 AM – 1 AM'}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Order Now</h4>
            <div className="space-y-3">
              <a href={info?.zomato || '#'} target="_blank" rel="noopener noreferrer" className="block bg-[#E23744] hover:bg-[#d12d3e] text-white text-sm px-4 py-3 rounded-lg text-center transition-colors">
                Order on Zomato
              </a>
              <a href={info?.swiggy || '#'} target="_blank" rel="noopener noreferrer" className="block bg-[#FF5722] hover:bg-[#e64a19] text-white text-sm px-4 py-3 rounded-lg text-center transition-colors">
                Order on Swiggy
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Red Dragon Chinese Restaurant. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#C41E3A] transition-colors">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#C41E3A] transition-colors">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#C41E3A] transition-colors">
              <Twitter size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main App Component
export default function App() {
  const [currentPage, setCurrentPage] = useState('Home');
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dishesRes, categoriesRes, infoRes] = await Promise.all([
        fetch('/api/dishes'),
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center overflow-hidden">
        {/* Background ambient effect */}
        <div className="dragon-loader-bg"></div>

        {/* Main loader container */}
        <div className="dragon-loader-container">
          {/* Dragon circle with all effects */}
          <div className="dragon-circle">
            {/* Breath waves emanating outward */}
            <div className="dragon-breath">
              <div className="breath-wave"></div>
              <div className="breath-wave"></div>
              <div className="breath-wave"></div>
            </div>

            {/* Glowing orbs rotating around */}
            <div className="dragon-orbs">
              <div className="dragon-orb"></div>
              <div className="dragon-orb"></div>
              <div className="dragon-orb"></div>
              <div className="dragon-orb"></div>
              <div className="dragon-orb"></div>
              <div className="dragon-orb"></div>
              <div className="dragon-orb"></div>
              <div className="dragon-orb"></div>
            </div>

            {/* Outer rotating ring */}
            <div className="dragon-ring-outer"></div>

            {/* Middle ring with glow */}
            <div className="dragon-ring-middle"></div>

            {/* Fire particles */}
            <div className="dragon-fire-particles">
              <div className="fire-particle"></div>
              <div className="fire-particle"></div>
              <div className="fire-particle"></div>
              <div className="fire-particle"></div>
              <div className="fire-particle"></div>
              <div className="fire-particle"></div>
              <div className="fire-particle"></div>
              <div className="fire-particle"></div>
            </div>

            {/* Inner core with dragon */}
            <div className="dragon-core">
              <span className="dragon-emoji">🐉</span>
            </div>
          </div>

          {/* Loading text */}
          <div className="text-center">
            <p className="dragon-loading-text">Red Dragon</p>
            <p className="dragon-loading-subtitle">Preparing your feast...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} info={info} />

      {currentPage === 'Home' && (
        <>
          <HeroSection info={info} />
          <FeaturedDishes dishes={dishes} categories={categories} setCurrentPage={setCurrentPage} />
          <TrustSection />
        </>
      )}

      {currentPage === 'Menu' && <MenuPage dishes={dishes} categories={categories} />}
      {currentPage === 'About' && <AboutPage info={info} />}
      {currentPage === 'Contact' && <ContactPage info={info} />}
      {currentPage === 'Order' && <OrderPage info={info} />}

      <Footer info={info} setCurrentPage={setCurrentPage} />

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${info?.whatsapp?.replace(/[^0-9]/g, '') || '919945871208'}?text=Hi! I would like to place an order from Red Dragon Restaurant.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all animate-pulse"
        aria-label="Chat on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
      </a>
    </main>
  );
}
