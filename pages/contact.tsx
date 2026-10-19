'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FeedbackDrawer } from '@/components/feedback/FeedbackDrawer';

export default function Contact() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white mb-8">
          Contact
        </h1>
        <p className="text-lg text-slate-300 leading-relaxed mb-12">
          Have a project in mind, want to discuss architecture, or just want to
          say hello? Use the Direct Line below to send a message.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <h3 className="text-lg font-semibold text-white mb-2">Direct Line</h3>
            <p className="text-sm text-slate-400 mb-4">
              Send a message directly through the secure feedback channel.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsDrawerOpen(true)}
            >
              Open Direct Line
            </Button>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-white mb-2">GitHub</h3>
            <p className="text-sm text-slate-400 mb-4">
              Check out my open-source projects and contributions.
            </p>
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://github.com/samirmina"
                target="_blank"
                rel="noopener noreferrer"
              >
                View GitHub
              </a>
            </Button>
          </Card>
        </div>

        <FeedbackDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      </section>
    </>
  );
}
