module.exports = {
  purge: {
    content: ['./public/**/*.html', './src/**/*.vue'],
    options: {
      whitelistPatterns: [
        /-(leave|enter|appear)(|-(to|from|active))$/,
        /^(?!(|.*?:)cursor-move).+-move$/,
        /^autosearch__/,
      ],
    },
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        wa: {
          light: '#fbf9f9',
          dark: '#232323',
        },
      },
      flex: {
        '2': '2 2 0%',
        '3': '3 3 0%',
        '4': '4 4 0%',
        '5': '5 5 0%',
        '6': '6 6 0%',
        '7': '7 7 0%',
        '8': '8 8 0%',
        '9': '9 9 0%',
      },
      fontSize: {
        '11xl': '11rem',
        '12xl': '12rem',
      },
      fontFamily: {
        fjalla: ['Fjalla One'],
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
    },
  },
};
