import { describe, it, expect } from 'vitest'
import { translateErrorKey } from '@/lib/i18n/translateError'

describe('translateErrorKey', () => {
  const t = (key: string) => `translated:${key}`
  const te = (key: string) => key.startsWith('fallback.') || key.startsWith('checkout.errors.')

  it('translates known i18n keys', () => {
    expect(translateErrorKey(t, te, 'fallback.apiTimeout')).toBe('translated:fallback.apiTimeout')
  })

  it('falls back for unknown keys', () => {
    expect(translateErrorKey(t, te, 'HTTP_404')).toBe('translated:checkout.errors.failed')
  })
})
