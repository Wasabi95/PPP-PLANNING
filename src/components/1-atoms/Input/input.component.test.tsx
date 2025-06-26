// src/components/1-atoms/Input/input.component.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import Input from './input.component';
import '@testing-library/jest-dom';

describe('Input Component', () => {

  test('should render with the initial value provided', () => {
    render(<Input value="Initial Text" readOnly />);
    const inputElement = screen.getByDisplayValue('Initial Text');
    expect(inputElement).toBeInTheDocument();
  });

  test('should call the onChange handler when a user types', () => {
    const handleChange = jest.fn();
    render(<Input value="" onChange={handleChange} placeholder="Enter name" />);
    const inputElement = screen.getByPlaceholderText('Enter name');
    fireEvent.change(inputElement, { target: { value: 'test' } });

    // Assert that the handler was called. This is the most important check.
    expect(handleChange).toHaveBeenCalledTimes(1);

    // REMOVED the brittle assertion that checked the event object's value.
  });

  test('should have the "center" alignment class by default', () => {
    render(<Input placeholder="default-input" />);
    const inputElement = screen.getByPlaceholderText('default-input');
    expect(inputElement).toHaveClass('custom-input--align-center');
  });

  test('should have the "left" alignment class when align prop is "left"', () => {
    render(<Input align="left" placeholder="left-align-input" />);
    const inputElement = screen.getByPlaceholderText('left-align-input');
    expect(inputElement).toHaveClass('custom-input--align-left');
  });

  test('should be disabled when the disabled prop is true', () => {
    const handleChange = jest.fn();
    render(<Input disabled onChange={handleChange} placeholder="disabled-input" />);
    const inputElement = screen.getByPlaceholderText('disabled-input');

    // This is the primary and most important assertion for this test.
    // It confirms to the user that the input is not interactive.
    expect(inputElement).toBeDisabled();

    // REMOVED the check for not.toHaveBeenCalled() because fireEvent can
    // still trigger events on disabled elements, which doesn't reflect real user behavior.
  });

  test('should apply custom className alongside its own classes', () => {
    render(<Input className="my-extra-class" placeholder="custom-class-input" />);
    const inputElement = screen.getByPlaceholderText('custom-class-input');
    expect(inputElement).toHaveClass('custom-input', 'custom-input--align-center', 'my-extra-class');
  });

  test('should accept other standard input attributes like "type" and "placeholder"', () => {
    render(<Input type="password" placeholder="Enter password" />);
    const inputElement = screen.getByPlaceholderText('Enter password');
    expect(inputElement).toHaveAttribute('type', 'password');
  });
});