import { Heart, MessageCircle, X } from 'lucide-react';
import type { UserProfile } from '@/types';
import { cn } from '@/utils/cn';

interface MatchModalProps {
  user: UserProfile;
  onChat: () => void;
  onClose: () => void;
}

export function MatchModal({ user, onChat, onClose }: MatchModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative mx-6 w-full max-w-sm animate-bounce-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
        >
          <X size={16} className="text-white" />
        </button>

        <div className="overflow-hidden rounded-3xl bg-gradient-to-b from-rose-500 via-pink-500 to-purple-600 p-6 text-center shadow-2xl">
          {/* Hearts animation */}
          <div className="mb-4 flex items-center justify-center gap-4">
            <span className="text-4xl animate-pulse">💕</span>
          </div>

          <h2 className="text-3xl font-bold text-white">匹配成功！</h2>
          <p className="mt-2 text-sm text-white/80">你和{user.name}互相喜欢</p>

          {/* Avatars */}
          <div className="relative mt-6 flex items-center justify-center">
            <div className={cn('flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br text-4xl font-bold text-white ring-4 ring-white/30', 'from-indigo-400 to-blue-600')}>
              明
            </div>
            <div className="-ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg">
              <Heart size={16} className="fill-rose-500 text-rose-500" />
            </div>
            <div className={cn('-ml-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br text-4xl font-bold text-white ring-4 ring-white/30', user.avatar)}>
              {user.name.charAt(user.name.length > 1 ? 1 : 0)}
            </div>
          </div>

          <p className="mt-4 text-sm text-white/70">快去打个招呼吧，缘分不等人 ✨</p>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={onChat}
              className="flex items-center justify-center gap-2 rounded-full bg-white py-3 font-semibold text-rose-500 shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
            >
              <MessageCircle size={18} />
              发消息
            </button>
            <button
              onClick={onClose}
              className="rounded-full border-2 border-white/30 py-3 font-medium text-white transition-all hover:bg-white/10"
            >
              继续发现
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
