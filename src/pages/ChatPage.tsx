import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Gift, Image, Smile, Phone, Video, MoreVertical, Shield } from 'lucide-react';
import type { Match, ChatMessage, PageType } from '@/types';
import { chatMessages as initialMessages, gifts } from '@/data/mockData';
import { AvatarPlaceholder } from '@/components/AvatarPlaceholder';
import { cn } from '@/utils/cn';

interface ChatListPageProps {
  matches: Match[];
  onNavigate: (page: PageType, data?: Record<string, unknown>) => void;
}

export function ChatListPage({ matches, onNavigate }: ChatListPageProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMatches = matches.filter((m) =>
    m.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <div className="bg-white px-5 pb-4 pt-4">
        <h1 className="text-2xl font-bold text-gray-900">消息</h1>
        <div className="mt-3">
          <input
            type="text"
            placeholder="搜索聊天..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl bg-gray-100 px-4 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-rose-200"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Online now */}
        <div className="border-b border-gray-100 bg-white px-5 py-3">
          <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400">在线好友</h3>
          <div className="flex gap-4 overflow-x-auto">
            {matches
              .filter((m) => m.user.online)
              .map((m) => (
                <button
                  key={m.id}
                  onClick={() => onNavigate('conversation', { userId: m.user.id })}
                  className="flex flex-col items-center gap-1"
                >
                  <AvatarPlaceholder
                    gradient={m.user.avatar}
                    name={m.user.name}
                    size="md"
                    online
                  />
                  <span className="w-14 truncate text-center text-[10px] text-gray-600">{m.user.name}</span>
                </button>
              ))}
          </div>
        </div>

        {/* Chat List */}
        <div className="divide-y divide-gray-50">
          {filteredMatches.map((match) => (
            <button
              key={match.id}
              onClick={() => onNavigate('conversation', { userId: match.user.id })}
              className="flex w-full items-center gap-3 bg-white px-5 py-3.5 transition-colors hover:bg-gray-50 active:bg-gray-100"
            >
              <AvatarPlaceholder
                gradient={match.user.avatar}
                name={match.user.name}
                size="md"
                online={match.user.online}
              />
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-gray-900">{match.user.name}</span>
                    {match.user.vip && <span className="text-xs">👑</span>}
                  </div>
                  <span className="text-[11px] text-gray-400">{match.matchedAt}</span>
                </div>
                <div className="mt-0.5 flex items-center justify-between">
                  <p className="max-w-[200px] truncate text-sm text-gray-500">
                    {match.lastMessage}
                  </p>
                  {match.unread > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                      {match.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ConversationPageProps {
  match: Match;
  onBack: () => void;
  isVip: boolean;
  onNavigate: (page: PageType) => void;
}

export function ConversationPage({ match, onBack, isVip, onNavigate }: ConversationPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [showGifts, setShowGifts] = useState(false);
  const [showMatchAnim, setShowMatchAnim] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      text: inputText,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: 'text',
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulate reply
    setTimeout(() => {
      const replies = [
        '哈哈是的呢 😄',
        '你说得对！',
        '太有意思了 ✨',
        '改天一起去吧！',
        '好的好的～',
        '那你喜欢什么类型的？',
      ];
      const reply: ChatMessage = {
        id: `msg-${Date.now()}-reply`,
        senderId: match.user.id,
        text: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        read: false,
        type: 'text',
      };
      setMessages((prev) => [...prev, reply]);
    }, 1500 + Math.random() * 2000);
  };

  const sendGift = (giftEmoji: string, giftName: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      text: `送了一个${giftName} ${giftEmoji}`,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: 'gift',
    };
    setMessages((prev) => [...prev, newMsg]);
    setShowGifts(false);
    setShowMatchAnim(true);
    setTimeout(() => setShowMatchAnim(false), 2000);
  };

  return (
    <div className="flex h-full flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3">
        <button onClick={onBack} className="rounded-full p-1 hover:bg-gray-100">
          <ArrowLeft size={22} className="text-gray-700" />
        </button>
        <AvatarPlaceholder
          gradient={match.user.avatar}
          name={match.user.name}
          size="sm"
          online={match.user.online}
        />
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-gray-900">{match.user.name}</span>
            {match.user.verified && (
              <Shield size={12} className="text-blue-500" />
            )}
          </div>
          <span className="text-xs text-gray-400">
            {match.user.online ? '在线' : match.user.lastActive}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-full p-2 hover:bg-gray-100">
            <Phone size={18} className="text-gray-500" />
          </button>
          <button className="rounded-full p-2 hover:bg-gray-100">
            <Video size={18} className="text-gray-500" />
          </button>
          <button className="rounded-full p-2 hover:bg-gray-100">
            <MoreVertical size={18} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Match Card */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-2 flex w-fit items-center gap-2 rounded-full bg-rose-50 px-4 py-2">
            <span className="text-lg">💝</span>
            <span className="text-sm font-medium text-rose-500">
              你和{match.user.name}匹配成功！
            </span>
          </div>
          <p className="text-xs text-gray-400">{match.matchedAt}</p>
        </div>

        {messages.map((msg) => {
          const isMe = msg.senderId === 'me';
          return (
            <div
              key={msg.id}
              className={cn('mb-3 flex', isMe ? 'justify-end' : 'justify-start')}
            >
              <div className={cn('max-w-[75%]')}>
                <div
                  className={cn(
                    'rounded-2xl px-4 py-2.5',
                    isMe
                      ? 'rounded-br-md bg-gradient-to-r from-rose-500 to-pink-500 text-white'
                      : 'rounded-bl-md bg-white text-gray-800 shadow-sm',
                    msg.type === 'gift' && 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800'
                  )}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                <div className={cn('mt-1 flex items-center gap-1', isMe ? 'justify-end' : 'justify-start')}>
                  <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                  {isMe && msg.read && (
                    <span className="text-[10px] text-blue-400">已读</span>
                  )}
                  {isMe && !msg.read && !isVip && (
                    <button onClick={() => onNavigate('premium')} className="text-[10px] text-gray-300 hover:text-rose-400">
                      🔒 已读回执
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Gift Animation */}
      {showMatchAnim && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
          <div className="animate-bounce text-8xl">🎁</div>
        </div>
      )}

      {/* Gift Panel */}
      {showGifts && (
        <div className="border-t border-gray-100 bg-white px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">虚拟礼物</span>
            <span className="text-xs text-gray-400">余额: 💎 280</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {gifts.map((gift) => (
              <button
                key={gift.id}
                onClick={() => sendGift(gift.emoji, gift.name)}
                className="flex flex-col items-center gap-1 rounded-xl bg-gray-50 p-2 transition-all hover:bg-rose-50 active:scale-95"
              >
                <span className="text-2xl">{gift.emoji}</span>
                <span className="text-[10px] text-gray-600">{gift.name}</span>
                <span className="text-[10px] font-medium text-rose-500">💎{gift.price}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-100 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGifts(!showGifts)}
            className={cn(
              'rounded-full p-2 transition-colors',
              showGifts ? 'bg-rose-100 text-rose-500' : 'text-gray-400 hover:bg-gray-100'
            )}
          >
            <Gift size={20} />
          </button>
          <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100">
            <Image size={20} />
          </button>
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="输入消息..."
              className="w-full rounded-full bg-gray-100 px-4 py-2.5 pr-10 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-rose-200"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Smile size={18} />
            </button>
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputText.trim()}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full transition-all',
              inputText.trim()
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200'
                : 'bg-gray-100 text-gray-300'
            )}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
