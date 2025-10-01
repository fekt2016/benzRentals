// src/components/SEO.jsx
import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const SEO = ({
  title = "BenzFlex - Premium Mercedes-Benz Rentals",
  description = "Experience luxury with our premium Mercedes-Benz rental fleet. Exclusive vehicles, exceptional service.",
  keywords = "mercedes-benz, luxury car rental, premium vehicles, benzflex, luxury rental",
  canonical = "",
  ogImage = "/images/og-image.jpg",
  ogType = "website",
  noIndex = false,
}) => {
  const location = useLocation();
  const siteTitle = "BenzFlex";
  const siteUrl = "https://benzflex.com";
  const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;
  const fullCanonical = canonical || `${siteUrl}${location.pathname}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta
        name="robots"
        content={noIndex ? "noindex, nofollow" : "index, follow"}
      />

      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@benzflex" />
      <meta name="twitter:creator" content="@benzflex" />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="author" content="BenzFlex" />
      <meta name="theme-color" content="#D32F2F" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "BenzFlex",
          alternateName: "BenzFlex Luxury Rentals",
          url: siteUrl,
          logo: `${siteUrl}/images/logo.png`,
          description: description,
          address: {
            "@type": "PostalAddress",
            streetAddress: "123 Luxury Avenue",
            addressLocality: "Munich",
            postalCode: "80331",
            addressCountry: "DE",
          },
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+49-89-1234567",
            contactType: "customer service",
            email: "info@benzflex.com",
          },
          sameAs: [
            "https://www.facebook.com/benzflex",
            "https://www.instagram.com/benzflex",
            "https://www.linkedin.com/company/benzflex",
          ],
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
