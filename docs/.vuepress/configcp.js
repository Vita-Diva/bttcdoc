module.exports = {
  title: 'BitTorrent-Chain',
  description: 'BitTorrent-Chain Documentation',
  base: '/v1/doc/',
  locales: {
    '/': {
      lang: 'zh-CN',
      label: '简体中文',
      title: 'BitTorrent-Chain 开发文档',
      description: 'BitTorrent-Chain 开发和使用手册'
    },  
    '/en/': { 
      lang: 'en-US',
      label: 'English',
      title: 'BitTorrent-Chain Developer Documentation',
      description: 'BitTorrent-Chain Developer Documentation'
    }
  },
  themeConfig: {
    locales: {
      '/': {
        selectText: '选择语言',
        label: '简体中文',
        nav: [
          {text: '开发者', link: '/'},
          {text: '验证人 & 委托人', link: '/validator/'}
        ],
        sidebar: {
          '/': [
            '', 
            'architecture', 
            'btttoken',
            'genesis-contracts',
            'fullnode',
            'wallets',
            'tron-bttc',
            'checkpoint',
            'mapping',
            'mintable',
            'statetransition'
          ],
        }
      },
      '/en/': {
        selectText: 'Select Language',
        label: 'English',
        nav: [
          {text: 'Developers', link: '/en/'},
          {text: 'Validators & Delegators', link: '/validator'}
        ],
        sidebar: {
          '/en': [
            '/en/', 
            '/en/architecture', 
            '/en/btttoken',
            '/en/genesis-contracts',
            '/en/fullnode',
            '/en/wallets',
            '/en/tron-bttc',
            '/en/checkpoint',
            '/en/mapping',
            '/en/mintable',
            '/en/statetransition'
          ],
        }
      },
      '/validator/': {
        selectText: '艹',
        label: '简体中文',
        nav: [
          {text: '开发者', link: '/'},
          {text: '验证人 & 委托人', link: '/validator/'}
        ],
        sidebar: {
          '/validator': [
            '/validator/', 
            '/validator/overview',
            '/validator/validators',
            '/validator/delegators',
            '/validator/node',
            '/validator/faq'
          ],
        }
      }
    },
    sidebar: 'auto',
    sidebarDepth: 4,
    smoothScroll: true
  },
  markdown: {
    anchor: {
      permalink: true,
      permalinkBefore: true,
      permalinkSymbol: '#'
    }
  },
  head: [
    ['link', {
      rel: 'icon',
      href: '/favicon.ico'
    }]
  ],
  plugins: [
    'vuepress-plugin-mermaidjs'
  ]
}
