'use client';

import { FeedbackDrawer } from '@/components/feedback/FeedbackDrawer';
import { useState } from 'react';

export default function FeedbackPage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
        Direct Line
      </h1>
      <p className="text-lg text-[#8b949e] mb-8 max-w-lg text-center">
        Send us a message. Your draft is saved automatically in this session.
      </p>
      <FeedbackDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
