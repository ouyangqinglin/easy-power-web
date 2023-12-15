<template>
  <common-flex class="comp-date-type-picker" wrap="wrap">
    <el-radio-group v-model="dateType" style="margin-right: 5px" size="small">
      <template v-for="item of dateRadioBtn">
        <el-radio-button :label="item.value">{{ item.label }}</el-radio-button>
      </template>
    </el-radio-group>
    <el-date-picker
      :key="timeType"
      size="small"
      ref="dataEnd"
      @change="sureDate"
      v-model="dateVal"
      :type="timeType"
      :format="displayFormat"
      :picker-options="closePicker"
      :value-format="dateFormat"
      start-placeholder="start time"
      end-placeholder="end time">
    </el-date-picker>
  </common-flex>
</template>

<script>
import {mapState} from "vuex"
import { dateRadioBtn } from '@sub/utils/dict'

export default {
  name: 'comp-date-type-picker',
  computed: {
    ...mapState({
      'timeZone': state => state.user.timeZone,
    }),
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
      this.dateVal = new Date(this.UTC_START_OF(this.timeZone))
      if (v === 'date' || v === 'week') {
        if (v === 'date') {
          this.params.startTime = this.params.endTime = this.DATE_FORMAT('yyyy-MM-dd', new Date(this.dateVal))
        } else {
          const startStampTime = (new Date(this.dateVal)).getTime() - 6 * 24 * 60 * 60 * 1000
          this.params.endTime = this.DATE_FORMAT('yyyy-MM-dd', new Date(this.dateVal))
          this.params.startTime = this.DATE_FORMAT('yyyy-MM-dd', startStampTime)
          let v1, v2
          v1 = this.DATE_FORMAT('MM-dd-yyyy', this.params.startTime)
          v2 = this.DATE_FORMAT('MM-dd-yyyy', this.params.endTime)
          this.dateVal = [v1, v2]
        }
        this.dateFormat = 'MM-dd-yyyy'
        this.displayFormat = 'MM-dd-yyyy'
      } else if (v === 'month') {
        const firstDate = this.DATE_FORMAT('yyyy-MM', this.dateVal) + '-01'
        this.params.startTime = firstDate
        this.params.endTime = this.DATE_FORMAT('yyyy-MM-dd', this.dateVal)
        this.dateFormat = 'yyyy-MM'
        this.displayFormat = 'MM-yyyy'
      } else if (v === 'year') {
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
      const data = {
        startTime: (this.ISD_TIMESTAMP(`${this.params.startTime} 00:00:00`, this.timeZone)) / 1000,
        endTime: (this.ISD_TIMESTAMP(`${this.params.endTime} 23:59:59`, this.timeZone)) / 1000,
        dataType: this.params.dataType,
      }
      this.$emit('emitDate', data)
    },
  },
  data() {
    const that = this
    return {
      dateRadioBtn,
      closePicker: {
        onPick(a) {
          that.$refs.dataEnd.handleClose()
          setTimeout(() => {
            that.params.startTime = that.DATE_FORMAT('yyyy-MM-dd', a.minDate)
            that.dateVal = []
            that.dateVal.push(that.params.startTime)
            that.sureDate(that.dateVal)
          }, 200)
        },
      },
      params: {
        dataType: 1, // {Number} 数据统计分组方式 1-按小时分组 2-按日分组 3-按月分组 4-按照每15分钟分组
        startTime: '', // {String} 示例值：2022-07-19
        endTime: ''
      },
      dateType: 'date',
      dateVal: '',
      displayFormat: 'MM-dd-yyyy',
      dateFormat: 'yyyy-MM-dd',
    }
  },
  created() {
    this.dateVal = new Date(this.UTC_START_OF(this.timeZone))
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
        const month = this.DATE_FORMAT('MM', new Date(this.dateVal))
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
      const data = {
        startTime: (this.ISD_TIMESTAMP(`${this.params.startTime} 00:00:00`, this.timeZone)) / 1000,
        endTime: (this.ISD_TIMESTAMP(`${this.params.endTime} 23:59:59`, this.timeZone)) / 1000,
        dataType: this.params.dataType,
      }
      this.$emit('emitDate', data)
    },
  }
}
</script>

<style lang="scss">
.comp-date-type-picker {
  .el-date-editor.el-input {
    width: 220px;
  }
  .el-date-editor--daterange.el-input__inner {
    width: 220px;
  }
}
</style>
