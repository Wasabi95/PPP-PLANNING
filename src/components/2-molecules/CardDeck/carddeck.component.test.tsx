// src/components/2-molecules/CardDeck/carddeck.component.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import CardDeck from './card-deck.component';
import '@testing-library/jest-dom';
// Import the type to use in our tests
import { type CardValue } from '../../../hooks/useRoomState';

// Mock the VotingCard child component. This isolates the CardDeck test.
// We only care that CardDeck *renders* the VotingCards with the correct props,
// not how the VotingCard itself looks or behaves.
jest.mock('../../1-atoms/VotingCard/voting-card.component', () => {
  // This is our fake VotingCard
  return jest.fn(({ value, isSelected, onClick }) => (
    <div
      data-testid={`card-${value}`}
      data-selected={isSelected} // Use a data attribute to easily check selection
      onClick={onClick}
    >
      {value}
    </div>
  ));
});

describe('CardDeck Component', () => {
  // A mock function to pass as the onCardSelect prop in all tests
  const mockOnCardSelect = jest.fn();

  // beforeEach is a Jest hook that runs before each test in this suite.
  // This is a great place to reset mocks.
  beforeEach(() => {
    mockOnCardSelect.mockClear(); // Clear any calls from previous tests
  });

  // Test 1: Rendering
  test('should render the title and all cards from DECK_VALUES', () => {
    // Arrange
    render(<CardDeck onCardSelect={mockOnCardSelect} />);

    // Assert: Check for the title
    expect(screen.getByText(/Elige una carta/)).toBeInTheDocument();

    // Assert: Check that a card for a specific number and a special character exist
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('?')).toBeInTheDocument();
    
    // Assert: Check if all 12 cards are rendered using their test IDs
    const DECK_VALUES: CardValue[] = [0, 1, 3, 5, 8, 13, 21, 34, 55, 89, '?', '☕'];
    DECK_VALUES.forEach(value => {
      expect(screen.getByTestId(`card-${value}`)).toBeInTheDocument();
    });
  });

  // Test 2: Selection Logic
  describe('Selection Logic', () => {
    test('should mark the correct card as selected based on the selectedValue prop', () => {
      const selectedValue: CardValue = 13;
      render(<CardDeck onCardSelect={mockOnCardSelect} selectedValue={selectedValue} />);

      // Find the card for '13' and check its data-selected attribute
      const selectedCard = screen.getByTestId('card-13');
      expect(selectedCard).toHaveAttribute('data-selected', 'true');

      // Find another card and ensure it is NOT selected
      const unselectedCard = screen.getByTestId('card-8');
      expect(unselectedCard).toHaveAttribute('data-selected', 'false');
    });

    test('should have no card selected if selectedValue is not provided', () => {
      render(<CardDeck onCardSelect={mockOnCardSelect} />);
      
      const anyCard = screen.getByTestId('card-5');
      expect(anyCard).toHaveAttribute('data-selected', 'false');
    });
  });

  // Test 3: Interaction and Callbacks
  test('should call onCardSelect with the correct value when a card is clicked', () => {
    const cardToClickValue: CardValue = 5;
    render(<CardDeck onCardSelect={mockOnCardSelect} />);

    // Find the specific card we want to click using its test ID
    const cardElement = screen.getByTestId(`card-${cardToClickValue}`);

    // Act: Simulate a user click
    fireEvent.click(cardElement);

    // Assert: The callback should have been called once
    expect(mockOnCardSelect).toHaveBeenCalledTimes(1);

    // Assert: The callback should have been called with the correct value
    expect(mockOnCardSelect).toHaveBeenCalledWith(cardToClickValue);
  });

  test('should call onCardSelect with the correct special character value when clicked', () => {
    const cardToClickValue: CardValue = '?';
    render(<CardDeck onCardSelect={mockOnCardSelect} />);

    const cardElement = screen.getByTestId(`card-${cardToClickValue}`);
    fireEvent.click(cardElement);

    expect(mockOnCardSelect).toHaveBeenCalledTimes(1);
    expect(mockOnCardSelect).toHaveBeenCalledWith(cardToClickValue);
  });
});