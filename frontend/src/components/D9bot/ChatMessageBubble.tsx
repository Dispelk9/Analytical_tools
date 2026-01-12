import { ChatMessage } from './type';
import ChatMessageContent from './ChatMessageContent';

export default function ChatMessageBubble({ msg }: { msg: ChatMessage }) {
  const rowClass = msg.role === 'user' ? 'd9-row-right' : 'd9-row-left';
  const bubbleClass =
    msg.role === 'user' ? 'd9-bubble-user' : msg.role === 'system' ? 'd9-bubble-system' : 'd9-bubble-bot';

  return (
    <div className={`d9-row ${rowClass}`}>
      <div className={`d9-bubble ${bubbleClass}`}>
        <ChatMessageContent msg={msg} />
      </div>
    </div>
  );
}
