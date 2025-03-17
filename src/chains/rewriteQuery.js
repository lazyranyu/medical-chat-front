// rewriteQuery.js

import { DEFAULT_REWRITE_QUERY } from '@/const/settings';

export const chainRewriteQuery = (query, context, instruction = DEFAULT_REWRITE_QUERY) => {
  return {
    messages: [
      {
        content: `${instruction}
<chatHistory>
${context.join('\n')}
</chatHistory>
`,
        role: 'system',
      },
      {
        content: `Follow Up Input: ${query}, it's standalone query:`,
        role: 'user',
      },
    ],
  };
};
