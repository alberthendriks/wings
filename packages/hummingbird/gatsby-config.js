const path = require('path');

module.exports = ({
  wings: { project: wingsProject, appKey: wingsAppKey, endpoint: wingsEndpoint },
  blockRobots,
  gaTrackingId,
  basicAuth,
} = {}) => ({
  siteMetadata: {
    siteTitle: 'Hummingbird',
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-page-creator',
      options: {
        path: path.join(__dirname, 'src', 'pages'),
      },
    },
    {
      resolve: 'gatsby-plugin-compile-es6-packages',
      options: {
        modules: ['@wingscms/hummingbird'],
      },
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-styled-components',
    'gatsby-plugin-remove-trailing-slashes',
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        query: `query {
          site {
            siteMetadata {
              siteUrl
            }
          }
          allSitePage {
            edges {
              node {
                id
                path
              }
            }
          }
        }`,
        serialize: ({ site, allSitePage }) =>
          allSitePage.edges
            .filter(({ node }) => !/\/confirm(?:ed)?$/.test(node.path))
            .map(x => ({
              url: site.siteMetadata.siteUrl + x.node.path,
            })),
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        resolveEnv: () => (blockRobots ? 'development' : 'production'),
        env: {
          development: {
            policy: [{ userAgent: '*', disallow: ['/'] }],
            sitemap: null,
            host: null,
          },
          production: {
            policy: [{ userAgent: '*', allow: '/' }],
          },
        },
      },
    },
    /* eslint-enable no-underscore-dangle */
    'gatsby-plugin-catch-links',
    {
      resolve: 'gatsby-plugin-nprogress',
      options: {
        color: '#24A42E',
        showSpinner: false,
      },
    },
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: require.resolve('./lib/typography'),
      },
    },
    {
      resolve: 'gatsby-source-graphql',
      options: {
        typeName: 'Wings',
        fieldName: 'wings',
        url: wingsEndpoint || 'https://api.wings.dev',
        headers: {
          Authorization: `Bearer ${wingsAppKey}`,
          'X-Wings-Project': wingsProject,
        },
      },
    },
    {
      resolve: 'gatsby-plugin-netlify',
      options: {
        headers: {
          ...(basicAuth && {
            '/*': [`Basic-Auth: ${basicAuth}`],
          }),
        },
      },
    },
    ...(!gaTrackingId
      ? []
      : [
        {
          resolve: 'gatsby-plugin-google-analytics',
          options: {
            trackingId: gaTrackingId,
            head: true,
            anonymize: true,
            respectDNT: true,
          },
        },
      ]),
  ],
});
