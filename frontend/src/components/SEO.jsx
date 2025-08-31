// components/SEO.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description }) => (
  <Helmet>
    <title>{title} | MyGarden</title>
    <meta name="description" content={description} />
  </Helmet>
);

export default SEO;
