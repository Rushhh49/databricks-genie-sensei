export function chunkParser(chunk: string) {
  return chunk
    .split("\n")
    .filter(Boolean);
}