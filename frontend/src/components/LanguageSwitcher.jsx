import React from 'react'
import { useTranslation } from 'react-i18next'

function LanguageSwitcher() {
    const { i18n } = useTranslation()

    const languages = [
        { code: 'en', name: 'English 🇬🇧' },
        { code: 'hi', name: 'हिन्दी 🇮🇳' },
        { code: 'ta', name: 'தமிழ் 🇮🇳' }
    ]

    return (
        <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">🌐</span>
            <select
                value={i18n.language}
                onChange={(e) => {
                    i18n.changeLanguage(e.target.value)
                    localStorage.setItem('language', e.target.value)
                }}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500"
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default LanguageSwitcher
