import { useState } from 'react';
import {
  ArrowLeft,
  Smartphone,
  Globe,
  Server,
  Cloud,
  Shield,
  Zap,
  CheckCircle2,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Monitor,
  Package,
  Rocket,
  Lock,
  Database,
  Bell,
  Layers,
  Settings,
  Terminal,
  FileCode,
  HardDrive,
  Wifi,
  Download,
  Share2,
} from 'lucide-react';
import type { PageType } from '@/types';
import { cn } from '@/utils/cn';

interface DeployGuidePageProps {
  onNavigate: (page: PageType) => void;
}

interface AccordionItem {
  title: string;
  icon: React.ElementType;
  color: string;
  content: React.ReactNode;
}

function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative mt-2 mb-3 overflow-hidden rounded-xl bg-gray-900 text-sm">
      <div className="flex items-center justify-between bg-gray-800 px-3 py-1.5">
        <span className="text-[10px] font-medium text-gray-400">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <CheckCircle2 size={10} />
              <span>已复制</span>
            </>
          ) : (
            <>
              <Copy size={10} />
              <span>复制</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 text-[11px] leading-relaxed text-green-400">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function StepBadge({ number }: { number: number }) {
  return (
    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-[11px] font-bold text-white">
      {number}
    </div>
  );
}

export function DeployGuidePage({ onNavigate }: DeployGuidePageProps) {
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]));
  const [activeStrategy, setActiveStrategy] = useState(0);

  const toggleSection = (index: number) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const deployStrategies = [
    {
      title: 'PWA 网页应用',
      icon: Globe,
      desc: '零成本，最快上线',
      difficulty: '⭐',
      time: '30分钟',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: '混合 App (Capacitor)',
      icon: Smartphone,
      desc: '一套代码，双端发布',
      difficulty: '⭐⭐',
      time: '2-3小时',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'React Native 重构',
      icon: Layers,
      desc: '原生性能，最佳体验',
      difficulty: '⭐⭐⭐⭐',
      time: '2-4周',
      color: 'from-purple-500 to-violet-500',
    },
    {
      title: '微信小程序',
      icon: Package,
      desc: '国内社交流量入口',
      difficulty: '⭐⭐⭐',
      time: '1-2周',
      color: 'from-green-500 to-lime-500',
    },
  ];

  const sections: AccordionItem[] = [
    {
      title: '方案一：PWA 渐进式 Web 应用（推荐首选）',
      icon: Globe,
      color: 'text-blue-500',
      content: (
        <div className="space-y-4">
          <div className="rounded-xl bg-blue-50 p-3">
            <p className="text-xs font-medium text-blue-700">
              💡 PWA 是最快速的移动端部署方案。用户可以通过浏览器「添加到主屏幕」，
              获得类似原生 App 的体验，无需上架应用商店。
            </p>
          </div>

          {/* Step 1 */}
          <div className="flex gap-3">
            <StepBadge number={1} />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-800">创建 manifest.json</h4>
              <p className="mt-1 text-xs text-gray-500">PWA 配置清单，定义应用名称、图标、主题色等</p>
              <CodeBlock
                language="json"
                code={`{
  "name": "SoulMate · 遇见对的人",
  "short_name": "SoulMate",
  "description": "社交交友平台",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#ffffff",
  "theme_color": "#f43f5e",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}`}
              />
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-3">
            <StepBadge number={2} />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-800">注册 Service Worker</h4>
              <p className="mt-1 text-xs text-gray-500">实现离线缓存和后台同步</p>
              <CodeBlock
                language="javascript"
                code={`// sw.js - Service Worker
const CACHE = 'soulmate-v1';
const URLS = ['/', '/index.html'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(URLS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request)
      .then(r => r || fetch(e.request))
  );
});`}
              />
              <CodeBlock
                language="javascript"
                code={`// main.tsx 中注册
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(r => console.log('SW 注册成功', r))
    .catch(e => console.log('SW 注册失败', e));
}`}
              />
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-3">
            <StepBadge number={3} />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-800">部署到云平台</h4>
              <p className="mt-1 text-xs text-gray-500">推荐使用 Vercel / Netlify / Cloudflare Pages</p>
              <CodeBlock
                code={`# 方式一：Vercel（推荐）
npm i -g vercel
vercel

# 方式二：Netlify
npm i -g netlify-cli
netlify deploy --prod --dir=dist

# 方式三：Cloudflare Pages
npx wrangler pages deploy dist`}
              />
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-3">
            <StepBadge number={4} />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-800">用户安装到手机</h4>
              <div className="mt-2 space-y-2">
                <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-2.5">
                  <Download size={14} className="mt-0.5 text-blue-500" />
                  <div>
                    <p className="text-xs font-medium text-gray-700">iOS Safari</p>
                    <p className="text-[11px] text-gray-500">点击分享按钮 → 「添加到主屏幕」</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-2.5">
                  <Download size={14} className="mt-0.5 text-green-500" />
                  <div>
                    <p className="text-xs font-medium text-gray-700">Android Chrome</p>
                    <p className="text-[11px] text-gray-500">菜单 → 「安装应用」或「添加到主屏幕」</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-green-200 bg-green-50 p-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-green-500" />
              <span className="text-xs font-semibold text-green-700">PWA 优势</span>
            </div>
            <ul className="mt-2 space-y-1 text-[11px] text-green-600">
              <li>✅ 无需应用商店审核，即时上线</li>
              <li>✅ 自动更新，用户无感升级</li>
              <li>✅ 可离线使用，支持推送通知</li>
              <li>✅ 占用空间小，安装即用</li>
              <li>✅ 跨平台，iOS / Android / 桌面通用</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: '方案二：Capacitor 混合应用',
      icon: Smartphone,
      color: 'text-green-500',
      content: (
        <div className="space-y-4">
          <div className="rounded-xl bg-green-50 p-3">
            <p className="text-xs font-medium text-green-700">
              📱 Capacitor 可以将现有 React 项目直接打包为原生 iOS / Android 应用，
              上架 App Store 和 Google Play。
            </p>
          </div>

          <div className="flex gap-3">
            <StepBadge number={1} />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-800">安装 Capacitor</h4>
              <CodeBlock
                code={`npm install @capacitor/core @capacitor/cli
npx cap init SoulMate com.soulmate.app

# 安装原生平台
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android`}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <StepBadge number={2} />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-800">安装常用插件</h4>
              <p className="mt-1 text-xs text-gray-500">Capacitor 提供丰富的原生 API 插件</p>
              <CodeBlock
                code={`# 推送通知
npm install @capacitor/push-notifications

# 相机（头像上传）
npm install @capacitor/camera

# 地理位置（附近的人）
npm install @capacitor/geolocation

# 本地存储
npm install @capacitor/preferences

# 分享功能
npm install @capacitor/share

# 状态栏控制
npm install @capacitor/status-bar

# 应用内浏览器
npm install @capacitor/browser`}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <StepBadge number={3} />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-800">配置 capacitor.config.ts</h4>
              <CodeBlock
                language="typescript"
                code={`import { CapacitorConfig } from
  '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.soulmate.app',
  appName: 'SoulMate',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // 开发时连接本地服务器
    // url: 'http://192.168.1.x:5173'
  },
  plugins: {
    PushNotifications: {
      presentationOptions: [
        'badge', 'sound', 'alert'
      ]
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#f43f5e'
    }
  }
};

export default config;`}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <StepBadge number={4} />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-800">构建并同步</h4>
              <CodeBlock
                code={`# 构建 Web 项目
npm run build

# 同步到原生项目
npx cap sync

# 打开 Xcode (iOS)
npx cap open ios

# 打开 Android Studio
npx cap open android

# 实时开发调试
npx cap run ios --livereload
npx cap run android --livereload`}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <StepBadge number={5} />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-800">发布到应用商店</h4>
              <div className="mt-2 space-y-2">
                <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-2.5">
                  <span className="text-sm">🍎</span>
                  <div>
                    <p className="text-xs font-medium text-gray-700">App Store (iOS)</p>
                    <p className="text-[11px] text-gray-500">需要 Apple 开发者账号（$99/年），通过 Xcode 上传到 App Store Connect</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-2.5">
                  <span className="text-sm">🤖</span>
                  <div>
                    <p className="text-xs font-medium text-gray-700">Google Play (Android)</p>
                    <p className="text-[11px] text-gray-500">需要 Google 开发者账号（$25 一次性），通过 Play Console 上传 AAB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '方案三：服务端架构设计',
      icon: Server,
      color: 'text-purple-500',
      content: (
        <div className="space-y-4">
          <div className="rounded-xl bg-purple-50 p-3">
            <p className="text-xs font-medium text-purple-700">
              🏗️ 商业化社交应用需要完整的后端架构。以下是推荐的技术栈和架构设计。
            </p>
          </div>

          {/* Architecture Diagram */}
          <div className="rounded-xl bg-gray-900 p-4">
            <p className="mb-3 text-xs font-semibold text-gray-400">系统架构图</p>
            <div className="space-y-2 text-[10px] font-mono text-green-400">
              <p>┌─────────────────────────────┐</p>
              <p>│  📱 客户端 (PWA / App)        │</p>
              <p>└──────────┬──────────────────┘</p>
              <p>           │ HTTPS / WebSocket</p>
              <p>┌──────────▼──────────────────┐</p>
              <p>│  🌐 API Gateway (Nginx)       │</p>
              <p>│  CDN + SSL + 负载均衡          │</p>
              <p>└──────────┬──────────────────┘</p>
              <p>     ┌─────┴──────┐</p>
              <p>┌────▼────┐ ┌─────▼─────┐</p>
              <p>│REST API │ │WebSocket  │</p>
              <p>│ Node.js │ │ 实时通信   │</p>
              <p>└────┬────┘ └─────┬─────┘</p>
              <p>     └─────┬──────┘</p>
              <p>  ┌────────▼────────┐</p>
              <p>  │  微服务集群       │</p>
              <p>  │ ┌──────┐┌──────┐│</p>
              <p>  │ │用户  ││匹配  ││</p>
              <p>  │ └──────┘└──────┘│</p>
              <p>  │ ┌──────┐┌──────┐│</p>
              <p>  │ │聊天  ││支付  ││</p>
              <p>  │ └──────┘└──────┘│</p>
              <p>  └────────┬────────┘</p>
              <p>  ┌────────▼────────┐</p>
              <p>  │ PostgreSQL      │</p>
              <p>  │ Redis · S3 · MQ │</p>
              <p>  └─────────────────┘</p>
            </div>
          </div>

          <h4 className="text-sm font-semibold text-gray-800">推荐技术栈</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: '后端框架', value: 'Node.js + NestJS', icon: '⚡' },
              { label: '数据库', value: 'PostgreSQL + Redis', icon: '🗄️' },
              { label: '实时通信', value: 'Socket.IO / WebSocket', icon: '💬' },
              { label: '对象存储', value: 'AWS S3 / 阿里 OSS', icon: '📁' },
              { label: '消息队列', value: 'RabbitMQ / Redis', icon: '📮' },
              { label: '搜索引擎', value: 'Elasticsearch', icon: '🔍' },
              { label: '容器部署', value: 'Docker + K8s', icon: '🐳' },
              { label: '监控告警', value: 'Prometheus + Grafana', icon: '📊' },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-gray-50 p-2.5">
                <span className="text-sm">{item.icon}</span>
                <p className="text-[11px] font-medium text-gray-700">{item.label}</p>
                <p className="text-[10px] text-gray-500">{item.value}</p>
              </div>
            ))}
          </div>

          <h4 className="text-sm font-semibold text-gray-800">核心 API 设计</h4>
          <CodeBlock
            language="text"
            code={`# 用户模块
POST   /api/auth/register     # 注册
POST   /api/auth/login        # 登录
GET    /api/users/profile      # 获取资料
PUT    /api/users/profile      # 更新资料
POST   /api/users/photos       # 上传照片

# 发现 & 匹配
GET    /api/discover           # 发现用户
POST   /api/swipe              # 滑动操作
GET    /api/matches            # 匹配列表

# 聊天
GET    /api/conversations      # 会话列表
GET    /api/messages/:id       # 消息历史
WS     /ws/chat                # 实时聊天

# 支付 & 会员
POST   /api/payment/subscribe  # 订阅VIP
POST   /api/payment/diamonds   # 充值钻石
POST   /api/gifts/send         # 送礼物`}
          />
        </div>
      ),
    },
    {
      title: '方案四：云服务部署',
      icon: Cloud,
      color: 'text-sky-500',
      content: (
        <div className="space-y-4">
          <div className="rounded-xl bg-sky-50 p-3">
            <p className="text-xs font-medium text-sky-700">
              ☁️ 使用云服务可以快速搭建可扩展的后端基础设施，以下是各平台的部署方案。
            </p>
          </div>

          <h4 className="text-sm font-semibold text-gray-800">国内云（阿里云方案）</h4>
          <div className="space-y-2">
            {[
              { name: 'ECS 云服务器', desc: 'API 服务部署', price: '¥100+/月' },
              { name: 'RDS PostgreSQL', desc: '用户数据存储', price: '¥200+/月' },
              { name: 'Redis', desc: '缓存 & 会话管理', price: '¥100+/月' },
              { name: 'OSS 对象存储', desc: '图片/视频存储', price: '按量付费' },
              { name: 'CDN', desc: '前端静态资源加速', price: '¥50+/月' },
              { name: 'SLB 负载均衡', desc: '流量分发', price: '¥50+/月' },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-lg bg-gray-50 p-2.5">
                <div>
                  <p className="text-xs font-medium text-gray-700">{item.name}</p>
                  <p className="text-[10px] text-gray-500">{item.desc}</p>
                </div>
                <span className="text-xs font-medium text-sky-500">{item.price}</span>
              </div>
            ))}
          </div>

          <h4 className="mt-4 text-sm font-semibold text-gray-800">Docker 一键部署</h4>
          <CodeBlock
            language="dockerfile"
            code={`# Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`}
          />

          <CodeBlock
            language="yaml"
            code={`# docker-compose.yml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "80:80"
    depends_on:
      - api
  
  api:
    image: node:20-alpine
    working_dir: /app
    volumes:
      - ./server:/app
    command: npm start
    environment:
      - DATABASE_URL=postgresql://...
      - REDIS_URL=redis://redis:6379
    ports:
      - "3000:3000"
  
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: soulmate
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:`}
          />

          <h4 className="text-sm font-semibold text-gray-800">CI/CD 自动部署</h4>
          <CodeBlock
            language="yaml"
            code={`# .github/workflows/deploy.yml
name: Deploy SoulMate
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - name: Deploy to Server
        uses: appleboy/scp-action@v0.1.7
        with:
          host: \${{ secrets.HOST }}
          username: \${{ secrets.USER }}
          key: \${{ secrets.SSH_KEY }}
          source: "dist/*"
          target: "/var/www/soulmate"`}
          />
        </div>
      ),
    },
    {
      title: '方案五：安全与合规',
      icon: Shield,
      color: 'text-red-500',
      content: (
        <div className="space-y-4">
          <div className="rounded-xl bg-red-50 p-3">
            <p className="text-xs font-medium text-red-700">
              🔒 社交应用涉及大量用户隐私数据，安全合规是商业化的前提条件。
            </p>
          </div>

          <h4 className="text-sm font-semibold text-gray-800">必须要做的安全措施</h4>
          <div className="space-y-2">
            {[
              {
                icon: Lock,
                title: 'HTTPS 强制加密',
                desc: '所有通信必须使用 SSL/TLS，Let\'s Encrypt 免费证书',
              },
              {
                icon: Shield,
                title: '用户认证 (JWT)',
                desc: 'Access Token + Refresh Token 双令牌机制',
              },
              {
                icon: Database,
                title: '数据加密存储',
                desc: '密码 bcrypt 哈希，敏感信息 AES-256 加密',
              },
              {
                icon: Bell,
                title: '内容审核',
                desc: '接入 AI 图片审核 / 文字过滤 (阿里云内容安全)',
              },
              {
                icon: Settings,
                title: '实名认证',
                desc: '手机号验证 + 可选身份证实名 (中国法规要求)',
              },
              {
                icon: FileCode,
                title: '隐私政策',
                desc: '符合《个人信息保护法》和 GDPR 的隐私政策',
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                <item.icon size={16} className="mt-0.5 text-red-400" />
                <div>
                  <p className="text-xs font-medium text-gray-700">{item.title}</p>
                  <p className="text-[10px] text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h4 className="text-sm font-semibold text-gray-800">中国法规合规清单</h4>
          <div className="space-y-1.5">
            {[
              '☐ ICP 备案（域名备案）',
              '☐ 网络安全等级保护（等保二级/三级）',
              '☐ App 隐私政策 & 用户协议',
              '☐ 未成年人保护机制',
              '☐ 实名认证系统',
              '☐ 内容审核机制（文字 + 图片）',
              '☐ 数据出境安全评估（如适用）',
              '☐ 增值电信业务经营许可证（ICP证）',
              '☐ 网络文化经营许可证（如有虚拟礼物）',
            ].map((item, i) => (
              <div key={i} className="rounded-lg bg-orange-50 px-3 py-2">
                <p className="text-[11px] text-orange-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: '方案六：性能优化与监控',
      icon: Zap,
      color: 'text-amber-500',
      content: (
        <div className="space-y-4">
          <div className="rounded-xl bg-amber-50 p-3">
            <p className="text-xs font-medium text-amber-700">
              ⚡ 社交应用对性能要求极高，需要全链路优化确保流畅体验。
            </p>
          </div>

          <h4 className="text-sm font-semibold text-gray-800">前端性能优化</h4>
          <div className="space-y-2">
            {[
              { title: '图片懒加载 + WebP', desc: '减少首屏加载时间 60%' },
              { title: '路由懒加载', desc: 'React.lazy + Suspense 按需加载页面' },
              { title: '虚拟列表', desc: 'react-window 处理大量用户列表' },
              { title: '缓存策略', desc: 'Service Worker + IndexedDB 离线缓存' },
              { title: '骨架屏', desc: '提升用户感知加载速度' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg bg-gray-50 p-2.5">
                <CheckCircle2 size={14} className="mt-0.5 text-amber-500" />
                <div>
                  <p className="text-xs font-medium text-gray-700">{item.title}</p>
                  <p className="text-[10px] text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h4 className="text-sm font-semibold text-gray-800">后端性能优化</h4>
          <CodeBlock
            language="text"
            code={`# 数据库优化
- 用户推荐：基于地理位置的空间索引 (PostGIS)
- 匹配算法：Redis SortedSet 高效排序
- 消息存储：分表 + 时序数据库
- 连接池：PgBouncer 连接池管理

# 缓存策略
- 热门用户资料：Redis 缓存 (TTL 5min)
- 匹配结果：本地缓存 + CDN
- 会话管理：Redis Cluster

# 实时通信
- WebSocket 长连接
- 消息队列异步处理
- 在线状态 Redis Pub/Sub`}
          />

          <h4 className="text-sm font-semibold text-gray-800">监控体系</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: 'Sentry', desc: '错误监控', icon: '🐛' },
              { name: 'Prometheus', desc: '指标收集', icon: '📊' },
              { name: 'Grafana', desc: '可视化面板', icon: '📈' },
              { name: 'ELK Stack', desc: '日志分析', icon: '📋' },
            ].map((item) => (
              <div key={item.name} className="rounded-lg bg-gray-50 p-2.5 text-center">
                <span className="text-lg">{item.icon}</span>
                <p className="text-[11px] font-medium text-gray-700">{item.name}</p>
                <p className="text-[10px] text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-full flex-col bg-gray-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-5 pb-6 pt-4">
        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 left-10 h-24 w-24 rounded-full bg-white/5" />
        <div className="absolute right-1/4 top-1/2 h-16 w-16 rounded-full bg-white/5" />

        <div className="relative flex items-center gap-3">
          <button onClick={() => onNavigate('profile')} className="rounded-full p-1">
            <ArrowLeft size={22} className="text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">移动端部署指南</h1>
        </div>

        <div className="relative mt-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Rocket size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">全栈部署方案</h2>
              <p className="mt-0.5 text-xs text-white/70">从开发到上线的完整指南</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="relative mt-4 flex gap-2">
          {[
            { icon: FileCode, label: '6 种方案' },
            { icon: Terminal, label: '完整代码' },
            { icon: HardDrive, label: '架构设计' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/15 py-2 backdrop-blur-sm"
            >
              <item.icon size={12} className="text-white/80" />
              <span className="text-[10px] font-medium text-white/80">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Strategy Cards */}
        <div className="px-5 pt-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">选择部署策略</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {deployStrategies.map((strategy, i) => (
              <button
                key={i}
                onClick={() => setActiveStrategy(i)}
                className={cn(
                  'relative overflow-hidden rounded-2xl border-2 p-3 text-left transition-all active:scale-[0.98]',
                  activeStrategy === i
                    ? 'border-purple-400 bg-purple-50 shadow-md shadow-purple-100'
                    : 'border-gray-100 bg-white'
                )}
              >
                <div
                  className={cn(
                    'mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r text-white',
                    strategy.color
                  )}
                >
                  <strategy.icon size={16} />
                </div>
                <p className="text-xs font-semibold text-gray-800">{strategy.title}</p>
                <p className="mt-0.5 text-[10px] text-gray-500">{strategy.desc}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[9px] text-gray-400">难度{strategy.difficulty}</span>
                  <span className="text-[9px] text-gray-400">· {strategy.time}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* PWA Install Prompt */}
        <div className="mx-5 mt-4 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <Share2 size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white">立即体验 PWA 安装</h3>
              <p className="text-[10px] text-white/70">当前应用已支持 PWA，可直接安装到主屏幕</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <div className="flex-1 rounded-lg bg-white/15 p-2 text-center">
              <Wifi size={14} className="mx-auto text-white/80" />
              <p className="mt-1 text-[10px] text-white/80">离线可用</p>
            </div>
            <div className="flex-1 rounded-lg bg-white/15 p-2 text-center">
              <Monitor size={14} className="mx-auto text-white/80" />
              <p className="mt-1 text-[10px] text-white/80">全屏体验</p>
            </div>
            <div className="flex-1 rounded-lg bg-white/15 p-2 text-center">
              <Zap size={14} className="mx-auto text-white/80" />
              <p className="mt-1 text-[10px] text-white/80">秒速启动</p>
            </div>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="mt-4 px-5 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">详细部署方案</h3>
          {sections.map((section, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl bg-white shadow-sm transition-all"
            >
              <button
                onClick={() => toggleSection(index)}
                className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-gray-50"
              >
                <section.icon size={20} className={section.color} />
                <span className="flex-1 text-sm font-semibold text-gray-800">
                  {section.title}
                </span>
                {openSections.has(index) ? (
                  <ChevronUp size={16} className="text-gray-400" />
                ) : (
                  <ChevronDown size={16} className="text-gray-400" />
                )}
              </button>
              {openSections.has(index) && (
                <div className="border-t border-gray-100 px-4 pb-4 pt-3 animate-fade-in">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Cost Estimation */}
        <div className="mx-5 mt-4 rounded-2xl bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800">💰 成本预估（月度）</h3>
          <div className="mt-3 space-y-2">
            {[
              { phase: '🚀 MVP 阶段', users: '< 1万用户', cost: '¥500-1,500/月', items: 'ECS + RDS + OSS' },
              { phase: '📈 成长阶段', users: '1-10万用户', cost: '¥3,000-8,000/月', items: '+ Redis + CDN + SLB' },
              { phase: '🏢 规模化', users: '10-100万用户', cost: '¥2-5万/月', items: '+ K8s + ES + 多可用区' },
            ].map((item) => (
              <div key={item.phase} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <div>
                  <p className="text-xs font-medium text-gray-700">{item.phase}</p>
                  <p className="text-[10px] text-gray-400">{item.users} · {item.items}</p>
                </div>
                <span className="text-xs font-bold text-indigo-500">{item.cost}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mx-5 mt-4 mb-6 rounded-2xl bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800">📅 推荐开发路线图</h3>
          <div className="mt-3 space-y-3">
            {[
              { week: '第 1-2 周', task: 'PWA 部署 + 后端 API 搭建', status: '🟢' },
              { week: '第 3-4 周', task: '用户认证 + 匹配算法', status: '🟡' },
              { week: '第 5-6 周', task: '实时聊天 + 推送通知', status: '🟡' },
              { week: '第 7-8 周', task: '支付集成 + VIP 系统', status: '🔴' },
              { week: '第 9-10 周', task: 'Capacitor 打包 + 应用商店上架', status: '🔴' },
              { week: '第 11-12 周', task: '安全审计 + 合规认证 + 上线', status: '🔴' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <span className="text-sm">{item.status}</span>
                  {i < 5 && <div className="mt-1 h-4 w-px bg-gray-200" />}
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-semibold text-gray-700">{item.week}</p>
                  <p className="text-[10px] text-gray-500">{item.task}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* External Links */}
        <div className="mx-5 mb-8 rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 p-4">
          <h3 className="text-sm font-semibold text-white">📚 参考文档</h3>
          <div className="mt-3 space-y-2">
            {[
              { name: 'Capacitor 官方文档', url: 'capacitorjs.com' },
              { name: 'Vite PWA 插件', url: 'vite-pwa-org.netlify.app' },
              { name: 'Vercel 部署指南', url: 'vercel.com/docs' },
              { name: 'Docker 文档', url: 'docs.docker.com' },
              { name: 'NestJS 后端框架', url: 'nestjs.com' },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-lg bg-white/10 p-2.5"
              >
                <span className="text-xs text-white/80">{item.name}</span>
                <div className="flex items-center gap-1 text-[10px] text-white/50">
                  <span>{item.url}</span>
                  <ExternalLink size={10} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
