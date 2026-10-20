/** @jest-environment jsdom */

import { render, screen, fireEvent } from '@testing-library/react';
import { FocusRing } from '@/components/ui/FocusRing';

describe('FocusRing', () => {
  it('renders children with focus ring classes', () => {
    render(
      <FocusRing>
        <button>Click me</button>
      </FocusRing>
    );
    const span = screen.getByRole('button').parentElement;
    expect(span).toHaveClass('focus-within:ring-2');
    expect(span).toHaveClass('focus-within:ring-[#58a6ff]');
    expect(span).toHaveClass('focus-within:ring-offset-2');
    expect(span).toHaveClass('focus-within:ring-offset-[#0d1117]');
  });

  it('accepts custom className', () => {
    render(
      <FocusRing className="custom-class">
        <button>Click me</button>
      </FocusRing>
    );
    expect(screen.getByRole('button').parentElement).toHaveClass('custom-class');
  });
});
