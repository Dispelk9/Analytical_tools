import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ChatList from '../../components/D9bot/ChatList';
import { ChatMessage } from '../../components/D9bot/type';

const message = (id: string, text: string): ChatMessage => ({ id, role: 'bot', text, createdAt: 0 });

describe('components/D9bot/ChatList.tsx', () => {
  const scrollTo = vi.fn();
  const scrollIntoView = vi.fn();

  beforeEach(() => {
    scrollTo.mockClear();
    scrollIntoView.mockClear();
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', { configurable: true, value: scrollTo });
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: scrollIntoView });
  });

  afterEach(() => {
    delete (HTMLElement.prototype as Partial<HTMLElement>).scrollTo;
    delete (HTMLElement.prototype as Partial<HTMLElement>).scrollIntoView;
  });

  it('scrolls the conversation container, never the page, when a new answer arrives', () => {
    const { container, rerender } = render(<ChatList messages={[message('1', 'Hi')]} isThinking={false} />);
    scrollTo.mockClear();

    rerender(<ChatList messages={[message('1', 'Hi'), message('2', 'Answer')]} isThinking={false} />);

    const list = container.querySelector('.d9-chat-list');
    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(scrollTo.mock.contexts[0]).toBe(list);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('does not scroll the page when the tab is opened', () => {
    render(<ChatList messages={[message('1', 'Hi')]} isThinking={false} />);

    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
