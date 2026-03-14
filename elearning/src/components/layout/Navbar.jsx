import { useState } from 'react';
import { Bell, Search, Sun, Moon } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useStore from '@/store/useStore';

export default function Navbar() {
  const { user, theme, toggleTheme } = useStore();
  const [searchValue, setSearchValue] = useState('');

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/80 backdrop-blur-md px-4 lg:px-6">
      {/* Sidebar Toggle */}
      <SidebarTrigger className="text-muted-foreground hover:text-foreground -ml-1" />

      {/* Greeting (hidden on mobile) */}
      <div className="hidden md:flex flex-col">
        <span className="text-sm font-semibold text-foreground leading-tight">
          {greeting()}, {user.name.split(' ')[0]}! 👋
        </span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-sm ml-auto md:ml-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-8 h-8 text-sm bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary rounded-lg"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="h-8 w-8 rounded-md inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 rounded-md relative inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors outline-none">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel className="font-semibold">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {[
              { title: 'New lesson available', desc: 'React Hooks Deep Dive is now live', time: '2m ago' },
              { title: 'Quiz reminder', desc: 'You have an unfinished quiz', time: '1h ago' },
              { title: 'Achievement unlocked!', desc: '7-day streak — keep it up! 🔥', time: '3h ago' },
            ].map((n, i) => (
              <DropdownMenuItem key={i} className="flex flex-col items-start gap-0.5 py-2.5 cursor-pointer">
                <span className="font-medium text-sm">{n.title}</span>
                <span className="text-xs text-muted-foreground">{n.desc}</span>
                <span className="text-[10px] text-muted-foreground/70 mt-0.5">{n.time}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 gap-2 px-2 rounded-lg inline-flex items-center text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors outline-none" aria-label="User menu">
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                {user.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:block text-sm font-medium text-foreground">{user.name.split(' ')[0]}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold">{user.name}</span>
                <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
