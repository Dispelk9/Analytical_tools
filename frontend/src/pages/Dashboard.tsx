import React from 'react'
import { PLinkTile, PTag } from '@porsche-design-system/components-react'
import { toolThemes, ToolTheme, ToolTile } from '../data/toolThemes'

const ToolThemeTile: React.FC<{ tile: ToolTile }> = ({ tile }) => (
  <PLinkTile
    href={tile.href}
    label={tile.label}
    description={tile.description}
    compact={true}
  >
    <PTag slot="header" theme="dark" color="background-frosted" compact={true}>
      {tile.tags}
    </PTag>
    <img src={tile.imageSrc} alt={tile.imageAlt} />
  </PLinkTile>
)

const ToolThemeSection: React.FC<{ theme: ToolTheme }> = ({ theme }) => (
  <section
    className="tool-theme-section"
    aria-labelledby={`${theme.id}-heading`}
    data-testid={`${theme.id}-theme`}
  >
    <h2 id={`${theme.id}-heading`} className="tool-theme-title">
      {theme.title}
    </h2>
    <div className="tool-theme-grid">
      {theme.tiles.map(tile => (
        <ToolThemeTile key={`${theme.id}-${tile.href}`} tile={tile} />
      ))}
    </div>
  </section>
)

// Widgets are driven by src/data/toolThemes.ts. Add a tile there to add a
// widget to an existing category, or a new theme entry for a new category.
const Dashboard: React.FC = () => (
  <div className="dashboard">
    <div className="dashboard-intro">
      <h1 className="dashboard-title">Overview</h1>
      <p className="dashboard-subtitle">Quick access to infrastructure, chemistry and AI tooling.</p>
    </div>
    <div className="tool-theme-list">
      {toolThemes.map(theme => (
        <ToolThemeSection key={theme.id} theme={theme} />
      ))}
    </div>
  </div>
)

export default Dashboard
