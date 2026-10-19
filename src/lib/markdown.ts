import remarkGfm from 'remark-gfm';
import rehypeSanitize, {
  defaultSchema,
} from 'rehype-sanitize';
import ReactMarkdown from 'react-markdown';

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a ?? []), 'target', 'rel'],
    img: [...(defaultSchema.attributes?.img ?? []), 'loading', 'decoding'],
    iframe: [
      ...(defaultSchema.attributes?.iframe ?? []),
      'src',
      'width',
      'height',
      'frameborder',
      'allow',
      'allowfullscreen',
      'loading',
    ],
  },
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    'iframe',
  ],
} as const;

export const markdownOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [[rehypeSanitize, sanitizeSchema]],
} as const;

export { ReactMarkdown };
