import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { HelpTextSection } from '#components'
import { enI18n } from '~~/tests/mocks/i18n'
import DashboardLayout from '~/layouts/dashboard.vue'

const mockAccountStore = {
  currentAccount: {
    id: '123'
  }
}

// Mock the store
vi.mock('#imports', async () => {
  const actual = await vi.importActual('#imports')
  return {
    ...actual,
    useConnectAccountStore: () => mockAccountStore
  }
})

describe('Dashboard Layout', () => {
  function mountComponent () {
    return mountSuspended(DashboardLayout, {
      global: {
        plugins: [enI18n]
      }
    })
  }

  it('should mount successfully', async () => {
    const wrapper = await mountComponent()
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the correct title and intro text', async () => {
    const wrapper = await mountComponent()

    const h1 = wrapper.find('h1')
    expect(h1.exists()).toBe(true)
    expect(h1.text()).toBe(enI18n.global.t('page.home.h1'))

    const intro = wrapper.find('p')
    expect(intro.exists()).toBe(true)
    expect(intro.text()).toBe(enI18n.global.t('page.home.intro'))
  })

  it('renders help text section correctly', async () => {
    const wrapper = await mountComponent()

    expect(wrapper.findComponent(HelpTextSection).exists()).toBe(true)
  })

  it('renders the "Get Started" button when account exists', async () => {
    const wrapper = await mountComponent()

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
  })
})
