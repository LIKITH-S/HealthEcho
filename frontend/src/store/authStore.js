import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
            error: null,

            // -------------------------------
            // LOGIN
            // -------------------------------
            login: async (email, password, role) => {
                set({ isLoading: true, error: null })
                try {
                    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                        email,
                        password,
                        role
                    })

                    const { tokens, user } = response.data

                    set({
                        user,
                        accessToken: tokens.accessToken,
                        refreshToken: tokens.refreshToken,
                        isLoading: false
                    })

                    // Persist tokens in localStorage so the shared `api` client can read them
                    localStorage.setItem('accessToken', tokens.accessToken)
                    localStorage.setItem('refreshToken', tokens.refreshToken)

                    axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`
                    return true
                } catch (error) {
                    set({
                        error: error.response?.data?.error || 'Login failed',
                        isLoading: false
                    })
                    return false
                }
            },

            // -------------------------------
            // REGISTER
            // -------------------------------
            register: async (formData) => {
                set({ isLoading: true, error: null })

                try {
                    // Split full name
                    const [first_name, ...rest] = formData.name.split(" ")
                    const last_name = rest.join(" ") || ""

                    // Base payload
                    const payload = {
                        first_name,
                        last_name,
                        email: formData.email,
                        password: formData.password,
                        role: formData.role,
                    }

                    // Doctor-only fields
                    if (formData.role === "doctor") {
                        payload.license_number = formData.license_number
                        payload.specialization = formData.specialization || null
                    }

                    await axios.post(`${API_BASE_URL}/auth/register`, payload)

                    set({ isLoading: false })
                    return true
                } catch (error) {
                    set({
                        error: error.response?.data?.error || 'Registration failed',
                        isLoading: false
                    })
                    return false
                }
            },

            // -------------------------------
            // LOGOUT
            // -------------------------------
            logout: () => {
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null
                })
                delete axios.defaults.headers.common['Authorization']
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
            },

            // -------------------------------
            // LOAD USER
            // -------------------------------
            loadUser: () => {
                const token = localStorage.getItem('accessToken')
                if (token) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                    // hydrate store values from persisted storage if available
                    set({ accessToken: token, refreshToken: localStorage.getItem('refreshToken') })
                }
            },

            // -------------------------------
            // CHANGE PASSWORD
            // -------------------------------
            changePassword: async (currentPassword, newPassword) => {
                try {
                    await axios.post(`${API_BASE_URL}/auth/change-password`, {
                        currentPassword,
                        newPassword
                    })
                    return true
                } catch (error) {
                    set({
                        error: error.response?.data?.error || 'Failed to change password'
                    })
                    return false
                }
            }
        }),
        {
            name: 'auth-store',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken
            })
        }
    )
)

// Hydrate tokens into axios defaults on module load so API requests include Authorization
try {
    // call loadUser to set axios default header and in-memory store values
    useAuthStore.getState().loadUser()
} catch (err) {
    // ignore - allows the module to be imported in non-browser contexts
}
