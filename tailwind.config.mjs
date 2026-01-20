/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],

  // 使用 data-theme 属性选择器实现暗色模式
  darkMode: ['selector', '[data-theme="dark"]'],

  theme: {
    extend: {
      colors: {
        // 品牌色
        base: '#F5DAE3',
        special: '#C8839C',
        highlight: '#B5C9D9',

        // 语义化颜色 - 使用 CSS 变量实现主题切换
        bg: {
          DEFAULT: 'var(--color-bg)',
          secondary: 'var(--color-bg-secondary)',
        },
        text: {
          DEFAULT: 'var(--color-text)',
          secondary: 'var(--color-text-secondary)',
        },
        border: 'var(--color-border)',
        link: {
          DEFAULT: 'var(--color-link)',
          hover: 'var(--color-link-hover)',
        },
      },

      fontFamily: {
        sans: [
          'system-ui', '-apple-system', 'BlinkMacSystemFont',
          'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'
        ],
        mono: [
          'ui-monospace', 'SFMono-Regular', 'SF Mono',
          'Menlo', 'Consolas', 'Liberation Mono', 'monospace'
        ],
      },

      maxWidth: {
        content: '48rem',
      },

      height: {
        header: '3rem',
      },
    },
  },

  plugins: [],
}
