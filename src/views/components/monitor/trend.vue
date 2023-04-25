<template>
<div class="comp-monitor-trend" v-if="show">
  <el-dialog width="60%" :before-close="beforeClose"
             :close-on-click-modal ="false"
             :visible.sync="show"
             :title="title[dataKey]"
  >
    <div class="posr container">
      <div class="date-picker posa">
        <el-date-picker
          format="MM-dd-yyyy"
          value-format="yyyy-MM-dd"
          v-model="dateVal"
          type="date"
          @change="getData('loading')"
        />
      </div>
      <div class="canvas" id="charts"></div>
    </div>
  </el-dialog>
</div>
</template>

<script>
import { batHistoryData } from '@/api/device'

import * as echarts from "echarts"
let arr = [], chartIns = null, arrY = [], dataList = []
for (let i = 0; i < 24; i++) {
  arr.push(i)
}
const dataKeyList = ['storeSoc', 'storeChargePower', 'storeVoltage', 'storeCurrent', 'maxTemperature', 'minTemperature']
const option = {
  tooltip: {
    trigger: 'axis',
    position: function (pt) {
      return [pt[0] + 20, pt[1] - 10];
    }
  },
  grid: {
    left: '4%',
    right: 0
  },
  xAxis: [
    {
      type: 'category',
      show: false,
      data: [], // 接受接口时间点数组
      position: 'bottom',
    },
    {
      type: 'category',
      // axisTick: {
      //   show: true,
      //   alignWithLabel: true
      // },
      data: arr,
      position: 'bottom',
      axisLine: {
        lineStyle: {
          color: '#E7E7E7'
        }
      },
      axisLabel: {
        textStyle: {
          color: '#000'
        }
      },
      axisPointer: {
        type: 'none',
      },
    },

  ],
  yAxis: {
    name: '%',
    type: 'value',
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false
    },
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    }
  },
  dataZoom: [
    {
      showDetail: true,
      type: 'inside',
      height: 26,
      bottom: 2,
      left: '4%',
      right: 1,
      start: 0,
      // zoomOnMouseWheel: false,
      end: 1999
    },
    {
      height: 22,
      bottom: 15,
      left: '4%',
      right: 1,
      start: 0,
      end: 1999,
      backgroundColor: 'white',
      dataBackground: {
        lineStyle: {
          color: '#E67A73'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(252, 219, 218, 0.1)'
          }, {
            offset: 1,
            color: 'rgb(255, 255, 255)'
          }])
        }
      },
      fillerColor: 'rgba(51, 149, 250, 0.06)',
      handleStyle: {
        color: '#7A84B0'
      }
    }
  ],
  series: [
    {
      symbol: "none",
      type: 'line',
      itemStyle: {
        color: '#638AE3'
      },
      data: [] // 接受接口数据值数组
    }
  ]
}
export default {
  name: "comp-monitor-trend",
  props: {
    show: Boolean,
    dataKey: Number,
  },
  data() {
    let dateVal = new Date()
    return {
      title: ['SOC', 'Power', 'Voltage', 'Current', 'Cell Highest_T', 'Cell Lowest_T'],
      dateVal,
      waitLoading: null,
      params: {
        sn: '',
        startTimeLong: 0,
        endTimeLong: 0
      }
    }
  },
  watch: {
    show(v) {
      if(v) this.initChart(this.dataKey)
    }
  },
  mounted() {
    if(this.$route.params.sn) localStorage.setItem('sn', this.$route.params.sn)
    if(this.$route.params.siteCode) localStorage.setItem('siteCode', this.$route.params.siteCode)
    this.params.sn = localStorage.getItem('sn')
    this.params.siteCode = localStorage.getItem('siteCode')
    this.getData()
  },
  methods: {
    initChart(v) {
      const unit = ['%', 'kW', 'V', 'A', '℃', '℃']
      option.yAxis.name = unit[v]
      option.series[0].data = []
      option.xAxis[0].data = []
      arrY = []
      for(let i = 0; i < dataList.length; i++) {
        arrY.push((+dataList[i][dataKeyList[v]]).toFixed(2))
        option.xAxis[0].data.push(dataList[i].timestamp)
      }
      option.series[0].data = arrY
      this.$nextTick(() => {
        if (chartIns) chartIns.dispose()
        chartIns = echarts.init(document.getElementById('charts'))
        chartIns.setOption(option)
        window.addEventListener('resize', this.changeSize)
      })
    },
    changeSize() {
      chartIns.resize()
    },
    beforeClose() {
      this.$emit('update:show', false)
      window.removeEventListener('resize', this.changeSize)
    },
    requestLoading() {
      this.waitLoading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    getData(v) {
      if (v) this.requestLoading()
      let format = this.DATE_FORMAT('yyyy-MM-dd', this.dateVal)
      this.params.startTimeLong = (new Date(`${format} 00:00:00`).getTime()) / 1000
      this.params.endTimeLong = (new Date(`${format} 23:59:59`).getTime()) / 1000
      batHistoryData(this.params).then(res => {
        dataList = res.data
        if(+this.dataKey >= 0) this.initChart(+this.dataKey)
      }).finally(() => {
        if (v) this.waitLoading.close()
      })
    },
  }
}
</script>

<style lang="scss">
.comp-monitor-trend {
  .el-dialog__header {
    border-bottom: 1px solid #E7E7E7;
  }
  .container {
    height: 40vh;
    .date-picker {
      right: 5%;
      z-index: 2;
    }
    .canvas {
      height: 100%;
    }
  }
}
</style>
