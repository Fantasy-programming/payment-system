type Callback = (...args: unknown[]) => void

export const debounce = (callback: Callback, timeout = 0) => {
  let timeoutObj: NodeJS.Timer | null = null

  return {
    run: (...args: unknown[]) => {
      if (timeoutObj !== null) {
        clearTimeout(timeoutObj)
      }
      timeoutObj = setTimeout(() => callback(...args), timeout)
    },

    cancel: () => {
      if (timeoutObj !== null) {
        clearTimeout(timeoutObj)
      }
    },
  }
}

export const isObjEmpty = (obj: object) => {
  return Object.keys(obj).length === 0
}
