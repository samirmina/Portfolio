'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FeedbackDrawer } from '@/components/feedback/FeedbackDrawer';

export default function Contact() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#c9d1d9] mb-4">
          Contact
        </h1>
        <p className="text-lg text-[#8b949e] max-w-2xl">
          Send me a message — I&apos;d love to hear from you.
        </p>
      </div>

      <div className="mb-8">
        <Button variant="primary" size="lg" onClick={() => setIsDrawerOpen(true)}>
          Send a Message
        </Button>
      </div>

      <FeedbackDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
