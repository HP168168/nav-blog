# NaviBlog (Astro + Keystatic 导航与博客一体站)

基于 **Astro** 静态站点生成（SSG）与 **Keystatic** 本地/云端 Git 可视化管理后台构建的现代化网址导航与个人博客一体化站点。

## 目录结构

```
d:/tools/nav-blog/
├── src/
│   ├── content/
│   │   ├── posts/          # 博客文章 (Markdown / Markdoc)
│   │   └── navigation/     # 导航分类与站点数据 (JSON)
│   ├── layouts/
│   │   └── Layout.astro    # 全局布局 (深色主题、顶栏、底栏)
│   ├── pages/
│   │   ├── index.astro     # 首页：网址导航 + 实时搜索
│   │   └── blog/           # 博客列表与详情页
│   └── content.config.ts   # Astro 内容集合配置
├── keystatic.config.ts     # Keystatic 后台模型配置 (定义文章与导航字段)
├── astro.config.mjs        # Astro 配置文件
└── tailwind.config.mjs     # 样式配置
```

## 运行与使用

1. **安装依赖**（建议使用国内镜像源保证极速顺畅）：
   ```bash
   npm install --registry=https://registry.npmmirror.com
   ```

2. **启动本地开发与后台**：
   ```bash
   npm run dev
   ```

3. **浏览器访问**：
   - 前台网址导航首页：`http://localhost:4321/`
   - 精选技术博客页：`http://localhost:4321/blog`
   - **在线可视化管理后台**：`http://localhost:4321/keystatic`

## 线上零成本部署指南

1. 将本目录代码推送到你的 GitHub 仓库。
2. 免费绑定到 **Cloudflare Pages** 或 **Vercel** 托管平台。
3. 在 `keystatic.config.ts` 中将 storage 修改为 `github` 模式，即可随时随地通过手机或电脑浏览器在线登录后台发布内容！
