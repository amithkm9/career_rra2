// lib/sanity-client.ts
import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

// Define the configuration for the Sanity client
export const config = {
  /**
   * Project ID and dataset are pulled from the Sanity CLI config
   * These values match what's in your sanity.cli.ts file
   */
  projectId: 'dz88krr6',
  dataset: 'production',
  apiVersion: '2023-05-03', // Use a UTC date string
  useCdn: process.env.NODE_ENV === 'production', // Use CDN for faster response in production
};

// Create a client for fetching data
export const sanityClient = createClient(config);

// Helper function to generate image URLs
const builder = imageUrlBuilder(sanityClient);
export const urlFor = (source: any) => builder.image(source);

// Define an array of demo/test post slugs to exclude from queries
const EXCLUDED_SLUGS = ["demo1", "demo2"];

// Helper functions to fetch data with GROQ queries
export async function getAllPosts() {
  try {
    const posts = await sanityClient.fetch(
      `*[_type == "post" && !(_id in path('drafts.**')) && !(slug.current in $excludedSlugs)] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        "categories": categories[]->{ _id, title, slug, color },
        mainImage,
        publishedAt,
        "author": author->{name, slug, image},
        featured,
        readTime
      }`,
      { excludedSlugs: EXCLUDED_SLUGS }
    );
    
    console.log("Sanity returned posts count:", posts?.length || 0);
    return posts;
  } catch (error) {
    console.error("Error in getAllPosts:", error);
    return [];
  }
}

export async function getFeaturedPosts() {
  return sanityClient.fetch(
    `*[_type == "post" && featured == true && !(_id in path('drafts.**')) && !(slug.current in $excludedSlugs)] | order(publishedAt desc)[0...3] {
      _id,
      title,
      slug,
      excerpt,
      "categories": categories[]->title,
      mainImage,
      publishedAt,
      "author": author->{name, slug, image},
      readTime
    }`,
    { excludedSlugs: EXCLUDED_SLUGS }
  );
}

export async function getPostBySlug(slug: string) {
  // No need to filter excluded slugs here as we're querying for a specific slug
  return sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug && !(_id in path('drafts.**'))][0] {
      _id,
      title,
      slug,
      body,
      excerpt,
      "categories": categories[]->{ title, slug, description, color },
      mainImage,
      publishedAt,
      "author": author->{name, slug, image, bio, role},
      readTime,
      seo
    }`,
    { slug }
  );
}

export async function getPostsByCategory(category: string) {
  return sanityClient.fetch(
    `*[_type == "post" && $category in categories[]->slug.current && !(_id in path('drafts.**')) && !(slug.current in $excludedSlugs)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      "categories": categories[]->title,
      mainImage,
      publishedAt,
      "author": author->{name, slug, image},
      readTime
    }`,
    { category, excludedSlugs: EXCLUDED_SLUGS }
  );
}

export async function getAllCategories() {
  return sanityClient.fetch(
    `*[_type == "category"] | order(title asc) {
      _id,
      title,
      slug,
      description,
      color
    }`
  );
}

export async function getAllAuthors() {
  return sanityClient.fetch(
    `*[_type == "author"] | order(name asc) {
      _id,
      name,
      slug,
      image,
      bio,
      role
    }`
  );
}

export async function getAuthorBySlug(slug: string) {
  return sanityClient.fetch(
    `*[_type == "author" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      image,
      bio,
      role,
      "posts": *[_type == "post" && references(^._id) && !(_id in path('drafts.**')) && !(slug.current in $excludedSlugs)] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        mainImage,
        publishedAt,
        readTime
      }
    }`,
    { slug, excludedSlugs: EXCLUDED_SLUGS }
  );
}

export async function searchPosts(searchTerm: string) {
  return sanityClient.fetch(
    `*[_type == "post" && (title match $searchTerm || excerpt match $searchTerm) && !(_id in path('drafts.**')) && !(slug.current in $excludedSlugs)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      "categories": categories[]->title,
      mainImage,
      publishedAt,
      "author": author->{name, slug, image},
      readTime
    }`,
    { searchTerm: `*${searchTerm}*`, excludedSlugs: EXCLUDED_SLUGS }
  );
}