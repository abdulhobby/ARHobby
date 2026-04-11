import { useEffect } from 'react';

const SEO = ({ title, description }) => {
  useEffect(() => {
    document.title = title ? `${title} | AR Hobby` : 'AR Hobby - Collectible Currencies & Coins';
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
    }
  }, [title, description]);

  return null;
};

export default SEO;