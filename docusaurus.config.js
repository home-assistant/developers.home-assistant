module.exports = {
  title: "Home Assistant Developer Docs",
  tagline: "All you need to start developing",
  url: "https://developers.home-assistant.io",
  baseUrl: "/",
  favicon: "img/favicon.png",
  organizationName: "home-assistant",
  projectName: "developers.home-assistant",
  themeConfig: {
    navbar: {
      title: "Developers",
      logo: {
        alt: "Home Assistant",
        src: "img/logo-pretty.svg",
        srcDark: "img/logo-pretty.svg",
      },
      items: [
        {
          label: "Home Assistant",
          position: "left",
          items: [
            {
              label: "Overview",
              to: "docs/architecture_index",
            },
            {
              label: "Core",
              to: "docs/development_index",
            },
            { to: "docs/frontend", label: "Frontend" },
            { to: "docs/supervisor", label: "Supervisor" },
            { to: "docs/add-ons", label: "Add-ons" },
            { to: "docs/operating-system", label: "Operating System" },
            { to: "docs/voice/overview", label: "Voice" },
            { to: "docs/translations", label: "Translations" },
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
        height: "70px",
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
          title: "Thanks",
          items: [
            {
              html: `
              <a href="https://www.netlify.com" target="_blank" rel="noreferrer noopener" aria-label="Deploys by Netlify">
                <img src="https://www.netlify.com/v3/img/components/netlify-color-accent.svg" alt="Deploys by Netlify" />
              </a>
              `,
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Home Assistant. Built with Docusaurus.`,
    },
    image: "img/default-social.png",
    mermaid: {
      theme: { light: "neutral", dark: "forest" },
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
        googleAnalytics: {
          trackingID: "UA-57927901-3",
        },
      },
    ],
  ],
  plugins: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        indexDocs: true,
        indexBlog: true,
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],
  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],
};
