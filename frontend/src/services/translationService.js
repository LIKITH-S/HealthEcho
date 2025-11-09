// Placeholder translation service
export async function fetchTranslations(lang){
  return fetch(`/locales/${lang}.json`).then(r=>r.json())
}
