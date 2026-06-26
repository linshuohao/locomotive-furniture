import { inject, provide, ref, type InjectionKey, type Ref } from 'vue'

export const pageIntroCompleteKey: InjectionKey<Ref<boolean>> = Symbol('page-intro-complete')

/** Provide intro curtain completion state for MotionSceneHost `intro-complete` triggers */
export function providePageIntroComplete() {
  const introComplete = ref(false)

  function markIntroComplete() {
    introComplete.value = true
  }

  provide(pageIntroCompleteKey, introComplete)

  return { introComplete, markIntroComplete }
}

export function usePageIntroComplete(): Ref<boolean> | null {
  return inject(pageIntroCompleteKey, null)
}
