import { describe, expect, test } from 'vitest'
import { splitPattern } from '../src/main'

describe('splitPattern', () => {
  test('It should return empty array, if input is empty string', () => {
    expect(splitPattern('')).toEqual([])
    expect(splitPattern('""')).toEqual([])
  })
  test("It should return ['**/*'], if input is '**/*'", () => {
    expect(splitPattern('**/*')).toEqual(['**/*'])
  })
  test("It should return ['**/*', '**/*.md'], if input is '**/* **/*.md'", () => {
    expect(splitPattern('**/* **/*.md')).toEqual(['**/*', '**/*.md'])
  })
  test(`It should return ['**/*', '**/*.md'], if input is '**/* "**/*.md"'`, () => {
    expect(splitPattern('**/* "**/*.md"')).toEqual(['**/*', '**/*.md'])
  })
  test(`It should return ['**/*', 'space separeted'], if input is '**/* "space separeted"'`, () => {
    expect(splitPattern('**/* "space separated"')).toEqual([
      '**/*',
      'space separated'
    ])
  })
})
