// RenderObject.tsx
import React from 'react';

interface RenderObjectProps {
  data: any;
}

const RenderObject: React.FC<RenderObjectProps> = ({ data }) => {
  if (data === null || data === undefined) {
    return <span>{String(data)}</span>;
  }
  if (typeof data !== 'object') {
    return <span>{data.toString()}</span>;
  }
  if (Array.isArray(data)) {
    return (
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            <RenderObject data={item} />
          </li>
        ))}
      </ul>
    );
  }
  // For objects, use a description list
  return (
    <dl>
      {Object.entries(data).map(([key, value]) => (
        <React.Fragment key={key}>
          <dt>{key}</dt>
          <dd>
            <RenderObject data={value} />
          </dd>
        </React.Fragment>
      ))}
    </dl>
  );
};

export default RenderObject;
