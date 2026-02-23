import { useState } from 'react';
import {
  Crown,
  Heart,
  Eye,
  Star,
  Zap,
  Shield,
  Globe,
  MessageCircle,
  Check,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import type { PageType } from '@/types';
import { cn } from '@/utils/cn';

interface PremiumPageProps {
  onNavigate: (page: PageType) => void;
  isVip: boolean;
  onToggleVip: () => void;
}

const plans = [
  { id: 'month', label: '月度', price: 68, originalPrice: 98, period: '/月', popular: false, save: '' },
  { id: 'quarter', label: '季度', price: 168, originalPrice: 294, period: '/季', popular: true, save: '省43%' },
  { id: 'year', label: '年度', price: 488, originalPrice: 1176, period: '/年', popular: false, save: '省59%' },
];

const features = [
  { icon: Heart, title: '无限喜欢', desc: '不限制每日滑动次数', free: '10次/天', vip: '无限' },
  { icon: Eye, title: '查看谁喜欢你', desc: '直接查看并匹配', free: '🔒', vip: '✓' },
  { icon: Star, title: '超级喜欢', desc: '让对方优先看到你', free: '1次/天', vip: '5次/天' },
  { icon: Zap, title: '加速曝光', desc: '30分钟内提升10倍曝光', free: '🔒', vip: '1次/周' },
  { icon: Shield, title: '已读回执', desc: '查看消息是否被阅读', free: '🔒', vip: '✓' },
  { icon: Globe, title: '全球漫游', desc: '更改位置发现更多人', free: '🔒', vip: '✓' },
  { icon: MessageCircle, title: '优先消息', desc: '消息置顶显示', free: '🔒', vip: '✓' },
  { icon: Crown, title: 'VIP 标识', desc: '专属 VIP 标识展示', free: '🔒', vip: '✓' },
];

const diamondPackages = [
  { id: 'd1', amount: 60, price: 6, bonus: 0 },
  { id: 'd2', amount: 300, price: 28, bonus: 20 },
  { id: 'd3', amount: 680, price: 58, bonus: 80 },
  { id: 'd4', amount: 1280, price: 108, bonus: 200 },
  { id: 'd5', amount: 3280, price: 268, bonus: 600 },
  { id: 'd6', amount: 6580, price: 518, bonus: 1500 },
];

export function PremiumPage({ onNavigate, isVip, onToggleVip }: PremiumPageProps) {
  const [selectedPlan, setSelectedPlan] = useState('quarter');
  const [activeTab, setActiveTab] = useState<'vip' | 'diamonds'>('vip');

  return (
    <div className="flex h-full flex-col bg-gray-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 px-5 pb-6 pt-4">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 left-1/4 h-20 w-20 rounded-full bg-white/10" />
        <div className="absolute right-1/3 top-1/3 h-12 w-12 rounded-full bg-white/5" />

        <div className="relative flex items-center gap-3">
          <button onClick={() => onNavigate('discover')} className="rounded-full p-1">
            <ArrowLeft size={22} className="text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">会员中心</h1>
        </div>

        <div className="relative mt-4 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Crown size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {isVip ? 'VIP 会员' : 'SoulMate VIP'}
            </h2>
            <p className="mt-0.5 text-sm text-white/80">
              {isVip ? '享受全部特权中' : '解锁全部高级特权'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="relative mt-4 flex gap-2">
          <button
            onClick={() => setActiveTab('vip')}
            className={cn(
              'flex-1 rounded-full py-2 text-sm font-medium transition-all',
              activeTab === 'vip'
                ? 'bg-white text-amber-600 shadow-md'
                : 'bg-white/20 text-white'
            )}
          >
            VIP 会员
          </button>
          <button
            onClick={() => setActiveTab('diamonds')}
            className={cn(
              'flex-1 rounded-full py-2 text-sm font-medium transition-all',
              activeTab === 'diamonds'
                ? 'bg-white text-amber-600 shadow-md'
                : 'bg-white/20 text-white'
            )}
          >
            💎 钻石充值
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {activeTab === 'vip' ? (
          <>
            {/* Plans */}
            <div className="-mt-2 flex gap-3 px-5">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={cn(
                    'relative flex-1 rounded-2xl border-2 p-3 text-center transition-all',
                    selectedPlan === plan.id
                      ? 'border-amber-400 bg-amber-50 shadow-md shadow-amber-100'
                      : 'border-gray-200 bg-white'
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-2.5 py-0.5 text-[10px] font-bold text-white">
                      推荐
                    </div>
                  )}
                  {plan.save && (
                    <div className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                      {plan.save}
                    </div>
                  )}
                  <span className="text-xs font-medium text-gray-500">{plan.label}</span>
                  <div className="mt-1">
                    <span className="text-2xl font-bold text-gray-900">¥{plan.price}</span>
                  </div>
                  <div className="mt-0.5 text-[10px] text-gray-400 line-through">
                    ¥{plan.originalPrice}
                  </div>
                </button>
              ))}
            </div>

            {/* Subscribe Button */}
            <div className="mt-4 px-5">
              {isVip ? (
                <div className="rounded-2xl bg-gradient-to-r from-amber-100 to-orange-100 p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles size={18} className="text-amber-500" />
                    <span className="font-semibold text-amber-700">您已是 VIP 会员</span>
                  </div>
                  <p className="mt-1 text-xs text-amber-500">有效期至 2025-12-31</p>
                  <button
                    onClick={onToggleVip}
                    className="mt-2 text-xs text-amber-400 underline"
                  >
                    (演示: 取消VIP)
                  </button>
                </div>
              ) : (
                <button
                  onClick={onToggleVip}
                  className="w-full rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 py-4 text-center font-bold text-white shadow-lg shadow-amber-200 transition-all hover:shadow-xl active:scale-[0.98]"
                >
                  立即开通 VIP · ¥{plans.find((p) => p.id === selectedPlan)?.price}
                  {plans.find((p) => p.id === selectedPlan)?.period}
                </button>
              )}
            </div>

            {/* Features Comparison */}
            <div className="mt-6 px-5">
              <h3 className="mb-3 text-sm font-semibold text-gray-700">VIP 特权对比</h3>
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="grid grid-cols-3 border-b border-gray-100 bg-gray-50 px-4 py-3">
                  <span className="text-xs font-medium text-gray-500">功能</span>
                  <span className="text-center text-xs font-medium text-gray-400">免费版</span>
                  <span className="text-center text-xs font-medium text-amber-500">VIP</span>
                </div>
                {features.map((feature, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-3 items-center border-b border-gray-50 px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <feature.icon size={14} className="text-gray-400" />
                      <div>
                        <span className="text-xs font-medium text-gray-700">{feature.title}</span>
                        <p className="text-[10px] text-gray-400">{feature.desc}</p>
                      </div>
                    </div>
                    <span className="text-center text-xs text-gray-400">{feature.free}</span>
                    <span className="text-center text-xs font-medium text-amber-500">
                      {feature.vip === '✓' ? (
                        <Check size={16} className="mx-auto text-green-500" />
                      ) : (
                        feature.vip
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="mt-6 px-5">
              <h3 className="mb-3 text-sm font-semibold text-gray-700">会员评价</h3>
              <div className="space-y-3">
                {[
                  { name: '小A', text: '开通VIP后匹配率提升了很多！终于找到了喜欢的人 ❤️', rating: 5 },
                  { name: '小B', text: '超级喜欢功能太好用了，直接锁定心仪对象！', rating: 5 },
                  { name: '小C', text: '全球漫游功能让我认识了好多有趣的朋友', rating: 4 },
                ].map((review, i) => (
                  <div key={i} className="rounded-xl bg-white p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{review.name}</span>
                      <div className="flex">
                        {Array.from({ length: review.rating }).map((_, j) => (
                          <Star key={j} size={10} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Diamond Packages */
          <div className="px-5 pt-4">
            <div className="mb-4 flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💎</span>
                <div>
                  <span className="text-sm text-gray-500">当前余额</span>
                  <p className="text-xl font-bold text-gray-900">280</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">用于送礼物和加速曝光</span>
            </div>

            <h3 className="mb-3 text-sm font-semibold text-gray-700">选择充值包</h3>
            <div className="grid grid-cols-2 gap-3">
              {diamondPackages.map((pkg) => (
                <button
                  key={pkg.id}
                  className="relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-4 text-center shadow-sm transition-all hover:border-purple-300 hover:shadow-md active:scale-[0.98]"
                >
                  {pkg.bonus > 0 && (
                    <div className="absolute right-0 top-0 rounded-bl-lg bg-gradient-to-r from-purple-500 to-indigo-500 px-2 py-0.5 text-[9px] font-bold text-white">
                      +{pkg.bonus}
                    </div>
                  )}
                  <div className="text-2xl">💎</div>
                  <div className="mt-1 text-lg font-bold text-gray-800">
                    {pkg.amount}
                    {pkg.bonus > 0 && (
                      <span className="text-xs font-normal text-purple-400">+{pkg.bonus}</span>
                    )}
                  </div>
                  <div className="mt-1 text-lg font-bold text-purple-600">¥{pkg.price}</div>
                </button>
              ))}
            </div>

            <p className="mt-4 text-center text-[10px] text-gray-300">
              购买即表示同意《用户协议》和《隐私政策》
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
