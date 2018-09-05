import React, { Fragment } from 'react';
import Helmet from 'react-helmet';

const Platforms = ({ data }) => {
  const { all, facebook, twitter } = data;
  return (
    <Fragment>
      <Helmet
        title={all.title}
        meta={[
          { name: 'description', content: all.description },

          { property: 'og:title', content: facebook.title },
          { property: 'og:description', content: facebook.description },
          { property: 'og:image', content: facebook.imageUrl },
          { property: 'og:image:secure_url', content: facebook.imageUrl },
          { property: 'og:type', content: 'article' },

          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: twitter.title },
          { name: 'twitter:description', content: twitter.description },
          { name: 'twitter:image', content: twitter.imageUrl },
        ]}
      />
    </Fragment>
  );
};

export default Platforms;
