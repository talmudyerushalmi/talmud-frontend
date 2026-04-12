import React from 'react';
import { Tooltip, Typography } from '@mui/material';
import { RabbiMention, ALL_RABBIES } from '../../services/tagging.service';

interface Props {
  text: string;
  rabbiMentions: RabbiMention[];
  highlightedRabbiIds: string[];
}

const TaggedTextView: React.FC<Props> = ({ text, rabbiMentions, highlightedRabbiIds }) => {
  if (!rabbiMentions || rabbiMentions.length === 0) {
    return (
      <div style={{ width: '100%', textAlign: 'right', lineHeight: 1.8 }}>
        {text}
      </div>
    );
  }

  const sorted = [...rabbiMentions].sort((a, b) => a.startIndex - b.startIndex);
  const parts: React.ReactNode[] = [];
  let cursor = 0;

  for (const mention of sorted) {
    if (mention.startIndex > cursor) {
      parts.push(
        <span key={`t-${cursor}`}>{text.slice(cursor, mention.startIndex)}</span>
      );
    }

    const rabbiData = ALL_RABBIES.find(r => r.id === mention.rabbiId);
    const isHighlighted = highlightedRabbiIds.includes(mention.rabbiId);
    const genStr = rabbiData?.generation || '';
    const isBavel = rabbiData?.location === 'בבל';

    const tooltipText = [
      mention.rabbiName,
      mention.doubt ? '(מסופק)' : '',
      rabbiData?.generation ? `דור ${rabbiData.generation}` : '',
      rabbiData?.location || '',
    ].filter(Boolean).join(' · ');

    parts.push(
      <Tooltip key={`m-${mention.startIndex}`} title={tooltipText} arrow>
        <span
          style={{
            backgroundColor: isHighlighted ? '#fff176' : '#e1bee7',
            borderRadius: '3px',
            padding: '1px 2px',
            fontWeight: 'bold',
            transition: 'background-color 0.2s',
          }}>
          {text.slice(mention.startIndex, mention.endIndex)}
          {genStr && (
            <sup style={{ fontSize: '0.6em', marginRight: '1px', color: '#616161' }}>
              {genStr}{isBavel ? 'ב' : ''}
            </sup>
          )}
        </span>
      </Tooltip>
    );
    cursor = mention.endIndex;
  }

  if (cursor < text.length) {
    parts.push(<span key="t-end">{text.slice(cursor)}</span>);
  }

  return (
    <div style={{ width: '100%', textAlign: 'right', lineHeight: 1.8 }}>
      {parts}
    </div>
  );
};

export default React.memo(TaggedTextView);
