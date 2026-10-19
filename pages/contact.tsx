'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FeedbackDrawer } from '@/components/feedback/FeedbackDrawer';

export async function getStaticProps() {
  try {
    const { fetchDirectLineNotes } = await import('@/lib/adapters/notion');
    const notes = await fetchDirectLineNotes();
    return {
      props: { notes },
      revalidate: 3600,
    };
  } catch {
    return {
      props: { notes: [] },
      revalidate: 60,
    };
  }
}

interface ContactPageProps {
  notes: {
    id: string;
    messageTitle: string;
    messageBody: string;
    authorName: string;
    authorContact: string;
    type: 'DIRECT_LINE' | 'OPINION';
    targetId: string | null;
  }[];
}

export default function Contact({ notes }: ContactPageProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#c9d1d9] mb-4">
          Contact
        </h1>
        <p className="text-lg text-[#8b949e] max-w-2xl">
          Reach out through the Direct Line or explore the messages below.
        </p>
      </div>

      <div className="mb-8">
        <Button variant="primary" size="lg" onClick={() => setIsDrawerOpen(true)}>
          Send a Message
        </Button>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#8b949e] text-lg">
            No messages yet. Be the first to reach out!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notes.map((note) => (
            <Card key={note.id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#c9d1d9]">
                  {note.messageTitle}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded border ${
                    note.type === 'DIRECT_LINE'
                      ? 'bg-[#238636]/10 text-[#238636] border-teal-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  {note.type === 'DIRECT_LINE' ? 'Direct Line' : 'Opinion'}
                </span>
              </div>
              <p className="text-sm text-[#8b949e] leading-relaxed">
                {note.messageBody}
              </p>
              <div className="text-xs text-[#8b949e] mt-auto">
                — {note.authorName}
                {note.authorContact && (
                  <span className="text-slate-600"> ({note.authorContact})</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <FeedbackDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
