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
        sidebar: [
          {
            title: '开发者',
            prefix: '/',
            children: [
              '', 
              'architecture', 
              'btttoken',
              // 'genesis-contracts',
              // 'fullnode',
              'wallets',
              'tron-bttc',
              'checkpoint',
              'mapping',
              'mintable',
              'statetransition',
              'dapp'
            ]
          },
          {
            title: '验证人 & 委托人',
            prefix: '/validator/',
            children: [
              '/validator/', 
              '/validator/overview',
              '/validator/validators',
              '/validator/delegators',
              '/validator/node',
              '/validator/faq'
            ]
          }
        ]
      },
      '/en/': {
        selectText: 'Select Language',
        label: 'English',
        sidebar: [
          {
            title: 'Developers',
            prefix: '/en',
            children: [
              '/en/', 
              '/en/architecture', 
              '/en/btttoken',
              // '/en/genesis-contracts',
              // '/en/fullnode',
              '/en/wallets',
              '/en/tron-bttc',
              '/en/checkpoint',
              '/en/mapping',
              '/en/mintable',
              '/en/statetransition',
              '/en/dapp'
            ]
          },
          {
            title: 'Validator & Delegator',
            prefix: '/en/validator',
            children: [
              '/en/validator/', 
              '/en/validator/overview',
              '/en/validator/validators',
              '/en/validator/delegators',
              '/en/validator/node',
              '/en/validator/faq'
            ]
          }
        ]
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
