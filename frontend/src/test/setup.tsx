import '@testing-library/jest-dom/vitest';
import React from 'react';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

Object.defineProperty(window.HTMLElement.prototype, 'scrollTo', {
  configurable: true,
  value: vi.fn(),
});

Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
  configurable: true,
  value: vi.fn(),
});

Object.defineProperty(URL, 'createObjectURL', {
  configurable: true,
  value: vi.fn(() => 'blob:mock'),
});

const wrapChildren = (children: React.ReactNode) => (
  <>{children}</>
);

vi.mock('@porsche-design-system/components-react', () => {
  const Button = ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>;

  const Wrapper = ({
    children,
    label,
    description,
  }: {
    children?: React.ReactNode;
    label?: React.ReactNode;
    description?: React.ReactNode;
  }) => (
    <label>
      {label ? <span>{label}</span> : null}
      {description ? <small>{description}</small> : null}
      {children}
    </label>
  );

  return {
    PorscheDesignSystemProvider: ({ children }: { children?: React.ReactNode }) => wrapChildren(children),
    PLinkTile: ({
      children,
      href,
      label,
      description,
    }: {
      children?: React.ReactNode;
      href?: string;
      label?: React.ReactNode;
      description?: React.ReactNode;
    }) => (
      <a href={href}>
        {label ? <span>{label}</span> : null}
        {description ? <span>{description}</span> : null}
        {children}
      </a>
    ),
    PTag: ({ children }: { children?: React.ReactNode }) => <span>{children}</span>,
    PButton: Button,
    PSpinner: ({ aria }: { aria?: Record<string, string> }) => (
      <div role="status" aria-label={aria?.['aria-label'] ?? 'Loading'} />
    ),
    PTextFieldWrapper: Wrapper,
    PSelectWrapper: Wrapper,
    PText: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    PTable: ({ children }: { children?: React.ReactNode }) => <table>{children}</table>,
    PTableBody: ({ children }: { children?: React.ReactNode }) => <tbody>{children}</tbody>,
    PTableCell: ({ children }: { children?: React.ReactNode }) => <td>{children}</td>,
    PTableHead: ({ children }: { children?: React.ReactNode }) => <thead>{children}</thead>,
    PTableHeadCell: ({ children }: { children?: React.ReactNode }) => <th>{children}</th>,
    PTableHeadRow: ({ children }: { children?: React.ReactNode }) => <tr>{children}</tr>,
    PTableRow: ({ children }: { children?: React.ReactNode }) => <tr>{children}</tr>,
    PSwitch: ({
      children,
      checked,
      disabled,
      onUpdate,
    }: {
      children?: React.ReactNode;
      checked?: boolean;
      disabled?: boolean;
      onUpdate?: (event: CustomEvent<{ checked: boolean }>) => void;
    }) => (
      <label>
        <span>{children}</span>
        <input
          aria-label={typeof children === 'string' ? children : 'switch'}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(event) =>
            onUpdate?.({
              detail: { checked: (event.target as HTMLInputElement).checked },
            } as CustomEvent<{ checked: boolean }>)
          }
        />
      </label>
    ),
    PTextarea: ({
      label,
      description,
      ...props
    }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
      label?: React.ReactNode;
      description?: React.ReactNode;
    }) => (
      <label>
        {label ? <span>{label}</span> : null}
        {description ? <small>{description}</small> : null}
        <textarea {...props} />
      </label>
    ),
  };
});
