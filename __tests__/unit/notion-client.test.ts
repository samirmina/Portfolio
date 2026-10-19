import { paginateNotion } from '@/lib/notion';

describe('paginateNotion', () => {
  it('iterates through all pages until has_more is false', async () => {
    const fetchPage = jest.fn();
    fetchPage
      .mockResolvedValueOnce({
        results: [{ id: '1' }],
        has_more: true,
        next_cursor: 'cursor-1',
      })
      .mockResolvedValueOnce({
        results: [{ id: '2' }],
        has_more: false,
        next_cursor: null,
      });

    const results = await paginateNotion(fetchPage);
    expect(results).toEqual([{ id: '1' }, { id: '2' }]);
    expect(fetchPage).toHaveBeenCalledTimes(2);
    expect(fetchPage).toHaveBeenCalledWith(undefined);
    expect(fetchPage).toHaveBeenLastCalledWith('cursor-1');
  });

  it('returns empty array when no results', async () => {
    const fetchPage = jest.fn().mockResolvedValue({
      results: [],
      has_more: false,
      next_cursor: null,
    });

    const results = await paginateNotion(fetchPage);
    expect(results).toEqual([]);
  });
});
