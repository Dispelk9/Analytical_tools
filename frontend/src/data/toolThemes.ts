export interface ToolTile {
  href: string
  label: string
}

export interface ToolTheme {
  id: string
  title: string
  tiles: ToolTile[]
}

// Single source of truth for the sidebar menu and the dashboard's quick links.
// To add a new tool, add a tile here (or a new theme for a new category).
export const toolThemes: ToolTheme[] = [
  {
    id: 'infrastructure',
    title: 'Infrastructure',
    tiles: [
      { href: 'https://analytical.dispelk9.de/check_mk/', label: 'Checkmk' },
      { href: 'https://app.terraform.io/app/dispelk9_org/workspaces', label: 'HCP Terraform' },
      { href: 'https://grafana.dispelk9.de', label: 'Grafana' },
      { href: 'https://prometheus.dispelk9.de', label: 'Prometheus' },
    ],
  },
  {
    id: 'smtp',
    title: 'SMTP',
    tiles: [
      { href: 'https://certcheck.dispelk9.de/', label: 'Certcheck' },
      { href: 'https://mail.dispelk9.de', label: 'Mailing' },
      { href: '/smtpcheck', label: 'SMTP Check' },
    ],
  },
  {
    id: 'dns',
    title: 'DNS',
    tiles: [{ href: 'https://dash.cloudflare.com/login', label: 'Cloudflare' }],
  },
  {
    id: 'ai-agent',
    title: 'AI / Agent',
    tiles: [{ href: '/D9bot', label: 'D9bot' }],
  },
  {
    id: 'act',
    title: 'ACT Chemistry',
    tiles: [
      { href: '/adduct', label: 'Adduct' },
      { href: '/compound', label: 'Compound' },
      { href: '/math', label: 'Math' },
    ],
  },
]

export const isExternalHref = (href: string): boolean => /^https?:\/\//.test(href)
