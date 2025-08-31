// utils/sanityImageUrl.js
import imageUrlBuilder from '@sanity/image-url';
import sanityClient from './sanityClient'; // your configured Sanity client

const builder = imageUrlBuilder(sanityClient);

export const urlFor = (source) => builder.image(source);
