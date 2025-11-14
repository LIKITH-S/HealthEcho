import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
            error: null,

            // Login
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

            register: async (formData) => {
                set({ isLoading: true, error: null })

                try {
                    const { name, email, password, role } = formData

                    // Split full name into first + last
                    const [first_name, ...lastParts] = name.trim().split(" ")
                    const last_name = lastParts.join(" ") || ""

                    const payload = {
                        first_name,
                        last_name,
                        email,
                        password,
                        role: role.toLowerCase()   // backend expects lowercase
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


            // Logout
            logout: () => {
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null
                })
                delete axios.defaults.headers.common['Authorization']
            },

            // Load user from localStorage
            loadUser: () => {
                const token = localStorage.getItem('accessToken')
                if (token) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                }
            },

            // Change password
            changePassword: async (currentPassword, newPassword) => {
                try {
                    await axios.post(`${API_BASE_URL}/auth/change-password`, {
                        currentPassword,
                        newPassword
                    })
                    return true
                } catch (error) {
                    set({ error: error.response?.data?.error || 'Failed to change password' })
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
