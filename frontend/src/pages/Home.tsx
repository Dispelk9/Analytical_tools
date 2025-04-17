// export default function Home() {
//   return (
//     <div>
//       <h2 className="text-2xl">Welcome to my Playground</h2>
//       <p className="mt-4">
//         This page demonstrates various DevOps skills and small demos showcasing
//         Docker, CI/CD, container orchestration, and more.
//       </p>
//     </div>
//   );
// }


import React, { ReactNode, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from '../login/Login'
import App from '../App'

interface RequireAuthProps {
  children: ReactNode
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [authed, setAuthed] = useState<boolean>(false)

  useEffect(() => {
    fetch('/api/check-auth', { credentials: 'include' })
      .then(res => {
        setAuthed(res.ok)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>
  return authed ? <>{children}</> : <Navigate to="/login" />
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <App />
          </RequireAuth>
        }
      />
    </Routes>
  </BrowserRouter>
)
