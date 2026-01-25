import './globals.css';
import { CartProvider } from '@/context/cart-context';
import { Toaster } from '@/components/ui/sonner';

export const metadata = {
  title: 'Red Dragon Chinese Restaurant | Best Chinese Food in Mira Road',
  description: 'Red Dragon Chinese Restaurant - Authentic Chinese cuisine, delicious momos, fried rice, noodles and starters in Mira Road East, Mumbai. Order online via Zomato, Swiggy or WhatsApp!',
  keywords: 'Chinese restaurant Mira Road, best momos Mira Road, Chinese food near me, Red Dragon restaurant, fried rice, noodles, Chinese starters, Mira Road East, Mumbai Chinese food, momos delivery, Chinese takeaway',
  authors: [{ name: 'Red Dragon Restaurant' }],
  creator: 'Red Dragon Chinese Restaurant',
  publisher: 'Red Dragon Chinese Restaurant',
  robots: 'index, follow',
  openGraph: {
    title: 'Red Dragon Chinese Restaurant | Best Chinese Food in Mira Road',
    description: 'Experience authentic Chinese flavors at Red Dragon. Best momos, fried rice, and noodles in Mira Road. Order now!',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Red Dragon Chinese Restaurant',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=1200',
        width: 1200,
        height: 630,
        alt: 'Red Dragon Chinese Restaurant - Delicious Chinese Food',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Red Dragon Chinese Restaurant | Mira Road',
    description: 'Authentic Chinese cuisine - Momos, Fried Rice, Noodles & more. Order online now!',
    images: ['https://images.unsplash.com/photo-1585032226651-759b368d7246?w=1200'],
  },
  alternates: {
    canonical: 'https://reddragon-restaurant.com',
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

// JSON-LD Structured Data for Local Business
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Red Dragon Chinese Restaurant',
  image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=1200',
  '@id': 'https://reddragon-restaurant.com',
  url: 'https://reddragon-restaurant.com',
  telephone: '+91-99458-71208',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Mira Road East',
    addressLocality: 'Mira Bhayandar',
    addressRegion: 'Maharashtra',
    postalCode: '401107',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 19.2905648,
    longitude: 72.8644067,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '07:00',
    closes: '01:00',
  },
  servesCuisine: ['Chinese', 'Indo-Chinese', 'Asian'],
  priceRange: '₹₹',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.5',
    reviewCount: '500',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐉</text></svg>" />
        <meta name="theme-color" content="#C41E3A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <CartProvider>
          {children}
          <Toaster position="top-center" richColors />
        </CartProvider>
      </body>
    </html>
  );
}

