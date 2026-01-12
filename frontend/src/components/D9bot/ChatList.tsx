import { useEffect, useRef } from 'react';
import { PSpinner } from '@porsche-design-system/components-react';
import { ChatMessage } from './type';
import ChatMessageBubble from './ChatMessageBubble';

export default function ChatList({ messages, isThinking }: { messages: ChatMessage[]; isThinking: boolean }) {
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length, isThinking]);

  return (
    <div className="d9-chat-list" ref={listRef}>
      {messages.map((m) => (
        <ChatMessageBubble key={m.id} msg={m} />
      ))}

      {isThinking && (
        <div className="d9-row d9-row-left">
          <div className="d9-bubble d9-bubble-bot">
            <PSpinner size="small" aria={{ 'aria-label': 'Thinking' }} />
          </div>
        </div>
      )}
    </div>
  );
}
