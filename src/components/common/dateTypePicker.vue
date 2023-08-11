<template>
  <common-flex justify="flex-end" style="flex-grow: 1">
    <el-radio-group v-model="dateType" style="margin-right: 5px" size="small">
      <el-radio-button label="date">Day</el-radio-button>
      <el-radio-button label="week">Week</el-radio-button>
      <el-radio-button label="month">Month</el-radio-button>
      <el-radio-button label="year">Year</el-radio-button>
    </el-radio-group>
    <el-date-picker
      :key="timeType"
      size="small"
      ref="dataEnd"
      @change="sureDate"
      v-model="dateVal"
      :type="timeType"
      range-separator="->"
      :format="displayFormat"
      :picker-options="closePicker"
      :value-format="dateFormat"
      start-placeholder="start time"
      end-placeholder="end time">
    </el-date-picker>
  </common-flex>
</template>

<script>
export default {
  name: 'comp-date-type-picker',
  computed: {
    timeType() {
      const arr = {
        'date': 'date',
        'week': 'daterange',
        'month': 'month',
        'year': 'year'
      }
      return arr[this.dateType]
    },
  },
  watch: {
    dateType(v) {
      if (v === 'date' || v === 'week') {
        this.dateVal = new Date()
        if (v === 'date') {
          this.params.startTime = this.params.endTime = this.DATE_FORMAT('yyyy-M-d', new Date(this.dateVal))
        } else {
          const startStampTime = (new Date(this.dateVal)).getTime() - 6 * 24 * 60 * 60 * 1000
          this.params.endTime = this.DATE_FORMAT('yyyy-M-d', new Date(this.dateVal))
          this.params.startTime = this.DATE_FORMAT('yyyy-M-d', startStampTime)
          let v1, v2
          v1 = this.DATE_FORMAT('MM-dd-yyyy', this.params.startTime)
          v2 = this.DATE_FORMAT('MM-dd-yyyy', this.params.endTime)
          this.dateVal = [v1, v2]
        }
        this.dateFormat = 'MM-dd-yyyy'
        this.displayFormat = 'MM-dd-yyyy'
      } else if (v === 'month') {
        this.dateVal = new Date()
        const firstDate = this.DATE_FORMAT('yyyy-M', this.dateVal) + '-1'
        this.params.startTime = firstDate
        this.params.endTime = this.DATE_FORMAT('yyyy-M-d', this.dateVal)
        this.dateFormat = 'yyyy-MM'
        this.displayFormat = 'MM-yyyy'
      } else if (v === 'year') {
        this.dateVal = new Date()
        const year = this.DATE_FORMAT('yyyy', this.dateVal)
        this.params.startTime = `${year}-01-01`
        this.params.endTime = this.DATE_FORMAT('yyyy-MM-dd', new Date(this.dateVal))
        this.dateFormat = 'yyyy'
        this.displayFormat = 'yyyy'
      }
      const arr = {
        'date': 1,
        'week': 2,
        'month': 2,
        'year': 3
      }
      this.params.dataType = arr[v]
      console.log('watch', this.params.startTime)
      console.log('watch', this.params.endTime)
      this.$emit('emitDate', this.params)
    },
  },
  data() {
    const dateVal = new Date()
    const that = this
    return {
      closePicker: {
        onPick(a) {
          that.$refs.dataEnd.handleClose()
          setTimeout(() => {
            that.params.startTime = that.DATE_FORMAT('yyyy-M-d', a.minDate)
            that.dateVal = []
            that.dateVal.push(that.params.startTime)
            that.sureDate(that.dateVal)
          }, 200)
        },
      },
      params: {
        dataType: 1, // {Number} 数据统计分组方式 1-按小时分组 2-按日分组 3-按月分组 4-按照每15分钟分组
        startTime: '', // {String} 示例值：2022-7-19
        endTime: ''
      },
      dateType: 'date',
      dateVal: dateVal,
      displayFormat: 'MM-dd-yyyy',
      dateFormat: 'yyyy-M-d',
    }
  },
  methods: {
    sureDate(v) {
      if (this.dateType === 'date') this.params.startTime = this.params.endTime = this.DATE_FORMAT('yyyy-MM-dd', v)
      else if (this.dateType === 'week') {
        const endStampTime = (new Date(v[0])).getTime() +  6 * 24 * 60 * 60 * 1000
        this.params.endTime = this.DATE_FORMAT('yyyy-MM-dd', endStampTime)
        let v1, v2
        v1 = this.DATE_FORMAT('MM-dd-yyyy', this.params.startTime)
        v2 = this.DATE_FORMAT('MM-dd-yyyy', this.params.endTime)
        this.dateVal = [v1, v2]
      } else if (this.dateType === 'month') {
        const maxMonth = [1, 3, 5, 7, 8, 10, 12]
        const month = this.DATE_FORMAT('M', new Date(this.dateVal))
        const startTime = `${v}-01`
        let endStampTime
        if (maxMonth.includes(+month)) {
          endStampTime = (new Date(startTime)).getTime() +  30 * 24 * 60 * 60 * 1000
        } else if (+month === 2) endStampTime = (new Date(startTime)).getTime() + 27 * 24 * 60 * 60 * 1000
        else endStampTime = (new Date(startTime)).getTime() + 29 * 24 * 60 * 60 * 1000
        this.params.startTime = startTime
        this.params.endTime = this.DATE_FORMAT('yyyy-MM-dd', endStampTime)
      } else {
        this.params.startTime = `${v}-01-01`
        let curYear = this.DATE_FORMAT('yyyy', new Date())
        if (+v !== +curYear) this.params.endTime = `${v}-12-31`
        else this.params.endTime = this.DATE_FORMAT('yyyy-MM-dd', new Date())
      }
      console.log('sure', this.params.startTime)
      console.log('sure', this.params.endTime)
      this.$emit('emitDate', this.params)
    },
  }
}
</script>

<style lang="scss">

</style>
