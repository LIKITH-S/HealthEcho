import React, { useState } from 'react'

const formatDate = (iso) => {
    try {
        const d = new Date(iso)
        if (Number.isNaN(d.getTime())) return null
        return d.toLocaleDateString()
    } catch (e) {
        return null
    }
}

const getAge = (iso) => {
    try {
        const dob = new Date(iso)
        if (Number.isNaN(dob.getTime())) return null
        const diff = Date.now() - dob.getTime()
        const age = new Date(diff).getUTCFullYear() - 1970
        return age
    } catch (e) {
        return null
    }
}

const PatientDetails = ({ user }) => {
    if (!user) return null

    const [showAll, setShowAll] = useState(false)

    const initials = `${(user.first_name || '').charAt(0)}${(user.last_name || '').charAt(0)}`.toUpperCase()

    const dobRaw = user.dob || user.date_of_birth || user.dob_date || null
    const dobFormatted = dobRaw ? formatDate(dobRaw) : null
    const age = dobRaw ? getAge(dobRaw) : null

    const insurance = user.insurance_provider || user.insurance || user.insurance_company || null
    const bloodGroup = user.blood_group || user.bloodType || null
    const gender = user.gender || null

    return (
        <div className="flex items-start space-x-3">
            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-lg">
                {initials}
            </div>

            <div className="text-sm flex-1">
                <p className="font-semibold text-gray-800">{user.first_name} {user.last_name}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                    {user.email && <span className="truncate">{user.email}</span>}
                    {user.phone && <span>{user.phone}</span>}
                </div>

                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    {gender && <span className="capitalize">{gender}</span>}
                    {age !== null && <span>• {age} yrs</span>}
                    {dobFormatted && <span>• {dobFormatted}</span>}
                </div>

                {(insurance || bloodGroup) && (
                    <div className="mt-1 text-xs text-gray-500">
                        {insurance && <div>Insurance: {insurance}</div>}
                        {bloodGroup && <div>Blood: {bloodGroup}</div>}
                    </div>
                )}

                {/* Full details toggle */}
                <div className="mt-2">
                    <button
                        onClick={() => setShowAll((s) => !s)}
                        className="text-xs text-indigo-600 hover:underline"
                    >
                        {showAll ? 'Hide details' : 'Show all details'}
                    </button>
                </div>

                {showAll && (
                    <div className="mt-2 text-xs text-gray-700 bg-gray-50 p-2 rounded">
                        {renderAllUserFields(user)}
                    </div>
                )}
            </div>
        </div>
    )
}

function isIsoDateString(val) {
    if (typeof val !== 'string') return false
    // simple check for YYYY-MM-DD or ISO timestamps
    return /^\d{4}-\d{2}-\d{2}/.test(val)
}

function prettyKey(k) {
    return k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function renderValue(v) {
    if (v === null || v === undefined) return <span className="text-gray-400">—</span>
    if (Array.isArray(v)) return v.length ? v.join(', ') : <span className="text-gray-400">—</span>
    if (typeof v === 'object') return <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(v, null, 2)}</pre>
    if (isIsoDateString(v)) return formatDate(v) || v
    return String(v)
}

function renderAllUserFields(user) {
    // exclude sensitive or already displayed keys
    const blacklist = new Set(['accessToken', 'refreshToken', 'password', 'tokens', 'createdAt', 'updatedAt'])
    const alreadyShown = new Set([
        'first_name', 'last_name', 'email', 'phone', 'dob', 'date_of_birth', 'insurance', 'insurance_provider', 'blood_group', 'bloodType', 'gender'
    ])

    const entries = Object.entries(user).filter(([k]) => !blacklist.has(k) && !alreadyShown.has(k))

    if (!entries.length) return <div className="text-gray-500">No additional fields available.</div>

    return (
        <div className="space-y-2">
            {entries.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                    <div className="font-medium text-gray-600">{prettyKey(k)}</div>
                    <div className="text-right">{renderValue(v)}</div>
                </div>
            ))}
        </div>
    )
}

export default PatientDetails
