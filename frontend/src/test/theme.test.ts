import { describe, it, expect } from 'vitest'
import css from '../index.css?raw'

const tokenNames = (block: string): string[] =>
  [...block.matchAll(/(--[\w-]+)\s*:/g)].map(match => match[1]).sort()

describe('theme tokens', () => {
  const lightStart = css.indexOf('@media (prefers-color-scheme: light)')
  const darkBlock = css.slice(css.indexOf(':root {'), lightStart)
  const lightBlock = css.slice(lightStart, css.indexOf('\n}\n', lightStart))

  it('defines a light-mode override block', () => {
    expect(lightStart).toBeGreaterThan(-1)
  })

  it('redefines every dark token for light mode', () => {
    const dark = tokenNames(darkBlock)
    expect(dark.length).toBeGreaterThan(0)
    expect(tokenNames(lightBlock)).toEqual(dark)
  })
})
