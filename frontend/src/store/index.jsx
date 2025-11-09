import React, { createContext, useReducer } from 'react'

// Root store context
const initialState = {
  auth: { isAuthenticated: false, user: null, token: null },
  patient: { profile: null, reports: [] }
}

function rootReducer(state, action){
  switch(action.type){
    case 'LOGIN':
      return { ...state, auth: { isAuthenticated: true, user: action.payload.user, token: action.payload.token } }
    case 'LOGOUT':
      return { ...state, auth: { isAuthenticated: false, user: null, token: null } }
    case 'SET_PROFILE':
      return { ...state, patient: { ...state.patient, profile: action.payload } }
    case 'SET_REPORTS':
      return { ...state, patient: { ...state.patient, reports: action.payload } }
    default:
      return state
  }
}

export const StoreContext = createContext()

export function StoreProvider({ children }){
  const [state, dispatch] = useReducer(rootReducer, initialState)
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}
