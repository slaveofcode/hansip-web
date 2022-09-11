<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    noCloseButton: {
        type: Boolean,
        default: false,
    },
})

const emits = defineEmits(['onModalClose', 'onModalClosed'])
const showModal = ref(props.show)
const hideCloseBtn = ref(props.noCloseButton)

watch(() => props.show, (newVal) => {
    if (newVal !== showModal.value) {
        showModal.value = newVal 
    }
})

watch(showModal, (newVal) => {
    if (newVal) {
        return document.querySelector('body')?.classList.add('overflow-hidden')
    }
    document.querySelector('body')?.classList.remove('overflow-hidden');
})

const close = () => {
    emits('onModalClose')
    showModal.value = false
    emits('onModalClosed')
}
</script>

<template>
    <div
        v-if="showModal"
        class="text-gray-700 fixed inset-0 w-full h-screen flex items-center justify-center bg-gray-500/75">
        <div class="max-w-2xl bg-white shadow-lg rounded-lg py-5 px-8">
            <div class="relative bg-white">
                <button
                    v-if="!hideCloseBtn"
                    aria-label="close"
                    class="absolute -top-3 -right-5 text-xl text-gray-500"
                    @click.prevent="close"
                >×</button>
            </div>
            <div class="pt-2">
                <slot />
            </div>
        </div>
  </div>
</template>