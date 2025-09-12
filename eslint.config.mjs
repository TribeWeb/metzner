// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    '@stylistic/max-len': ['error', { code: 200 }],
    '@stylistic/eol-last': ['error', 'always']
  }
})
  .overrideRules({
    'vue/max-attributes-per-line': ['error', { singleline: 5 }]
  })
