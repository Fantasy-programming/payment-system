import { catchError } from "@/utils/promise"
import { Redis } from "ioredis"

const CHECKING_INTERVAL = 1000 //1s
const MAX_WAIT_TIME = 30 * 1000 //30s

type ResultCallback = (result: unknown) => void
type CalloutCallback = () => void

export async function monitorResults(
  cache: Redis,
  deviceSN: string,
  onResult: ResultCallback,
  onTimeout: CalloutCallback,
) {
  const startTime = Date.now()

  const checkResults = async () => {
    const [err, results] = await catchError(cache.get(`results:${deviceSN}`))

    if (err) {
      throw new Error(err.message)
    }

    if (results) {
      onResult(results)
      const [err] = await catchError(cache.del(`results:${deviceSN}`))

      if (err) {
        throw new Error(err.message)
      }

      return
    }

    // Timeout reached
    if (Date.now() - startTime >= MAX_WAIT_TIME) {
      onTimeout()
      return
    }

    // Schedule next check
    setTimeout(checkResults, CHECKING_INTERVAL)
  }

  // Start checking
  checkResults()
}
