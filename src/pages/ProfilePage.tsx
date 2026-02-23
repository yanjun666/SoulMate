import { useState } from 'react';
import {
  Settings,
  Edit3,
  MapPin,
  Briefcase,
  Shield,
  Camera,
  ChevronRight,
  Bell,
  Lock,
  HelpCircle,
  LogOut,
  Moon,
  Globe,
  Heart,
  Eye,
  Star,
  Rocket,
} from 'lucide-react';
import type { PageType } from '@/types';
import { currentUser } from '@/data/mockData';
import { cn } from '@/utils/cn';

interface ProfilePageProps {
  onNavigate: (page: PageType) => void;
  isVip: boolean;
  onToggleVip: () => void;
}

export function ProfilePage({ onNavigate, isVip, onToggleVip }: ProfilePageProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState(currentUser.bio);

  const stats = [
    { label: '获赞', value: '1,234', icon: Heart },
    { label: '来访', value: '567', icon: Eye },
    { label: '匹配', value: '89', icon: Star },
  ];

  const menuItems = [
    { icon: Bell, label: '通知设置', desc: '消息提醒偏好' },
    { icon: Lock, label: '隐私设置', desc: '谁可以看到我' },
    { icon: Globe, label: '语言', desc: '简体中文' },
    { icon: Moon, label: '深色模式', desc: '跟随系统' },
    { icon: HelpCircle, label: '帮助与反馈', desc: '常见问题' },
  ];

  if (showSettings) {
    return (
      <div className="flex h-full flex-col bg-gray-50">
        <div className="flex items-center gap-3 bg-white px-5 py-4">
          <button onClick={() => setShowSettings(false)} className="text-gray-600">
            ← 返回
          </button>
          <h1 className="flex-1 text-lg font-bold">设置</h1>
        </div>
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="mt-2 bg-white">
            {menuItems.map((item, i) => (
              <button
                key={i}
                className="flex w-full items-center gap-3 border-b border-gray-50 px-5 py-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100">
                  <item.icon size={18} className="text-gray-600" />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-sm font-medium text-gray-800">{item.label}</span>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </button>
            ))}
          </div>

          <div className="mt-4 bg-white">
            <button
              onClick={onToggleVip}
              className="flex w-full items-center gap-3 border-b border-gray-50 px-5 py-4"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
                <Star size={18} className="text-amber-500" />
              </div>
              <div className="flex-1 text-left">
                <span className="text-sm font-medium text-gray-800">
                  {isVip ? '已是 VIP 会员' : '升级 VIP'}
                </span>
                <p className="text-xs text-gray-400">
                  {isVip ? '有效期至 2025-12-31' : '享受更多特权'}
                </p>
              </div>
              <div
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-semibold',
                  isVip
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
                )}
              >
                {isVip ? 'VIP' : '开通'}
              </div>
            </button>
          </div>

          <div className="mt-6 px-5">
            <button className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm text-red-400 transition-colors hover:bg-red-50">
              <LogOut size={16} />
              退出登录
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-gray-300">SoulMate v2.0.1</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-gray-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 px-5 pb-8 pt-4">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-5 -left-5 h-24 w-24 rounded-full bg-white/10" />

        <div className="relative flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">我的</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className="rounded-full bg-white/20 p-2 backdrop-blur-sm"
            >
              <Edit3 size={16} className="text-white" />
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="rounded-full bg-white/20 p-2 backdrop-blur-sm"
            >
              <Settings size={16} className="text-white" />
            </button>
          </div>
        </div>

        <div className="relative mt-4 flex items-center gap-4">
          <div className="relative">
            <div
              className={cn(
                'flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br text-3xl font-bold text-white ring-3 ring-white/30',
                currentUser.avatar
              )}
            >
              {currentUser.name.charAt(1)}
            </div>
            <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md">
              <Camera size={12} className="text-rose-500" />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
              {currentUser.verified && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/30">
                  <Shield size={10} className="text-white" />
                </div>
              )}
              {isVip && (
                <span className="rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-2 py-0.5 text-[10px] font-bold text-white">
                  VIP
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-1 text-sm text-white/80">
              <MapPin size={12} />
              <span>{currentUser.location}</span>
              <span>·</span>
              <Briefcase size={12} />
              <span>{currentUser.occupation}</span>
            </div>
            <p className="mt-1 text-xs text-white/70">ID: SM{currentUser.id}88888</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Stats */}
        <div className="-mt-4 mx-5 flex gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-1 flex-col items-center gap-1 rounded-2xl bg-white py-4 shadow-sm"
            >
              <stat.icon size={18} className="text-rose-400" />
              <span className="text-lg font-bold text-gray-800">{stat.value}</span>
              <span className="text-[10px] text-gray-400">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Bio */}
        <div className="mt-4 mx-5 rounded-2xl bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-sm font-semibold text-gray-700">个人简介</h3>
          {editMode ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-xl bg-gray-50 p-3 text-sm outline-none focus:ring-2 focus:ring-rose-200"
              rows={3}
            />
          ) : (
            <p className="text-sm text-gray-600 leading-relaxed">{bio}</p>
          )}
        </div>

        {/* Interests */}
        <div className="mt-4 mx-5 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">兴趣标签</h3>
            {editMode && (
              <button className="text-xs text-rose-500">+ 添加</button>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {currentUser.interests.map((interest) => (
              <span
                key={interest}
                className="rounded-full bg-gradient-to-r from-rose-50 to-pink-50 px-3 py-1.5 text-xs font-medium text-rose-500"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Photos */}
        <div className="mt-4 mx-5 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">我的相册</h3>
            <button className="text-xs text-rose-500">管理</button>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[currentUser.avatar, 'from-sky-400 to-blue-500', 'from-violet-400 to-purple-500'].map(
              (gradient, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex h-24 items-center justify-center rounded-xl bg-gradient-to-br text-2xl font-bold text-white/30',
                    gradient
                  )}
                >
                  📷
                </div>
              )
            )}
            <button className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-gray-300 hover:border-rose-300 hover:text-rose-300 transition-colors">
              <Camera size={24} />
            </button>
          </div>
        </div>

        {/* VIP Banner */}
        {!isVip && (
          <div className="mt-4 mx-5">
            <button
              onClick={() => onNavigate('premium')}
              className="w-full overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 p-4 text-left shadow-lg shadow-amber-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">👑</span>
                <div>
                  <h3 className="font-bold text-white">升级 VIP 会员</h3>
                  <p className="mt-0.5 text-xs text-white/80">
                    无限滑动 · 查看谁喜欢你 · 超级喜欢
                  </p>
                </div>
                <ChevronRight size={20} className="ml-auto text-white/60" />
              </div>
            </button>
          </div>
        )}

        {/* PWA Guide - Beginner Friendly */}
        <div className="mt-4 mx-5">
          <button
            onClick={() => onNavigate('pwa-guide')}
            className="w-full overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 p-4 text-left shadow-lg shadow-rose-200"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-xl">
                📱
              </div>
              <div>
                <h3 className="font-bold text-white">PWA 小白部署教程 ⭐</h3>
                <p className="mt-0.5 text-xs text-white/80">
                  零基础 · 分步图解 · 30分钟上线
                </p>
              </div>
              <ChevronRight size={20} className="ml-auto text-white/60" />
            </div>
          </button>
        </div>

        {/* Deploy Guide */}
        <div className="mt-3 mx-5">
          <button
            onClick={() => onNavigate('deploy-guide')}
            className="w-full overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 text-left shadow-lg shadow-purple-200"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Rocket size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">📖 完整部署方案</h3>
                <p className="mt-0.5 text-xs text-white/80">
                  PWA · Capacitor · 云服务 · 架构设计
                </p>
              </div>
              <ChevronRight size={20} className="ml-auto text-white/60" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
