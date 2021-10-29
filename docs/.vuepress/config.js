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
        sidebar: {
          '/' : [
            '', 
            'architecture', 
            'btttoken',
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
        // sidebar: [
        //   {
        //     title: '开发者',
        //     prefix: '/',
        //     children: [
        //       '', 
        //       'architecture', 
        //       'btttoken',
        //       'wallets',
        //       'jsonrpc',   
        //       'testnet',
        //       'tools',
        //       'dapp',
        //       'tron-bttc',
        //       'del-val',
        //       '/validator/node',
        //       '/validator/faq'
        //     ]
        //   },
          // {
          //   title: '验证人 & 委托人',
          //   prefix: '/validator/',
          //   children: [
          //     '/validator/', 
          //     '/validator/overview',
          //     '/validator/validators',
          //     '/validator/delegators',
          //     '/validator/node',
          //     '/validator/faq'
          //   ]
          // }
        // ]
      },
      '/en/': {
        selectText: 'Select Language',
        label: 'English',
        sidebar : {
          '/en': [
            '/en/', 
            '/en/architecture', 
            '/en/btttoken',
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
