import React from 'react'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

function LanguageSwitcher() {
  const [currentLanguage, setCurrentLanguage] = React.useState('en')

  const languages = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    hi: 'हिन्दी',
  }

  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang)
    // Add i18n/translation logic here
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="language" className="text-sm font-medium text-gray-700">
        Language:
      </label>
      <select
        id="language"
        value={currentLanguage}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {Object.entries(languages).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LanguageSwitcher