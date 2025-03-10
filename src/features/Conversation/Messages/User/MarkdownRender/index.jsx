import { Flexbox } from 'react-layout-kit';

import ContentPreview from './ContentPreview';

export const MarkdownRender = ({ text, dom, id, displayMode }) => {
  if (text.length > 30_000)
    return (
      <Flexbox>
        <ContentPreview content={text} displayMode={displayMode} id={id} />
      </Flexbox>
    );

  return dom;
}; 