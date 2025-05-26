import { Metadata } from 'next';
import { generateMetadata as generatePageMetadata } from '@/app/utils/metadata';
import WribateContent from './WribateContent';


export async function generateMetadata({ params }){
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      throw new Error('Backend URL not configured');
    }
    
    const baseUrl = backendUrl.endsWith('/api') ? backendUrl : backendUrl + '/api';
    const apiUrl = `${baseUrl}/user/getWribateById/${id}`;

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
    const wribate = data.data;

    if (!wribate?.title) {
      throw new Error('Invalid wribate data');
    }

    return generatePageMetadata({
      title: wribate.title,
      description: `Join the discussion on "${wribate.title}". Share your arguments and vote on this engaging topic.`,
      image: wribate.image,
      type: 'article',
      url: `https://wribate.com/wribate/${id}`,
      keywords: [
        'wribate discussion',
        'debate',
        wribate.category,
        'online debate',
        'critical thinking'
      ]
    });
    
  } catch (error) {
    console.error('Error generating metadata:', error);
    
    return generatePageMetadata({
      title: 'Wribate Discussion',
      description: 'Join the discussion on Wribate',
      type: 'article'
    });
  }
}

export default function WribateView() {
  return <WribateContent />;
} 