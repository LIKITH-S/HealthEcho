import api from './api'

export async function getProfile(patientId){
  try{
    const res = await api.get(`/patients/${patientId}`)
    return res.data
  }catch(err){
    console.error('patientService.getProfile', err)
    throw err
  }
}

export async function getReports(patientId){
  try{
    const res = await api.get(`/reports?patientId=${patientId}`)
    return res.data
  }catch(err){
    console.error('patientService.getReports', err)
    return []
  }
}

export async function uploadReport(patientId, file){
  try{
    const form = new FormData()
    form.append('file', file)
    form.append('patientId', patientId)
    const res = await api.post('/reports/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
    return res.data
  }catch(err){
    console.error('patientService.uploadReport', err)
    throw err
  }
}

export async function getRecommendations(patientId){
  try{
    const res = await api.get(`/recommendations?patientId=${patientId}`)
    return res.data
  }catch(err){
    console.error('patientService.getRecommendations', err)
    return { recommendations: [] }
  }
}
