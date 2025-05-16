import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white text-black border-t border-gray-200">
      <div className="container mx-auto px-4">

        {/* Bottom section with copyright and legal */}
        <div className="py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-3 md:mb-0">
              © 2021-25 Wribate.com
            </div>
            <div className="flex gap-6">
              <Link href="/terms" className="text-gray-500 text-sm hover:text-blue-900 transition-colors">
                Terms of Use
              </Link>
              <Link href="/privacy-policy" className="text-gray-500 text-sm hover:text-blue-900 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/contact" className="text-gray-500 text-sm hover:text-blue-900 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}