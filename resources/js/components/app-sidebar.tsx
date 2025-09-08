import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BarChart3, BookOpen, Folder, LayoutGrid, MessageSquare, Package, ShoppingCart, Tags, Users } from 'lucide-react';
import AppLogo from './app-logo';

const navItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Kategori',
        href: '/admin/kategori',
        icon: Tags,
    },
    {
        title: 'Produk',
        href: '/admin/produk',
        icon: Package,
    },
    {
        title: 'Pelanggan',
        href: '/admin/pelanggan',
        icon: Users,
    },
    {
        title: 'Pesanan',
        href: '/admin/pesanan',
        icon: ShoppingCart,
    },
    {
        title: 'Laporan',
        href: '/admin/laporan',
        icon: BarChart3,
    },
    {
        title: 'Feedback',
        href: '/admin/feedback',
        icon: MessageSquare,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
