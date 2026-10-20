import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local', //local：本地；github：线上发布

    /*
    //线上发布用
    repo: {
      owner: 'HP168168',//你的github用户名
      name: 'nav-blog', //你的github仓库名
    },
    */
  },
  collections: {
    // 1. 博客文章模块
    posts: collection({
      label: '博客文章',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({
          name: { label: '文章标题' },
          slug: {
            label: '文章链接别名 (Slug)',
            description: '文章的英文访问路径与文件名，支持英文、数字与短横线（点击右侧“重新生成”可根据标题自动转换）',
          },
        }),
        summary: fields.text({ label: '文章摘要', multiline: true }),
        publishedDate: fields.date({
          label: '发布日期',
          defaultValue: { kind: 'today' },
          description: '新建文章时默认自动填充当天系统日期，也可手动调整',
        }),
        category: fields.text({ label: '文章分类', defaultValue: '技术分享' }),
        content: fields.markdoc({ label: '文章正文', extension: 'md' }),
      },
    }),

    // 2. 网址导航模块
    categories: collection({
      label: '导航分类',
      slugField: 'name',
      path: 'src/content/navigation/*',
      format: 'json',
      schema: {
        name: fields.slug({
          name: { label: '分类名称 (如 AI工具、前端资源)' },
          slug: {
            label: '分类链接别名 (Slug)',
            description: '分类的唯一英文标识与文件名（点击右侧“重新生成”可根据分类名自动转换）',
          },
        }),
        icon: fields.text({ label: '分类图标 (Emoji 或 图标名)', defaultValue: '🚀' }),
        order: fields.integer({ label: '排序 (越小越靠前)', defaultValue: 1 }),
        links: fields.array(
          fields.object({
            title: fields.text({ label: '站点名称' }),
            url: fields.url({ label: '站点网址' }),
            description: fields.text({ label: '站点简介' }),
            icon: fields.text({ label: '图标 (Emoji 或 图片URL)', defaultValue: '🌐' }),
            tag: fields.text({ label: '角标标签 (如 免费 / 推荐 / 官方)' }),
            visible: fields.checkbox({
              label: '前台显示',
              description: '是否在前台导航页面展示此站点（默认勾选显示）',
              defaultValue: true,
            }),
          }),
          {
            label: '收录站点列表',
            itemLabel: (props) => `${props.fields.title.value || '未命名站点'}${props.fields.visible.value === false ? ' (已隐藏)' : ''}`,
          }
        ),
      },
    }),
  },
});
