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

const emit = defineEmits(['confirm', 'cancel', 'close'])
</script>


<template>
    <Popup @confirm="$emit('confirm', $event)" @cancel="$emit('cancel', $event)" @close="$emit('close', $event)">
      <template v-slot:title>{{ props.title }}</template>
      <p>{{ props.message }}</p>
      <template v-slot:footer>
        <div class="flex-shrink-0 flex justify-end items-center pt-4">
            <button class="vfm-btn block btn btn-blue mr-3" @click="$emit('cancel', $event)">Cancel</button>
            <button class="vfm-btn block btn btn-orange" @click="$emit('confirm', $event)">Confirm</button>
        </div>
      </template>
    </Popup>
</template>