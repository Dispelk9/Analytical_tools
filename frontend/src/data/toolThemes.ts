export interface ToolTile {
  href: string
  label: string
  description: string
  tags: string
  imageSrc: string
  imageAlt: string
}

export interface ToolTheme {
  id: string
  title: string
  tiles: ToolTile[]
}

// Single source of truth for the navbar dropdowns and the dashboard widgets.
// To add a new tool, add a tile here (or a new theme for a new category).
export const toolThemes: ToolTheme[] = [
  {
    id: 'infrastructure',
    title: 'Infrastructure',
    tiles: [
      {
        href: 'https://analytical.dispelk9.de/check_mk/',
        label: 'Checkmk',
        description: 'Checkmk',
        tags: '#Monitoring',
        imageSrc: './assets/checkmk.png',
        imageAlt: 'Monitoring',
      },
      {
        href: 'https://app.terraform.io/app/dispelk9_org/workspaces',
        label: 'HCP Terraform',
        description: 'Remote State TF Management',
        tags: '#HCP Terraform',
        imageSrc: './assets/HCTF.png',
        imageAlt: 'IaC',
      },
    ],
  },
  {
    id: 'smtp',
    title: 'SMTP',
    tiles: [
      {
        href: 'https://certcheck.dispelk9.de/',
        label: 'Certcheck',
        description: 'SMTP Certfetcher',
        tags: '#Go#Js#Certs',
        imageSrc: './assets/ssl.jpg',
        imageAlt: 'Certcheck',
      },
      {
        href: 'https://mail.dispelk9.de',
        label: 'Mailing',
        description: 'MX Postfix/Dovecot',
        tags: '#Docker#Mailcow',
        imageSrc: './assets/sogo.png',
        imageAlt: 'Mailing',
      },
      {
        href: '/smtpcheck',
        label: 'SMTP Check',
        description: 'SMTP/SMTPS/SMTPstarttls',
        tags: '#Port 25,465 or 587',
        imageSrc: './assets/in_dev.png',
        imageAlt: 'SMTP check',
      },
    ],
  },
  {
    id: 'dns',
    title: 'DNS',
    tiles: [
      {
        href: 'https://dash.cloudflare.com/login',
        label: 'Cloudflare',
        description: 'Routing/Analytic',
        tags: '#Cloudflare',
        imageSrc: './assets/cloudflare.jpg',
        imageAlt: 'Cloudflare',
      },
    ],
  },
  {
    id: 'ai-agent',
    title: 'AI / Agent',
    tiles: [
      {
        href: '/D9bot',
        label: 'D9bot',
        description: 'Dispelk9 Bot',
        tags: '#Gemini#LLM#AI',
        imageSrc: './assets/AI.jpg',
        imageAlt: 'D9bot',
      },
    ],
  },
  {
    id: 'act',
    title: 'ACT Chemistry',
    tiles: [
      {
        href: '/adduct',
        label: 'Adduct',
        description: 'ACT Adduct',
        tags: '#Python#React#Js',
        imageSrc: './assets/adduct.jpg',
        imageAlt: 'Adduct',
      },
      {
        href: '/compound',
        label: 'Compound',
        description: 'ACT Compound',
        tags: '#Python#React#Js',
        imageSrc: './assets/compound.png',
        imageAlt: 'Compound',
      },
      {
        href: '/math',
        label: 'Math',
        description: 'ACT Math',
        tags: '#Math#Equation',
        imageSrc: '/assets/ACT-math.jpg',
        imageAlt: 'ACT Math',
      },
    ],
  },
]

export const isExternalHref = (href: string): boolean => /^https?:\/\//.test(href)
