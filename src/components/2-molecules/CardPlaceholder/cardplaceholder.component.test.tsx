// src/components/2-molecules/CardPlaceholder/card-placeholder.component.test.tsx

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import CardPlaceholder from './card-placeholder.component';

// A good practice is to add a data-testid to the component for easier selection.
// We'll use it to find our elements in the tests.
const testId = 'card-placeholder';
const voteIndicatorTestId = 'card-placeholder-vote-indicator';



describe('CardPlaceholder Component', () => {

  test('should render correctly when hasVoted is false', () => {
    // Arrange: Render the component with hasVoted set to false
    render(<CardPlaceholder hasVoted={false} />);

    // Act: Find the main placeholder element
    // We are assuming you've added data-testid="card-placeholder" to the main div
    const placeholderElement = screen.getByTestId(testId);

    // Assert: Check the state for hasVoted={false}
    // 1. The component should be in the document
    expect(placeholderElement).toBeInTheDocument();

    // 2. It should have the base class but not the '--voted' modifier class
    expect(placeholderElement).toHaveClass('card-placeholder');
    expect(placeholderElement).not.toHaveClass('card-placeholder--voted');

    // 3. The vote indicator child element should NOT be present
    const voteIndicator = screen.queryByTestId(voteIndicatorTestId);
    expect(voteIndicator).not.toBeInTheDocument();

  });


  test('should render the voted state when hasVoted is true', () => {
    // Arrange: Render the component with hasVoted set to true
    render(<CardPlaceholder hasVoted={true} />);

    // Act: Find the main placeholder element
    const placeholderElement = screen.getByTestId(testId);
    
    // Assert: Check the state for hasVoted={true}
    // 1. The component should still be in the document
    expect(placeholderElement).toBeInTheDocument();

    // 2. It should have both the base class AND the '--voted' modifier class
    expect(placeholderElement).toHaveClass('card-placeholder', 'card-placeholder--voted');

    // 3. The vote indicator child element SHOULD be present
    const voteIndicator = screen.getByTestId(voteIndicatorTestId);
    expect(voteIndicator).toBeInTheDocument();

    // --- Alternative if you cannot add test-ids ---
    // const { container } = render(<CardPlaceholder hasVoted={true} />);
    // const placeholderElement = container.querySelector('.card-placeholder');
    // expect(placeholderElement).toBeInTheDocument();
    // expect(placeholderElement).toHaveClass('card-placeholder--voted');
    // expect(container.querySelector('.card-placeholder__vote-indicator')).toBeInTheDocument();
  });

});