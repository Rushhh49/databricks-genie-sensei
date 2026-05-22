export async function connectSSE(url: string, onMessage: (data: any) => void) {
  const response = await fetch(url);

  const reader = response.body?.getReader();

  if (!reader) return;

  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    const chunk = decoder.decode(value);

    onMessage(chunk);
  }
}