"use client"
// components/blog/page.tsx
import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getAllCategories, getFeaturedPosts } from "@/lib/sanity-client";
import BlogLayout from "@/components/blog/blog-layout";
import BlogPostCard from "@/components/blog/blog-post-card";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | ClassMent",
  description: "Read our latest articles about career development, skill-building, and professional growth.",
};

async function FeaturedPosts() {
  const featuredPosts = await getFeaturedPosts();
  
  if (!featuredPosts || featuredPosts.length === 0) {
    return null;
  }
  
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Featured Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredPosts.map((post) => (
          <BlogPostCard key={post._id} post={post} featured={true} />
        ))}
      </div>
    </section>
  );
}

async function AllPosts() {
  const posts = await getAllPosts();
  
  // Additional filtering for demo posts (just in case they weren't filtered at the database level)
  const excludedSlugs = ["demo1", "demo2"];
  const validPosts = posts.filter(post => {
    return post && post.slug && !excludedSlugs.includes(post.slug.current);
  });
  
  if (!validPosts || validPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">No posts found. Check back soon!</p>
      </div>
    );
  }
  
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">All Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {validPosts.map((post) => (
          <BlogPostCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
}

export default async function BlogPage() {
  const categories = await getAllCategories();
  
  return (
    <BlogLayout categories={categories}>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">ClassMent Blog</h1>
          <p className="text-lg text-gray-600">
            Insights, guides, and resources for your career journey
          </p>
        </div>
        
        <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
          <FeaturedPosts />
        </Suspense>
        
        <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
          <AllPosts />
        </Suspense>
      </div>
    </BlogLayout>
  );
}