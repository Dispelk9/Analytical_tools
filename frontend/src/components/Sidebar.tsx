import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BranchedMenu, { BranchedMenuChild, BranchedMenuItem } from './BranchedMenu'
import { isExternalHref, toolThemes } from '../data/toolThemes'
import { buildHandbookMenuItems, fetchHandbookTree, handbookFileHref, HandbookNode } from '../data/handbook'
import './Sidebar.css'

const MIN_SIDEBAR_WIDTH = 200
const MAX_SIDEBAR_WIDTH = 520
const DEFAULT_SIDEBAR_WIDTH = 260
const SIDEBAR_WIDTH_STORAGE_KEY = 'sidebar-width'

const clampSidebarWidth = (width: number): number =>
  Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, width))

const readStoredSidebarWidth = (): number => {
  try {
    const stored = Number(localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY))
    return Number.isFinite(stored) && stored > 0 ? clampSidebarWidth(stored) : DEFAULT_SIDEBAR_WIDTH
  } catch {
    return DEFAULT_SIDEBAR_WIDTH
  }
}

// Menu sections/tools come from src/data/toolThemes.ts. Add a tile there to
// add a tool to an existing category, or a new theme entry for a new one.
//
// This sits next to <Routes> in AppLayout (not inside one of its routes), so
// it stays mounted and keeps its open/active state while the right-hand
// content switches between tools.
const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const asideRef = useRef<HTMLElement>(null)
  const [width, setWidth] = useState<number>(readStoredSidebarWidth)
  const [isResizing, setIsResizing] = useState(false)

  const handleResizerMouseDown = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    setIsResizing(true)
  }, [])

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (event: MouseEvent) => {
      const asideEl = asideRef.current
      if (!asideEl) return
      const { left } = asideEl.getBoundingClientRect()
      setWidth(clampSidebarWidth(event.clientX - left))
    }
    const stopResizing = () => setIsResizing(false)

    document.body.classList.add('sidebar-resizing')
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', stopResizing)
    return () => {
      document.body.classList.remove('sidebar-resizing')
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', stopResizing)
    }
  }, [isResizing])

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, String(width))
    } catch {
      // ignore storage failures (e.g. private browsing)
    }
  }, [width])

  // Inner menus need a little less width than the sidebar itself to account
  // for the aside's own padding, so long handbook paths get room to truncate
  // with an ellipsis instead of overflowing the sidebar.
  const menuWidth = Math.max(160, width - 40)

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
    <aside
      ref={asideRef}
      className="app-sidebar"
      aria-label="Tool navigation"
      style={{ width }}
      data-resizing={isResizing ? '' : undefined}
    >
      <BranchedMenu
        items={menuItems}
        defaultOpen={-1}
        onSelect={handleSelect}
        color="#e2e8f0"
        accentColor="#38bdf8"
        lineColor="#334155"
        width={menuWidth}
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
            width={menuWidth}
          />
        )}
      </div>

      <div
        className="app-sidebar-resizer"
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize sidebar"
        onMouseDown={handleResizerMouseDown}
      />
    </aside>
  )
}

export default Sidebar
