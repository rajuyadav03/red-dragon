'use client';

import { CartProvider } from '@/context/cart-context';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }) {
    return (
        <CartProvider>
            {children}
            <Toaster position="top-center" richColors />
        </CartProvider>
    );
}
