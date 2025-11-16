/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from 'react'
import { debounce } from 'lodash'

export const useDebounceFn = (fnToDebounce: (e: React.ChangeEvent<HTMLInputElement>) => void, delay = 500) => {
  if (isNaN(delay)) {
    throw new Error('Delay value should be a number.')
  }

  if (!fnToDebounce || typeof fnToDebounce !== 'function') {
    throw new Error('Debounce must have a function')
  }

  return useCallback(debounce(fnToDebounce, delay), [fnToDebounce, delay])
}
