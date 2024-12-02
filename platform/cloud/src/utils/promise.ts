export async function catchError<T>(promise: Promise<T>): Promise<[undefined, T] | [Error]> {
  try {
    const result = await promise
    return [undefined, result]
  } catch (error) {
    if (error instanceof Error) {
      return [error]
    }
    return [new Error("something went wrong")]
  }
}
