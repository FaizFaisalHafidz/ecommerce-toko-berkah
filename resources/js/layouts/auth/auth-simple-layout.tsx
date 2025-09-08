import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex">
            {/* Left Side - Image/Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 flex flex-col justify-center items-center text-center p-12 text-white">
                    <div className="mb-8">
                        <AppLogoIcon className="size-16 fill-current text-white mx-auto mb-6" />
                        <h2 className="text-4xl font-light tracking-wider mb-4">BERKAH</h2>
                        <p className="text-lg font-light tracking-wide text-stone-200">Koleksi Kulit Premium</p>
                    </div>
                    <div className="max-w-md">
                        <p className="text-base font-light text-stone-300 leading-relaxed">
                            Temukan keanggunan abadi dengan tas kulit buatan tangan kami, 
                            di mana tradisi bertemu dengan kemewahan kontemporer.
                        </p>
                    </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-10 right-10 w-32 h-32 border border-white/20 rotate-45"></div>
                <div className="absolute bottom-20 left-20 w-24 h-24 border border-white/10 rotate-12"></div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="mb-12 text-center lg:text-left">
                        {/* Mobile Logo */}
                        <div className="lg:hidden mb-8 text-center">
                            <Link href={home()} className="inline-flex flex-col items-center">
                                <AppLogoIcon className="size-12 fill-current text-stone-800 mb-3" />
                                <span className="text-2xl font-light tracking-wider text-stone-800">BERKAH</span>
                            </Link>
                        </div>
                        
                        <h1 className="text-3xl font-light text-stone-800 mb-3 tracking-wide">{title}</h1>
                        <p className="text-stone-600 font-light leading-relaxed">{description}</p>
                    </div>
                    
                    <div className="space-y-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
