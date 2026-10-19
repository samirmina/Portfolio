import { markdownOptions } from '@/lib/markdown';

describe('markdownOptions', () => {
  it('includes remark-gfm plugin', () => {
    expect(markdownOptions.remarkPlugins).toHaveLength(1);
  });

  it('includes rehype-sanitize plugin', () => {
    expect(markdownOptions.rehypePlugins).toHaveLength(1);
  });

  it('sanitize schema allows iframe', () => {
    const [, schema] = markdownOptions.rehypePlugins[0] as unknown as [
      Function,
      Record<string, unknown>
    ];
    expect(schema.tagNames).toContain('iframe');
  });
});
