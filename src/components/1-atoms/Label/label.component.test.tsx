// src/components/1-atoms/Label/label.component.test.tsx

import { render, screen } from '@testing-library/react';
import Label from './label.component';
import '@testing-library/jest-dom';

describe('Label Component', () => {

  // Test 1: Basic rendering of children
  test('should render its children text content', () => {
    // Arrange: Render the Label with some text
    render(<Label>Enter your name</Label>);

    // Act: Find the element by its text
    const labelElement = screen.getByText('Enter your name');

    // Assert: Check that it's in the document
    expect(labelElement).toBeInTheDocument();
  });

  // Test 2: Check for the `htmlFor` attribute (accessibility)
  test('should correctly set the htmlFor attribute', () => {
    // Arrange: Render the Label and point it to an input's ID
    const inputId = 'user-name-input';
    render(<Label htmlFor={inputId}>Username</Label>);

    // Act: Find the label by its text
    const labelElement = screen.getByText('Username');

    // Assert: Check that it has the 'for' attribute matching the input's ID
    expect(labelElement).toHaveAttribute('for', inputId);
  });

  // Test 3: Check for default and custom class names
  test('should have the "custom-label" base class', () => {
    // Arrange
    render(<Label>Default Class</Label>);

    // Act
    const labelElement = screen.getByText('Default Class');

    // Assert
    expect(labelElement).toHaveClass('custom-label');
  });

  test('should append custom classes alongside the base class', () => {
    // Arrange: Render with a custom className
    render(<Label className="my-extra-class another-class">Custom Class</Label>);

    // Act
    const labelElement = screen.getByText('Custom Class');

    // Assert: Check for the base class AND the custom ones
    expect(labelElement).toHaveClass('custom-label');
    expect(labelElement).toHaveClass('my-extra-class');
    expect(labelElement).toHaveClass('another-class');
  });

  // Test 4: Ensure it renders as a <label> element
  test('should render as a <label> HTML element', () => {
    // Arrange
    render(<Label>I am a label</Label>);

    // Act
    const labelElement = screen.getByText('I am a label');

    // Assert: Check the HTML tag name
    expect(labelElement.tagName).toBe('LABEL');
  });
});