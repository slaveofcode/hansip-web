<script lang="ts" setup>
import { defineProps, ref, watch } from 'vue'

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    }
})

const emits = defineEmits(['onModalClose', 'onModalClosed'])
const showModal = ref(props.show)

watch(showModal, (newVal) => {
    if (newVal) {
        return document.querySelector('body')?.classList.add('overflow-hidden')
    }
    document.querySelector('body')?.classList.remove('overflow-hidden');
})

watch(() => props.show, (newVal) => {
    if (newVal !== showModal.value) {
        showModal.value = newVal 
    }
})

const close = () => {
    emits('onModalClose')
    showModal.value = false
    emits('onModalClosed')

    console.info('show', showModal.value)
}
</script>

<template>
    <div
        v-if="showModal"
        class="text-gray-700 fixed inset-0 w-full h-screen flex items-center justify-center bg-gray-500/75">
        <div class="max-w-2xl bg-white shadow-lg rounded-lg p-8">
            <div class="relative bg-white">
                <button
                    aria-label="close"
                    class="absolute -top-4 right-0 text-xl text-gray-500"
                    @click.prevent="close"
                >×</button>
            </div>
            <slot />
        </div>
  </div>
</template>