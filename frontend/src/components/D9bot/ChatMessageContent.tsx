import React from 'react';
import { ChatMessage } from './type';
import { splitIntoBlocks, renderRichTextBlock } from './textBlocks';

export default function ChatMessageContent({ msg }: { msg: ChatMessage }) {
  return (
    <div style={{ textAlign: 'left' }}>
      {msg.role !== 'bot' ? (
        <p style={{ margin: 0, whiteSpace: 'pre-wrap', textAlign: 'left' }}>{msg.text}</p>
      ) : (
        <>
          {splitIntoBlocks(msg.text).map((b, i) =>
            b.type === 'code' ? (
              <pre
                key={`${msg.id}-code-${i}`}
                className="code-box"
                data-lang={b.lang}
                style={{ textAlign: 'left' }}
              >
                <code>{b.content}</code>
              </pre>
            ) : (
              <React.Fragment key={`${msg.id}-text-${i}`}>
                {renderRichTextBlock(b.content, `${msg.id}-text-${i}`)}
              </React.Fragment>
            )
          )}
        </>
      )}
    </div>
  );
}
