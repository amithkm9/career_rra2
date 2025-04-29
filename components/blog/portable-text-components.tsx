"use client"
// components/blog/portable-text-components.tsx
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity-client';
import { Code } from 'lucide-react';

// Type for portable text block components
type PortableTextComponentProps = {
  value: any;
};

// Custom components for rendering rich text content from Sanity
export const portableTextComponents = {
  types: {
    image: ({ value }: PortableTextComponentProps) => {
      if (!value?.asset?._ref) {
        return null;
      }

      return (
        <div className="my-8 relative">
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt || 'Blog image'}
            width={800}
            height={value.asset.metadata?.dimensions?.height || 600}
            className="rounded-lg mx-auto"
          />
          {value.caption && (
            <div className="text-sm text-muted-foreground text-center mt-2">{value.caption}</div>
          )}
        </div>
      );
    },
    code: ({ value }: PortableTextComponentProps) => {
      if (!value?.code) {
        return null;
      }

      return (
        <div className="my-6 rounded-lg overflow-hidden bg-gray-900 text-gray-100">
          {value.filename && (
            <div className="px-4 py-2 bg-gray-800 text-sm flex items-center border-b border-gray-700">
              <Code className="h-4 w-4 mr-2" />
              <span className="font-mono">{value.filename}</span>
            </div>
          )}
          <pre className="p-4 overflow-x-auto">
            <code className={`language-${value.language || 'javascript'}`}>{value.code}</code>
          </pre>
        </div>
      );
    },
  },
  marks: {
    link: ({ value, children }: any) => {
      const target = (value?.blank === true) ? '_blank' : undefined;
      const rel = target === '_blank' ? 'noreferrer noopener' : undefined;
      
      return (
        <Link 
          href={value?.href || '#'} 
          target={target} 
          rel={rel}
          className="text-primary underline decoration-primary/30 hover:decoration-primary"
        >
          {children}
        </Link>
      );
    },
    code: ({ children }: any) => {
      return (
        <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded font-mono text-sm">
          {children}
        </code>
      );
    },
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-lg font-semibold mt-6 mb-2">{children}</h4>
    ),
    normal: ({ children }: any) => (
      <p className="my-4 leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary/50 pl-4 my-6 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc pl-6 my-4 space-y-2">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal pl-6 my-4 space-y-2">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => <li>{children}</li>,
    number: ({ children }: any) => <li>{children}</li>,
  },
};