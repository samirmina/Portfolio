'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FeedbackDrawer } from '@/components/feedback/FeedbackDrawer';
import { Icon } from '@/components/ui/Icon';

export default function Contact() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
      <div className="mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#c9d1d9] mb-4">
          Contact
        </h1>
        <p className="text-lg text-[#8b949e] max-w-2xl">
          Send me a message — I&apos;d love to hear from you.
        </p>
      </div>

      <div className="mb-8">
        <Button variant="primary" size="lg" onClick={() => setIsDrawerOpen(true)}>
          <span className="flex items-center gap-1">
            <Icon name="mail" className="w-4 h-4" />
            Send a Message
          </span>
        </Button>
      </div>

      <FeedbackDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
