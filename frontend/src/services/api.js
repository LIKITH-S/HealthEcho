import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Add token to requests
api.interceptors.request.use((config) => {
    try {
        const token = localStorage.getItem('accessToken')
        // ensure headers object exists (some axios callers omit it)
        if (!config.headers) config.headers = {}
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
    } catch (err) {
        // ignore localStorage errors in restrictive environments
    }

    return config
})

// Handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // If access token is invalid or expired (401 or 403), try refresh once
        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const refreshToken = localStorage.getItem('refreshToken')
                if (!refreshToken) throw new Error('No refresh token')

                const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
                    refreshToken
                })

                const newAccessToken = response.data.accessToken
                if (!newAccessToken) throw new Error('Refresh failed')

                // persist new token
                localStorage.setItem('accessToken', newAccessToken)

                // set on original request and retry
                if (!originalRequest.headers) originalRequest.headers = {}
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

                return api(originalRequest)
            } catch (err) {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                // clear any global axios header fallbacks
                try { delete axios.defaults.headers.common['Authorization'] } catch (e) { }
                // navigate to login (use replace so back button doesn't keep bad URL)
                window.location.replace('/login')
            }
        }

        return Promise.reject(error)
    }
)

export default api
