import { generateMetadata as generatePageMetadata } from '@/app/utils/metadata';
import Sidebar from '../components/WhyWribate/Sidebar';
import Mainsection from '../components/WhyWribate/MainSection';

export const metadata = generatePageMetadata({
  title: 'Why Wribate',
  description: 'Discover why Wribate is revolutionizing online discourse. Learn about our unique approach to written debates, critical thinking, and meaningful dialogue.',
  type: 'website',
  url: 'https://wribate.com/why-wribate',
  keywords: [
    'why wribate',
    'written debate',
    'online discourse',
    'critical thinking',
    'student development',
    'meaningful dialogue',
    'debate platform',
    'educational tool'
  ]
});

export default function WhyWribatePage() {
  return (
    <div className='flex flex-row h-[90vh] overflow-y-hidden'>
      <Sidebar/>
      <Mainsection/>
    </div>
  );
} 