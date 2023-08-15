<template>
  <div class="comp-analysis-fault-static">
    <common-flex style="height: 76px" justify="space-between" align="center">
      <strong>Alarm statistics</strong>
      <DateTypePicker @emitDate="getDateParams" />
    </common-flex>
    <div class="posr">
      <div class="total num posa">{{ total }}</div>
      <div class="charts" id="charts"></div>
    </div>
  </div>
</template>

<script>
import DateTypePicker from "@/components/common/dateTypePicker.vue";
import * as echarts from "echarts";
import { statisticsNum } from '@/api/fault'
import {mapState} from "vuex";
let chartsInstance = null
let lineOption = {
  tooltip: {
    show: true,
    trigger: 'axis'
  },
  grid: {
    left: '4%',
    right: '3%',
    bottom: 20
  },
  xAxis: {
    data: [],
    axisTick: {
      alignWithLabel: true
    },
    axisLine: {
      lineStyle: {
        color: '#E7E7E7'
      }
    },
    axisLabel: {
      textStyle: {
        color: '#000',
      }
    },
  },
  yAxis: {
    name: 'Quantity',
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    },
  },
  series: [
    {
      type: 'line',
      color: '#3EBCD4',
      symbol: 'none',
      data: [],
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(
            0, 0, 0, 1,
            [
              {offset: 0, color: '#aae2ec'},
              {offset: 0.5, color: '#c4ebf2'},
              {offset: 1, color: '#f5fcfd'}
            ]
          )
        }
      },
    }
  ]
}
let barOption = {
  tooltip: {
    show: true,
    trigger: 'item'
  },
  grid: {
    left: '4%',
    right: '3%',
    bottom: 20
  },
  xAxis: {
    data: [],
    axisTick: {
      alignWithLabel: false
    },
    axisLine: {
      lineStyle: {
        color: '#E7E7E7'
      }
    },
    axisLabel: {
      textStyle: {
        color: '#000',
      }
    },
  },
  yAxis: {
    name: 'Quantity',
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    },
  },
  series: [
    {
      type: 'bar',
      color: '#3EBCD4',
      data: [],
      barWidth: 12
    }
  ]
}
export default {
  name: 'comp-analysis-fault-line',
  components: {
    DateTypePicker
  },
  computed: {
    ...mapState({
      'timeZone': state => state.user.timeZone,
    })
  },
  data() {
    return {
      total: 0
    }
  },
  mounted() {
    let startTime = this.DATE_FORMAT('yyyy-MM-dd', new Date(this.UTC_START_OF(this.timeZone)))
    chartsInstance = echarts.init(document.getElementById('charts'))
    const data = {
      startTime: (this.ISD_TIMESTAMP(`${startTime} 00:00:00`, this.timeZone)) / 1000,
      endTime: (this.ISD_TIMESTAMP(`${startTime} 23:59:59`, this.timeZone)) / 1000,
      dataType: 1,
    }
    this.getStaticNum(data)
    window.addEventListener('resize', this.change)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.change)
  },
  methods: {
    getStaticNum(data) {
      let total = 0
      lineOption.xAxis.data = []
      lineOption.series[0].data = []
      barOption.xAxis.data = []
      barOption.series[0].data = []
      statisticsNum(data).then(res => {
        if (+data.dataType === 1) {
          res.data.forEach(i => {
            lineOption.xAxis.data.push(i.time.slice(0, 2))
            lineOption.series[0].data.push(i.num)
            total += i.num
          })
          chartsInstance.setOption(lineOption)
        } else {
          res.data.forEach(i => {
            if (+data.dataType === 3) barOption.xAxis.data.push(i.time.slice(5))
            else barOption.xAxis.data.push(i.time)
            barOption.series[0].data.push(i.num)
            total += i.num
          })
          chartsInstance.setOption(barOption)
        }
        this.total = total
      })
    },
    getDateParams(p) {
      this.getStaticNum(p)
    },
    change() {
      if (chartsInstance) chartsInstance.resize()
    }
  }
}
</script>

<style lang="scss">
.comp-analysis-fault-static {
  .charts {
    height: 40vh;
  }
  .total {
    right: 20px;
    top: 20px;
  }
}
</style>
