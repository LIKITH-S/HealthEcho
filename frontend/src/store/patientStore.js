import { useContext } from 'react'
import { StoreContext } from './index'

export function usePatient(){
  const { state, dispatch } = useContext(StoreContext)
  const setProfile = (profile) => dispatch({ type: 'SET_PROFILE', payload: profile })
  const setReports = (reports) => dispatch({ type: 'SET_REPORTS', payload: reports })
  return { patient: state.patient, setProfile, setReports }
}
