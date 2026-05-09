export const RULES = [
  { id: "length",  label: "Au moins 8 caractères",         test: (p) => p.length >= 8 },
  { id: "upper",   label: "Au moins une lettre majuscule", test: (p) => /[A-Z]/.test(p) },
  { id: "number",  label: "Au moins un chiffre",           test: (p) => /[0-9]/.test(p) },
  { id: "special", label: "Au moins un caractère spécial", test: (p) => /[^A-Za-z0-9]/.test(p) },
]

export const getStrength = (pwd) => {
  const n = RULES.filter((r) => r.test(pwd)).length
  if (n <= 1) return  { label: "Faible", color: "bg-red-500",   text: "text-red-600",   width: "w-1/4" }
  if (n === 2) return { label: "Moyen",  color: "bg-amber-500", text: "text-amber-600", width: "w-2/4" }
  if (n === 3) return { label: "Bien",   color: "bg-blue-500",  text: "text-blue-600",  width: "w-3/4" }
  return              { label: "Fort",   color: "bg-green-500", text: "text-green-600", width: "w-full" }
}