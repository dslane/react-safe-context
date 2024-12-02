const noUnusedVarsConfig = [
  "error", {
    args: "all",
    argsIgnorePattern: "^_",
    vars: "all",
    varsIgnorePattern: "^_",
    ignoreRestSiblings: true
  }
];

module.exports = {
  parser: '@typescript-eslint/parser',  // Specifies the ESLint parser
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint',  // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended',  // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 2018,  // Allows for the parsing of modern ECMAScript features
    sourceType: 'module',  // Allows for the use of imports
    ecmaFeatures: {
      jsx: true,  // Allows for the parsing of JSX
    },
  },
  plugins: [
    "react",
    "@typescript-eslint",
    "prettier"
  ],
  env: {
    "browser": true,
    "node": true,
    "jasmine": true,
    "jest": true,
    "es6": true
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-member-accessibility": "off",
    "prettier/prettier": ["error", { "singleQuote": true }],
    "comma-dangle": ["error", "always-multiline"],
    "no-unused-vars": noUnusedVarsConfig,
    "@typescript-eslint/no-unused-vars": noUnusedVarsConfig
  },
  settings: {
    react: {
      pragma: "React",
      version: 'detect',  // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
};
