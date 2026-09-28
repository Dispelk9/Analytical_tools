import { act, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import DecryptedText from '../../components/DecryptedText';

const visibleText = (container: HTMLElement): string =>
  container.querySelector('[aria-hidden="true"]')?.textContent ?? '';

describe('components/DecryptedText.tsx', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the plain text before any interaction', () => {
    const { container } = render(<DecryptedText text="Hello World" />);

    expect(visibleText(container)).toBe('Hello World');
    expect(container.querySelectorAll('[aria-hidden="true"] > span')).toHaveLength('Hello World'.length);
  });

  it('scrambles on hover and settles back on the original text', () => {
    const { container } = render(
      <DecryptedText text="Decrypt" speed={10} maxIterations={5} parentClassName="parent" />,
    );

    fireEvent.mouseEnter(container.querySelector('.parent')!);
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(visibleText(container)).toBe('Decrypt');
  });

  it('starts encrypted in click mode and reveals the text after a click', () => {
    const { container } = render(
      <DecryptedText
        text="Secret"
        animateOn="click"
        speed={10}
        maxIterations={3}
        characters="#"
        parentClassName="parent"
        encryptedClassName="encrypted"
      />,
    );

    expect(visibleText(container)).toBe('######');
    expect(container.querySelectorAll('.encrypted')).toHaveLength(6);

    fireEvent.click(container.querySelector('.parent')!);
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(visibleText(container)).toBe('Secret');
    expect(container.querySelectorAll('.encrypted')).toHaveLength(0);
  });
});
