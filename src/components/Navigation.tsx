import { Compass, Heart, MessageCircle, User, Crown } from 'lucide-react';
import type { PageType } from '@/types';
import { cn } from '@/utils/cn';

interface NavigationProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  unreadCount: number;
}

const navItems: { page: PageType; icon: typeof Compass; label: string }[] = [
  { page: 'discover', icon: Compass, label: '发现' },
  { page: 'matches', icon: Heart, label: '匹配' },
  { page: 'chat', icon: MessageCircle, label: '消息' },
  { page: 'premium', icon: Crown, label: '会员' },
  { page: 'profile', icon: User, label: '我的' },
];

export function Navigation({ currentPage, onNavigate, unreadCount }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1">
        {navItems.map(({ page, icon: Icon, label }) => {
          const isActive = currentPage === page;
          return (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={cn(
                'relative flex flex-col items-center gap-0.5 rounded-xl px-4 py-2 transition-all duration-200',
                isActive
                  ? 'text-rose-500'
                  : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <div className="relative">
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={cn(isActive && 'drop-shadow-sm')}
                />
                {page === 'chat' && unreadCount > 0 && (
                  <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>
              <span className={cn('text-[10px]', isActive ? 'font-semibold' : 'font-medium')}>
                {label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 h-0.5 w-6 rounded-full bg-rose-500" />
              )}
            </button>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
