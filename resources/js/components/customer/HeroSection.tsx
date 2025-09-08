import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
    title?: string;
    subtitle?: string;
    description?: string;
    backgroundImage?: string;
    ctaText?: string;
    ctaLink?: string;
}

export default function HeroSection({
    title = "Koleksi Tas Premium",
    subtitle = "TAS BERKAH",
    description = "Temukan tas berkualitas tinggi yang memadukan gaya dan fungsionalitas untuk gaya hidup modern Anda",
    backgroundImage = "/images/products/backpack-school-premium.jpg",
    ctaText = "Jelajahi Koleksi",
    ctaLink = "/products"
}: HeroSectionProps) {
    return (
        <section className="relative h-[70vh] lg:h-[80vh] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={backgroundImage}
                    alt="Hero Background"
                    className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 h-full flex items-center lg:px-6">
                <div className="max-w-2xl">
                    {/* Subtitle */}
                    <p className="text-sm font-medium text-white/90 tracking-wider uppercase mb-4">
                        {subtitle}
                    </p>

                    {/* Main Title */}
                    <h1 className="text-4xl font-light text-white mb-6 lg:text-6xl lg:leading-tight">
                        {title}
                    </h1>

                    {/* Description */}
                    <p className="text-lg text-white/90 mb-8 max-w-md leading-relaxed">
                        {description}
                    </p>

                    {/* CTA Button */}
                    <Link
                        href={ctaLink}
                        className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 text-sm font-medium uppercase tracking-wide hover:bg-gray-100 transition-colors group"
                    >
                        {ctaText}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce" />
                </div>
            </div>
        </section>
    );
}
