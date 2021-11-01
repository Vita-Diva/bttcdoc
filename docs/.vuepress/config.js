module.exports = {
  title: 'BitTorrent-Chain',
  description: 'BitTorrent-Chain Documentation',
  base: '/v1/doc',
  locales: { 
    '/en/': { 
      lang: 'en-US',
      label: 'English',
      title: 'BitTorrent-Chain Developer Documentation',
      description: 'BitTorrent-Chain Developer Documentation'
    },
    '/traditional/': {
      lang: 'zh-HK',
      label: '繁體中文',
      title: 'BitTorrent-Chain 開發文檔',
      description: 'BitTorrent-Chain 開發和使用手冊'
    },
    '/': {
      lang: 'zh-CN',
      label: '简体中文',
      title: 'BitTorrent-Chain 开发文档',
      description: 'BitTorrent-Chain 开发和使用手册'
    }
  },
  themeConfig: {
    locales: {
      '/en/': {
        selectText: 'Select Language',
        label: 'English',
        sidebar : {
          '/en': [
            '/en/', 
            '/en/architecture', 
            '/en/wallets',
            '/en/jsonrpc',
            '/en/testnet',
            '/en/tools',
            '/en/dapp',
            '/en/tron-bttc',
            '/en/del-val',
            '/en/validator/node',
            '/en/validator/faq'
          ]
        }
      },
      '/': {
        selectText: '选择语言',
        label: '简体中文',
        sidebar: {
          '/' : [
            '', 
            'architecture', 
            'wallets',
            'jsonrpc',   
            'testnet',
            'tools',
            'dapp',
            'tron-bttc',
            'del-val',
            '/validator/node',
            '/validator/faq'
          ]
        }
      },
      '/traditional/': {
        selectText: '選擇語言',
        label: '繁體中文',
        sidebar: {
          '/' : [
            '/traditional/', 
            '/traditional/architecture', 
            '/traditional/wallets',
            '/traditional/jsonrpc',   
            '/traditional/testnet',
            '/traditional/tools',
            '/traditional/dapp',
            '/traditional/tron-bttc',
            '/traditional/del-val',
            '/traditional/validator/node',
            '/traditional/validator/faq'
          ]
        }
      },
    sidebar: 'auto',
    sidebarDepth: 4,
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
  ]
}
}
