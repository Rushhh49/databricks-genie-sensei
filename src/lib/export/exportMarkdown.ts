export function exportMarkdown(content: string) {
  const blob = new Blob([content], {
    type: "text/markdown",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = "conversation.md";

  a.click();
}