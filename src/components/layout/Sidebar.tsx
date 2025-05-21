
import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart2, Calendar, Clock, CreditCard, Home, PieChart, Settings, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
};

const NavItem = ({ to, icon, label }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
          isActive 
            ? "bg-efarina-100 text-efarina-800 font-medium" 
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

const Sidebar = () => {
  return (
    <aside className="w-64 border-r border-border h-[calc(100vh-4rem)] p-4 flex flex-col">
      <div className="space-y-1 mb-8">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground px-3 mb-2">Dashboard</h2>
        <NavItem to="/" icon={<Home className="h-5 w-5" />} label="Beranda" />
        <NavItem to="/transactions" icon={<CreditCard className="h-5 w-5" />} label="Transaksi" />
        <NavItem to="/reports" icon={<PieChart className="h-5 w-5" />} label="Laporan" />
        <NavItem to="/analytics" icon={<BarChart2 className="h-5 w-5" />} label="Analitik" />
      </div>
      
      <div className="space-y-1 mb-8">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground px-3 mb-2">Manajemen</h2>
        <NavItem to="/calendar" icon={<Calendar className="h-5 w-5" />} label="Jadwal" />
        <NavItem to="/users" icon={<Users className="h-5 w-5" />} label="Pengguna" />
        <NavItem to="/settings" icon={<Settings className="h-5 w-5" />} label="Pengaturan" />
      </div>
      
      <div className="mt-auto border-t border-border pt-4">
        <div className="flex items-center px-3">
          <Clock className="w-5 h-5 text-muted-foreground mr-2" />
          <span className="text-sm text-muted-foreground">Last sync: 5 minutes ago</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
