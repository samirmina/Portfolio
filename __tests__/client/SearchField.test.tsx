/** @jest-environment jsdom */

import { render, screen, fireEvent } from '@testing-library/react';
import { SearchField } from '@/components/ui/SearchField';

const hints = [
  { label: 'Activity Logs', text: 'Recent explorations, builds, and learning notes.' },
  { label: 'Professional Insights', text: 'Technical deep-dives and architectural decisions.' },
  { label: 'GitHub Repositories', text: 'Public repositories from GitHub.' },
];

describe('SearchField', () => {
  it('renders the input and all embedded hints', () => {
    render(<SearchField hints={hints} />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getByText('Activity Logs:')).toBeInTheDocument();
    expect(screen.getByText('Professional Insights:')).toBeInTheDocument();
    expect(screen.getByText('GitHub Repositories:')).toBeInTheDocument();
  });

  it('calls onSearch on Enter', () => {
    const onSearch = jest.fn();
    render(<SearchField hints={hints} onSearch={onSearch} />);
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'nextjs' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSearch).toHaveBeenCalledWith('nextjs');
  });

  it('calls onSearch on every change', () => {
    const onSearch = jest.fn();
    render(<SearchField hints={hints} onSearch={onSearch} />);
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'a' } });
    expect(onSearch).toHaveBeenCalledWith('a');
  });

  it('still renders the input with no hints', () => {
    render(<SearchField hints={[]} />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });
});