import { generateMetadata as generatePageMetadata } from '@/app/utils/metadata';
import ContactContent from './ContactContent';

export const metadata = generatePageMetadata({
  title: 'Contact Us',
  description: 'Get in touch with Wribate. Contact our team for support, privacy concerns, or general inquiries. Find our email addresses and office location.',
  type: 'website',
  url: 'https://wribate.com/contact',
  keywords: [
    'contact wribate',
    'wribate support',
    'contact us',
    'help',
    'customer service',
    'email',
    'office location',
    'get in touch'
  ]
});

export default function ContactPage() {
  return <ContactContent />;
} 