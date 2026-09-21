import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import LatticeLoader from '../components/LatticeLoader'
import { handbookFileHref, HandbookSearchResult, searchHandbook } from '../data/handbook'
import './HandbookSearch.css'

const HandbookSearch: React.FC = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<HandbookSearchResult[]>([])

  useEffect(() => {
    if (!query) {
      setLoading(false)
      setError('Enter a search term above.')
      setResults([])
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    searchHandbook(query)
      .then(data => {
        if (!cancelled) setResults(data)
      })
      .catch(() => {
        if (!cancelled) setError('Could not search the handbook.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [query])

  return (
    <div className="handbook-search">
      <h1 className="handbook-search-title">Handbook search: &ldquo;{query}&rdquo;</h1>

      {loading && <LatticeLoader status="working" label="Searching" showTimer={false} />}

      {!loading && error && <p className="handbook-search-error">{error}</p>}

      {!loading && !error && results.length === 0 && (
        <p className="handbook-search-empty">No matches found.</p>
      )}

      {!loading && !error && results.length > 0 && (
        <ul className="handbook-search-results">
          {results.map(result => (
            <li key={`${result.path}-${result.line}`}>
              <Link to={handbookFileHref(result.path)} className="handbook-search-result">
                <span className="handbook-search-result-path">{result.path}</span>
                <span className="handbook-search-result-line">line {result.line}</span>
                <span className="handbook-search-result-snippet">{result.snippet}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default HandbookSearch
