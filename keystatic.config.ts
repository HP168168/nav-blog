import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    // 1. 博客文章模块
    posts: collection({
      label: '博客文章',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: '文章标题' } }),
        summary: fields.text({ label: '文章摘要', multiline: true }),
        publishedDate: fields.date({ label: '发布日期', defaultValue: { kind: 'today' } }),
        category: fields.text({ label: '文章分类', defaultValue: '技术分享' }),
        content: fields.markdoc({ label: '文章正文', extension: 'md' }),
      },
    }),

    // 2. 网址导航模块
    categories: collection({
      label: '网址导航分类',
      slugField: 'name',
      path: 'src/content/navigation/*',
      format: 'json',
      schema: {
        name: fields.slug({ name: { label: '分类名称 (如 AI工具、前端资源)' } }),
        icon: fields.text({ label: '分类图标 (Emoji 或 图标名)', defaultValue: '🚀' }),
        order: fields.integer({ label: '排序 (越小越靠前)', defaultValue: 1 }),
        links: fields.array(
          fields.object({
            title: fields.text({ label: '站点名称' }),
            url: fields.url({ label: '站点网址' }),
            description: fields.text({ label: '站点简介' }),
            icon: fields.text({ label: '图标 (Emoji 或 图片URL)', defaultValue: '🌐' }),
            tag: fields.text({ label: '角标标签 (如 免费 / 推荐 / 官方)' }),
          }),
          {
            label: '收录站点列表',
            itemLabel: (props) => props.fields.title.value || '未命名站点',
          }
        ),
      },
    }),
  },
});
