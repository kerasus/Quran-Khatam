<template>
  <q-page>
    <q-card class="q-ma-md">
      <q-card-section>
        <q-file v-model="excelFile" @update:model-value="onFileChange" />
        <q-table
          title="بانک"
          :rows="mainBank"
          :columns="tableColumns"
          row-key="کد ملی"
        />
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
      excelFile: null,
      tableColumns: [],
      mainBank: []
    }
  },
  methods: {
    getMainBankFromExcel (data) {
      data.splice(0, 1)
      // const newData = data.filter(row => Object.keys(row).length === 40)

      return data
    },
    setTableColumns (firstRow) {
      Object.keys(firstRow).forEach(columnKey => {
        this.tableColumns.push({
          name: columnKey,
          label: columnKey,
          align: 'left',
          field: row => row[columnKey],
          sortable: true
        })
      })
    },
    onFileChange (file) {
      console.log('file: ', file)

      const reader = new FileReader()

      reader.onload = (e) => {
        const data = e.target.result
        const workbook = XLSX.read(data, {
          type: 'binary'
        })

        workbook.SheetNames.forEach((sheetName) => {
          // Here is your object
          const xlRowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName])
          // const jsonObject = JSON.stringify(xlRowObject)
          if (sheetName.trim() === 'بانک') {
            this.mainBank = this.getMainBankFromExcel(xlRowObject)
            this.setTableColumns(this.mainBank[0])
            console.log('this.mainBank: ', this.mainBank)
          }
          // console.log('sheetName: ', sheetName)
          // console.log('xlRowObject: ', xlRowObject)
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
