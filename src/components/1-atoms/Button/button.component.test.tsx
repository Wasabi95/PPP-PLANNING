// src/components/1-atoms/Button/button.component.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import Button from './button.component';
import '@testing-library/jest-dom';

// No import is needed for `jest`. It is a global provided by the Jest environment.

describe('Button Component with Jest', () => {

  // Test 1: Basic rendering
  test('should render children correctly', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
  });

  // Test 2: onClick functionality
  test('should call the onClick handler when clicked', () => {
    // --- THIS IS THE FIX ---
    // Use `jest.fn()` which is globally available in Jest tests.
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Submit</Button>);

    const buttonElement = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(buttonElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test 3: Variant classes
  describe('variant classes', () => {
    test.each([
      { variant: 'primary', expectedClass: 'custom-button--primary' },
      { variant: 'secondary', expectedClass: 'custom-button--secondary' },
      { variant: 'tertiary', expectedClass: 'custom-button--tertiary' },
      { variant: 'cta', expectedClass: 'custom-button--cta' },
    ])('should have the correct class for variant "$variant"', ({ variant, expectedClass }) => {
      render(<Button variant={variant as 'primary' | 'secondary' | 'tertiary' | 'cta'}>Variant Test</Button>);
      
      const buttonElement = screen.getByRole('button', { name: /variant test/i });
      expect(buttonElement).toHaveClass(expectedClass);
    });
  });

  // Test 4: Default variant
  test('should have the "primary" variant class by default when no variant is provided', () => {
    render(<Button>Default Variant</Button>);
    const buttonElement = screen.getByRole('button', { name: /default variant/i });
    expect(buttonElement).toHaveClass('custom-button--primary');
  });

  // Test 5: Disabled state
  test('should be disabled when the disabled prop is true', () => {
    // --- THIS IS THE FIX ---
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Disabled Button</Button>);

    const buttonElement = screen.getByRole('button', { name: /disabled button/i });
    expect(buttonElement).toBeDisabled();

    fireEvent.click(buttonElement);
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Test 6: Custom className
  test('should apply custom className alongside variant classes', () => {
    render(<Button variant="cta" className="my-custom-class">Custom Class</Button>);

    const buttonElement = screen.getByRole('button', { name: /custom class/i });
    expect(buttonElement).toHaveClass('custom-button', 'custom-button--cta', 'my-custom-class');
  });
});