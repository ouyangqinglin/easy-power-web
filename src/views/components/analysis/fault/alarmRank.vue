<template>
  <div class="comp-analysis-fault-rank">
    <common-flex justify="space-between" align="center">
      <strong>Alarm Ranking (Top 10)</strong>
      <DateTypePicker />
    </common-flex>
    <el-row :gutter="16">
      <el-col :span="12">
        <div class="charts" id="rankOne"></div>
      </el-col>
      <el-col :span="12">
        <div class="charts" id="rankTwo"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DateTypePicker from "@/components/common/dateTypePicker.vue";
import * as echarts from "echarts";
let lineAxis = [], seriesData = [], chartsInstanceOne = null, chartsInstanceTwo = null
for (let i = 10; i > 0; i--) {
  lineAxis.push(i)
  seriesData.push((Math.random() * 10 + 1).toFixed(0))
}
let optionOne = {
  title: {
    text: 'Alarm Name Ranking  (Top 10)',
    textStyle: {
      fontSize: 12,
      // fontWeight: 400
    },
  },
  tooltip: {
    show: false
  },
  grid: {
    left: '3%',
    right: '3%',
    bottom: 20
  },
  xAxis: {
    type: 'value',
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
    data: lineAxis,
    type: 'category',
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
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
  series: [
    {
      type: 'bar',
      color: '#6290ff',
      data: seriesData,
      barWidth: 16,
      label: {
        show: true,
        position: 'top',
        formatter(v) {
          console.log(v.dataIndex, v)
          // return 11111
        },
      }
    }
  ]
}
export default {
  name: 'comp-analysis-fault-rank',
  components: {DateTypePicker},
  mounted() {
    chartsInstanceOne = echarts.init(document.getElementById('rankOne'))
    chartsInstanceTwo = echarts.init(document.getElementById('rankTwo'))
    chartsInstanceOne.setOption(optionOne)
    chartsInstanceTwo.setOption(optionOne)
    window.addEventListener('resize', this.change)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.change)
  },
  methods: {
    change() {
      if (chartsInstanceOne) chartsInstanceOne.resize()
      if (chartsInstanceTwo) chartsInstanceTwo.resize()
    }
  },
}
</script>

<style lang="scss">
.comp-analysis-fault-rank{
  .charts {
    margin-top: 16px;
    height: 45vh;
  }
}
</style>
