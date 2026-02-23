import { useState, useCallback } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Globe,
  Download,
  Wifi,
  WifiOff,
  Monitor,
  Zap,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  FolderOpen,
  FileCode,
  Terminal,
  Upload,
  Share2,
  MoreVertical,
  Plus,
  Rocket,
  BookOpen,
  Search,
  Layers,
  CheckCheck,
  Lightbulb,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import type { PageType } from '@/types';
import { cn } from '@/utils/cn';

interface PWAGuidePageProps {
  onNavigate: (page: PageType) => void;
}

/* ——— 小组件 ——— */

function CodeBlock({ code, language = 'bash', title }: { code: string; language?: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="mt-2 mb-3 overflow-hidden rounded-xl bg-gray-900 text-sm shadow-lg">
      <div className="flex items-center justify-between bg-gray-800/80 px-3 py-1.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <span className="text-[10px] font-medium text-gray-400">{title || language}</span>
        </div>
        <button onClick={handleCopy} className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px] text-gray-400 transition-colors hover:bg-white/10 hover:text-white">
          {copied ? <><CheckCircle2 size={10} /><span className="text-green-400">已复制!</span></> : <><Copy size={10} /><span>复制</span></>}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 text-[11px] leading-relaxed text-green-400"><code>{code}</code></pre>
    </div>
  );
}

function StepNumber({ n, done }: { n: number; done: boolean }) {
  return done ? (
    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-white shadow-md shadow-green-200">
      <CheckCircle2 size={16} />
    </div>
  ) : (
    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-sm font-bold text-white shadow-md shadow-rose-200">
      {n}
    </div>
  );
}

function Tip({ children, type = 'info' }: { children: React.ReactNode; type?: 'info' | 'warning' | 'success' }) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-700',
    warning: 'bg-amber-50 border-amber-200 text-amber-700',
    success: 'bg-green-50 border-green-200 text-green-700',
  };
  const icons = { info: Lightbulb, warning: AlertTriangle, success: CheckCircle2 };
  const Icon = icons[type];
  return (
    <div className={cn('mt-3 flex items-start gap-2 rounded-xl border p-3', styles[type])}>
      <Icon size={14} className="mt-0.5 flex-shrink-0" />
      <div className="text-xs leading-relaxed">{children}</div>
    </div>
  );
}

function VisualDiagram({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="mt-3 mb-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <p className="mb-2 text-xs font-semibold text-gray-500">{title}</p>
      {children}
    </div>
  );
}

/* ——— 主组件 ——— */

export function PWAGuidePage({ onNavigate }: PWAGuidePageProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [openStep, setOpenStep] = useState<number>(0);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleStep = useCallback((index: number) => {
    setOpenStep((prev) => (prev === index ? -1 : index));
  }, []);

  const markDone = useCallback((index: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index); else next.add(index);
      return next;
    });
  }, []);

  const progress = Math.round((completedSteps.size / 7) * 100);

  /* ==================== 7 大步骤 ==================== */
  const steps = [
    /* ——— 步骤 0：理解 PWA ——— */
    {
      title: '了解什么是 PWA',
      subtitle: '先搞懂概念，后面操作就不慌了',
      icon: BookOpen,
      color: 'from-violet-500 to-purple-600',
      content: (
        <div className="space-y-4">
          <div className="rounded-xl bg-violet-50 p-4">
            <h4 className="text-sm font-bold text-violet-800">🤔 PWA 是什么？用大白话解释</h4>
            <p className="mt-2 text-xs leading-relaxed text-violet-700">
              <b>PWA = Progressive Web App（渐进式 Web 应用）</b>
              <br /><br />
              简单来说：<b>它是一个网页，但用起来像手机 App</b>。
              <br /><br />
              你用手机浏览器打开一个网址，然后点「添加到主屏幕」，
              它就会出现在你手机桌面上，有自己的图标，打开时<b>没有浏览器的地址栏</b>，
              看起来和原生 App 一模一样！
            </p>
          </div>

          <VisualDiagram title="📊 PWA vs 原生 App vs 普通网页">
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
                <div className="rounded bg-gray-200 p-1.5 font-semibold text-gray-600">特性</div>
                <div className="rounded bg-gray-200 p-1.5 font-semibold text-gray-600">普通网页</div>
                <div className="rounded bg-violet-200 p-1.5 font-semibold text-violet-700">PWA ✨</div>
                <div className="rounded bg-gray-200 p-1.5 font-semibold text-gray-600">原生App</div>
              </div>
              {[
                ['桌面图标', '❌', '✅', '✅'],
                ['离线使用', '❌', '✅', '✅'],
                ['全屏体验', '❌', '✅', '✅'],
                ['推送通知', '❌', '✅', '✅'],
                ['应用商店', '不需要', '不需要', '需要'],
                ['审核上架', '不需要', '不需要', '需要'],
                ['开发成本', '低', '低 👍', '高'],
                ['更新方式', '自动', '自动 👍', '手动'],
                ['安装大小', '0MB', '<1MB 👍', '50-200MB'],
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-4 gap-1 text-center text-[10px]">
                  <div className="rounded bg-gray-50 p-1.5 font-medium text-gray-600">{row[0]}</div>
                  <div className="rounded bg-gray-50 p-1.5 text-gray-500">{row[1]}</div>
                  <div className="rounded bg-violet-50 p-1.5 font-medium text-violet-600">{row[2]}</div>
                  <div className="rounded bg-gray-50 p-1.5 text-gray-500">{row[3]}</div>
                </div>
              ))}
            </div>
          </VisualDiagram>

          <div className="rounded-xl bg-gray-900 p-4">
            <p className="mb-2 text-xs font-semibold text-gray-400">🧩 PWA 由三个东西组成</p>
            <div className="space-y-2">
              {[
                { emoji: '📄', name: 'manifest.json', desc: '告诉浏览器：这是个 App，名字叫什么、图标是什么、打开方式是什么' },
                { emoji: '⚙️', name: 'Service Worker', desc: '一个后台小程序，让 App 能离线使用、能缓存文件、能接收推送' },
                { emoji: '🔒', name: 'HTTPS', desc: '网站必须用 https:// 开头（安全连接），localhost 开发时除外' },
              ].map((item) => (
                <div key={item.name} className="flex items-start gap-2 rounded-lg bg-white/10 p-2.5">
                  <span className="text-lg">{item.emoji}</span>
                  <div>
                    <p className="text-xs font-bold text-white">{item.name}</p>
                    <p className="text-[10px] leading-relaxed text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Tip type="success">
            <b>好消息！</b>当前这个 SoulMate 项目已经帮你准备好了 manifest.json 和 Service Worker，
            你只需要跟着后面的步骤部署上线就行！
          </Tip>
        </div>
      ),
    },

    /* ——— 步骤 1：准备开发环境 ——— */
    {
      title: '准备开发环境',
      subtitle: '安装必要的工具软件',
      icon: Terminal,
      color: 'from-blue-500 to-cyan-600',
      content: (
        <div className="space-y-4">
          <div className="rounded-xl bg-blue-50 p-4">
            <h4 className="text-sm font-bold text-blue-800">🛠️ 你需要安装什么？</h4>
            <p className="mt-1 text-xs text-blue-600">只需要 2 个软件，5 分钟搞定</p>
          </div>

          {/* Node.js */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-lg">⬢</div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">第 1 步：安装 Node.js</h4>
                <p className="text-[10px] text-gray-500">JavaScript 运行环境，必装</p>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-2.5">
                <span className="text-sm">1️⃣</span>
                <div>
                  <p className="text-xs text-gray-700">打开浏览器，访问 Node.js 官网</p>
                  <div className="mt-1 flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-[11px] text-blue-600">
                    <Globe size={10} />
                    <span className="font-mono">https://nodejs.org/zh-cn</span>
                    <ExternalLink size={8} />
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-2.5">
                <span className="text-sm">2️⃣</span>
                <p className="text-xs text-gray-700">
                  点击绿色的 <b>「LTS（长期支持版）」</b> 按钮下载
                  <br />
                  <span className="text-[10px] text-gray-400">（不要选「最新版」，LTS 更稳定）</span>
                </p>
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-2.5">
                <span className="text-sm">3️⃣</span>
                <p className="text-xs text-gray-700">双击下载的安装包，<b>一路点「下一步」</b>就行，不需要改任何设置</p>
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-2.5">
                <span className="text-sm">4️⃣</span>
                <div>
                  <p className="text-xs text-gray-700">打开终端验证安装成功：</p>
                  <CodeBlock title="终端（命令行）" code={`node --version\n# 显示类似 v20.11.0 就说明成功了 ✅\n\nnpm --version\n# 显示类似 10.2.4 就说明成功了 ✅`} />
                </div>
              </div>
            </div>
            <Tip type="info">
              <b>什么是终端？</b>
              <br />• Windows：按 <code className="rounded bg-white px-1 py-0.5 text-[10px] font-bold">Win+R</code>，输入 <code className="rounded bg-white px-1 py-0.5 text-[10px]">cmd</code> 回车
              <br />• Mac：按 <code className="rounded bg-white px-1 py-0.5 text-[10px] font-bold">Cmd+空格</code>，搜索「终端」
            </Tip>
          </div>

          {/* VS Code */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-lg">📝</div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">第 2 步：安装 VS Code（可选）</h4>
                <p className="text-[10px] text-gray-500">代码编辑器，强烈推荐</p>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-2.5">
                <span className="text-sm">1️⃣</span>
                <div>
                  <p className="text-xs text-gray-700">访问 VS Code 官网下载</p>
                  <div className="mt-1 flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-[11px] text-blue-600">
                    <Globe size={10} />
                    <span className="font-mono">https://code.visualstudio.com</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-2.5">
                <span className="text-sm">2️⃣</span>
                <p className="text-xs text-gray-700">下载后双击安装，一路下一步</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    /* ——— 步骤 2：获取项目代码 ——— */
    {
      title: '获取项目代码',
      subtitle: '下载并运行 SoulMate 项目',
      icon: FolderOpen,
      color: 'from-emerald-500 to-green-600',
      content: (
        <div className="space-y-4">
          <div className="rounded-xl bg-emerald-50 p-4">
            <h4 className="text-sm font-bold text-emerald-800">📂 获取代码的两种方式</h4>
            <p className="mt-1 text-xs text-emerald-600">任选一种即可</p>
          </div>

          {/* 方式一 */}
          <div className="rounded-xl border-2 border-emerald-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold text-white">推荐</span>
              <h4 className="text-sm font-bold text-gray-800">方式一：用 Git 克隆</h4>
            </div>
            <CodeBlock title="在终端执行" code={`# 1. 安装 Git（如果没装过）\n# 去 https://git-scm.com 下载安装\n\n# 2. 克隆项目到本地\ngit clone https://github.com/你的用户名/soulmate.git\n\n# 3. 进入项目文件夹\ncd soulmate\n\n# 4. 安装依赖（第一次需要等 1-2 分钟）\nnpm install\n\n# 5. 启动开发服务器\nnpm run dev`} />
            <Tip type="info">
              如果你还没有 GitHub 仓库，先把代码文件夹上传到 GitHub，后面部署要用。
            </Tip>
          </div>

          {/* 方式二 */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h4 className="text-sm font-bold text-gray-800">方式二：直接下载 ZIP</h4>
            <div className="mt-2 space-y-2 text-xs text-gray-600">
              <p>1. 在 GitHub 仓库页面，点绿色的 <b>「Code」</b> 按钮</p>
              <p>2. 点 <b>「Download ZIP」</b></p>
              <p>3. 解压到任意文件夹</p>
              <p>4. 在该文件夹打开终端，运行 <code className="rounded bg-gray-100 px-1">npm install</code></p>
            </div>
          </div>

          {/* 验证 */}
          <div className="rounded-xl bg-gray-900 p-4">
            <p className="text-xs font-semibold text-gray-400">✅ 验证项目运行成功</p>
            <CodeBlock title="终端" code={`npm run dev\n\n# 终端会显示类似：\n#   VITE v5.x.x  ready in 300ms\n#   ➜  Local:   http://localhost:5173/\n#   ➜  Network: http://192.168.1.x:5173/`} />
            <p className="mt-2 text-xs text-gray-400">
              打开浏览器访问 <b className="text-green-400">http://localhost:5173</b>，
              如果看到 SoulMate 应用界面，就说明成功了！🎉
            </p>
          </div>

          <VisualDiagram title="📁 项目文件结构（你需要关注的）">
            <div className="space-y-1 font-mono text-[10px] text-gray-600">
              <p>📦 soulmate/</p>
              <p>├── 📂 <b className="text-blue-600">public/</b></p>
              <p>│   ├── 📄 <b className="text-rose-500">manifest.json</b> ← PWA 配置 ⭐</p>
              <p>│   └── 📄 <b className="text-rose-500">sw.js</b> ← Service Worker ⭐</p>
              <p>├── 📂 <b className="text-blue-600">src/</b></p>
              <p>│   ├── 📂 pages/ ← 所有页面</p>
              <p>│   ├── 📂 components/ ← 组件</p>
              <p>│   ├── 📄 App.tsx ← 主入口</p>
              <p>│   └── 📄 main.tsx ← 启动文件</p>
              <p>├── 📄 <b className="text-amber-600">index.html</b> ← HTML 入口 ⭐</p>
              <p>├── 📄 package.json ← 依赖配置</p>
              <p>└── 📄 vite.config.ts ← 构建配置</p>
            </div>
          </VisualDiagram>
        </div>
      ),
    },

    /* ——— 步骤 3：理解 PWA 关键文件 ——— */
    {
      title: '理解 PWA 的关键文件',
      subtitle: '逐行解释每个配置是干什么的',
      icon: FileCode,
      color: 'from-amber-500 to-orange-600',
      content: (
        <div className="space-y-4">
          <div className="rounded-xl bg-amber-50 p-4">
            <h4 className="text-sm font-bold text-amber-800">📝 两个最重要的文件</h4>
            <p className="mt-1 text-xs text-amber-600">搞懂它们，PWA 你就学会了 80%</p>
          </div>

          {/* manifest.json */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">📄</div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">manifest.json</h4>
                <p className="text-[10px] text-gray-500">相当于 App 的「身份证」</p>
              </div>
            </div>
            <CodeBlock language="json（逐行注释版）" code={`{
  "name": "SoulMate · 遇见对的人",
  // ↑ App 的完整名字（安装时显示）

  "short_name": "SoulMate",
  // ↑ App 的短名字（桌面图标下方显示）

  "description": "社交交友平台",
  // ↑ App 的描述

  "start_url": "/",
  // ↑ 打开 App 时加载哪个页面

  "display": "standalone",
  // ↑ 显示模式：
  //   standalone = 独立窗口（像原生 App）
  //   fullscreen = 全屏（像游戏）
  //   browser = 普通浏览器

  "orientation": "portrait",
  // ↑ 锁定竖屏

  "background_color": "#ffffff",
  // ↑ App 启动时的背景色

  "theme_color": "#f43f5e",
  // ↑ 状态栏颜色（Android 顶部）

  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512"
    }
  ]
  // ↑ App 的图标（至少需要两个尺寸）
}`} />
            <Tip type="info">
              <b>图标怎么做？</b>最简单的方法：
              <br />1. 找一张方形 Logo 图（至少 512x512 像素）
              <br />2. 去 <code className="rounded bg-white px-1 text-[10px]">realfavicongenerator.net</code> 上传，它会自动生成所有尺寸
              <br />3. 下载后放到项目的 <code className="rounded bg-white px-1 text-[10px]">public/icons/</code> 文件夹
            </Tip>
          </div>

          {/* Service Worker */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">⚙️</div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">sw.js（Service Worker）</h4>
                <p className="text-[10px] text-gray-500">相当于 App 的「后台管家」</p>
              </div>
            </div>
            <CodeBlock language="javascript（简化注释版）" code={`// sw.js 的核心逻辑，只有三个事件：

// 1️⃣ 安装时 → 缓存关键文件
self.addEventListener('install', (event) => {
  // 把首页等关键文件存到手机里
  // 这样没网也能打开 App
});

// 2️⃣ 激活时 → 清理旧缓存
self.addEventListener('activate', (event) => {
  // 更新版本时，删除旧的缓存文件
});

// 3️⃣ 拦截网络请求 → 先联网，没网就用缓存
self.addEventListener('fetch', (event) => {
  // 有网：正常请求，同时更新缓存
  // 没网：从缓存中取出之前存的文件
});`} />
            <Tip type="success">
              <b>不需要你写这些代码！</b>项目里已经写好了 <code className="rounded bg-white px-1 text-[10px]">public/sw.js</code>，
              你只需要确保这个文件存在就行。
            </Tip>
          </div>

          {/* index.html 中的关键行 */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">🔗</div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">index.html 需要加的代码</h4>
                <p className="text-[10px] text-gray-500">把 manifest 和 SW 连接起来</p>
              </div>
            </div>
            <CodeBlock language="html（已帮你加好了）" code={`<!-- 在 <head> 中加一行，引入 manifest -->
<link rel="manifest" href="/manifest.json" />

<!-- 在 <body> 底部加注册 Service Worker -->
<script>
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log('✅ SW 注册成功'))
    .catch(() => console.log('❌ SW 注册失败'));
}
</script>`} />
          </div>
        </div>
      ),
    },

    /* ——— 步骤 4：构建项目 ——— */
    {
      title: '构建生产版本',
      subtitle: '把代码打包成可部署的文件',
      icon: Layers,
      color: 'from-pink-500 to-rose-600',
      content: (
        <div className="space-y-4">
          <div className="rounded-xl bg-pink-50 p-4">
            <h4 className="text-sm font-bold text-pink-800">📦 什么是「构建」？</h4>
            <p className="mt-1 text-xs text-pink-600">
              开发时的代码（.tsx 文件）浏览器不认识，需要「翻译」成浏览器能懂的 HTML/CSS/JS 文件。
              这个翻译过程就叫<b>构建（Build）</b>。
            </p>
          </div>

          <CodeBlock title="在项目文件夹中执行" code={`# 构建项目（大概 10-30 秒）
npm run build

# 构建完成后，会生成一个 dist/ 文件夹
# 里面就是可以部署的文件！

# （可选）本地预览构建结果
npm run preview
# 访问 http://localhost:4173 查看`} />

          <VisualDiagram title="📁 构建后的 dist/ 文件夹">
            <div className="space-y-1 font-mono text-[10px] text-gray-600">
              <p>📦 dist/</p>
              <p>├── 📄 index.html ← 入口文件</p>
              <p>├── 📄 manifest.json ← PWA 配置（自动复制）</p>
              <p>├── 📄 sw.js ← Service Worker（自动复制）</p>
              <p>└── 📂 assets/</p>
              <p>    ├── 📄 index-xxx.js ← 打包后的 JS</p>
              <p>    └── 📄 index-xxx.css ← 打包后的 CSS</p>
            </div>
          </VisualDiagram>

          <Tip type="warning">
            <b>常见问题：</b>如果 <code className="rounded bg-white px-1 text-[10px]">npm run build</code> 报错，
            通常是代码有语法错误。仔细看终端里的红色错误信息，
            它会告诉你哪个文件的哪一行出了问题。
          </Tip>
        </div>
      ),
    },

    /* ——— 步骤 5：部署上线 ——— */
    {
      title: '部署到互联网（最关键！）',
      subtitle: '让全世界都能访问你的 App',
      icon: Upload,
      color: 'from-indigo-500 to-blue-600',
      content: (
        <div className="space-y-4">
          <div className="rounded-xl bg-indigo-50 p-4">
            <h4 className="text-sm font-bold text-indigo-800">🌐 三种免费部署方式（推荐排名）</h4>
            <p className="mt-1 text-xs text-indigo-600">全部免费！选一个就行</p>
          </div>

          {/* Vercel */}
          <div className="rounded-xl border-2 border-indigo-300 bg-white p-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-indigo-500 px-2.5 py-0.5 text-[10px] font-bold text-white">🥇 首选</span>
              <h4 className="text-sm font-bold text-gray-800">方式一：Vercel（最简单）</h4>
            </div>
            <p className="mt-2 text-xs text-gray-500 mb-3">适合小白，全程鼠标点击，不用敲命令</p>
            <div className="space-y-3">
              <div className="flex items-start gap-2 rounded-lg bg-indigo-50 p-3">
                <span className="text-sm font-bold text-indigo-500">1</span>
                <div>
                  <p className="text-xs font-medium text-gray-700">注册 Vercel 账号</p>
                  <p className="text-[10px] text-gray-500">打开 <b>vercel.com</b>，用 GitHub 账号登录（一键注册）</p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-indigo-50 p-3">
                <span className="text-sm font-bold text-indigo-500">2</span>
                <div>
                  <p className="text-xs font-medium text-gray-700">导入项目</p>
                  <p className="text-[10px] text-gray-500">点 <b>「New Project」</b> → 选择你的 GitHub 仓库 → 点 <b>「Import」</b></p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-indigo-50 p-3">
                <span className="text-sm font-bold text-indigo-500">3</span>
                <div>
                  <p className="text-xs font-medium text-gray-700">自动部署</p>
                  <p className="text-[10px] text-gray-500">
                    Vercel 会自动识别 Vite 项目并构建部署
                    <br />等 1-2 分钟，就会给你一个网址（如 <code className="rounded bg-white px-1">soulmate.vercel.app</code>）
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-green-50 p-3">
                <span className="text-sm">🎉</span>
                <div>
                  <p className="text-xs font-medium text-green-700">部署完成！</p>
                  <p className="text-[10px] text-green-600">
                    以后每次 git push，Vercel 会<b>自动重新部署</b>，无需手动操作！
                  </p>
                </div>
              </div>
            </div>
            <Tip type="info">
              <b>绑定自定义域名：</b>在 Vercel 项目设置中的 <b>Domains</b> 页面，
              输入你的域名（如 soulmate.com），按提示配置 DNS 解析即可。
            </Tip>
          </div>

          {/* Netlify */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h4 className="text-sm font-bold text-gray-800">🥈 方式二：Netlify（也很简单）</h4>
            <p className="mt-2 text-xs text-gray-500 mb-3">与 Vercel 类似，也支持拖拽部署</p>
            <div className="space-y-2 text-xs text-gray-600">
              <p>1. 打开 <b>app.netlify.com</b>，用 GitHub 登录</p>
              <p>2. 点 <b>「Add new site」 → 「Import an existing project」</b></p>
              <p>3. 选择 GitHub 仓库，点 Deploy</p>
              <p>4. 等待构建完成，获得网址</p>
            </div>
            <div className="mt-3 rounded-lg bg-gray-50 p-3">
              <p className="text-xs font-medium text-gray-700">🖱️ 或者用「拖拽部署」（更简单）：</p>
              <p className="mt-1 text-[10px] text-gray-500">
                先在本地 <code className="rounded bg-white px-1">npm run build</code>，
                然后直接把 <b>dist 文件夹</b>拖到 Netlify 的部署页面上！
              </p>
            </div>
          </div>

          {/* Cloudflare Pages */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h4 className="text-sm font-bold text-gray-800">🥉 方式三：Cloudflare Pages（速度快）</h4>
            <p className="mt-2 text-xs text-gray-500 mb-2">在中国访问速度最快的免费方案</p>
            <div className="space-y-2 text-xs text-gray-600">
              <p>1. 打开 <b>dash.cloudflare.com</b> 注册账号</p>
              <p>2. 左侧菜单点 <b>「Workers & Pages」</b></p>
              <p>3. 点 <b>「Create」 → 「Pages」 → 连接 Git</b></p>
              <p>4. 选择仓库，构建命令填 <code className="rounded bg-gray-100 px-1">npm run build</code></p>
              <p>5. 输出目录填 <code className="rounded bg-gray-100 px-1">dist</code></p>
            </div>
          </div>

          {/* 命令行方式 */}
          <div className="rounded-xl bg-gray-900 p-4">
            <p className="text-xs font-semibold text-gray-400">💻 喜欢用命令行？这样也可以</p>
            <CodeBlock title="Vercel CLI" code={`# 安装 Vercel CLI（一次就行）
npm install -g vercel

# 登录
vercel login

# 部署！（在项目文件夹里执行）
vercel

# 部署到正式环境
vercel --prod`} />
            <CodeBlock title="Netlify CLI" code={`# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 先构建
npm run build

# 部署 dist 文件夹
netlify deploy --prod --dir=dist`} />
          </div>
        </div>
      ),
    },

    /* ——— 步骤 6：安装到手机 ——— */
    {
      title: '在手机上安装 PWA',
      subtitle: '让用户把 App 添加到桌面',
      icon: Smartphone,
      color: 'from-green-500 to-emerald-600',
      content: (
        <div className="space-y-4">
          <div className="rounded-xl bg-green-50 p-4">
            <h4 className="text-sm font-bold text-green-800">📱 部署完成后，在手机上这样安装</h4>
            <p className="mt-1 text-xs text-green-600">两种手机系统的安装方法</p>
          </div>

          {/* iOS */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🍎</span>
              <h4 className="text-sm font-bold text-gray-800">iPhone / iPad（iOS）</h4>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl bg-gray-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                    <Globe size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">第 1 步：用 Safari 打开</p>
                    <p className="text-[10px] text-red-500 font-medium">⚠️ 必须用 Safari！Chrome 不支持</p>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-gray-600">打开 Safari 浏览器，在地址栏输入你部署后的网址</p>
              </div>

              <div className="rounded-xl bg-gray-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                    <Share2 size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">第 2 步：点击分享按钮</p>
                    <p className="text-[10px] text-gray-500">屏幕底部中间的 ⬆️ 按钮</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-white p-2">
                  <Share2 size={16} className="text-blue-500" />
                  <p className="text-[11px] text-gray-600">就是这个箭头朝上的方块图标</p>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                    <Plus size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">第 3 步：添加到主屏幕</p>
                    <p className="text-[10px] text-gray-500">在弹出菜单中向下滚动</p>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-gray-600">
                  找到 <b>「添加到主屏幕」</b> 选项，点击它。
                  然后给 App 取个名字（默认就行），点右上角<b>「添加」</b>。
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-green-500" />
                  <p className="text-xs font-bold text-green-700">完成！</p>
                </div>
                <p className="mt-1 text-[11px] text-green-600">
                  回到桌面，你会看到 SoulMate 的图标！点击打开就是全屏的 App 体验 🎉
                </p>
              </div>
            </div>
          </div>

          {/* Android */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🤖</span>
              <h4 className="text-sm font-bold text-gray-800">Android 手机</h4>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl bg-gray-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                    <Globe size={20} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">第 1 步：用 Chrome 打开网址</p>
                    <p className="text-[10px] text-gray-500">推荐用 Chrome，其他浏览器也可以</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                    <MoreVertical size={20} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">第 2 步：点击右上角 ⋮ 菜单</p>
                    <p className="text-[10px] text-gray-500">三个竖着的点</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                    <Download size={20} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">第 3 步：选择「安装应用」</p>
                    <p className="text-[10px] text-gray-500">或者叫「添加到主屏幕」</p>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-gray-600">
                  Android 会弹出安装提示，点 <b>「安装」</b> 就行了。
                  安装完会出现在应用列表和桌面上！
                </p>
              </div>

              <Tip type="info">
                Android 上的 PWA 体验更好！Chrome 浏览器会自动检测 PWA，
                有时会在底部弹出 <b>「将 SoulMate 添加到主屏幕」</b> 的横幅提示。
              </Tip>
            </div>
          </div>
        </div>
      ),
    },

    /* ——— 步骤 7：测试与检查 ——— */
    {
      title: '测试 PWA 是否正常工作',
      subtitle: '用 Chrome 开发者工具验证',
      icon: Search,
      color: 'from-red-500 to-rose-600',
      content: (
        <div className="space-y-4">
          <div className="rounded-xl bg-red-50 p-4">
            <h4 className="text-sm font-bold text-red-800">🔍 用 Chrome 开发者工具检查 PWA</h4>
            <p className="mt-1 text-xs text-red-600">确保一切正常再告诉用户</p>
          </div>

          {/* Lighthouse */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h4 className="text-sm font-bold text-gray-800 mb-3">方法一：Lighthouse 审计（推荐）</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-2.5">
                <span className="text-sm">1️⃣</span>
                <div>
                  <p className="text-xs text-gray-700">用 Chrome 打开你部署后的网址</p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-2.5">
                <span className="text-sm">2️⃣</span>
                <div>
                  <p className="text-xs text-gray-700">
                    按 <code className="rounded bg-white px-1 font-bold">F12</code> 打开开发者工具
                  </p>
                  <p className="text-[10px] text-gray-500">Mac 上按 <code className="rounded bg-white px-1">Cmd+Option+I</code></p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-2.5">
                <span className="text-sm">3️⃣</span>
                <div>
                  <p className="text-xs text-gray-700">
                    点顶部标签页的 <b>「Lighthouse」</b>
                  </p>
                  <p className="text-[10px] text-gray-500">如果看不到，点 ≫ 箭头展开更多标签</p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-2.5">
                <span className="text-sm">4️⃣</span>
                <div>
                  <p className="text-xs text-gray-700">
                    勾选 <b>「Progressive Web App」</b>，点 <b>「Analyze page load」</b>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-green-50 p-2.5">
                <span className="text-sm">5️⃣</span>
                <div>
                  <p className="text-xs font-medium text-green-700">
                    如果 PWA 那一项显示 ✅，说明你的 PWA 完全合格！
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Application 面板 */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h4 className="text-sm font-bold text-gray-800 mb-3">方法二：Application 面板</h4>
            <div className="space-y-2 text-xs text-gray-600">
              <p>在开发者工具中点 <b>「Application」</b> 标签：</p>
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2.5">
                  <CheckCircle2 size={14} className="text-green-500" />
                  <p><b>Manifest</b> → 应该能看到应用名称和图标</p>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2.5">
                  <CheckCircle2 size={14} className="text-green-500" />
                  <p><b>Service Workers</b> → 状态应该是 "activated and running"</p>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2.5">
                  <CheckCircle2 size={14} className="text-green-500" />
                  <p><b>Cache Storage</b> → 应该有缓存的文件列表</p>
                </div>
              </div>
            </div>
          </div>

          {/* 离线测试 */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h4 className="text-sm font-bold text-gray-800 mb-3">方法三：离线测试</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <Wifi size={18} className="text-green-500" />
                <ArrowRight size={14} className="text-gray-400" />
                <WifiOff size={18} className="text-red-400" />
                <p className="text-xs text-gray-600">断开网络（开飞行模式或关 WiFi）</p>
              </div>
              <p className="text-xs text-gray-600 ml-2">
                刷新页面，如果 App 还能正常显示，说明离线缓存生效了 ✅
              </p>
            </div>
          </div>

          {/* PWA 检查清单 */}
          <div className="rounded-xl bg-gray-900 p-4">
            <p className="text-sm font-bold text-white mb-3">✅ PWA 上线检查清单</p>
            <div className="space-y-2">
              {[
                { text: '网站使用 HTTPS', desc: 'Vercel/Netlify 自动提供' },
                { text: 'manifest.json 可访问', desc: '访问 网址/manifest.json 能看到内容' },
                { text: 'Service Worker 已注册', desc: 'Console 里显示注册成功' },
                { text: '图标正确显示', desc: '192x192 和 512x512 两个尺寸' },
                { text: '离线可以打开 App', desc: '断网后刷新页面仍能加载' },
                { text: 'Lighthouse PWA 审计通过', desc: '所有项目都是绿色 ✓' },
                { text: 'iOS Safari 可添加到主屏幕', desc: '分享 → 添加到主屏幕' },
                { text: 'Android Chrome 可安装', desc: '菜单 → 安装应用' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 rounded-lg bg-white/10 p-2.5">
                  <CheckCircle2 size={12} className="mt-0.5 text-green-400" />
                  <div>
                    <p className="text-xs font-medium text-white">{item.text}</p>
                    <p className="text-[10px] text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  /* ==================== FAQ ==================== */
  const faqs = [
    {
      q: '我完全不会写代码，能部署 PWA 吗？',
      a: '可以！如果你已经有了项目代码（比如别人帮你写好的），你只需要做三件事：1) 注册 Vercel 账号 2) 把代码上传到 GitHub 3) 在 Vercel 里导入项目。全程不需要写一行代码，10 分钟就能搞定。',
    },
    {
      q: 'PWA 和正常的 App 有什么区别？用户能感觉到吗？',
      a: '99% 感觉不到区别。PWA 有自己的桌面图标、打开时全屏、可以离线使用。唯一的区别是：iOS 上 PWA 不能发推送通知（Android 可以），不能在 App Store 搜到。',
    },
    {
      q: 'Vercel 部署是免费的吗？有限制吗？',
      a: '免费！Vercel 的免费计划对个人项目完全够用：100GB 流量/月、无限次部署、自动 HTTPS、自动 CI/CD。直到你的月访问量超过百万才需要付费。',
    },
    {
      q: '我改了代码之后，怎么更新已部署的应用？',
      a: '如果你用 Vercel 部署，只要 git push 推送代码到 GitHub，Vercel 会在 1-2 分钟内自动部署新版本。用户下次打开 App 就是最新版，完全自动！',
    },
    {
      q: 'Service Worker 注册失败怎么办？',
      a: '最常见的原因：1) 没有用 HTTPS（本地开发用 localhost 没问题）2) sw.js 文件路径不对，应该放在 public/ 文件夹根目录 3) sw.js 里有语法错误。打开浏览器控制台（F12）查看具体错误信息。',
    },
    {
      q: 'iOS 用户不会安装 PWA 怎么办？',
      a: '可以在 App 内显示一个安装引导弹窗，用图片告诉用户具体步骤：打开 Safari → 点分享按钮 → 点「添加到主屏幕」。很多大型 PWA 应用都是这么做的（如 Twitter Lite）。',
    },
    {
      q: '怎么绑定自己的域名？',
      a: '1) 在域名商（如阿里云、GoDaddy）购买域名 2) 在 Vercel 项目设置 → Domains 中添加域名 3) 按 Vercel 的提示在域名商处配置 DNS（添加 CNAME 记录）。一般 10 分钟内生效。',
    },
    {
      q: '一个人能搞定所有这些吗？大概要多久？',
      a: '完全可以！如果你跟着这个教程一步步做：准备环境 30 分钟 + 构建部署 30 分钟 + 手机测试 30 分钟 = 大约 1.5 小时搞定。第一次可能会慢一点，之后部署更新只要几分钟。',
    },
  ];

  return (
    <div className="flex h-full flex-col bg-gray-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 via-pink-600 to-purple-700 px-5 pb-5 pt-4">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 left-8 h-28 w-28 rounded-full bg-white/5" />
        
        <div className="relative flex items-center gap-3">
          <button onClick={() => onNavigate('profile')} className="rounded-full p-1 hover:bg-white/10">
            <ArrowLeft size={22} className="text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">PWA 小白部署教程</h1>
        </div>

        <div className="relative mt-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Rocket size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">零基础，一步步教你</h2>
            <p className="text-xs text-white/70">跟着做，30 分钟部署你的第一个 PWA</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-white/80">完成进度</span>
            <span className="text-xs font-bold text-white">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1.5 text-[10px] text-white/60">{completedSteps.size} / 7 步骤已完成</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-8">
        {/* Quick overview */}
        <div className="px-5 pt-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Monitor, label: '无需下载', desc: '浏览器直接用' },
              { icon: Wifi, label: '离线可用', desc: '没网也能打开' },
              { icon: Zap, label: '秒速更新', desc: '自动同步最新版' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1 rounded-xl bg-white p-3 text-center shadow-sm">
                <item.icon size={18} className="text-rose-400" />
                <span className="text-[11px] font-bold text-gray-700">{item.label}</span>
                <span className="text-[9px] text-gray-400">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Flow Diagram */}
        <div className="mx-5 mt-4 rounded-xl bg-gradient-to-r from-rose-50 to-purple-50 p-4">
          <p className="text-xs font-bold text-gray-700 mb-3">🗺️ 部署全流程一览</p>
          <div className="flex items-center justify-between text-center">
            {[
              { emoji: '🛠️', label: '准备' },
              { emoji: '📂', label: '代码' },
              { emoji: '📝', label: '配置' },
              { emoji: '📦', label: '构建' },
              { emoji: '🚀', label: '部署' },
              { emoji: '📱', label: '安装' },
              { emoji: '✅', label: '测试' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full text-sm transition-all',
                  completedSteps.has(i) ? 'bg-green-100 ring-2 ring-green-400' : 'bg-white shadow-sm'
                )}>
                  {completedSteps.has(i) ? '✅' : item.emoji}
                </div>
                <span className="mt-1 text-[8px] font-medium text-gray-500">{item.label}</span>
                {i < 6 && (
                  <div className="absolute" style={{ display: 'none' }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="mt-4 space-y-3 px-5">
          {steps.map((step, index) => (
            <div key={index} className={cn(
              'overflow-hidden rounded-2xl bg-white shadow-sm transition-all',
              openStep === index && 'shadow-md ring-1 ring-gray-100'
            )}>
              {/* Step Header */}
              <button
                onClick={() => toggleStep(index)}
                className="flex w-full items-center gap-3 p-4 text-left"
              >
                <StepNumber n={index + 1} done={completedSteps.has(index)} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <step.icon size={14} className={cn(
                      completedSteps.has(index) ? 'text-green-500' : 'text-gray-400'
                    )} />
                    <h3 className={cn(
                      'text-sm font-bold',
                      completedSteps.has(index) ? 'text-green-600' : 'text-gray-800'
                    )}>
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-0.5 text-[10px] text-gray-400">{step.subtitle}</p>
                </div>
                {openStep === index ? (
                  <ChevronUp size={16} className="text-gray-400" />
                ) : (
                  <ChevronDown size={16} className="text-gray-400" />
                )}
              </button>

              {/* Step Content */}
              {openStep === index && (
                <div className="border-t border-gray-100 px-4 pb-4 pt-3 animate-fade-in">
                  {step.content}
                  {/* Mark Done Button */}
                  <button
                    onClick={() => markDone(index)}
                    className={cn(
                      'mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all active:scale-[0.98]',
                      completedSteps.has(index)
                        ? 'bg-green-50 text-green-600'
                        : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-200'
                    )}
                  >
                    {completedSteps.has(index) ? (
                      <><CheckCheck size={16} /> 已完成！点击取消</>
                    ) : (
                      <><CheckCircle2 size={16} /> 我已完成这一步</>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Completion Banner */}
        {progress === 100 && (
          <div className="mx-5 mt-6 overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-5 text-center shadow-lg animate-bounce-in">
            <span className="text-4xl">🎉</span>
            <h3 className="mt-2 text-xl font-bold text-white">恭喜你！</h3>
            <p className="mt-1 text-sm text-white/90">你已经成功部署了 PWA 应用！</p>
            <p className="mt-3 text-xs text-white/70">
              现在你可以把链接分享给朋友，<br />让他们安装到手机桌面了 📱
            </p>
          </div>
        )}

        {/* FAQ */}
        <div className="mt-6 px-5">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle size={16} className="text-rose-500" />
            <h3 className="text-sm font-bold text-gray-800">常见问题（FAQ）</h3>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="overflow-hidden rounded-xl bg-white shadow-sm">
                <button
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  className="flex w-full items-center gap-2 p-3 text-left"
                >
                  <MessageCircle size={14} className="flex-shrink-0 text-rose-400" />
                  <span className="flex-1 text-xs font-medium text-gray-700">{faq.q}</span>
                  {openFAQ === i ? (
                    <ChevronUp size={14} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={14} className="text-gray-400" />
                  )}
                </button>
                {openFAQ === i && (
                  <div className="border-t border-gray-100 px-3 pb-3 pt-2 animate-fade-in">
                    <p className="text-[11px] leading-relaxed text-gray-600">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Help */}
        <div className="mx-5 mt-6 mb-6 rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 p-4">
          <h3 className="text-sm font-bold text-white">📚 还需要帮助？</h3>
          <p className="mt-1 text-[11px] text-gray-400">以下资源可以帮到你</p>
          <div className="mt-3 space-y-2">
            {[
              { name: 'PWA 官方文档 (MDN)', url: 'developer.mozilla.org/zh-CN/docs/Web/Progressive_web_apps' },
              { name: 'Vercel 部署文档', url: 'vercel.com/docs' },
              { name: 'Vite 官方文档', url: 'cn.vitejs.dev' },
              { name: 'web.dev PWA 教程', url: 'web.dev/learn/pwa' },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-lg bg-white/10 p-2.5">
                <span className="text-xs text-white/80">{item.name}</span>
                <div className="flex items-center gap-1 text-[10px] text-white/40">
                  <span className="max-w-[120px] truncate">{item.url}</span>
                  <ExternalLink size={8} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
