import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import AdmissionForm from './form'
import { RULES, getStrength } from "../../utils/password.util";

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('../../services/program.service', () => ({
  getProgramsS: vi.fn().mockResolvedValue([]),
}))

// On mock les modules qui causent des problèmes dans jsdom
vi.mock('react-datepicker', () => ({
  default: ({ placeholderText, onChange }) => (
    <input placeholder={placeholderText} onChange={(e) => onChange(e.target.value)} />
  ),
}))

vi.mock('react-select', () => ({
  default: ({ placeholder }) => <div>{placeholder}</div>,
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

// ── Helper ────────────────────────────────────────────────────────────────────

const renderForm = () => render(
  <MemoryRouter>
    <AdmissionForm />
  </MemoryRouter>
)

beforeEach(() => {
  vi.clearAllMocks()
})

// ─────────────────────────────────────────────────────────────────────────────
describe('passwordUtils — RULES (tests unitaires purs)', () => {
 
  it('Detects a password that is too short', () => {
    expect(RULES.find(r => r.id === 'length').test('Ab1!')).toBe(false)
  })

  it('Validates min length', () => {
    expect(RULES.find(r => r.id === 'length').test('Ab1!wxyz')).toBe(true)
  })

  it('Detects missing uppercase', () => {
    expect(RULES.find(r => r.id === 'upper').test('ab1!wxyz')).toBe(false)
  })

  it('Detects missing number', () => {
    expect(RULES.find(r => r.id === 'number').test('Abcdefg!')).toBe(false)
  })

  it('Detects missing specials caracteres', () => {
    expect(RULES.find(r => r.id === 'special').test('Abcdefg1')).toBe(false)
  })

  it('Validate a password', () => {
    const allPass = RULES.every(r => r.test('Secure1!'))
    expect(allPass).toBe(true)
  })

})

// ─────────────────────────────────────────────────────────────────────────────
describe('passwordUtils — getStrength', () => {

  it('Returns “Low” if 0 or 1 rule is met', () => {
    expect(getStrength('abc').label).toBe('Faible')
  })

  it('Returns “Medium” if two rules are met', () => {
    expect(getStrength('Abcdefgh').label).toBe('Moyen')
  })

  it('Returns Good if three rules are met', () => {
    expect(getStrength('Abcdefg1').label).toBe('Bien')
  })

  it('Returns "strong" if all rules are met', () => {
    expect(getStrength('Secure1!').label).toBe('Fort')
  })

})

// ─────────────────────────────────────────────────────────────────────────────
describe('AdmissionForm — Rendu initial', () => {

  it('Display form title', () => {
    renderForm()
    expect(screen.getByText(/formulaire d'admission/i)).toBeInTheDocument()
  })

  it('Button Coninuer is unable by default', () => {
    renderForm()
    expect(screen.getByText(/continuer/i).closest('button')).toBeDisabled()
  })

})

// ─────────────────────────────────────────────────────────────────────────────
describe('AdmissionForm — Validation mot de passe', () => {

  const getPwdInput = () => screen.getByPlaceholderText(/choisissez un mot de passe/i)
  const getConfirmInput = () => screen.getByPlaceholderText(/répétez votre mot de passe/i)

  it('Displays the strength indicator when you type in a password', () => {
    renderForm()
    fireEvent.change(getPwdInput(), { target: { value: 'abc' } })
    expect(screen.getByText('Faible')).toBeInTheDocument()
  })

  it('Displays “Strong” for a valid password', () => {
    renderForm()
    fireEvent.change(getPwdInput(), { target: { value: 'Secure1!' } })
    expect(screen.getByText('Fort')).toBeInTheDocument()
  })

  it('Displays all validation rules', () => {
    renderForm()
    fireEvent.change(getPwdInput(), { target: { value: 'a' } })
    expect(screen.getByText('Au moins 8 caractères')).toBeInTheDocument()
    expect(screen.getByText('Au moins une lettre majuscule')).toBeInTheDocument()
    expect(screen.getByText('Au moins un chiffre')).toBeInTheDocument()
    expect(screen.getByText('Au moins un caractère spécial')).toBeInTheDocument()
  })

  it('Displays an error if the passwords do not match', () => {
    renderForm()
    fireEvent.change(getPwdInput(), { target: { value: 'Secure1!' } })
    fireEvent.change(getConfirmInput(), { target: { value: 'Secure2!' } })
    expect(screen.getByText(/ne correspondent pas/i)).toBeInTheDocument()
  })

  it('Displays “Match” if the passwords match', () => {
    renderForm()
    fireEvent.change(getPwdInput(), { target: { value: 'Secure1!' } })
    fireEvent.change(getConfirmInput(), { target: { value: 'Secure1!' } })
    expect(screen.getByText(/correspond/i)).toBeInTheDocument()
  })

  it('Enable the “Continue” button only if the password is valid and confirmed', () => {
    renderForm()
    const btn = screen.getByText(/continuer/i).closest('button')

    // Encore disabled avec mdp invalide
    fireEvent.change(getPwdInput(), { target: { value: 'abc' } })
    expect(btn).toBeDisabled()

    // Valide mais pas confirmé
    fireEvent.change(getPwdInput(), { target: { value: 'Secure1!' } })
    expect(btn).toBeDisabled()

    // Valide et confirmé → enabled
    fireEvent.change(getConfirmInput(), { target: { value: 'Secure1!' } })
    expect(btn).not.toBeDisabled()
  })

})

// ─────────────────────────────────────────────────────────────────────────────
describe('AdmissionForm — Toggle visibilité mot de passe', () => {

  it('The password is hidden by default', () => {
    renderForm()
    expect(screen.getByPlaceholderText(/choisissez un mot de passe/i)).toHaveAttribute('type', 'password')
  })

  it('The password becomes visible when you click the icon', () => {
    renderForm()
    // On cherche le bouton toggle par son rôle dans le bon conteneur
    const toggleBtns = screen.getAllByRole('button', { name: '' })
    fireEvent.click(toggleBtns[0])
    expect(screen.getByPlaceholderText(/choisissez un mot de passe/i)).toHaveAttribute('type', 'text')
  })

})

// ─────────────────────────────────────────────────────────────────────────────
describe('AdmissionForm — Validation upload fichier', () => {

  it('Displays a warning if the file is larger than 2 MB', async () => {
    renderForm()

    const fileInput = screen.getByLabelText(/relevés scolaires/i)

    // On crée un faux fichier de 3Mo — File est disponible dans jsdom
    const bigFile = new File(['x'.repeat(3 * 1024 * 1024)], 'transcript.pdf', {
      type: 'application/pdf',
    })
    Object.defineProperty(bigFile, 'size', { value: 3 * 1024 * 1024 })

    fireEvent.change(fileInput, { target: { files: [bigFile] } })

    await waitFor(() => {
      expect(screen.getByText(/dépasse 2 Mo/i)).toBeInTheDocument()
    })
  })

})

// ─────────────────────────────────────────────────────────────────────────────
describe('AdmissionForm — Navigation', () => {

  it('The return button call navigate(-1)', () => {
    renderForm()
    fireEvent.click(screen.getByText(/retour/i))
    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })

})