// src/components/1-atoms/VotingCard/voting-card.component.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import VotingCard from './voting-card.component';
import '@testing-library/jest-dom';
// We still import the type to ensure our test is type-safe.
import { type CardValue } from '../../../hooks/useRoomState';

describe('VotingCard Component', () => {

  describe('Value Rendering', () => {
    test('should render a numeric value', () => {
      // --- FIX: Pass the value as a number, not a string ---
      const cardValue: CardValue = 8;
      render(<VotingCard value={cardValue} isSelected={false} />);
      // screen.getByText will still find it, as React renders the number as text.
      expect(screen.getByText('8')).toBeInTheDocument();
    });

    test('should render a question mark value', () => {
      const cardValue: CardValue = '?';
      render(<VotingCard value={cardValue} isSelected={false} />);
      expect(screen.getByText('?')).toBeInTheDocument();
    });

    test('should render the coffee icon for the coffee value', () => {
      const cardValue: CardValue = '☕';
      const { container } = render(<VotingCard value={cardValue} isSelected={false} />);
      expect(container.querySelector('.icon')).toBeInTheDocument();
    });
  });

  describe('Selection State', () => {
    test('should have "--selected" class when isSelected is true', () => {
      const cardValue: CardValue = 5;
      render(<VotingCard value={cardValue} isSelected={true} />);
      const cardElement = screen.getByText('5').closest('.voting-card');
      expect(cardElement).toHaveClass('voting-card--selected');
    });

    test('should not have "--selected" class when isSelected is false', () => {
      const cardValue: CardValue = 5;
      render(<VotingCard value={cardValue} isSelected={false} />);
      const cardElement = screen.getByText('5').closest('.voting-card');
      expect(cardElement).not.toHaveClass('voting-card--selected');
    });
  });

  describe('Click Functionality', () => {
    test('should call onClick with its numeric value when clicked', () => {
      const handleClick = jest.fn();
      const cardValue: CardValue = 21; // This is a number
      render(<VotingCard value={cardValue} isSelected={false} onClick={handleClick} />);

      const cardElement = screen.getByText('21').closest('.voting-card');
      fireEvent.click(cardElement!);

      expect(handleClick).toHaveBeenCalledTimes(1);
      // It correctly asserts that the handler was called with the number 21.
      expect(handleClick).toHaveBeenCalledWith(21);
    });

    test('should call onClick with its string value when clicked', () => {
      const handleClick = jest.fn();
      const cardValue: CardValue = '?'; // This is a string
      render(<VotingCard value={cardValue} isSelected={false} onClick={handleClick} />);

      const cardElement = screen.getByText('?').closest('.voting-card');
      fireEvent.click(cardElement!);

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith('?');
    });

    test('should have "--not-clickable" class when onClick is NOT provided', () => {
      const cardValue: CardValue = 34;
      render(<VotingCard value={cardValue} isSelected={false} />);
      const cardElement = screen.getByText('34').closest('.voting-card');
      expect(cardElement).toHaveClass('voting-card--not-clickable');
    });

    test('should not throw an error when clicked if onClick is not provided', () => {
      const cardValue: CardValue = 55;
      render(<VotingCard value={cardValue} isSelected={false} />);
      const cardElement = screen.getByText('55').closest('.voting-card');
      
      expect(() => fireEvent.click(cardElement!)).not.toThrow();
    });
  });
});