import { describe, it, expect } from 'vitest'
import { isValidEmail, slugify, formatDate } from '../helpers.js'

describe('isValidEmail', () => {
  it('accepts a well-formed email', () => {
    expect(isValidEmail('hello@example.com')).toBe(true)
  })

  it('rejects a malformed email', () => {
    expect(isValidEmail('not-an-email')).toBe(false)
    expect(isValidEmail('missing@domain')).toBe(false)
  })
})

describe('slugify', () => {
  it('converts a title into a URL-safe slug', () => {
    expect(slugify('Hello World!')).toBe('hello-world')
    expect(slugify('  Trim Me  ')).toBe('trim-me')
  })
})

describe('formatDate', () => {
  it('formats an ISO date string as a readable date', () => {
    const formatted = formatDate('2026-01-15')
    expect(formatted).toMatch(/2026/)
  })
})
