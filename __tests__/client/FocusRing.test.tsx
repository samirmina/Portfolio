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
    expect(span).toHaveClass('focus-within:ring-teal-400');
    expect(span).toHaveClass('focus-within:ring-offset-2');
    expect(span).toHaveClass('focus-within:ring-offset-slate-950');
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
