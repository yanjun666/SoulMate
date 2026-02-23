import { useState, useRef, useCallback } from 'react';
import { MapPin, X, Heart, Star, RotateCcw, Sparkles, Shield, ChevronDown } from 'lucide-react';
import type { UserProfile, PageType } from '@/types';
import { discoverUsers } from '@/data/mockData';
import { cn } from '@/utils/cn';

interface DiscoverPageProps {
  onNavigate: (page: PageType, data?: Record<string, unknown>) => void;
  onMatch: (user: UserProfile) => void;
  isVip: boolean;
}

export function DiscoverPage({ onNavigate, onMatch, isVip }: DiscoverPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | 'up' | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [dailyLikes, setDailyLikes] = useState(isVip ? 999 : 10);
  const [superLikes, setSuperLikes] = useState(isVip ? 5 : 1);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const currentUser = discoverUsers[currentIndex % discoverUsers.length];

  const handleAction = useCallback(
    (action: 'like' | 'dislike' | 'superlike') => {
      if (action === 'like') {
        if (dailyLikes <= 0 && !isVip) {
          onNavigate('premium');
          return;
        }
        setDailyLikes((p) => p - 1);
        setDirection('right');
        if (Math.random() > 0.5) {
          setTimeout(() => onMatch(currentUser), 300);
        }
      } else if (action === 'dislike') {
        setDirection('left');
      } else if (action === 'superlike') {
        if (superLikes <= 0 && !isVip) {
          onNavigate('premium');
          return;
        }
        setSuperLikes((p) => p - 1);
        setDirection('up');
        setTimeout(() => onMatch(currentUser), 300);
      }

      setTimeout(() => {
        setDirection(null);
        setCurrentIndex((i) => i + 1);
        setPhotoIndex(0);
        setShowDetails(false);
      }, 400);
    },
    [currentIndex, dailyLikes, superLikes, isVip, onMatch, onNavigate, currentUser]
  );

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const pos = 'touches' in e ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };
    startPos.current = pos;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const pos = 'touches' in e ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };
    setDragOffset({
      x: pos.x - startPos.current.x,
      y: pos.y - startPos.current.y,
    });
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset.x > 100) {
      handleAction('like');
    } else if (dragOffset.x < -100) {
      handleAction('dislike');
    } else if (dragOffset.y < -100) {
      handleAction('superlike');
    }
    setDragOffset({ x: 0, y: 0 });
  };

  const cardStyle = direction
    ? {
        transform:
          direction === 'left'
            ? 'translateX(-150%) rotate(-30deg)'
            : direction === 'right'
            ? 'translateX(150%) rotate(30deg)'
            : 'translateY(-150%) scale(0.8)',
        opacity: 0,
        transition: 'all 0.4s ease-out',
      }
    : isDragging
    ? {
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.05}deg)`,
        transition: 'none',
      }
    : {
        transform: 'translate(0, 0) rotate(0)',
        transition: 'all 0.3s ease-out',
      };

  const likeOpacity = Math.min(Math.max(dragOffset.x / 100, 0), 1);
  const nopeOpacity = Math.min(Math.max(-dragOffset.x / 100, 0), 1);

  return (
    <div className="flex h-full flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-2 pt-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500">
            <Sparkles size={18} className="text-white" />
          </div>
          <h1 className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-xl font-bold text-transparent">
            SoulMate
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-500">
            <Heart size={12} fill="currentColor" />
            <span>{dailyLikes}</span>
          </div>
          <button
            onClick={() => onNavigate('premium')}
            className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-600"
          >
            <Star size={12} fill="currentColor" />
            <span>{superLikes}</span>
          </button>
        </div>
      </div>

      {/* Card Area */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-4">
        {/* Background card */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-md" style={{ height: 'calc(100% - 80px)', transform: 'translateY(-50%) scale(0.95)', opacity: 0.5 }} />

        {/* Main Card */}
        <div
          ref={cardRef}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onMouseLeave={() => { if (isDragging) handleTouchEnd(); }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full max-w-sm cursor-grab select-none active:cursor-grabbing"
          style={{ ...cardStyle, height: 'calc(100vh - 260px)', maxHeight: '560px' } as React.CSSProperties}
        >
          <div className="relative h-full overflow-hidden rounded-3xl bg-white shadow-xl">
            {/* Photo */}
            <div className={cn('absolute inset-0 bg-gradient-to-br', currentUser.photos[photoIndex % currentUser.photos.length])}>
              <div className="flex h-full items-center justify-center text-[120px] font-bold text-white/20">
                {currentUser.name.charAt(currentUser.name.length > 1 ? 1 : 0)}
              </div>
            </div>

            {/* Photo indicators */}
            <div className="absolute left-3 right-3 top-3 flex gap-1">
              {currentUser.photos.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-all',
                    i === photoIndex % currentUser.photos.length
                      ? 'bg-white'
                      : 'bg-white/40'
                  )}
                />
              ))}
            </div>

            {/* Photo tap zones */}
            <div className="absolute inset-0 flex">
              <button
                className="h-full w-1/2"
                onClick={(e) => { e.stopPropagation(); setPhotoIndex((p) => Math.max(0, p - 1)); }}
              />
              <button
                className="h-full w-1/2"
                onClick={(e) => { e.stopPropagation(); setPhotoIndex((p) => Math.min(currentUser.photos.length - 1, p + 1)); }}
              />
            </div>

            {/* Like/Nope Overlays */}
            <div
              className="absolute left-6 top-20 rounded-lg border-4 border-green-400 px-4 py-2 text-3xl font-extrabold text-green-400"
              style={{ opacity: likeOpacity, transform: `rotate(-20deg)` }}
            >
              LIKE
            </div>
            <div
              className="absolute right-6 top-20 rounded-lg border-4 border-red-400 px-4 py-2 text-3xl font-extrabold text-red-400"
              style={{ opacity: nopeOpacity, transform: `rotate(20deg)` }}
            >
              NOPE
            </div>

            {/* Online indicator */}
            {currentUser.online && (
              <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/30 px-2.5 py-1 backdrop-blur-sm">
                <div className="h-2 w-2 rounded-full bg-green-400 shadow-sm shadow-green-400" />
                <span className="text-xs font-medium text-white">在线</span>
              </div>
            )}

            {/* Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-20">
              <div className="flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-white">{currentUser.name}</h2>
                    <span className="text-xl text-white/80">{currentUser.age}</span>
                    {currentUser.verified && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                        <Shield size={10} className="text-white" />
                      </div>
                    )}
                    {currentUser.vip && (
                      <div className="rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-2 py-0.5 text-[10px] font-bold text-white">
                        VIP
                      </div>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-sm text-white/70">
                    <MapPin size={12} />
                    <span>{currentUser.location} · {currentUser.distance}km</span>
                  </div>
                  <p className="mt-1.5 text-sm text-white/80">{currentUser.occupation}</p>
                  <p className="mt-1 text-sm text-white/90">{currentUser.bio}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {currentUser.interests.slice(0, 4).map((interest) => (
                      <span
                        key={interest}
                        className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs text-white backdrop-blur-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
                >
                  <ChevronDown size={16} className={cn('text-white transition-transform', showDetails && 'rotate-180')} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 px-8 pb-20 pt-2">
        <button
          onClick={() => {
            setCurrentIndex((i) => Math.max(0, i - 1));
            setPhotoIndex(0);
          }}
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-amber-300 bg-white text-amber-400 shadow-lg shadow-amber-100 transition-all hover:scale-110 active:scale-95"
        >
          <RotateCcw size={20} />
        </button>
        <button
          onClick={() => handleAction('dislike')}
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-red-300 bg-white text-red-400 shadow-lg shadow-red-100 transition-all hover:scale-110 active:scale-95"
        >
          <X size={26} strokeWidth={3} />
        </button>
        <button
          onClick={() => handleAction('superlike')}
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-300 bg-white text-blue-400 shadow-lg shadow-blue-100 transition-all hover:scale-110 active:scale-95"
        >
          <Star size={20} fill="currentColor" />
        </button>
        <button
          onClick={() => handleAction('like')}
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-green-300 bg-white text-green-400 shadow-lg shadow-green-100 transition-all hover:scale-110 active:scale-95"
        >
          <Heart size={26} fill="currentColor" />
        </button>
        <button
          onClick={() => onNavigate('premium')}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-200 transition-all hover:scale-110 active:scale-95"
        >
          <Sparkles size={20} />
        </button>
      </div>
    </div>
  );
}
