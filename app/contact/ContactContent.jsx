'use client';

import { Mail, Globe, MapPin } from "lucide-react";

export default function ContactContent() {
  return (
    <div className="min-h-screen">
      <div className="border-2 border-blue-900 rounded-none shadow-lg max-w-4xl mx-auto bg-white">
        {/* Header */}
        <div className="bg-blue-900 text-white p-4">
          <h2 className="text-xl font-bold">Contact Information</h2>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Email Section */}
            <div className="space-y-4 border-b md:border-b-0 md:border-r border-blue-900 pb-6 md:pb-0 md:pr-6">
              <h3 className="text-blue-900 font-bold text-lg pb-2">Email</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-blue-900 flex-shrink-0" size={24} />
                  <div>
                    <p className="font-semibold">Data Privacy</p>
                    <p className="text-gray-600">dataprivacy@wribate.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-blue-900 flex-shrink-0" size={24} />
                  <div>
                    <p className="font-semibold">Support</p>
                    <p className="text-gray-600">support@wribate.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-blue-900 flex-shrink-0" size={24} />
                  <div>
                    <p className="font-semibold">General Information</p>
                    <p className="text-gray-600">info@wribate.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Website Section */}
            <div className="space-y-4 border-b md:border-b-0 md:border-r border-blue-900 pb-6 md:pb-0 md:pr-6">
              <h3 className="text-blue-900 font-bold text-lg pb-2">Website</h3>
              <div className="flex items-center gap-3">
                <Globe className="text-blue-900 flex-shrink-0" size={24} />
                <div>
                  <p className="font-semibold">Website</p>
                  <p className="text-gray-600">www.wribate.com</p>
                </div>
              </div>
            </div>
            
            {/* Address Section */}
            <div className="space-y-4">
              <h3 className="text-blue-900 font-bold text-lg pb-2">Address</h3>
              <div className="flex items-start gap-3">
                <MapPin className="text-blue-900 flex-shrink-0 mt-1" size={24} />
                <div>
                  <p className="font-semibold">Corporate Address</p>
                  <p className="text-gray-600">C/o INNORIZE ENTERPRISES PRIVATE LIMITED</p>
                  <p className="text-gray-600">D.No.17-1-389/18-B, 4th Floor,</p>
                  <p className="text-gray-600">Prashanth Nagar Colony,</p>
                  <p className="text-gray-600">Saidabad, Hyderabad,</p>
                  <p className="text-gray-600">Telangana, India-500059</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 