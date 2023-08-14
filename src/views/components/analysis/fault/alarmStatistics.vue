<template>
  <div class="comp-analysis-fault-static">
    <common-flex justify="space-between" align="center">
      <strong>Alarm statistics</strong>
      <DateTypePicker @emitDate="getDateParams" />
    </common-flex>
    <div class="posr">
      <div class="total posa">20</div>
      <div class="charts" id="charts"></div>
    </div>
  </div>
</template>

<script>
import DateTypePicker from "@/components/common/dateTypePicker.vue";
import * as echarts from "echarts";
let lineAxis = [], seriesData = [], chartsInstance = null
for (let i = 1; i < 24; i++) {
  lineAxis.push(i)
  seriesData.push((Math.random() * 10).toFixed(0))
}
let lineOption = {
  tooltip: {
    show: true,
    trigger: 'axis'
  },
  grid: {
    left: '3%',
    right: '3%',
    bottom: 20
  },
  xAxis: {
    data: lineAxis,
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
        fontSize: 10
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
      color: '#ff9fa0',
      symbol: 'none',
      smooth: true,
      data: seriesData,
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(
            0, 0, 0, 1,
            [
              {offset: 0, color: '#feccce'},
              {offset: 0.5, color: '#fee4e6'},
              {offset: 1, color: '#fff4f6'}
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
    left: '3%',
    right: '3%',
    bottom: 20
  },
  xAxis: {
    data: ['1', '2', '3', '4', '5', '6', '7'],
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
        fontSize: 10
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
      color: '#ff9fa0',
      data: ['1', '2', '3', '4', '5', '6', '7'],
      barWidth: 12
    }
  ]
}
export default {
  name: 'comp-analysis-fault-line',
  components: {
    DateTypePicker
  },
  data() {
    return {

    }
  },
  mounted() {
    chartsInstance = echarts.init(document.getElementById('charts'))
    chartsInstance.setOption(lineOption)
    window.addEventListener('resize', this.change)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.change)
  },
  methods: {
    getDateParams(p) {
      console.log(p)
      if (+p.dataType === 1) chartsInstance.setOption(lineOption)
      else chartsInstance.setOption(barOption)
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
    margin-top: 16px;
    height: 40vh;
  }
  .total {
    right: 20px;
    top: 20px;
  }
}
</style>
