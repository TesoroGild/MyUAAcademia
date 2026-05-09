import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Home from './home'

// On mock useNavigate pour intercepter les navigations
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Helper : render Home avec le router (obligatoire car tu uses useNavigate)
const renderHome = () => render(
  <MemoryRouter>
    <Home />
  </MemoryRouter>
)

// Reset les mocks entre chaque test
beforeEach(() => {
  mockNavigate.mockClear()
})

// ─────────────────────────────────────────────
describe('Home — Connexion Modal', () => {

  it('The modal is closed by défaut', () => {
    renderHome()
    expect(screen.queryByText('Vous êtes :')).not.toBeInTheDocument()
  })

  it('The modal opens by clicking on Se connecter', () => {
    renderHome()
    fireEvent.click(screen.getAllByText(/se connecter/i)[0])
    expect(screen.getByText('Vous êtes :')).toBeVisible()
  })

  it('The modal closes by clicking on sur Annuler', () => {
    renderHome()
    fireEvent.click(screen.getAllByText(/se connecter/i)[0])
    fireEvent.click(screen.getByText(/annuler/i))
    expect(screen.queryByText('Vous êtes :')).not.toBeInTheDocument()
  })

  it('The modal closes by clicking on the backdrop', () => {
    renderHome()
    fireEvent.click(screen.getAllByText(/se connecter/i)[0])
    const backdrop = screen.getByText('Vous êtes :').closest('[class*="fixed"]')
    fireEvent.click(backdrop)
    expect(screen.queryByText('Vous êtes :')).not.toBeInTheDocument()
  })

})

// ─────────────────────────────────────────────
describe('Home — Navigation by roles', () => {

  it('Student navigate to /login/user', () => {
    renderHome()
    fireEvent.click(screen.getAllByText(/se connecter/i)[0])
    fireEvent.click(screen.getByText('Étudiant'))
    expect(mockNavigate).toHaveBeenCalledWith('/login/user')
  })

  it('Employee navigate to /login/employee', () => {
    renderHome()
    fireEvent.click(screen.getAllByText(/se connecter/i)[0])
    fireEvent.click(screen.getByText('Employé'))
    expect(mockNavigate).toHaveBeenCalledWith('/login/employee')
  })

})

// ─────────────────────────────────────────────
describe('Home — Programs navigation', () => {

  it('clic on Master navigate to /programs/Master', () => {
    renderHome()
    fireEvent.click(screen.getAllByText('Master')[0])
    expect(mockNavigate).toHaveBeenCalledWith('/programs/Master')
  })

  it('clic on BTS navigue to /programs/BTS', () => {
    renderHome()
    fireEvent.click(screen.getAllByText('BTS')[0])
    expect(mockNavigate).toHaveBeenCalledWith('/programs/BTS')
  })

})