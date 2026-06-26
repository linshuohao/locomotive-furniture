import { describe, it, expect } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { providePageIntroComplete, usePageIntroComplete } from '@/composables/usePageIntroComplete'

describe('usePageIntroComplete', () => {
  it('provides intro state to descendants and markIntroComplete updates it', async () => {
    const IntroProbe = defineComponent({
      setup() {
        const introComplete = usePageIntroComplete()
        return () => h('span', { 'data-complete': String(introComplete?.value ?? false) })
      },
    })

    const Host = defineComponent({
      setup() {
        const { markIntroComplete } = providePageIntroComplete()
        return () => [
          h(IntroProbe),
          h('button', { type: 'button', onClick: markIntroComplete }, 'done'),
        ]
      },
    })

    const wrapper = mount(Host)
    expect(wrapper.find('[data-complete="false"]').exists()).toBe(true)

    await wrapper.find('button').trigger('click')

    expect(wrapper.find('[data-complete="true"]').exists()).toBe(true)
  })
})
