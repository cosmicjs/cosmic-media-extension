import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"

const useDebouncedValue = (
  initialValue: string,
  duration = 500
): [string, Dispatch<SetStateAction<string>>, string] => {
  const [value, setValue] = useState<string>(initialValue)
  const [debouncedValue, setDebouncedValue] = useState<string>(initialValue)
  const timeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    timeout.current = setTimeout(() => setDebouncedValue(value), duration)
    return () => {
      if (timeout.current) clearTimeout(timeout.current)
      timeout.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return [value, setValue, debouncedValue]
}

export default useDebouncedValue
