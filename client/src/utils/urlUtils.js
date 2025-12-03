export const createSlug = (text) => {
  if (!text) return ''
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove all non-word characters (except spaces and hyphens)
    .replace(/[\s_-]+/g, '-') // Replace spaces and repeated hyphens with a single hyphen
    .replace(/^-+|-+$/g, '')  // Remove leading/trailing hyphens
}