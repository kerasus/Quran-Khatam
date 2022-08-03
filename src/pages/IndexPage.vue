<template>
  <q-page>
    <q-card class="q-ma-md">
      <q-card-section>
        <q-file v-model="excelFile" @update:model-value="onFileChange" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
const XLSX = require('xlsx')

export default defineComponent({
  name: 'IndexPage',
  data () {
    return {
      excelFile: null
    }
  },
  methods: {
    onFileChange (file) {
      console.log('file: ', file)

      const reader = new FileReader()

      reader.onload = function (e) {
        const data = e.target.result
        const workbook = XLSX.read(data, {
          type: 'binary'
        })

        workbook.SheetNames.forEach(function (sheetName) {
          // Here is your object
          const xlRowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName])
          // const jsonObject = JSON.stringify(xlRowObject)
          console.log('xlRowObject', xlRowObject)
          // console.log('jsonObject', jsonObject)
        })
      }

      reader.onerror = function (ex) {
        console.log('ex', ex)
      }

      reader.readAsBinaryString(file)

      // const parseExcel = (filename) => {
      //   const excelData = XLSX.readFile(filename)
      //
      //   return Object.keys(excelData.Sheets).map(name => ({
      //     name,
      //     data: XLSX.utils.sheet_to_json(excelData.Sheets[name])
      //   }))
      // }
      //
      // parseExcel(data).forEach(element => {
      //   console.log(element.data)
      // })
    }
  }
})
</script>
