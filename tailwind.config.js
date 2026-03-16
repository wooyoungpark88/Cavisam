/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f4f4f4',
        card: '#ffffff',
        header: '#000000',
        border: {
          DEFAULT: '#cccccc',
          light: 'rgba(204,204,204,0.8)',
        },
        text: {
          primary: '#313131',
          secondary: '#515151',
          muted: '#848484',
        },
        accent: {
          DEFAULT: 'rgba(136,136,136,0.7)',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '5px',
      },
    },
  },
  plugins: [],
}
