/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/frontend/src/**/*.{js,ts,jsx,tsx}",
        "./src/frontend/src/index.html",
    ],
    theme: {
        extend: {
            colors: {
                glass: {
                    DEFAULT: "rgba(255, 255, 255, 0.05)",
                    border: "rgba(255, 255, 255, 0.1)",
                    highlight: "rgba(255, 255, 255, 0.2)",
                }
            },
            backdropBlur: {
                xs: "2px",
            }
        },
    },
    plugins: [],
}
