import { defineNuxtRouteMiddleware } from 'nuxt/app'

export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.server) return

  if (to.path === from.path) return // Don't navigate if paths are the same
  const mergedQuery = { ...from.query, ...to.query } // Merge previous and new query parameters

  // Prevent infinite redirects by only navigating if queries are different
  if (JSON.stringify(to.query) !== JSON.stringify(mergedQuery)) {
    return navigateTo({ path: to.path, query: mergedQuery }, { replace: true })
  }
})
