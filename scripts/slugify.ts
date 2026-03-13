// string.js slugify drops non ascii chars so we have to
// use a custom implementation here
import { remove } from 'diacritics'
// eslint-disable-next-line no-control-regex
const rControl = /[\u0000-\u001F]/g
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'<>,.?/]+/g
const rContinuousSeparator = /-{2,}/g
const rEdgeSeparator = /^-+|-+$/g
const rLeadingDigit = /^(\d)/

export function slugify(str: string): string {
  return (
    remove(str)
      // Remove control characters
      .replace(rControl, '')
      // Replace special characters
      .replace(rSpecial, '-')
      // Remove continuos separators
      .replace(rContinuousSeparator, '-')
      // Remove prefixing and trailing separtors
      .replace(rEdgeSeparator, '')
      // ensure it doesn't start with a number (#121)
      .replace(rLeadingDigit, '_$1')
      // lowercase
      .toLowerCase()
  )
}
