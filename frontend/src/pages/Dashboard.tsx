import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import BranchedMenu, { BranchedMenuChild, BranchedMenuItem } from '../components/BranchedMenu'
import { isExternalHref, toolThemes } from '../data/toolThemes'

// Menu sections/tools come from src/data/toolThemes.ts. Add a tile there to
// add a tool to an existing category, or a new theme entry for a new one.
const Dashboard: React.FC = () => {
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

  return (
    <div className="dashboard">
      <div className="dashboard-intro">
        <h1 className="dashboard-title">Overview</h1>
        <p className="dashboard-subtitle">Quick access to infrastructure, chemistry and AI tooling.</p>
      </div>
      <BranchedMenu
        items={menuItems}
        defaultOpen={menuItems.map((_, index) => index)}
        onSelect={handleSelect}
        color="#e2e8f0"
        accentColor="#38bdf8"
        lineColor="#334155"
      />
    </div>
  )
}

export default Dashboard
