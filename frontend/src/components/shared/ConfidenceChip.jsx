import Pill from './Pill'

/**
 * Solid = the AI is confident (confirmed module, critical workflow, high-risk area).
 * Dashed = the AI inferred this rather than observed it (assumed module, exploratory item).
 * Reused across Modules and Checklist so the convention only has to be learned once.
 */
export default function ConfidenceChip({ label, tone = 'verified', confidence = 'confirmed' }) {
  return (
    <Pill tone={tone} dashed={confidence === 'assumed'}>
      {label}
    </Pill>
  )
}
