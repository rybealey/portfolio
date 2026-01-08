'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FolderOpen, Heart, LayoutDashboard, LogOut } from 'lucide-react';
import LogoutButton from './LogoutButton';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/admin/case-studies',
      label: 'Case Studies',
      icon: FolderOpen,
    },
    {
      href: '/admin/passions',
      label: 'Passions',
      icon: Heart,
    },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card h-screen sticky top-0 flex flex-col">
      <div className="p-6 flex-1">
        <h2 className="text-lg font-bold mb-6">Admin</h2>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-6 border-t border-border">
        <LogoutButton />
      </div>
    </aside>
  );
}

