"use client"
// components/blog/blog-post-card.tsx
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { urlFor } from '@/lib/sanity-client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import type { Post } from '@/types/blog';

interface BlogPostCardProps {
  post: Post;
  featured?: boolean;
}

export default function BlogPostCard({ post, featured = false }: BlogPostCardProps) {
  // Safety check for invalid post data
  if (!post || !post.slug || !post.slug.current) {
    return null; // Don't render anything if the post data is invalid
  }

  return (
    <Card className={`overflow-hidden border ${featured ? 'shadow-md hover:shadow-lg' : 'shadow-sm hover:shadow'} transition-all duration-300 h-full`}>
      <div className="relative h-48 w-full overflow-hidden">
        {post.mainImage ? (
          <Image
            src={urlFor(post.mainImage).width(600).height(350).url()}
            alt={post.title || 'Blog post'}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            priority={featured}
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        
        {featured && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-primary text-white">Featured</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-5">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-3">
          {post.categories && Array.isArray(post.categories) && post.categories.slice(0, 2).map((category, index) => {
            // Skip invalid categories
            if (!category) return null;
            
            const title = typeof category === 'string' ? category : category.title;
            if (!title) return null;
            
            return (
              <Badge key={index} variant="outline" className="bg-purple-50 text-primary border-purple-200">
                {title}
              </Badge>
            );
          })}
        </div>
        
        {/* Title */}
        <h3 className="font-bold text-xl mb-2 line-clamp-2 hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug.current}`}>{post.title || 'Untitled Post'}</Link>
        </h3>
        
        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
        )}
        
        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
          <div className="flex items-center">
            {post.author?.image && (
              <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2">
                <Image
                  src={urlFor(post.author.image).width(96).height(96).url()}
                  alt={post.author.name || 'Author'}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <span>{post.author?.name || 'Anonymous'}</span>
          </div>
          
          <div className="flex items-center gap-3">
            {post.readTime && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{post.readTime} min read</span>
              </div>
            )}
            
            {post.publishedAt && (
              <span>
                {format(new Date(post.publishedAt), 'MMM d, yyyy')}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}