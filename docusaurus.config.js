module.exports = {
  title: 'Home Assistant Developer Docs',
  tagline: 'All you need to start developing for Home Assistant',
  url: 'https://developers.home-assistant.io',
  baseUrl: '/',
  favicon: 'img/favicon.png',
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.
  themeConfig: {
    googleAnalytics: {
      trackingID: 'UA-57927901-3',
    },
    navbar: {
      title: 'Developer Docs',
      logo: {
        alt: 'Home Assistant',
        src: 'img/logo-pretty.svg',
      },
      links: [
        {to: 'docs/architecture_index', label: 'Architecture', position: 'left'},
        {to: 'docs/frontend_index', label: 'Frontend', position: 'left'},
        {to: 'docs/development_index', label: 'Backend', position: 'left'},
        {to: 'docs/misc', label: 'Misc', position: 'left'},
        {to: 'blog', label: 'Blog', position: 'left'},
      ],
    },
    footer: {
      logo: {
        alt: 'Home Assistant',
        src: 'img/logo-white.svg',
        href: 'https://www.home-assistant.io',
      },
      style: 'dark',
      links: [
        {
          title: 'Social',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/home-assistant/developers.home-assistant',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/hass_devs',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Home Assistant, Inc. Built with Docusaurus.`,
    },
    image: 'img/default-social.png',
    algolia: {
      apiKey: 'd0245452c36b10cec4b8b5bad04e06fc',
        indexName: 'home-assistant-dev',
      algoliaOptions: {}
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/home-assistant/developers.home-assistant/edit/master/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        blog: {
          postsPerPage: 10,
        },
      },
    ],
  ],
};
