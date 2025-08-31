import client from '../utils/sanityClient';

export const fetchAllBlogs = async () => {
  const query = `*[_type == "blog"]{
    _id,
    title,
    slug,
    mainImage{
      asset->{url}
    },
    excerpt,
    publishedAt
  } | order(publishedAt desc)`;

  return await client.fetch(query);
};

export const fetchBlogBySlug = async (slug) => {
  const query = `*[_type == "blog" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    mainImage {
      asset -> {
        url
      }
    },
    body,
    publishedAt
  }`;

  return await client.fetch(query, { slug });
};
