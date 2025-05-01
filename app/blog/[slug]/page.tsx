// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { PortableText } from "@portabletext/react";
import { getPostBySlug, getAllCategories, urlFor } from "@/lib/sanity-client";
import { portableTextComponents } from "@/components/blog/portable-text-components";
import BlogLayout from "@/components/blog/blog-layout";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: "Post Not Found | ClassMent Blog",
      description: "The blog post you're looking for could not be found.",
    };
  }
  
  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt || `Read ${post.title} on ClassMent Blog`,
    openGraph: {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt || `Read ${post.title} on ClassMent Blog`,
      type: 'article',
      url: `https://classment.com/blog/${post.slug.current}`,
      images: post.mainImage ? [
        {
          url: urlFor(post.mainImage).width(1200).height(630).url(),
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : undefined,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug);
  const categories = await getAllCategories();
  
  if (!post) {
    notFound();
  }
  
  return (
    <BlogLayout categories={categories}>
      <article className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to all posts
        </Link>

        {/* Post Header */}
        <header className="mb-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories && Array.isArray(post.categories) && post.categories.map((category: any) => (
              <Link 
                key={category._id} 
                href={`/blog/category/${category.slug.current}`}
              >
                <Badge 
                  style={{ 
                    backgroundColor: category.color ? `${category.color}20` : undefined,
                    color: category.color || undefined,
                    borderColor: category.color ? `${category.color}50` : undefined
                  }}
                  className="hover:opacity-80 transition-opacity"
                >
                  {category.title}
                </Badge>
              </Link>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            {/* Author */}
            {post.author && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <Link href={`/blog/author/${post.author.slug.current}`} className="hover:text-primary">
                  {post.author.name}
                </Link>
              </div>
            )}
            
            {/* Published Date */}
            {post.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.publishedAt}>
                  {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                </time>
              </div>
            )}
            
            {/* Read Time */}
            {post.readTime && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} min read</span>
              </div>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {post.mainImage && (
          <div className="mb-8">
            <Image
              src={urlFor(post.mainImage).width(1200).url()}
              alt={post.title}
              width={1200}
              height={post.mainImage.asset.metadata?.dimensions?.height || 675}
              className="rounded-lg"
              priority
            />
          </div>
        )}

        {/* Post Content */}
        <div className="prose prose-lg max-w-none blog-content">
          <PortableText value={post.body} components={portableTextComponents} />
        </div>

        {/* Author Bio */}
        {post.author && post.author.bio && (
          <div className="mt-12 border-t pt-8">
            <div className="flex items-start gap-4">
              {post.author.image && (
                <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={urlFor(post.author.image).width(150).height(150).url()}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg">{post.author.name}</h3>
                {post.author.role && (
                  <p className="text-gray-600 text-sm mb-2">{post.author.role}</p>
                )}
                <div className="text-sm text-gray-700 prose">
                  <PortableText value={post.author.bio} components={portableTextComponents} />
                </div>
              </div>
            </div>
          </div>
        )}
      </article>
    </BlogLayout>
  );
}