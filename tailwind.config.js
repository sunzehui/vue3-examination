const {default: plugin} = require('tailwindcss')

module.exports = {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {

        screens: {
            'none': '0px',
            'sm': '640px',
            // => @media (min-width: 640px) { ... }

            'md': '768px',
            // => @media (min-width: 768px) { ... }

            'lg': '1024px',
            // => @media (min-width: 1024px) { ... }

            'xl': '1080px',
            // => @media (min-width: 1280px) { ... }
            '2xl': '1536px',
            // => @media (min-width: 1536px) { ... }
            '3xl': '1736px',
            // => @media (min-width: 1536px) { ... }
        },
        extend: {
            colors: {
                'active': "#0F40F5",
                'complete': "#2ED573",
                'half': "#1E90FF",
            },
        },
    },
    plugins: [],
}
