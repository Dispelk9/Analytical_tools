// RenderObjectTable.tsx
import React from 'react';
import {
  PTable,
  PTableHead,
  PTableBody,
  PTableRow,
  PTableHeadCell,
  PTableCell,
} from '@porsche-design-system/components-react';

interface RenderObjectTableProps {
  data: any;
}

/**
 * Recursively renders JSON data as a PDE PTable.
 * - Primitives (string, number, null, etc.) are displayed as text.
 * - Arrays are rendered as multiple sub-blocks (one per item).
 * - Objects are rendered as a table with key-value rows.
 */
const RenderObjectTable: React.FC<RenderObjectTableProps> = ({ data }) => {
  // Handle null/undefined
  if (data === null || data === undefined) {
    return <span>{String(data)}</span>;
  }

  // Handle primitive (string, number, boolean, etc.)
  if (typeof data !== 'object') {
    return <span>{String(data)}</span>;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    // Render each array item as its own sub-block or sub-table
    return (
      <>
        {data.map((item, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            <RenderObjectTable data={item} />
          </div>
        ))}
      </>
    );
  }

  // Handle objects as a table with "Key" and "Value" columns
  const entries = Object.entries(data);

  return (
    <PTable theme="dark">
      <PTableHead>
        <PTableRow>
          <PTableHeadCell>Mode</PTableHeadCell>
          <PTableHeadCell>Information</PTableHeadCell>
        </PTableRow>
      </PTableHead>
      <PTableBody>
        {entries.map(([key, value]) => (
          <PTableRow key={key}>
            <PTableCell>{key}</PTableCell>
            <PTableCell>
              <RenderObjectTable data={value} />
            </PTableCell>
          </PTableRow>
        ))}
      </PTableBody>
    </PTable>
  );
};

export default RenderObjectTable;
