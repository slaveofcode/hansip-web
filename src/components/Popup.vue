<script lang="ts">
export default {
  name: 'Popup',
  inheritAttrs: false,
}
</script>


<script lang="ts" setup>
import { VueFinalModal } from 'vue-final-modal'

const emit = defineEmits(['close'])
</script>

<template>
    <VueFinalModal
        v-slot="{ params, close }"
        v-bind="$attrs"
        classes="flex justify-center items-center modal-window text-gray-700"
        content-class="relative flex flex-col max-h-full mx-4 p-4 border rounded bg-white"
    >
        <span class="text-2xl font-bold">
            <slot name="title"></slot>
        </span>
        <div class="flex-grow overflow-y-auto mt-4">
            <slot :params="params"></slot>
        </div>
        <slot name="footer"></slot>
        <button class="absolute top-0 right-0 mt-2 mr-3 text-xl text-gray-500" @click="close">
            <span>×</span>
        </button>
    </VueFinalModal>
</template>

<style lang="stylus">
.modal-window > .vfm__content {
    min-width: 400px;
}
</style>