export function occupancyStatus(availableSpaces, totalCapacity) {
  const available = Number(availableSpaces)
  const total = Number(totalCapacity)
  if (!Number.isFinite(available) || available <= 0) return 'Full'
  if (!Number.isFinite(total) || available <= 0.2 * total) return 'Limited'
  return 'Available'
}

export function occupancyColor(status) {
  if (status === 'Limited') return 'var(--medium)'
  if (status === 'Full') return 'var(--urgent)'
  return 'var(--safe)'
}
