import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: ({ browser }) => ({
    name: 'GitHub DeepWiki Button (Unofficial)',
    short_name: 'gh-deepwiki',
    version: '1.0.3',
    description: '__MSG_appDescription__',
    default_locale: 'en',
    icons: {
      16: 'images/icon-16.png',
      19: 'images/icon-19.png',
      32: 'images/icon-32.png',
      38: 'images/icon-38.png',
      48: 'images/icon-48.png',
      64: 'images/icon-64.png',
      128: 'images/icon-128.png',
    },
    permissions: ['scripting'],
    host_permissions: ['https://github.com/*'],
    web_accessible_resources: [
      {
        resources: [
          'images/icon-16.png',
          'images/icon-19.png',
          'images/icon-32.png',
          'images/icon-38.png',
          'images/icon-48.png',
          'images/icon-64.png',
          'images/icon-128.png',
        ],
        matches: ['https://github.com/*'],
      },
    ],
    ...(browser === 'firefox' && {
      browser_specific_settings: {
        gecko: {
          id: '{0b2537a5-b568-4e8e-b85c-39d5a617a6ba}',
          strict_min_version: '102.0',
        },
      },
    }),
  }),
  webExt: {
    chromiumArgs: ['--disable-extensions-except={{rootDir}}/.output/chrome-mv3'],
  },
});
