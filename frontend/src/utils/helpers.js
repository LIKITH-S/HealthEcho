// General small helpers used across the app

export function formatDate(isoString){
  if(!isoString) return ''
  const d = new Date(isoString)
  return d.toLocaleString()
}

export function toTitleCase(str){
  if(!str) return ''
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
}

export function safeGet(obj, path, defaultValue = undefined){
  return path.split('.').reduce((o,k)=> (o || {})[k], obj) ?? defaultValue
}
