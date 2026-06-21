import React from 'react';
import { Helmet } from 'react-helmet-async';

export function OrganizationStructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NEXORA TECH",
    "url": window.location.origin,
    "logo": `${window.location.origin}/logo.png`,
    "description": "Enterprise software solutions and web development",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "contact@nexoratech.com",
      "contactType": "customer service"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

export function ArticleStructuredData({ title, description, datePublished, author = "NEXORA TECH", image }: { title: string, description: string, datePublished: string, author?: string, image?: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": image || `${window.location.origin}/default-article-image.jpg`,
    "datePublished": datePublished,
    "author": {
      "@type": "Organization",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "NEXORA TECH",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/logo.png`
      }
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
