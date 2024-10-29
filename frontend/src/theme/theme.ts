import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const customConfig = defineConfig({
    theme: {
        tokens: {
            colors: {
                mtaColors: {
                    logoBlue: {value: "#0039A6"},
                    labelPurple: {value: "#8E44AD"}, 
                },
                customColors: {
                    grayBackground: {value: "#40414F"}, // dark gray
                },
            },
            fonts: {
                heading: {value: `'Helvetica', Arial, sans-serif`}, // Font for headings
                body: {value: `'Helvetica', Arial, sans-serif`},    // Font for body text
            }
      },
    },
});
  
export const system = createSystem(defaultConfig, customConfig)

// import { theme } from "@chakra-ui/react";

// export default {
//   ...theme,
//   colors: {
//     ...theme.colors,
//     mtaColors: {
        // logoBlue: "#0039A6",
        // labelPurple: "#8E44AD"
//     },
//     customColors: {
//       grayBackground: "#40414F", // dark gray
//     },
//   },
//   fonts: {
//     heading: "Helvetica, Arial, sans-serif", // Font for headings
//     body: "Helvetica, Arial, sans-serif",    // Font for body text
//     mono: "Menlo, monospace",                // Monospace font
//   },
// };

// // export default {
// //     breakpoints: ["30em", "48em", "62em", "80em"],
// //     fonts: {
// //       heading: '"Avenir Next", sans-serif',
// //       body: "system-ui, sans-serif",
// //       mono: "Menlo, monospace",
// //     },
// //     fontSizes: {
// //       xs: "0.75rem",
// //       sm: "0.875rem",
// //       md: "1rem",
// //       lg: "1.125rem",
// //       xl: "1.25rem",
// //       "2xl": "1.5rem",
// //       "3xl": "1.875rem",
// //       "4xl": "2.25rem",
// //       "5xl": "3rem",
// //       "6xl": "4rem",
// //     },
// //   };