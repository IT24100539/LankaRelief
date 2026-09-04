export function isSriLankanMobile(value) {
  const normalized = String(value).replace(/\s+/g, '')
  return /^(07\d{8}|\+947\d{8})$/.test(normalized)
}
