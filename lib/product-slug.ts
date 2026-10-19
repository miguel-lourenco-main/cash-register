export function slugifyProductName(name: string): string {
  // Lowercase ASCII slug; diacritics are stripped so "Café" becomes "cafe".
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
