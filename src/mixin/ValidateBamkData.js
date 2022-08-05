const mixinDrawer = {
  data () {
    return {
      countOfMainBankRows: 0
    }
  },
  methods: {
    validateData (mainBank, progressCallback) {
      this.countOfMainBankRows = mainBank.length
      let messages = []
      messages = messages.concat(this.checkRadif(mainBank, progressCallback))
      messages = messages.concat(this.checkDuplicateReshte(mainBank, progressCallback))

      return messages
    },
    getPersent (stepIndex, totalStep) {
      return (stepIndex / totalStep)
    },
    checkRadif (mainBank, progressCallback) {
      // console.log('mainBank', mainBank)
      const messages = []
      mainBank.forEach((row, key) => {
        progressCallback(key, this.getPersent(key, this.countOfMainBankRows))
        if (!row['ردیف'] || isNaN(row['ردیف'])) {
          const newRow = JSON.parse(JSON.stringify(row))
          const message = 'مقدار ردیف به درستی وارد نشده است.'
          newRow.error_message = message
          messages.push({
            row: newRow,
            message: 'در سطر شماره ' + row.row_id + ' ' + message
          })
        }
      })

      return messages
    },
    checkDuplicateReshte (mainBank, progressCallback) {
      const messages = []
      // کد ملی
      // رشته
      mainBank.forEach((row, key) => {
        progressCallback(key, this.getPersent(key, this.countOfMainBankRows))
        const nationalCode = row['کد ملی']
        const major = row['رشته']
        if (nationalCode && major && typeof nationalCode === 'string' && typeof major === 'string') {
          const filterResult = mainBank.filter(filterRow => typeof filterRow['کد ملی'] === 'string' && typeof filterRow['رشته'] === 'string' && filterRow['کد ملی'].trim() === nationalCode.trim() && filterRow['رشته'].trim() === major.trim())
          if (filterResult.length > 1) {
            const newRow = JSON.parse(JSON.stringify(row))
            const message = 'کدملی ثبت شده دارای چند رشته ثبت نامی می باشد.'
            newRow.error_message = message
            messages.push({
              row: newRow,
              message: 'در سطر شماره ' + row.row_id + ' ' + message
            })
          }
        }
      })

      const gg = mainBank.filter((row, rowKey) => rowKey === mainBank.findIndex(newRow => row['رشته'] === newRow['رشته'])).map(row => row['رشته'])
      console.log('gg', gg)
      return messages
    }
  }
}

export default mixinDrawer
