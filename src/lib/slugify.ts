export function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/** Strip HTML tags for plain text (e.g. slug from title, image alt). */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}
