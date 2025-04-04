<script setup lang="ts">
import { z } from 'zod'
import type { FormError, FormSubmitEvent, Form } from '#ui/types'
import { FetchError } from 'ofetch'

const brdModal = useBrdModals()
const toast = useToast()
const { t } = useI18n()
const affStore = useAffiliationsStore()

const props = defineProps<{
  nrNum: string
}>()

const emit = defineEmits<{
  showHelp: [void]
  nameRequestError: [error: FetchError]
}>()

const alertText = ref('')
const ariaAlertText = ref('')
const formRef = ref<Form<NRSchema>>()
const formLoading = ref(false)
const state = reactive({
  email: '',
  phone: ''
})

const setScreenReaderAlert = (message: string) => {
  ariaAlertText.value = ''
  ariaAlertText.value = `${t('words.Error')}, ${message}`
}

const nrSchema = z.object({
  email: z.string(),
  phone: z.string().max(12)
})

type NRSchema = z.infer<typeof nrSchema>

const validate = (state: NRSchema): FormError[] => {
  alertText.value = ''

  const errors = []
  const phoneValid = state.phone.length <= 12
  const emailValid = z.string().email().safeParse(state.email).success
  if (!state.phone && !state.email) { // show alert if both fields are empty
    alertText.value = t('form.manageNR.fields.alert.bothEmpty')
    setScreenReaderAlert(t('form.manageNR.fields.alert.bothEmpty'))
    errors.push({ path: 'phone', message: t('form.manageNR.fields.phone.error.invalid') })
    errors.push({ path: 'email', message: t('form.manageNR.fields.email.error.invalid') })
  } else if (state.phone && !state.email) { // show phone error if phone populated but invalid
    if (!phoneValid) {
      errors.push({ path: 'phone', message: t('form.manageNR.fields.phone.error.invalid') })
      setScreenReaderAlert(t('form.manageNR.fields.phone.error.invalid'))
    }
  } else if (!state.phone && state.email) { // show email error if email populated but invalid
    if (!emailValid) {
      errors.push({ path: 'email', message: t('form.manageNR.fields.email.error.invalid') })
      setScreenReaderAlert(t('form.manageNR.fields.email.error.invalid'))
    }
  } else if (state.phone && state.email) { // show alert and error text if both fields populated and both are invalid
    if (!phoneValid && !emailValid) {
      alertText.value = t('form.manageNR.fields.alert.bothInvalid')
      setScreenReaderAlert(t('form.manageNR.fields.alert.bothInvalid'))
      errors.push({ path: 'phone', message: t('form.manageNR.fields.phone.error.invalid') })
      errors.push({ path: 'email', message: t('form.manageNR.fields.email.error.invalid') })
    }
  }

  return errors
}

async function onSubmit (event: FormSubmitEvent<NRSchema>) {
  try {
    formLoading.value = true

    const emailValid = z.string().email().safeParse(event.data.email).success
    const phoneWithoutHyphens = event.data.phone.replace(/-/g, '')
    const phoneValid = phoneWithoutHyphens.length <= 12

    // create payload with phone and email if they are valid
    const payload: CreateNRAffiliationRequestBody = {
      businessIdentifier: props.nrNum,
      ...(phoneValid && { phone: phoneWithoutHyphens }),
      ...(emailValid && { email: event.data.email })
    }

    // submit post request
    await affStore.createNRAffiliation(payload)

    toast.add({ title: t('form.manageNR.successToast', { nrNum: props.nrNum }) }) // add success toast
    await affStore.loadAffiliations() // update table with new affilitations
    brdModal.close() // close modal
  } catch (e) {
    emit('nameRequestError', e as FetchError)
  } finally {
    formLoading.value = false
  }
}
</script>
<template>
  <UForm
    ref="formRef"
    :state
    :validate-on="['input', 'submit']"
    :validate="validate"
    class="space-y-4"
    @submit="onSubmit"
    @error="handleFormErrorEvent"
  >
    <fieldset>
      <legend class="py-4 text-bcGovColor-midGray">
        {{ $t('form.manageNR.legend') }}
      </legend>

      <div class="flex flex-col gap-4">
        <UFormGroup
          name="phone"
          :help="$t('form.manageNR.fields.phone.help')"
        >
          <UInput
            v-model="state.phone"
            :placeholder="$t('form.manageNR.fields.phone.placeholder')"
            :aria-label="$t('form.manageNR.fields.phone.arialabel')"
            variant="bcGovLg"
          />
        </UFormGroup>

        <span class="font-semibold text-bcGovColor-midGray">{{ $t('words.Or') }}</span>

        <UFormGroup
          name="email"
          :help="$t('form.manageNR.fields.email.help')"
        >
          <UInput
            v-model="state.email"
            :placeholder="$t('form.manageNR.fields.email.placeholder')"
            :aria-label="$t('form.manageNR.fields.email.arialabel')"
            variant="bcGovLg"
          />
        </UFormGroup>
      </div>
    </fieldset>

    <UAlert
      v-if="alertText !== ''"
      icon="i-mdi-alert"
      color="red"
      variant="error"
      :description="alertText"
    />

    <div class="flex justify-between">
      <UButton
        :label="$t('btn.help')"
        variant="ghost"
        icon="i-mdi-help-circle-outline"
        class="pl-0"
        @click="$emit('showHelp')"
      />

      <div class="flex flex-col-reverse gap-2 sm:flex-row">
        <UButton
          :label="$t('btn.cancel')"
          variant="outline"
          class="h-11"
          @click="brdModal.close()"
        />
        <UButton
          type="submit"
          class="h-11"
          :label="$t('form.manageNR.submitBtn')"
          :loading="formLoading"
        />
      </div>
    </div>
    <div class="sr-only" role="status">
      {{ ariaAlertText }}
    </div>
  </UForm>
</template>
