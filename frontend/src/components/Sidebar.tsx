import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BranchedMenu, { BranchedMenuChild, BranchedMenuItem } from './BranchedMenu'
import { isExternalHref, toolThemes } from '../data/toolThemes'
import { buildHandbookMenuItems, fetchHandbookTree, handbookFileHref, HandbookNode } from '../data/handbook'
import './Sidebar.css'

// Menu sections/tools come from src/data/toolThemes.ts. Add a tile there to
// add a tool to an existing category, or a new theme entry for a new one.
//
// This sits next to <Routes> in AppLayout (not inside one of its routes), so
// it stays mounted and keeps its open/active state while the right-hand
// content switches between tools.
const Sidebar: React.FC = () => {
  const navigate = useNavigate()

  const menuItems: BranchedMenuItem[] = useMemo(
    () =>
      toolThemes.map(theme => ({
        label: theme.title,
        children: theme.tiles.map(tile => ({
          value: tile.href,
          label: tile.label,
        })),
      })),
    [],
  )

  const handleSelect = (value: string, _item: BranchedMenuChild | BranchedMenuItem) => {
    if (isExternalHref(value)) {
      window.open(value, '_blank', 'noopener,noreferrer')
      return
    }
    navigate(value)
  }

  const [handbookTree, setHandbookTree] = useState<HandbookNode[] | null>(null)
  const [handbookError, setHandbookError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchHandbookTree()
      .then(tree => {
        if (!cancelled) setHandbookTree(tree)
      })
      .catch(() => {
        if (!cancelled) setHandbookError('Could not load handbook')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handbookMenuItems = useMemo(
    () => (handbookTree ? buildHandbookMenuItems(handbookTree) : []),
    [handbookTree],
  )

  const handleHandbookSelect = (value: string) => {
    navigate(handbookFileHref(value))
  }

  return (
    <aside className="app-sidebar" aria-label="Tool navigation">
      <BranchedMenu
        items={menuItems}
        defaultOpen={-1}
        onSelect={handleSelect}
        color="#e2e8f0"
        accentColor="#38bdf8"
        lineColor="#334155"
        width={220}
      />

      <div className="app-sidebar-section">
        <h2 className="app-sidebar-heading">Handbook</h2>
        {handbookError && <p className="app-sidebar-note">{handbookError}</p>}
        {!handbookError && handbookTree && handbookMenuItems.length === 0 && (
          <p className="app-sidebar-note">No handbook files found.</p>
        )}
        {!handbookError && handbookMenuItems.length > 0 && (
          <BranchedMenu
            items={handbookMenuItems}
            defaultOpen={-1}
            onSelect={handleHandbookSelect}
            color="#e2e8f0"
            accentColor="#a78bfa"
            lineColor="#334155"
            width={220}
          />
        )}
      </div>
    </aside>
  )
}

export default Sidebar
