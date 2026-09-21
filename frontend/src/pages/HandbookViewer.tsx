import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import LatticeLoader from '../components/LatticeLoader'
import BackToTop from '../components/BackToTop'
import { authFetch } from '../auth/auth'
import { getHandbookFileKind } from '../data/handbook'
import './HandbookViewer.css'

const HandbookViewer: React.FC = () => {
  const [searchParams] = useSearchParams()
  const path = searchParams.get('path') ?? ''
  const kind = getHandbookFileKind(path)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [text, setText] = useState<string | null>(null)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const blobUrlRef = useRef<string | null>(null)

  useEffect(() => {
    if (!path) {
      setLoading(false)
      setError('No file selected.')
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)
    setText(null)

    authFetch(`/api/handbook/file?path=${encodeURIComponent(path)}`)
      .then(async response => {
        if (!response.ok) throw new Error('Failed to load file')

        if (kind === 'pdf') {
          const blob = await response.blob()
          if (cancelled) return
          if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
          const url = URL.createObjectURL(blob)
          blobUrlRef.current = url
          setBlobUrl(url)
        } else {
          const body = await response.text()
          if (cancelled) return
          setText(body)
        }
      })
      .catch(() => {
        if (!cancelled) setError('Could not load this file.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [path, kind])

  useEffect(
    () => () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
    },
    [],
  )

  return (
    <div className="handbook-viewer">
      <h1 className="handbook-viewer-title">{path || 'Handbook'}</h1>

      {loading && <LatticeLoader status="working" label="Loading" showTimer={false} />}

      {!loading && error && <p className="handbook-viewer-error">{error}</p>}

      {!loading && !error && (kind === 'markdown' || kind === 'text') && (
        <pre className="handbook-viewer-text">{text}</pre>
      )}

      {!loading && !error && kind === 'pdf' && blobUrl && (
        <embed src={blobUrl} type="application/pdf" className="handbook-viewer-pdf" />
      )}

      {!loading && !error && kind === 'unsupported' && (
        <p className="handbook-viewer-error">This file type isn't supported for preview yet.</p>
      )}

      <BackToTop />
    </div>
  )
}

export default HandbookViewer
