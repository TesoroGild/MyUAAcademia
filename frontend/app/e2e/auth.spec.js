import { test, expect } from '@playwright/test'

// test.describe('Auth — Login étudiant', () => {

//   test('login réussi redirige vers studentspace', async ({ page }) => {
//     await page.goto('/login/user')

//     await page.fill('#code', 'CHEW7758200122')
//     await page.fill('#pwd', 'Wei1234-')
//     await page.click('button[type="submit"]')

//     await expect(page).toHaveURL(/\/studentspace/, { timeout: 10000 })
//   })

//   test('le sidebar est présent après login', async ({ page }) => {
//     await page.goto('/login/user')
//     await page.fill('#code', 'CHEW7758200122')
//     await page.fill('#pwd', 'Wei1234-')
//     await page.click('button[type="submit"]')

//     await page.waitForURL(/\/studentspace/)
//     await expect(page.getByText('Factures')).toBeVisible()
//   })

//   test('déconnexion redirige vers login étudiants', async ({ page }) => {
//     // Login
//     await page.goto('/login/user')
//     await page.fill('#code', 'CHEW7758200122')
//     await page.fill('#pwd', 'Wei1234-')
//     await page.click('button[type="submit"]')

//     // Attendre le dashboard
//     await page.waitForURL(/\/studentspace/)

//     // Déconnexion
//     await page.click('text=Déconnexion')

//     await expect(page).toHaveURL('/login/user', { timeout: 10000 })
//   })

//   test('credentials incorrects affichent une erreur', async ({ page }) => {
//     await page.goto('/login/user')
//     await page.fill('#code', 'WRONGCODE')
//     await page.fill('#pwd', 'wrongpassword')
//     await page.click('button[type="submit"]')

//     // On reste sur la page login
//     await expect(page).toHaveURL(/\/login\/user/)
//   })

// })

test.describe('Auth — Login étudiant', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login/user');
  })

  test('login réussi redirige vers studentspace', async ({ page }) => {
    await page.route('**/Auth/login2**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'fake-token',
          userRole: 'student',
          permanentCode: 'CHEW7758200122'
        })
      })
    })
    await page.fill('#code', 'CHEW7758200122')
    await page.fill('#pwd', 'Wei1234-')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/studentspace/, { timeout: 10000 })
  })

  test('le sidebar est présent après login', async ({ page }) => {
    await page.route('**/Auth/login2**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'fake-token',
          userRole: 'student',
          permanentCode: 'CHEW7758200122'
        })
      })
    })
    await page.fill('#code', 'CHEW7758200122')
    await page.fill('#pwd', 'Wei1234-')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/studentspace/)
    await expect(page.getByText('Factures')).toBeVisible()
  })

  test('déconnexion redirige vers login étudiants', async ({ page }) => {
    // Mock login
    await page.route('**/Auth/login2', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          token: 'fake', 
          userRole: 'student', 
          permanentCode: 'CHEW7758200122' 
        })
      })
    })

    // Mock logout
    await page.route('**/Auth/logout', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      })
    })

    await page.fill('#code', 'CHEW7758200122')
    await page.fill('#pwd', 'Wei1234-')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/studentspace/)
    await page.getByText('Déconnexion').click()
    await expect(page).toHaveURL('/login/user', { timeout: 10000 })
  })

  test('credentials incorrects affichent une erreur', async ({ page }) => {
    await page.route('**/Auth/login2**', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Identifiants incorrects' })
      })
    })
    await page.fill('#code', 'WRONGCODE')
    await page.fill('#pwd', 'wrongpassword')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/login\/user/)
  })

})