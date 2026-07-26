import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '../BaseButton.vue'

describe('BaseButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(BaseButton, { slots: { default: 'Click me' } })
    expect(wrapper.text()).toContain('Click me')
  })

  it('renders as a <button> by default and respects the "tag" prop', () => {
    const asButton = mount(BaseButton)
    expect(asButton.element.tagName).toBe('BUTTON')

    const asAnchor = mount(BaseButton, { props: { tag: 'a' } })
    expect(asAnchor.element.tagName).toBe('A')
  })
})
