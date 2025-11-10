// src/hooks/usePageTitle.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const usePageTitle = (title = null, description = null) => {
  const location = useLocation();

  useEffect(() => {
    // Set page title
    if (title) {
      document.title = title;
    }

    // Set meta description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');

      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.name = "description";
        document.head.appendChild(metaDescription);
      }

      metaDescription.content = description;
    }

    // Update Open Graph tags
    const updateMetaTag = (property, content) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`);

      if (!metaTag) {
        metaTag = document.createElement("meta");
        metaTag.setAttribute("property", property);
        document.head.appendChild(metaTag);
      }

      metaTag.content = content;
    };

    if (title) {
      updateMetaTag("og:title", title);
      updateMetaTag("twitter:title", title);
    }

    if (description) {
      updateMetaTag("og:description", description);
      updateMetaTag("twitter:description", description);
    }
  }, [title, description, location]);
};

export default usePageTitle;
