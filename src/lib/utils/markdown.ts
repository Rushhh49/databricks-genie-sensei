export function sanitizeMarkdown(
  markdown: string
) {
  return markdown
    .replaceAll(
      "<script",
      "&lt;script"
    )
    .replaceAll(
      "</script>",
      "&lt;/script&gt;"
    );
}
