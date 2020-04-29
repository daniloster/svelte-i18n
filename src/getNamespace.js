export default function getNamespace(filename = '') {
  return filename
    .replace(/^(((.*\/)?(DEV|src|(dist\/\.app)))\/)/gi, '')
    .replace(/\/|\\/g, '.')
    .replace(/\.(jsx?|svelte)$/gi, '')
}
