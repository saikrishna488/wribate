import { Metadata } from 'next';
import { generateMetadata as generatePageMetadata } from '@/app/utils/metadata';
import BlogContent from './BlogContent';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      throw new Error('Backend URL not configured');
    }
    
    const baseUrl = backendUrl.endsWith('/api') ? backendUrl : backendUrl + '/api';
    const apiUrl = `${baseUrl}/blog/${id}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const blog = data.blog;

    if (!blog?.title) {
      throw new Error('Invalid blog data');
    }

    return generatePageMetadata({
      title: blog.title,
      description: blog.content ? blog.content.substring(0, 160) : undefined,
      image: blog.image,
      type: 'article',
      url: `https://wribate.com/blogs/${id}`,
      author: blog.author_name,
      publishedTime: blog.created_at,
      keywords: [
        'wribate blog',
        'article',
        blog.category || 'blog post',
        'online content',
        'knowledge sharing'
      ]
    });
    
  } catch (error) {
    console.error('Error generating metadata:', error);
    
    return generatePageMetadata({
      title: 'Blog Post',
      description: 'Read interesting blog posts on Wribate',
      type: 'article'
    });
  }
}

export default function BlogPage() {
  return <BlogContent />;
} 