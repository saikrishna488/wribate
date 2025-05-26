import { generateMetadata as generatePageMetadata } from '@/app/utils/metadata';
import PrivacyPolicyContent from './PrivacyPolicyContent';

export const metadata = generatePageMetadata({
  title: 'Privacy Policy',
  description: 'Learn about how Wribate collects, uses, and protects your personal information. Our privacy policy outlines our commitment to data protection and transparency.',
  type: 'website',
  url: 'https://wribate.com/privacy-policy',
  keywords: [
    'privacy policy',
    'data protection',
    'wribate privacy',
    'user data',
    'personal information',
    'data security',
    'GDPR',
    'CCPA'
  ]
});

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContent />;
} 