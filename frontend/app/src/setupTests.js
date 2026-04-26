import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import * as React from 'react'

global.React = React

expect.extend(matchers)

afterEach(() => {
  cleanup()
})