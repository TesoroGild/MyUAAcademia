// src/utils/billUtils.js
export const calcTotal = (bill) => {
  if (!bill) return 0
  let t = 0
  t += bill.generalExpenses          || 0
  t += bill.sportsAdministrationFees || 0
  t += bill.dentalInsurance          || 0
  t += bill.insuranceFees            || 0
  t += bill.amount                   || 0
  t -= bill.refundsAndAdjustments    || 0
  return t
}