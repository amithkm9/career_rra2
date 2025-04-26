// app/blog/category/[slug]/page.tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getPostsByCategory, getAllCategories } from "@/lib/sanity-client";
import BlogLayout from "@/components/blog/blog-layout";
import BlogPostCard from "@/components/blog/blog-post-card";
import { Loader2 } from "lucide-react";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categories = await getAllCategories();
  const category = categories.find((cat) => cat.slug.current === params.slug);
  
  if (!category) {
    return {
      title: "Category Not Found | ClassMent Blog",
      description: "The blog category you're looking for could not be found.",
    };
  }
  
  return {
    title: `${category.title} | ClassMent Blog`,
    description: category.description || `Browse all posts in the ${category.title} category on ClassMent Blog.`,
  };
}

async function CategoryPosts({ slug }: { slug: string }) {
  const posts = await getPostsByCategory(slug);
  const categories = await getAllCategories();
  const category = categories.find((cat) => cat.slug.current === slug);
  
  if (!category) {
    notFound();
  }
  
  // Additional validation to ensure posts have valid categories
  const validPosts = posts.filter(post => {
    // If the post has no categories, it's still valid
    if (!post.categories || !Array.isArray(post.categories) || post.categories.length === 0) {
      return true;
    }
    
    // Check if the current category slug is in the post's categories
    return post.categories.some(cat => 
      typeof cat === 'string' 
        ? cat === category.title 
        : cat.slug && cat.slug.current === slug
    );
  });
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{category.title}</h1>
      {category.description && (
        <p className="text-gray-600 mb-8">{category.description}</p>
      )}
      
      {validPosts.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg text-gray-600">No posts found in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {validPosts.map((post) => (
            <BlogPostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categories = await getAllCategories();
  
  return (
    <BlogLayout categories={categories}>
      <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
        <CategoryPosts slug={params.slug} />
      </Suspense>
    </BlogLayout>
  );
}