import { useState } from 'react';
import { Heart, Lock, Crown, Sparkles } from 'lucide-react';
import type { Match, PageType, UserProfile } from '@/types';
import { AvatarPlaceholder } from '@/components/AvatarPlaceholder';
import { cn } from '@/utils/cn';

interface MatchesPageProps {
  matches: Match[];
  onNavigate: (page: PageType, data?: Record<string, unknown>) => void;
  isVip: boolean;
}

const likedYouUsers: Partial<UserProfile>[] = [
  { id: 'ly1', name: '???', avatar: 'from-pink-300 to-rose-400', age: 24 },
  { id: 'ly2', name: '???', avatar: 'from-violet-300 to-purple-400', age: 26 },
  { id: 'ly3', name: '???', avatar: 'from-blue-300 to-indigo-400', age: 23 },
  { id: 'ly4', name: '???', avatar: 'from-emerald-300 to-teal-400', age: 25 },
  { id: 'ly5', name: '???', avatar: 'from-amber-300 to-orange-400', age: 22 },
];

export function MatchesPage({ matches, onNavigate, isVip }: MatchesPageProps) {
  const [activeTab, setActiveTab] = useState<'matches' | 'liked'>('matches');

  return (
    <div className="flex h-full flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white px-5 pb-0 pt-4">
        <h1 className="text-2xl font-bold text-gray-900">匹配</h1>
        <p className="mt-0.5 text-sm text-gray-500">发现你的缘分</p>
        <div className="mt-4 flex gap-1 border-b border-gray-100">
          <button
            onClick={() => setActiveTab('matches')}
            className={cn(
              'flex-1 pb-3 text-sm font-medium transition-all',
              activeTab === 'matches'
                ? 'border-b-2 border-rose-500 text-rose-500'
                : 'text-gray-400'
            )}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Heart size={14} />
              互相喜欢 ({matches.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('liked')}
            className={cn(
              'flex-1 pb-3 text-sm font-medium transition-all',
              activeTab === 'liked'
                ? 'border-b-2 border-rose-500 text-rose-500'
                : 'text-gray-400'
            )}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Sparkles size={14} />
              谁喜欢了我 ({likedYouUsers.length})
            </div>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {activeTab === 'matches' ? (
          <div className="p-4">
            {/* New Matches - Horizontal */}
            <h3 className="mb-3 text-sm font-semibold text-gray-700">新匹配</h3>
            <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
              {matches.slice(0, 4).map((match) => (
                <button
                  key={match.id}
                  onClick={() => onNavigate('conversation', { userId: match.user.id })}
                  className="flex flex-shrink-0 flex-col items-center gap-1.5"
                >
                  <div className="relative">
                    <div className="rounded-full bg-gradient-to-r from-rose-400 to-pink-500 p-0.5">
                      <AvatarPlaceholder
                        gradient={match.user.avatar}
                        name={match.user.name}
                        size="lg"
                        online={match.user.online}
                      />
                    </div>
                    {match.unread > 0 && (
                      <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                        {match.unread}
                      </div>
                    )}
                  </div>
                  <span className="w-16 truncate text-center text-xs font-medium text-gray-700">
                    {match.user.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Match List */}
            <h3 className="mb-3 text-sm font-semibold text-gray-700">所有匹配</h3>
            <div className="space-y-2">
              {matches.map((match) => (
                <button
                  key={match.id}
                  onClick={() => onNavigate('conversation', { userId: match.user.id })}
                  className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
                >
                  <AvatarPlaceholder
                    gradient={match.user.avatar}
                    name={match.user.name}
                    size="md"
                    online={match.user.online}
                    verified={match.user.verified}
                    vip={match.user.vip}
                  />
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">{match.user.name}</span>
                      <span className="text-xs text-gray-400">{match.matchedAt}</span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-gray-500">
                      {match.lastMessage || '你们匹配啦！快来打个招呼吧'}
                    </p>
                  </div>
                  {match.unread > 0 && (
                    <div className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
                      {match.unread}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4">
            {/* Liked You Section */}
            {!isVip && (
              <div className="mb-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-4">
                <div className="flex items-center gap-2">
                  <Crown size={18} className="text-amber-500" />
                  <span className="font-semibold text-amber-800">升级 VIP 查看谁喜欢了你</span>
                </div>
                <p className="mt-1 text-sm text-amber-600">解锁后可直接查看并匹配</p>
                <button
                  onClick={() => onNavigate('premium')}
                  className="mt-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-amber-200 transition-all hover:shadow-lg"
                >
                  立即升级
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {likedYouUsers.map((user) => (
                <div key={user.id} className="relative overflow-hidden rounded-2xl bg-white shadow-sm">
                  <div className={cn('flex h-48 items-center justify-center bg-gradient-to-br text-5xl font-bold text-white/30', user.avatar)}>
                    ?
                  </div>
                  {!isVip && (
                    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-lg">
                      <div className="flex flex-col items-center gap-2">
                        <Lock size={24} className="text-gray-400" />
                        <span className="text-xs font-medium text-gray-500">VIP 可见</span>
                      </div>
                    </div>
                  )}
                  <div className="p-2 text-center">
                    <p className="text-sm font-medium text-gray-800">
                      {isVip ? '???' : '***'}
                    </p>
                    <p className="text-xs text-gray-400">{user.age}岁</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
