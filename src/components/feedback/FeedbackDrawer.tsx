'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { z } from 'zod';

import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';

const FEEDBACK_SESSION_KEY = 'portfolio:feedback:draft';
const DRAFT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

const feedbackSchema = z.object({
  messageTitle: z.string().min(1, 'Title is required').max(200),
  messageBody: z.string().min(1, 'Message is required').max(5000),
  authorName: z.string().min(1, 'Name is required').max(100),
  authorContact: z.string().min(1, 'Contact is required').max(200),
  type: z.enum(['DIRECT_LINE', 'OPINION']),
  targetId: z.string().optional(),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

interface FeedbackDraft {
  data: Partial<FeedbackFormData>;
  savedAt: number;
}

type FeedbackType = 'DIRECT_LINE' | 'OPINION';

export interface FeedbackDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  targetId?: string;
}

export function FeedbackDrawer({
  isOpen,
  onClose,
  targetId,
}: FeedbackDrawerProps) {
  const [form, setForm] = useState<FeedbackFormData>({
    messageTitle: '',
    messageBody: '',
    authorName: '',
    authorContact: '',
    type: 'DIRECT_LINE',
    targetId,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>(
    'idle'
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const drawerRef = useRef<HTMLDivElement>(null);

  // Load draft from session storage on mount
  useEffect(() => {
    if (!isOpen) return;
    try {
      const raw = sessionStorage.getItem(FEEDBACK_SESSION_KEY);
      if (raw) {
        const draft: FeedbackDraft = JSON.parse(raw);
        if (Date.now() - draft.savedAt < DRAFT_TTL_MS && draft.data) {
          setForm((prev) => ({ ...prev, ...draft.data, targetId }));
        }
      }
    } catch {
      // Ignore malformed drafts
    }
  }, [isOpen, targetId]);

  // Persist draft to session storage on every change
  useEffect(() => {
    if (!isOpen) return;
    const draft: FeedbackDraft = {
      data: { ...form, targetId },
      savedAt: Date.now(),
    };
    sessionStorage.setItem(FEEDBACK_SESSION_KEY, JSON.stringify(draft));
  }, [form, targetId, isOpen]);

  // Trap focus and handle Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, type: e.target.value as FeedbackType }));
    },
    []
  );

  const clearDraft = useCallback(() => {
    sessionStorage.removeItem(FEEDBACK_SESSION_KEY);
    setForm((prev) => ({
      ...prev,
      messageTitle: '',
      messageBody: '',
      authorName: '',
      authorContact: '',
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setTouched({
        messageTitle: true,
        messageBody: true,
        authorName: true,
        authorContact: true,
      });

      const parsed = feedbackSchema.safeParse({ ...form, targetId });
      if (!parsed.success) {
        return;
      }

      setSubmitting(true);
      setSubmitError(null);
      setSubmitStatus('idle');

      try {
        const response = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed.data),
        });

        if (!response.ok) {
          throw new Error(`Submission failed (${response.status})`);
        }

        setSubmitStatus('success');
        clearDraft();
      } catch (error) {
        setSubmitStatus('error');
        setSubmitError(
          error instanceof Error ? error.message : 'Submission failed'
        );
      } finally {
        setSubmitting(false);
      }
    },
    [form, targetId, clearDraft]
  );

  const getFieldError = useCallback(
    (name: string): string | null => {
      if (!touched[name]) return null;
      // Simple validation mirror for inline errors
      switch (name) {
        case 'messageTitle':
          return form.messageTitle.length < 1 ? 'Title is required' : null;
        case 'messageBody':
          return form.messageBody.length < 1 ? 'Message is required' : null;
        case 'authorName':
          return form.authorName.length < 1 ? 'Name is required' : null;
        case 'authorContact':
          return form.authorContact.length < 1 ? 'Contact is required' : null;
        default:
          return null;
      }
    },
    [form, touched]
  );

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        role="presentation"
        onClick={onClose}
      />
      <FocusTrapWrapper initialFocusRef={drawerRef}>
        <div
          ref={drawerRef}
          className="fixed inset-0 z-50 flex flex-col h-full"
          role="dialog"
          aria-modal="true"
          aria-label="Direct Line feedback"
        >
          <div className="flex-1 flex flex-col bg-[#0d1117] border-l border-[#30363d] transform translate-x-0 transition-transform duration-300">
            <div className="p-6 border-b border-[#30363d] flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Direct Line
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="focus-visible:ring-offset-[#0d1117]"
              >
                Close
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[85vh]">
              <div className="space-y-2">
                <label htmlFor="messageTitle" className="block text-sm font-medium text-[#8b949e]">
                  Message Title
                </label>
                <input
                  id="messageTitle"
                  name="messageTitle"
                  type="text"
                  value={form.messageTitle}
                  onChange={handleChange}
                  onBlur={(e) => setTouched((p) => ({ ...p, [e.target.name]: true }))}
                  className={cn(
                    'w-full px-3 py-2 rounded border text-[#c9d1d9] placeholder-[#484f58] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58a6ff] focus-visible:border-[#58a6ff] bg-[#161b22]',
                    getFieldError('messageTitle') && 'border-red-500'
                  )}
                  placeholder="e.g. Project inquiry"
                  autoComplete="off"
                />
                {getFieldError('messageTitle') && (
                  <p className="text-xs text-red-400">{getFieldError('messageTitle')}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="messageBody" className="block text-sm font-medium text-[#8b949e]">
                  Message
                </label>
                <textarea
                  id="messageBody"
                  name="messageBody"
                  rows={6}
                  value={form.messageBody}
                  onChange={handleChange}
                  onBlur={(e) => setTouched((p) => ({ ...p, [e.target.name]: true }))}
                  className={cn(
                    'w-full px-3 py-2 rounded border text-[#c9d1d9] placeholder-[#484f58] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58a6ff] focus-visible:border-[#58a6ff] bg-[#161b22]',
                    getFieldError('messageBody') && 'border-red-500'
                  )}
                  placeholder="Tell us about your project or question..."
                  autoComplete="off"
                />
                {getFieldError('messageBody') && (
                  <p className="text-xs text-red-400">{getFieldError('messageBody')}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="authorName" className="block text-sm font-medium text-[#8b949e]">
                  Your Name
                </label>
                <input
                  id="authorName"
                  name="authorName"
                  type="text"
                  value={form.authorName}
                  onChange={handleChange}
                  onBlur={(e) => setTouched((p) => ({ ...p, [e.target.name]: true }))}
                  className={cn(
                    'w-full px-3 py-2 rounded border text-[#c9d1d9] placeholder-[#484f58] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58a6ff] focus-visible:border-[#58a6ff] bg-[#161b22]',
                    getFieldError('authorName') && 'border-red-500'
                  )}
                  placeholder="e.g. Jane Doe"
                  autoComplete="name"
                />
                {getFieldError('authorName') && (
                  <p className="text-xs text-red-400">{getFieldError('authorName')}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="authorContact" className="block text-sm font-medium text-[#8b949e]">
                  Contact (email or handle)
                </label>
                <input
                  id="authorContact"
                  name="authorContact"
                  type="text"
                  value={form.authorContact}
                  onChange={handleChange}
                  onBlur={(e) => setTouched((p) => ({ ...p, [e.target.name]: true }))}
                  className={cn(
                    'w-full px-3 py-2 rounded border text-[#c9d1d9] placeholder-[#484f58] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58a6ff] focus-visible:border-[#58a6ff] bg-[#161b22]',
                    getFieldError('authorContact') && 'border-red-500'
                  )}
                  placeholder="e.g. jane@example.com"
                  autoComplete="email"
                />
                {getFieldError('authorContact') && (
                  <p className="text-xs text-red-400">{getFieldError('authorContact')}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="type" className="block text-sm font-medium text-[#8b949e]">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handleTypeChange}
                  className="w-full px-3 py-2 rounded border text-[#c9d1d9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58a6ff] focus-visible:border-[#58a6ff] bg-[#161b22]"
                >
                  <option value="DIRECT_LINE">Direct Line</option>
                  <option value="OPINION">Opinion</option>
                </select>
              </div>

              {submitError && (
                <div className="p-3 rounded bg-red-900/20 border border-red-500/30 text-red-400 text-sm">
                  {submitError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:justify-end gap-4 pt-4 border-t border-[#30363d]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearDraft}
                  disabled={submitting}
                >
                  Clear Draft
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting}
                >
                  {submitting ? 'Sending…' : 'Send Message'}
                </Button>
              </div>
            </form>

            {submitStatus === 'success' && (
              <div className="p-6 bg-[#238636]/10 border border-[#238636]/20 rounded-b-xl text-[#238636] text-center">
                <p className="font-medium">Message sent successfully.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSubmitStatus('idle');
                    onClose();
                  }}
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      </FocusTrapWrapper>
    </>
  );
}

interface FocusTrapWrapperProps {
  children: React.ReactNode;
  initialFocusRef: React.RefObject<HTMLDivElement>;
}

function FocusTrapWrapper({ children, initialFocusRef }: FocusTrapWrapperProps) {
  useEffect(() => {
    const element = initialFocusRef.current;
    if (element) {
      const focusable = element.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();
    }
    return () => {};
  }, [initialFocusRef]);

  return <>{children}</>;
}
