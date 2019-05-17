
/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config.html for all the possible
// site configuration options.

/* List of projects/orgs using your project for the users page */
const users = [
  {
    caption: 'User1',
    image: '/test-site/img/docusaurus.svg',
    infoLink: 'https://www.facebook.com',
    pinned: true,
  },
];

const siteConfig = {
  title: 'Home Assistant dev docs' /* title for your website */,
  tagline: 'All you need to start developing for Home Assistant',
  editUrl: 'https://github.com/home-assistant/developers.home-assistant/edit/master/docs/',
  url: 'https://developers.home-assistant.io' /* your website url */,
  baseUrl: '/' /* base url for your project */,
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  gaTrackingId: 'UA-57927901-3',

  // Used for publishing and more
  projectName: 'home-assistant',
  organizationName: 'home-assistant',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {doc: 'architecture_index', label: 'Architecture'},
    {doc: 'frontend_index', label: 'Frontend'},
    {doc: 'development_index', label: 'Backend'},
    {doc: 'misc', label: 'Misc'},
    { blog: true, label: 'Blog' },
  ],

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  headerIcon: 'img/logo-white.svg',
  footerIcon: 'img/logo-white.svg',
  favicon: 'img/favicon.png',

  /* colors for website */
  colors: {
    primaryColor: '#03A9F4',
    secondaryColor: '#4FC3F7',
  },

  /* custom fonts for website */
  /*fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },*/

  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright:
    'Copyright © ' +
    new Date().getFullYear() +
    ' Home Assistant',

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags
  // scripts: ['https://buttons.github.io/buttons.js'],

  /* On page navigation for the current documentation page */
  onPageNav: 'separate',

  /* Open Graph and Twitter card images */
  ogImage: 'img/default-social.png',
  twitterImage: 'img/default-social.png',

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl: 'https://github.com/home-assistant/home-assistant',
  repoFrontendUrl: 'https://github.com/home-assistant/home-assistant-polymer',
  repoFrontendWebsite: 'https://github.com/home-assistant/home-assistant.io',
  repoDevWebsite: 'https://github.com/home-assistant/developers.home-assistant',

  algolia: {
    apiKey: 'd0245452c36b10cec4b8b5bad04e06fc',
    indexName: 'home-assistant-dev',
    algoliaOptions: {}
  },
};

module.exports = siteConfig;
