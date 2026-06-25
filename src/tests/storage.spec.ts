import { describe, it, expect } from 'vitest'
import { getStorageItem, setStorageItem } from '@/lib/storage'

describe('storage', () => {
  it('persists and retrieves values', () => {
    setStorageItem('test', { foo: 'bar' })
    expect(getStorageItem('test', {})).toEqual({ foo: 'bar' })
  })

  it('returns fallback on missing key', () => {
    expect(getStorageItem('missing', ['default'])).toEqual(['default'])
  })
})
