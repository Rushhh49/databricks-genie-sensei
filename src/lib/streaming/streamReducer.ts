export function streamReducer(
  previous: string,
  chunk: string
) {
  return previous + chunk;
}