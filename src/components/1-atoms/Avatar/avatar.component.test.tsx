// src/components/1-atoms/Avatar/avatar.component.test.tsx
import { render, screen } from '@testing-library/react';
import Avatar from './avatar.component'; // Import the component we are testing
import '@testing-library/jest-dom'; // To use matchers like .toBeInTheDocument()

// Describe a test suite for the Avatar component
describe('Avatar Component', () => {

  // Test case 1: Basic rendering with initials
  test('should render the provided initials', () => {
    // Arrange: Define the props for this test
    const testInitials = 'AN';
    render(<Avatar initials={testInitials} />);

    // Act: Find the element with the initials
    const avatarElement = screen.getByText(testInitials);

    // Assert: Check if the element is actually on the screen
    expect(avatarElement).toBeInTheDocument();
  });

  // Test case 2: Default state (hasVoted is undefined)
  test('should not have the "has-voted" class by default', () => {
    // Arrange: Render the component without the hasVoted prop
    render(<Avatar initials="JD" />);

    // Act: Find the wrapper element. We use `getByText` to find the child,
    // then navigate up to its parent div, which is the wrapper.
    const wrapperElement = screen.getByText('JD').closest('.avatar-wrapper');

    // Assert: Check that the wrapper does NOT have the class
    expect(wrapperElement).not.toHaveClass('has-voted');
    expect(wrapperElement).toBeInTheDocument(); // Also good to check it exists
  });

  // Test case 3: hasVoted is explicitly false
  test('should not have the "has-voted" class when hasVoted is false', () => {
    // Arrange: Render with hasVoted explicitly set to false
    render(<Avatar initials="LV" hasVoted={false} />);

    // Act: Find the wrapper element
    const wrapperElement = screen.getByText('LV').closest('.avatar-wrapper');

    // Assert: Check that the wrapper does NOT have the class
    expect(wrapperElement).not.toHaveClass('has-voted');
  });

  // Test case 4: hasVoted is true
  test('should have the "has-voted" class when hasVoted is true', () => {
    // Arrange: Render with hasVoted set to true
    render(<Avatar initials="AN" hasVoted={true} />);

    // Act: Find the wrapper element
    const wrapperElement = screen.getByText('AN').closest('.avatar-wrapper');

    // Assert: Check that the wrapper DOES have the class
    expect(wrapperElement).toHaveClass('has-voted');
  });

  // Test case 5: Another example with different initials
  test('should render different initials correctly', () => {
    // Arrange
    render(<Avatar initials="XY" />);

    // Act & Assert
    expect(screen.getByText('XY')).toBeInTheDocument();
  });
});