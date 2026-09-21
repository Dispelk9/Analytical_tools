import { authFetch } from '../auth/auth'
import type { BranchedMenuChild, BranchedMenuItem } from '../components/BranchedMenu'

export interface HandbookNode {
  name: string
  path: string
  type: 'dir' | 'file'
  children?: HandbookNode[]
}

export const fetchHandbookTree = async (): Promise<HandbookNode[]> => {
  const response = await authFetch('/api/handbook/tree')
  if (!response.ok) {
    throw new Error('Failed to load handbook tree')
  }
  return response.json()
}

// BranchedMenu only supports one level of nesting (section -> leaf), but the
// handbook can be nested arbitrarily deep, so folders beyond the top level
// are flattened into the leaf's label as a relative path.
const flattenFiles = (node: HandbookNode, relPrefix: string): BranchedMenuChild[] => {
  if (node.type === 'file') {
    return [{ value: node.path, label: relPrefix ? `${relPrefix}/${node.name}` : node.name }]
  }
  const childPrefix = relPrefix ? `${relPrefix}/${node.name}` : node.name
  return (node.children ?? []).flatMap(child => flattenFiles(child, childPrefix))
}

export const buildHandbookMenuItems = (tree: HandbookNode[]): BranchedMenuItem[] =>
  tree.map(node =>
    node.type === 'file'
      ? { label: node.name, value: node.path }
      : { label: node.name, children: (node.children ?? []).flatMap(child => flattenFiles(child, '')) },
  )

export const handbookFileHref = (path: string): string => `/handbook?path=${encodeURIComponent(path)}`

export type HandbookFileKind = 'markdown' | 'text' | 'pdf' | 'unsupported'

export const getHandbookFileKind = (path: string): HandbookFileKind => {
  const lower = path.toLowerCase()
  if (lower.endsWith('.md')) return 'markdown'
  if (lower.endsWith('.txt')) return 'text'
  if (lower.endsWith('.pdf')) return 'pdf'
  return 'unsupported'
}
