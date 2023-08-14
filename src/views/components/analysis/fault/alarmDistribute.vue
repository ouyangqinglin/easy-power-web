<template>
  <div class="comp-analysis-fault-pile">
    <common-flex justify="space-between" align="center">
      <strong>Alarm Distribution</strong>
      <DateTypePicker />
    </common-flex>
    <div id="pile" class="pile"></div>
  </div>
</template>

<script>
import DateTypePicker from "@/components/common/dateTypePicker.vue";
import * as echarts from "echarts";
let pileInstance = null
let option = {
  color: ['#37affb', '#f6b630', '#ee9992'],
  tooltip: {
    trigger: 'item',
  },
  legend: {
    bottom: 'bottom'
  },
  series: [
    {
      name: 'Alarm Distribution',
      type: 'pie',
      radius: '66%',
      data: [
        { value: 0, name: 'Notice' },
        { value: 0, name: 'Warning' },
        { value: 0, name: 'Fault' },
      ],
      label: {
        formatter(v) {
          return v.name + ' ' + v.percent + '%'
        }
      },
      labelLine: {
        show: false
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};

export default {
  name: 'comp-analysis-fault-pile',
  components: {
    DateTypePicker
  },
  data() {
    return {
      total: 100
    }
  },
  mounted() {
    pileInstance = echarts.init(document.getElementById('pile'))
    option.series[0].data[0].value = 20
    option.series[0].data[1].value = 30
    option.series[0].data[2].value = 50
    pileInstance.setOption(option)
    window.addEventListener('resize', this.change)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.change)
  },
  methods: {
    change() {
      if (pileInstance) pileInstance.resize()
    }
  }
}
</script>

<style lang="scss">
.comp-analysis-fault-pile {
  .pile {
    margin-top: 16px;
    height: 40vh;
  }
}
</style>
