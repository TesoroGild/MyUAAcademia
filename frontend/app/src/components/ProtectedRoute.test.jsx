import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

// Helper pour render avec routing
const renderWithRouter = (ui, { initialEntries = ['/protected'] } = {}) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/protected" element={ui} />
        <Route path="/" element={<div>Page Accueil</div>} />
        <Route path="/forbidden" element={<div>Page Forbidden</div>} />
      </Routes>
    </MemoryRouter>
  )
}

// Reset localStorage entre chaque test
afterEach(() => {
  localStorage.clear()
})

// ─────────────────────────────────────────────
describe('ProtectedRoute — Utilisateur non connecté', () => {

  it('Redirects to / if no user is stored in localStorage', () => {
    renderWithRouter(
      <ProtectedRoute allowedRoles={['student']}>
        <div>Contenu protégé</div>
      </ProtectedRoute>
    )
    expect(screen.getByText('Page Accueil')).toBeInTheDocument()
    expect(screen.queryByText('Contenu protégé')).not.toBeInTheDocument()
  })

  it('Redirects to a custom redirectPath if provided', () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute allowedRoles={['student']} redirectPath="/custom">
                <div>Contenu protégé</div>
              </ProtectedRoute>
            }
          />
          <Route path="/custom" element={<div>Page Custom</div>} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('Page Custom')).toBeInTheDocument()
  })

})

// ─────────────────────────────────────────────
describe('ProtectedRoute — Utilisateur connecté mauvais rôle', () => {

  it('Redirects to /forbidden if the role does not match', () => {
    localStorage.setItem('user', JSON.stringify({ userRole: 'student' }))

    renderWithRouter(
      <ProtectedRoute allowedRoles={['admin']}>
        <div>Contenu protégé</div>
      </ProtectedRoute>
    )
    expect(screen.getByText('Page Forbidden')).toBeInTheDocument()
    expect(screen.queryByText('Contenu protégé')).not.toBeInTheDocument()
  })

})

// ─────────────────────────────────────────────
describe('ProtectedRoute — Utilisateur connecté bon rôle', () => {

  it('Displays “children” if the role is authorized', () => {
    localStorage.setItem('user', JSON.stringify({ userRole: 'student' }))

    renderWithRouter(
      <ProtectedRoute allowedRoles={['student']}>
        <div>Contenu protégé</div>
      </ProtectedRoute>
    )
    expect(screen.getByText('Contenu protégé')).toBeInTheDocument()
  })

  it('Supports multiple authorized roles', () => {
    localStorage.setItem('user', JSON.stringify({ userRole: 'admin' }))

    renderWithRouter(
      <ProtectedRoute allowedRoles={['student', 'admin', 'professor']}>
        <div>Contenu protégé</div>
      </ProtectedRoute>
    )
    expect(screen.getByText('Contenu protégé')).toBeInTheDocument()
  })

  it('Returns Outlet if no children are provided', () => {
    localStorage.setItem('user', JSON.stringify({ userRole: 'student' }))

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            element={
              <ProtectedRoute allowedRoles={['student']} />
            }
          >
            <Route path="/protected" element={<div>Rendu via Outlet</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('Rendu via Outlet')).toBeInTheDocument()
  })

})