// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      '@stylistic/max-len': ['error', { code: 160 }],
      '@stylistic/js/eol-last': ['error', 'always']
    }
  }
)
