import {
  filterPublished,
  extractTitle,
  extractRichText,
  extractMultiSelect,
  extractUrl,
  extractNumber,
  extractDate,
  extractCheckbox,
  extractSelect,
} from '@/lib/normalizers';

describe('filterPublished', () => {
  it('keeps only records with published === true', () => {
    const records = [
      { id: 'a', published: true },
      { id: 'b', published: false },
      { id: 'c', published: true },
    ];
    const result = filterPublished(records);
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.id)).toEqual(['a', 'c']);
  });
});

describe('extractTitle', () => {
  it('extracts plain text from title array', () => {
    expect(
      extractTitle({ title: [{ plain_text: 'Hello' }, { plain_text: ' World' }] })
    ).toBe('Hello World');
  });
  it('returns empty string for undefined', () => {
    expect(extractTitle(undefined)).toBe('');
  });
  it('returns empty string for null', () => {
    expect(extractTitle(null)).toBe('');
  });
});

describe('extractRichText', () => {
  it('extracts plain text from rich_text array', () => {
    expect(
      extractRichText({ rich_text: [{ plain_text: 'Foo' }, { plain_text: ' Bar' }] })
    ).toBe('Foo Bar');
  });
  it('returns empty string for undefined', () => {
    expect(extractRichText(undefined)).toBe('');
  });
});

describe('extractMultiSelect', () => {
  it('extracts names from multi_select', () => {
    expect(
      extractMultiSelect({
        multi_select: [{ name: 'a' }, { name: 'b' }],
      })
    ).toEqual(['a', 'b']);
  });
  it('returns empty array for undefined', () => {
    expect(extractMultiSelect(undefined)).toEqual([]);
  });
});

describe('extractUrl', () => {
  it('extracts url', () => {
    expect(extractUrl({ url: 'https://example.com' })).toBe('https://example.com');
  });
  it('returns null for missing url', () => {
    expect(extractUrl({ url: null })).toBeNull();
    expect(extractUrl(undefined)).toBeNull();
  });
});

describe('extractNumber', () => {
  it('extracts number', () => {
    expect(extractNumber({ number: 42 })).toBe(42);
  });
  it('returns 0 for null', () => {
    expect(extractNumber({ number: null })).toBe(0);
  });
  it('returns 0 for undefined', () => {
    expect(extractNumber(undefined)).toBe(0);
  });
});

describe('extractDate', () => {
  it('extracts start date', () => {
    expect(extractDate({ date: { start: '2026-01-01' } })).toBe('2026-01-01');
  });
  it('returns null for missing date', () => {
    expect(extractDate({ date: null })).toBeNull();
    expect(extractDate(undefined)).toBeNull();
  });
});

describe('extractCheckbox', () => {
  it('returns boolean', () => {
    expect(extractCheckbox({ checkbox: true })).toBe(true);
    expect(extractCheckbox({ checkbox: false })).toBe(false);
    expect(extractCheckbox(undefined)).toBe(false);
  });
});

describe('extractSelect', () => {
  it('extracts select name', () => {
    expect(extractSelect({ select: { name: 'TypeScript' } })).toBe('TypeScript');
  });
  it('returns null for missing select', () => {
    expect(extractSelect({ select: null })).toBeNull();
    expect(extractSelect(undefined)).toBeNull();
  });
});
