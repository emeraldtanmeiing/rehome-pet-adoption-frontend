const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { 
                '@font-family': 'Zen Maru Gothic',
                '@primary-color': '#f38434',
                '@link-color': '#cd7333',
                '@text-color': '#2f2f2f',
                '@border-radius-base': '3px',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};