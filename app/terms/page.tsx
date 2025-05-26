import { Metadata } from 'next';
import { generateMetadata as generatePageMetadata } from '@/app/utils/metadata';
import TermsContent from './TermsContent';

export const metadata: Metadata = generatePageMetadata({
  title: 'Terms and Conditions',
  description: 'Read our Terms & Conditions to understand the rules, guidelines, and policies that govern the use of Wribate platform.',
  type: 'website',
  url: 'https://wribate.com/terms',
  keywords: [
    'terms and conditions',
    'wribate terms',
    'user agreement',
    'legal',
    'privacy',
    'rules',
    'guidelines',
    'policies'
  ]
});

export default function TermsPage() {
  return <TermsContent />;
} 