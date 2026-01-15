import type { ContentNavigationItem } from '@nuxt/content'

export function useAboutCategories() {
  const { footer } = useAppConfig()
  const columnHeaders = footer.columnHeaders || []
  const listAbout = inject<Ref<ContentNavigationItem[]>>('about') || ref<ContentNavigationItem[]>([])
  const columns = computed(() => {
    return columnHeaders.map((header) => {
      return {
        ...header,
        children: listAbout.value.filter(item => item.column === header.id)
      }
    })
  })
  return columns
}
