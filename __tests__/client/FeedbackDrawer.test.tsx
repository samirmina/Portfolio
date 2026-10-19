/** @jest-environment jsdom */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FeedbackDrawer } from '@/components/feedback/FeedbackDrawer';

jest.mock('@/lib/notion', () => ({
  notion: {
    pages: {
      create: jest.fn().mockResolvedValue({ id: 'new-page' }),
    },
  },
}));

const postMock = jest.fn();

global.fetch = jest.fn(() =>
  Promise.resolve({ ok: true, status: 200 })
) as jest.Mock;

describe('FeedbackDrawer', () => {
  beforeEach(() => {
    sessionStorage.clear();
    (fetch as jest.Mock).mockClear();
    postMock.mockClear();
  });

  it('renders closed by default', () => {
    const { queryByRole } = render(<FeedbackDrawer isOpen={false} onClose={jest.fn()} />);
    expect(queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders form when open', () => {
    render(<FeedbackDrawer isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByRole('dialog', { name: 'Direct Line feedback' })).toBeInTheDocument();
    expect(screen.getByLabelText('Message Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByLabelText('Your Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Contact (email or handle)')).toBeInTheDocument();
  });

  it('shows validation errors on submit with empty fields', async () => {
    render(<FeedbackDrawer isOpen={true} onClose={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));
    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Message is required')).toBeInTheDocument();
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Contact is required')).toBeInTheDocument();
  });

  it('submits successfully and shows success message', async () => {
    render(<FeedbackDrawer isOpen={true} onClose={jest.fn()} />);
    fireEvent.change(screen.getByLabelText('Message Title'), { target: { value: 'Hello' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'World' } });
    fireEvent.change(screen.getByLabelText('Your Name'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText('Contact (email or handle)'), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));
    await waitFor(() => {
      expect(screen.getByText('Message sent successfully.')).toBeInTheDocument();
    });
    expect(fetch).toHaveBeenCalledWith('/api/feedback', expect.any(Object));
  });

  it('persists draft to sessionStorage', () => {
    render(<FeedbackDrawer isOpen={true} onClose={jest.fn()} />);
    fireEvent.change(screen.getByLabelText('Message Title'), { target: { value: 'Draft' } });
    const stored = sessionStorage.getItem('portfolio:feedback:draft');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.data.messageTitle).toBe('Draft');
  });
});
