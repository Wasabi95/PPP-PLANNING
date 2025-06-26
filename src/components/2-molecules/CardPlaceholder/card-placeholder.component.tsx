// src/components/2-molecules/CardPlaceholder/card-placeholder.component.tsx
// src/components/2-molecules/CardPlaceholder/card-placeholder.component.tsx
import React from 'react';
import './card-placeholder.component.scss';

interface CardPlaceholderProps {
  hasVoted: boolean;
}

const CardPlaceholder: React.FC<CardPlaceholderProps> = ({ hasVoted }) => {
  return (
    <div
      data-testid="card-placeholder" // <-- ADD THIS
      className={`card-placeholder ${hasVoted ? 'card-placeholder--voted' : ''}`}
    >
      {hasVoted && (
        <div
          data-testid="card-placeholder-vote-indicator" // <-- AND THIS
          className="card-placeholder__vote-indicator"
        ></div>
      )}
    </div>
  );
};

export default CardPlaceholder;

