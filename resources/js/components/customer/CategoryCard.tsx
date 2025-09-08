import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
    category: {
        name: string;
        count: number;
        image: string;
    };
    href: string;
    className?: string;
}

export default function CategoryCard({ category, href, className = '' }: CategoryCardProps) {
    return (
        <Link href={href} className={`group block ${className}`}>
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80';
                    }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="text-white">
                        <h3 className="text-xl font-medium mb-1 group-hover:text-gray-200 transition-colors">
                            {category.name}
                        </h3>
                        <p className="text-sm text-white/80 mb-3">
                            {category.count} Products
                        </p>
                        <div className="flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span>Shop Now</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
