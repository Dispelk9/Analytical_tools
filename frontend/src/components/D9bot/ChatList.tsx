import { useEffect, useRef } from 'react';
import LatticeLoader from '../LatticeLoader';
import { ChatMessage } from './type';
import ChatMessageBubble from './ChatMessageBubble';

export default function ChatList({ messages, isThinking }: { messages: ChatMessage[]; isThinking: boolean }) {
  const listRef = useRef<HTMLDivElement | null>(null);

  // Scroll only the conversation container. scrollIntoView() would also
  // scroll every scrollable ancestor, dragging the main window down.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTo?.({ top: list.scrollHeight, behavior: 'smooth' });
  }, [messages, isThinking]);

  return (
    <div className="d9-chat-list" ref={listRef}>
      {messages.map((m) => (
        <ChatMessageBubble key={m.id} msg={m} />
      ))}

      {isThinking && (
        <div className="d9-row d9-row-left">
          <div className="d9-bubble d9-bubble-bot">
            <LatticeLoader status="working" label="Thinking" showTimer fontSize={14} />
          </div>
        </div>
      )}
    </div>
  );
}
