// // src/components/1-atoms/VotingCard/voting-card.component.tsx
import React from 'react';
import { type CardValue } from '../../../hooks/useRoomState';
import './voting-card.component.scss';

// --- FIX 1: Make 'onClick' optional and specify it passes the value back up ---
interface VotingCardProps {
  value: CardValue;
  isSelected: boolean;
  onClick?: (value: CardValue) => void;
  
}

// Simple SVG icons as React components
const CoffeeIcon = () => (
  <svg
    className="icon"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18 8h1a3 3 0 010 6h-1v1a4 4 0 01-4 4H8a4 4 0 01-4-4V8h14zm1 4a1 1 0 100-2h-1v2h1zM6 19h12a1 1 0 010 2H6a1 1 0 110-2zM10 3h1v3h-1V3zm3 0h1v3h-1V3zM7 3h1v3H7V3z" />
  </svg>
);


const InfinityIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    {/* SVG path data */}
  </svg>
);

const VotingCard: React.FC<VotingCardProps> = ({
  value,
  isSelected,
  onClick,
}) => {
  // --- FIX 2: Add a class when the card is not clickable for styling ---
  const cardClassName = `
    voting-card
    ${isSelected ? 'voting-card--selected' : ''}
    ${!onClick ? 'voting-card--not-clickable' : ''}
  `.trim();

  const renderValue = () => {
    if (value === '☕') return <CoffeeIcon />;
    if (value === '∞') return <InfinityIcon />;
    return value;
  };

  // --- FIX 3: Safely call onClick only if it exists ---
  const handleClick = () => {
    if (onClick) {
      onClick(value);
    }
  };

  // --- FIX 4: Use a 'div' for better semantics, as it's not always a button ---
  return (
    <div className={cardClassName} onClick={handleClick}>
      <span className="voting-card__value">{renderValue()}</span>
    </div>
  );
};

export default VotingCard;