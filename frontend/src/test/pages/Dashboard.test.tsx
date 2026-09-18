import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Dashboard from '../../pages/Dashboard';

describe('pages/Dashboard.tsx', () => {
  it('renders an overview heading', () => {
    render(<Dashboard />);

    expect(screen.getByRole('heading', { name: 'Overview' })).toBeInTheDocument();
  });

  it('groups the main tools by theme in the requested row order', () => {
    render(<Dashboard />);

    const expectedThemes = [
      {
        testId: 'infrastructure-theme',
        title: 'Infrastructure',
        labels: ['Checkmk', 'HCP Terraform'],
      },
      {
        testId: 'smtp-theme',
        title: 'SMTP',
        labels: ['Certcheck', 'Mailing', 'SMTP Check'],
      },
      {
        testId: 'dns-theme',
        title: 'DNS',
        labels: ['Cloudflare'],
      },
      {
        testId: 'ai-agent-theme',
        title: 'AI / Agent',
        labels: ['D9bot'],
      },
      {
        testId: 'act-theme',
        title: 'ACT Chemistry',
        labels: ['Adduct', 'Compound', 'Math'],
      },
    ];

    const headings = expectedThemes.map(theme =>
      within(screen.getByTestId(theme.testId)).getByRole('heading', { name: theme.title }),
    );

    expect(headings.map(heading => heading.textContent)).toEqual(
      expectedThemes.map(theme => theme.title),
    );

    headings.slice(1).forEach((heading, index) => {
      expect(
        headings[index].compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });

    expectedThemes.forEach(theme => {
      const section = within(screen.getByTestId(theme.testId));

      theme.labels.forEach(label => {
        expect(section.getAllByText(label).length).toBeGreaterThan(0);
      });
    });
  });
});
