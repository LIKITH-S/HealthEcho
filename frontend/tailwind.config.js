/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                indigo: {
                    50: '#f0f4ff',
                    600: '#4f46e5',
                    700: '#4338ca',
                }
            }
        },
    },
    plugins: [],
}
