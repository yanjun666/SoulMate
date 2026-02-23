import { cn } from '@/utils/cn';

interface AvatarPlaceholderProps {
  gradient: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  online?: boolean;
  verified?: boolean;
  vip?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-10 h-10 text-sm',
  md: 'w-14 h-14 text-lg',
  lg: 'w-20 h-20 text-2xl',
  xl: 'w-28 h-28 text-4xl',
  full: 'w-full h-full text-6xl',
};

export function AvatarPlaceholder({
  gradient,
  name,
  size = 'md',
  online,
  verified,
  vip,
  className,
}: AvatarPlaceholderProps) {
  const initial = name.charAt(name.length > 1 ? 1 : 0);
  return (
    <div className={cn('relative inline-flex', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-gradient-to-br font-bold text-white shadow-lg',
          gradient,
          sizeClasses[size]
        )}
      >
        {initial}
      </div>
      {online && size !== 'full' && (
        <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-400" />
      )}
      {verified && size !== 'full' && (
        <div className="absolute -right-0.5 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[8px] text-white">
          ✓
        </div>
      )}
      {vip && size !== 'full' && (
        <div className="absolute -left-0.5 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[8px]">
          👑
        </div>
      )}
    </div>
  );
}
