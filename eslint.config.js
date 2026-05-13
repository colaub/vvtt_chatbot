import typescript from "@typescript-eslint/eslint-plugin"
import parser from "@typescript-eslint/parser"

export default [
    {
        files: ["src/**/*.ts"],
        languageOptions: {
            parser: parser
        },
        plugins: {
            "@typescript-eslint": typescript
        },
        rules: {
            "@typescript-eslint/no-unused-vars": "error",
            "@typescript-eslint/no-explicit-any": "error",
            "no-console": "warn",
            "prefer-const": "error",
            "react/react-in-jsx-scope": "off"
        }
    }
]