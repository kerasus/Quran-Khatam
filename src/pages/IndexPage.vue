<template>
  <q-page>
    <q-card class="q-ma-md">
      <q-card-section>
        <q-file v-model="excelFile" @change="onFileChange" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage',
  data () {
    return {
      excelFile: null
    }
  },
  methods: {
    onFileChange (data) {
      console.log('data', data)
    }
  }
})
</script>
