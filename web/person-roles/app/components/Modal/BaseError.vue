<script setup lang="ts">
import { FetchError } from 'ofetch'

// https://vue-i18n.intlify.dev/api/composition.html#te-key-locale
const { t, te } = useI18n()
const isSmallScreen = useMediaQuery('(max-width: 640px)')

const {
  error,
  i18nPrefix,
  buttons = [
    { label: useNuxtApp().$i18n.t('btn.close'), shouldClose: true }
  ]
} = defineProps<{
  error?: unknown
  i18nPrefix: string
  buttons?: ModalButtonProps[]
}>()
defineEmits<{ close: [] }>()

const status = error instanceof FetchError
  ? error.response?.status
  : undefined

const titleKey = `${i18nPrefix}.${status}.title`
const descKey = `${i18nPrefix}.${status}.description`

const title = te(titleKey) ? t(titleKey) : t(`${i18nPrefix}.undefined.title`)
const description = te(descKey) ? t(descKey) : t(`${i18nPrefix}.undefined.description`)
</script>

<template>
  <UModal
    id="base-error-modal"
    overlay
    :title
    :description
    :dismissible="false"
  >
    <template #content>
      <div class="p-10 flex flex-col gap-6">
        <h2 class="text-2xl font-semibold text-bcGovColor-darkGray">
          {{ title }}
        </h2>
        <p>{{ description }}</p>
        <!-- <div class="flex flex-col gap-4 text-left self-start">
          <p>{{ $t('text.ifIssuePersistsContactUs') }}</p>
          <ConnectContactInfoBcros />
        </div> -->
        <div class="flex flex-wrap items-center justify-center gap-4">
          <template
            v-for="button in buttons"
            :key="button.label"
          >
            <UButton
              v-if="button.shouldClose"
              v-bind="button"
              :block="isSmallScreen"
              size="xl"
              @click="$emit('close')"
            />
            <UButton
              v-else
              v-bind="button"
              size="xl"
              :block="isSmallScreen"
            />
          </template>
        </div>
      </div>
    </template>
  </UModal>
</template>
