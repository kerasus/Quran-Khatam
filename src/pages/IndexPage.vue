<template>
  <q-page>
    <q-card class="q-ma-md">
      <q-linear-progress v-if="loading" :indeterminate="loadingIndeterminate" stripe size="10px" :value="loadFileProgress" />
      <q-card-section>
        <div class="row">
          <div class="col-md-8">
            <q-file v-model="excelFile" label="انتخاب فایل بانک" @update:model-value="onFileChange" />
          </div>
          <div class="col-md-4">
            <q-btn label="بررسی صحت اطلاعات فایل" color="primary" @click="onValidateData" />
          </div>
        </div>

        <q-table
          title="بانک"
          :rows="mainBank"
          :columns="tableColumns"
          row-key="row_id"
        />
        <q-separator v-if="mainBankErrors.length > 0" />
        <q-table
          v-if="mainBankErrors.length > 0"
          title="ردیف های مشکل دار"
          :rows="mainBankErrors"
          :columns="mainBankErrorsTableColumns"
          row-key="row_id"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
const XLSX = require('xlsx')
import ValidateBamkData from 'src/mixin/ValidateBamkData'

export default defineComponent({
  name: 'IndexPage',
  mixins: [ValidateBamkData],
  data () {
    return {
      loading: false,
      loadingIndeterminate: false,
      loadFileProgress: 0,
      excelFile: null,
      tableColumns: [],
      mainBankErrorsTableColumns: [],
      mainBankErrors: []
    }
  },
  computed: {
    mainBank: {
      get () {
        return this.$store.getters['mainBank/mainBank']
      },
      set (payload) {
        this.$store.commit('mainBank/updateMainBank', payload)
      }
    }
  },
  created () {
  },
  methods: {
    getMainBankFromExcel (data) {
      return data.slice(1)
    },
    setTableColumns (firstRow) {
      Object.keys(firstRow).forEach(columnKey => {
        // if (columnKey !== 'row_id') {
        this.tableColumns.push({
          name: columnKey,
          label: columnKey,
          align: 'left',
          field: row => row[columnKey],
          sortable: true
        })
        // }
      })

      this.mainBankErrorsTableColumns = [{
        name: 'error_message',
        label: 'ایراد',
        style: 'color: red',
        align: 'left',
        field: row => row.error_message,
        sortable: true
      }].concat(this.tableColumns)
    },
    showProgress () {
      this.loading = true
      this.setProgressIndeterminate(true)
    },
    setProgressIndeterminate (state) {
      this.loadingIndeterminate = state
    },
    async setProgressValue (value) {
      console.log('percent', value)
      this.setProgressIndeterminate(false)
      this.loadFileProgress = value
    },
    hideProgress () {
      this.loading = false
      this.setProgressValue(0)
    },
    loadBank (xlRowObject) {
      this.setBankRowId(xlRowObject)
      this.mainBank = this.getMainBankFromExcel(xlRowObject)
      this.setTableColumns(xlRowObject[0])
      this.hideProgress()
    },
    setBankRowId (xlRowObject) {
      xlRowObject.forEach((row, key) => {
        row.row_id = key
      })
    },
    onFileChange (file) {
      this.showProgress()
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
            this.loadBank(xlRowObject)
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
    },
    onValidateData () {
      this.showProgress()
      const messages = this.validateData(this.mainBank, this.validateProgressCallback)
      // this.hideProgress()
      // // this.showMessages(messages)
      //
      this.mainBankErrors = messages.map(message => message.row)
    },
    showMessages (messages) {
      messages.forEach(message => {
        this.$q.notify(message.message)
      })
    },
    async validateProgressCallback (key, percent) {
      await this.setProgressValue(percent)
    }
  }
})
</script>
