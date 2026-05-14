import { test, expect } from '@playwright/test';
import dotenv from 'dotenv'

dotenv.config()

let createdPermanentCode = null

// test.describe('Flow Admission complet', () => {

//   const API_URL =  process.env.VITE_API_URL;
//   // Cleanup après chaque test — supprime l'étudiant créé en BD
//   test.afterEach(async ({ request }) => {
//     if (createdPermanentCode) {
//       console.log(API_URL)
//       await request.delete(`${API_URL}/User/delete/${createdPermanentCode}`)
//       createdPermanentCode = null
//     }
//   })

//   test('Accueil → programme → formulaire → vérification → paiement → confirmation', async ({ page }) => {

//     // ── 1. Accueil → choisir Certificat ──────────────────────────────────────
//     await page.goto('/')
//     await page.click('text=Certificat')
//     await expect(page).toHaveURL(/\/programs\/Certificat/)

//     // ── 2. Programmes → cliquer Admission sur Création littéraire ────────────
//     await page.click('text=Admission')
//     await expect(page).toHaveURL(/\/admission/)

//     // ── 3. Remplir le formulaire ──────────────────────────────────────────────
//     await page.fill('input[name="lastname"]', 'Testeur')
//     await page.fill('input[name="firstname"]', 'E2E')
//     await page.selectOption('select[name="sexe"]', 'F')
//     await page.click('#birthDay')
//     await page.type('#birthDay', '15/06/1995')
//     await page.keyboard.press('Escape')
//     await expect(page.locator('#birthDay')).toHaveValue('15/06/1995')
//     await page.fill('input[name="nationality"]', 'Japonnaise')
//     await page.fill('input[name="personalEmail"]', 'e2e.testeur@test.com')
//     await page.fill('input[name="phoneNumber"]', '5140202020')
//     await page.fill('input[name="streetAddress"]', '1234 rue des Tests, Montréal, QC')
//     await page.fill('#pwd', 'Secure1!')
//     await page.fill('#confirmPwd', 'Secure1!')

//     // ── 4. Soumettre le formulaire ────────────────────────────────────────────
//     await page.click('button[type="submit"]:has-text("Continuer")')
//     await expect(page).toHaveURL(/\/admission\/verify/)

//     // ── 5. Vérification → intercepter la réponse API pour récupérer le permanentCode
//     const responsePromise = page.waitForResponse(
//       res => res.url().includes('/api/User/students') && res.request().method() === 'POST'
//     )

//     await page.click('text=Confirmer et passer au paiement')
//     const response = await responsePromise
//     const body = await response.json()
//     createdPermanentCode = body.permanentCode
//     expect(createdPermanentCode).toBeTruthy()

//     await expect(page).toHaveURL(/\/admission\/payment/)

//     // ── 6. Paiement → autofill + soumettre ───────────────────────────────────
//     await page.click('text=Remplissage auto')

//     // On attend que les champs soient remplis
//     await expect(page.locator('input[name="fullName"]')).not.toHaveValue('')

//     await page.click('button[type="submit"]')

//     // ── 7. Confirmation ───────────────────────────────────────────────────────
//     await expect(page).toHaveURL(/\/admission\/bill/, { timeout: 15000 })
//   })

// })


test.describe('Flow Admission complet', () => {

  test.beforeEach(async ({ page }) => {

    // Mock programmes disponibles
    await page.route('**/api/Program/programs**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            title: 'Création littéraire',
            grade: 'Certificat',
            programName: 'Création littéraire'
          }
        ])
      })
    })

    // Mock création étudiant — on capture le permanentCode ici
    await page.route('**/api/User/students**', route => {
      createdPermanentCode = 'TEST' + Date.now()
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          permanentCode: createdPermanentCode,
          firstName: 'E2E',
          lastName: 'Testeur',
          personalEmail: 'e2e.testeur@test.com',
        })
      })
    })

    // Mock paiement
    await page.route('**/api/Payment**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      })
    })

  })

  // Plus besoin de afterEach cleanup — rien n'est créé en BD
  test('Accueil → programme → formulaire → vérification → paiement → confirmation', async ({ page }) => {

    // ── 1. Accueil → Certificat ───────────────────────────────────────────
    await page.goto('/')
    await page.click('text=Certificat')
    await expect(page).toHaveURL(/\/programs\/Certificat/)

    // ── 2. Cliquer Admission ──────────────────────────────────────────────
    await page.click('text=Admission')
    await expect(page).toHaveURL(/\/admission/)

    // ── 3. Remplir le formulaire ──────────────────────────────────────────
    await page.fill('input[name="lastname"]', 'Testeur')
    await page.fill('input[name="firstname"]', 'E2E')
    await page.selectOption('select[name="sexe"]', 'F')
    await page.click('#birthDay')
    await page.type('#birthDay', '15/06/1995')
    await page.keyboard.press('Escape')
    await expect(page.locator('#birthDay')).toHaveValue('15/06/1995')
    await page.fill('input[name="nationality"]', 'Japonnaise')
    await page.fill('input[name="personalEmail"]', 'e2e.testeur@test.com')
    await page.fill('input[name="phoneNumber"]', '5140202020')
    await page.fill('input[name="streetAddress"]', '1234 rue des Tests, Montréal, QC')
    await page.fill('#pwd', 'Secure1!')
    await page.fill('#confirmPwd', 'Secure1!')

    // ── 4. Soumettre ──────────────────────────────────────────────────────
    await page.click('button[type="submit"]:has-text("Continuer")')
    await expect(page).toHaveURL(/\/admission\/verify/)

    // ── 5. Vérification ───────────────────────────────────────────────────
    await page.click('text=Confirmer et passer au paiement')
    await expect(page).toHaveURL(/\/admission\/payment/)

    // ── 6. Paiement ───────────────────────────────────────────────────────
    await page.click('text=Remplissage auto')
    await expect(page.locator('input[name="fullName"]')).not.toHaveValue('')
    await page.click('button[type="submit"]')

    // ── 7. Confirmation ───────────────────────────────────────────────────
    await expect(page).toHaveURL(/\/admission\/bill/, { timeout: 15000 })
  })

})