<script lang="ts">
    export default {
      name: 'PopupInfo',
      inheritAttrs: true,
    }
</script>

<script lang="ts" setup>
import Popup from './Popup.vue'

const props = defineProps({
    title: {
        type: String,
        default: '',
    },
    message: {
        type: String,
        default: ''
    },
})

const emit = defineEmits(['close'])
</script>


<template>
    <Popup>
      <template v-slot:title>{{ props.title }}</template>
      <p>{{ props.message }}</p>
      <template v-slot:footer>
        <div class="flex-shrink-0 flex justify-end items-center pt-4">
            <button class="vfm-btn block btn btn-blue mr-3" @click="emit('close', $event)">Close</button>
        </div>
      </template>
    </Popup>
</template>