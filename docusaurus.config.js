module.exports = {
  title: "Home Assistant Developer Documentation",
  tagline: "All you need to start developing for Home Assistant",
  url: "https://developers.home-assistant.io",
  baseUrl: "/",
  favicon: "img/favicon.png",
  organizationName: "home-assistant",
  projectName: "developers.home-assistant",
  themeConfig: {
    googleAnalytics: {
      trackingID: "UA-57927901-3",
    },
    navbar: {
      title: "Developers",
      logo: {
        alt: "Home Assistant",
        src: "img/logo-pretty.svg",
      },
      links: [
        {
          label: "Home Assistant",
          position: "left",
          items: [
            {
              label: "Architecture",
              to: "docs/architecture_index",
            },
            {
              label: "Core",
              to: "docs/development_index",
            },
            { to: "docs/frontend_index", label: "Frontend" },
            { to: "docs/internationalization", label: "Internationalization" },
          ],
        },
        {
          label: "Documenting",
          position: "left",
          items: [
            { label: "Documentation", to: "docs/documentation_index" },
            { label: "Standards", to: "docs/documentation_standards" },
            {
              label: "Create a new page",
              to: "docs/documentation_create_page",
            },
          ],
        },
        { label: "Translations", to: "docs/translations", position: "left" },
        {
          label: "API",
          position: "left",
          items: [
            { label: "REST-API", to: "docs/api/rest" },
            { label: "WebSocket API", to: "docs/api/websocket" },
            {
              label: "Native App Integration",
              to: "docs/api/native-app-integration",
            },
          ],
        },
        { to: "docs/misc", label: "Misc", position: "left" },
        { to: "blog", label: "Blog", position: "left" },
      ],
    },
    footer: {
      logo: {
        alt: "Home Assistant",
        src: "img/logo-white.svg",
        href: "https://www.home-assistant.io",
      },
      style: "dark",
      links: [
        {
          title: "More Home Assistant",
          items: [
            {
              label: "Homepage",
              href: "https://www.home-assistant.io",
            },
            {
              label: "Data Science Portal",
              href: "https://data.home-assistant.io",
            },
            {
              label: "Alerts",
              href: "https://alerts.home-assistant.io",
            },
            {
              label: "System Status",
              href: "https://status.home-assistant.io/",
            },
          ],
        },
        {
          title: "Social",
          items: [
            {
              label: "Blog",
              to: "blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/home-assistant",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/hass_devs",
            },
            {
              label: "Discord chat",
              href: "https://www.home-assistant.io/join-chat",
            },
          ],
        },
        {
          title: "Other",
          items: [
            {
              label: "Privacy",
              href: "https://www.home-assistant.io/privacy/",
            },
            {
              label: "Security",
              href: "https://www.home-assistant.io/security/",
            },
          ],
        },
        {
          items: [
            {
              html: `
              <a href="https://www.netlify.com" target="_blank" rel="noreferrer noopener" aria-label="Deploys by Netlify">
                <img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg" alt="Deploys by Netlify" />
              </a>
              `,
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Home Assistant, Inc. Built with Docusaurus.`,
    },
    image: "img/default-social.png",
    algolia: {
      apiKey: "d0245452c36b10cec4b8b5bad04e06fc",
      indexName: "home-assistant-dev",
      algoliaOptions: {},
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/home-assistant/developers.home-assistant/edit/master/",
          showLastUpdateTime: true,
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        blog: {
          postsPerPage: 10,
          feedOptions: {
            type: "all",
          },
        },
      },
    ],
  ],
};
