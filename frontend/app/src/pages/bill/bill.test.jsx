import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Bill from './bill'
import { calcTotal } from '../../utils/bill.util'

// ── Mocks ────────────────────────────────────────────────────────────────────

// On mock Sidebar car c'est une dépendance externe qui n'est pas ce qu'on teste
vi.mock('../sidebar/sidebar', () => ({
  default: () => <div data-testid="sidebar" />,
}))

// On mock les services API pour ne pas faire de vrais appels réseau
vi.mock('../../services/bill.service', () => ({
  getStudentBillsS: vi.fn(),
}))

vi.mock('../../services/course.service', () => ({
  getSessionCoursePriceS: vi.fn(),
}))

import { getStudentBillsS } from '../../services/bill.service'
import { getSessionCoursePriceS } from '../../services/course.service'

// ── Données de test (fixtures) ────────────────────────────────────────────────
// En entreprise on appelle ça des "fixtures" ou "stubs"
const mockUser = { permanentCode: 'ABC12345' }

const mockBillUnpaid = {
  yearStudy: new Date().getFullYear().toString(),
  sessionStudy: 'Hiver',
  dateOfIssue: '2024-01-15',
  deadLine: '2024-02-15',
  amount: 800,
  generalExpenses: 50,
  sportsAdministrationFees: 30,
  dentalInsurance: 20,
  insuranceFees: 25,
  refundsAndAdjustments: 0,
  amountPaid: 0
}

const mockBillPaid = {
  ...mockBillUnpaid,
  sessionStudy: 'Été',
  amountPaid: 925
}

const mockCourses = [
  { sigle: 'INF101', courseName: 'Intro à la prog', price: 400 },
  { sigle: 'MAT201', courseName: 'Algèbre', price: 400 },
]

// ── Helper render ─────────────────────────────────────────────────────────────
const renderBill = () => render(
  <MemoryRouter>
    <Bill user={mockUser} />
  </MemoryRouter>
)

beforeEach(() => {
  vi.clearAllMocks()
  getStudentBillsS.mockResolvedValue([mockBillUnpaid, mockBillPaid])
  getSessionCoursePriceS.mockResolvedValue({ success: true, courses: mockCourses })
})

// ─────────────────────────────────────────────────────────────────────────────
describe('Bill — Chargement initial', () => {

  it('Display loader during loading', async () => {
    // On retarde la réponse pour voir le loader
    getStudentBillsS.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve([mockBillUnpaid]), 100))
    )
    renderBill()
    expect(screen.getByText('Chargement...')).toBeInTheDocument()
  })

  it('Call getStudentBillsS with the right permanentCode', async () => {
    renderBill()
    await waitFor(() => {
      expect(getStudentBillsS).toHaveBeenCalledWith('ABC12345')
    })
  })

})

// ─────────────────────────────────────────────────────────────────────────────
describe('Bill — Onglets de session', () => {

  it('Displays the 3 session tabs', async () => {
    renderBill()
    expect(screen.getByText('Hiver')).toBeInTheDocument()
    expect(screen.getByText('Été')).toBeInTheDocument()
    expect(screen.getByText('Automne')).toBeInTheDocument()
  })

  it('Hiver active by default', async () => {
    renderBill()
    await waitFor(() => {
      const hiverBtn = screen.getByText('Hiver')
      expect(hiverBtn.className).toContain('bg-blue-800')
    })
  })

  it('Dipslay bill Hiver after loading', async () => {
    renderBill()
    // waitFor attend que le DOM se mette à jour après l'appel API async
    await waitFor(() => {
      expect(screen.getByText('Payer cette facture')).toBeInTheDocument()
    })
  })

  it('Display a blank message if there are no invoices for session Automne', async () => {
    renderBill()
    await waitFor(() => screen.getByText('Payer cette facture'))

    fireEvent.click(screen.getByText('Automne'))

    await waitFor(() => {
      expect(screen.getByText(/aucune facture pour la session Automne/i)).toBeInTheDocument()
    })
  })

})

// ─────────────────────────────────────────────────────────────────────────────
describe('Bill — Statut de paiement', () => {

  it('Dipslay a red banner if the invoice is unpaid', async () => {
    renderBill()
    await waitFor(() => {
      expect(screen.getByText(/paiement dû avant le/i)).toBeInTheDocument()
    })
  })

  it('Dispaly Payer button if the invoice is unpaid', async () => {
    renderBill()
    await waitFor(() => {
      expect(screen.getByText('Payer cette facture')).toBeInTheDocument()
    })
  })

  it('Dipslay a green banner if the invoice has been paid', async () => {
    // On met seulement la facture payée (session Été)
    getStudentBillsS.mockResolvedValue([mockBillPaid])
    renderBill()

    // On clique sur Été pour afficher la facture payée
    await waitFor(() => screen.getByText('Été'))
    fireEvent.click(screen.getByText('Été'))

    await waitFor(() => {
      expect(screen.getByText(/facture réglée/i)).toBeInTheDocument()
    })
  })

  it('Dont display Payer button if the invoice has been paid', async () => {
    getStudentBillsS.mockResolvedValue([mockBillPaid])
    renderBill()

    await waitFor(() => screen.getByText('Été'))
    fireEvent.click(screen.getByText('Été'))

    await waitFor(() => {
      expect(screen.queryByText('Payer cette facture')).not.toBeInTheDocument()
    })
  })

})

// ─────────────────────────────────────────────────────────────────────────────
describe('Bill — Historique', () => {

  it("The history is hidden by default", async () => {
    renderBill()
    expect(screen.queryByText('Aucune facture trouvée.')).not.toBeInTheDocument()
  })

  it("The history is displayed on the first click", async () => {
    getStudentBillsS.mockResolvedValue([])
    renderBill()

    await waitFor(() => screen.getByText('Historique de toutes mes factures'))
    fireEvent.click(screen.getByText('Historique de toutes mes factures'))

    expect(screen.getByText('Aucune facture trouvée.')).toBeInTheDocument()
  })

  it("The history closes on the second click", async () => {
    getStudentBillsS.mockResolvedValue([])
    renderBill()

    await waitFor(() => screen.getByText('Historique de toutes mes factures'))
    fireEvent.click(screen.getByText('Historique de toutes mes factures'))
    fireEvent.click(screen.getByText('Historique de toutes mes factures'))

    expect(screen.queryByText('Aucune facture trouvée.')).not.toBeInTheDocument()
  })

})

// ─────────────────────────────────────────────────────────────────────────────
describe('calcTotal — Logique de calcul', () => {

  it('Correctly calculates the total without refunds', () => {
    const bill = {
      amount: 800,
      generalExpenses: 50,
      sportsAdministrationFees: 30,
      dentalInsurance: 20,
      insuranceFees: 25,
      refundsAndAdjustments: 0,
    }
    
    expect(calcTotal(bill)).toBe(925)
  })

  it('déduit correctement les remboursements', () => {
    const bill = { ...mockBillUnpaid, refundsAndAdjustments: 100 }
    expect(calcTotal(bill)).toBe(825)
  })

})