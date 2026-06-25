export function usePageSeo(titleKey: string) {
  const { t } = useLocale()

  useSeoMeta({
    title: () => `${t(titleKey)} — ${t('brand.fullName')}`,
  })
}
