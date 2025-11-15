// Simple validators used by forms

export function isRequired(value){
  return value !== undefined && value !== null && String(value).trim() !== ''
}

export function isEmail(value){
  if(!value) return false
  // simple email regex for basic validation
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
}

export function isStrongPassword(value){
  if(!value) return false
  // at least 8 chars, one number, one letter
  return /(?=.{8,})(?=.*\d)(?=.*[A-Za-z])/.test(value)
}
