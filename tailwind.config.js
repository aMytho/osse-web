/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    safelist: [
        '!fill-emerald-300'
    ],
    theme: {
        extend: {
            dropShadow: {
                glow: [
                    "0 0px 10px rgba(255,255, 255, 0.35)",
                    "0 0px 35px rgba(255, 255,255, 0.2)"
                ]
            }
        },
    },
    plugins: [],
}