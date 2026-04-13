// components/common/Breadcrumb.jsx
import { Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

const Breadcrumb = ({ items }) => {
  // Generate breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.path ? `${window.location.origin}${item.path}` : undefined
    }))
  };

  return (
    <>
      {/* Add breadcrumb schema to head */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>

      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center flex-wrap gap-2 text-sm" aria-label="Breadcrumb">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {index === 0 && <FiHome className="w-4 h-4 text-text-light" />}

                {item.path ? (
                  <Link
                    to={item.path}
                    className="text-text-secondary hover:text-primary transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-text-primary font-medium">{item.label}</span>
                )}

                {index < items.length - 1 && (
                  <FiChevronRight className="w-4 h-4 text-text-light" />
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Breadcrumb;