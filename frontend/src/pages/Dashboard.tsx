import React from 'react'
import { isExternalHref, toolThemes } from '../data/toolThemes'

const quickLinks = toolThemes.flatMap(theme => theme.tiles.filter(tile => isExternalHref(tile.href)))

const Dashboard: React.FC = () => (
  <div className="dashboard-intro">
    <h1 className="dashboard-title">Overview</h1>
    <p className="dashboard-subtitle">
      Pick a tool from the menu on the left, or jump straight to a linked service below.
    </p>

    <div className="quick-links">
      {quickLinks.map(link => (
        <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="quick-link">
          {link.label}
        </a>
      ))}
    </div>
  </div>
)

export default Dashboard
