/** @jest-environment jsdom */

import { render, screen, fireEvent } from '@testing-library/react';
import { MediaFacade } from '@/components/media/MediaFacade';

describe('MediaFacade', () => {
  it('renders a placeholder card before interaction', () => {
    const { container } = render(
      <MediaFacade src="https://youtube.com/watch?v=abc" alt="Demo" />
    );
    expect(screen.getByRole('button', { name: 'Demo' })).toBeInTheDocument();
    expect(screen.getByText('Click to load Demo')).toBeInTheDocument();
    expect(container.querySelector('iframe')).toBeNull();
  });

  it('loads iframe on click', () => {
    const { container } = render(
      <MediaFacade src="https://youtube.com/watch?v=abc" alt="Demo" />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Demo' }));
    const iframe = container.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect((iframe as HTMLIFrameElement).src).toContain('youtube.com');
  });

  it('loads iframe on Enter key', () => {
    const { container } = render(
      <MediaFacade src="https://youtube.com/watch?v=abc" alt="Demo" />
    );
    fireEvent.keyDown(screen.getByRole('button', { name: 'Demo' }), { key: 'Enter' });
    const iframe = container.querySelector('iframe');
    expect(iframe).not.toBeNull();
  });

  it('sets aria-expanded to true after loading', () => {
    const { container } = render(
      <MediaFacade src="https://youtube.com/watch?v=abc" alt="Demo" />
    );
    const button = screen.getByRole('button', { name: 'Demo' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(container.querySelector('iframe')).not.toBeNull();
  });
});
