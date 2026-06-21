import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  name?: string;
  type?: string;
  url?: string;
  image?: string;
  canonical?: string;
}

export function SEO({ 
  title, 
  description, 
  name = "NEXORA TECH", 
  type = "website", 
  url, 
  image,
  canonical
}: SEOProps) {
  const defaultImage = "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80";
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : (url || "https://nexoratech.com");
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : siteUrl);
  const ogImage = image || defaultImage;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{`${title} | ${name}`}</title>
      <meta name='description' content={description} />
      <link rel="canonical" href={canonical || currentUrl} />

      {/* OpenGraph tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={name} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
