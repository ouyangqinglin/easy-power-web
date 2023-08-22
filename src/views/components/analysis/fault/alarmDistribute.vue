<template>
  <div class="comp-analysis-fault-pile">
    <common-flex style="height: 76px" justify="space-between" align="center" wrap="wrap">
      <strong>Alarm Distribution</strong>
      <DateTypePicker @emitDate="getDateParams" />
    </common-flex>
    <div class="posr">
      <div class="posa total num" v-if="show">{{ total }}</div>
      <div class="pile">
        <div id="pile" class="pile" v-if="show"></div>
        <NoData v-else />
      </div>
    </div>
  </div>
</template>

<script>
import DateTypePicker from "@/components/common/dateTypePicker.vue";
import * as echarts from "echarts";
let pileInstance = null
let option = {
  color: ['#68B4FF', '#FFC96B', '#FF6464'],
  tooltip: {
    trigger: 'item',
  },
  legend: {
    bottom: 'bottom',
    icon: 'circle'
  },
  series: [
    {
      type: 'pie',
      avoidLabelOverlap: false,
      radius: ['30%', '70%'],
      data: [
        { value: 0, name: 'Notice' },
        { value: 0, name: 'Warning' },
        { value: 0, name: 'Fault' },
      ],
      label: {
        formatter(v) {
          return v.percent + '%'
        }
      }
    }
  ]
};

import { pileNum } from '@/api/fault'
import {mapState} from "vuex";
export default {
  name: 'comp-analysis-fault-pile',
  components: {
    DateTypePicker
  },
  data() {
    return {
      total: 0,
      show: true
    }
  },
  computed: {
    ...mapState({
      'timeZone': state => state.user.timeZone,
    })
  },
  mounted() {
    let startTime = this.DATE_FORMAT('yyyy-MM-dd', new Date(this.UTC_START_OF(this.timeZone)))
    const data = {
      startTime: (this.ISD_TIMESTAMP(`${startTime} 00:00:00`, this.timeZone)) / 1000,
      endTime: (this.ISD_TIMESTAMP(`${startTime} 23:59:59`, this.timeZone)) / 1000,
      dataType: 1,
    }
    this.getPileNum(data)
    window.addEventListener('resize', this.change)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.change)
  },
  methods: {
    getPileNum(data) {
      pileNum(data).then(res => {
        // 故障类型 1-Warning 2-Fault 3-Notice
        let noticeItem = {}, warnItem = {}, faultItem = {}
        noticeItem = res.data.find(i => +i.type === 3)
        warnItem = res.data.find(i => +i.type === 1)
        faultItem = res.data.find(i => +i.type === 2)
        this.total = res.data.reduce((pre, cur) => {
          return pre + cur?.num
        }, 0)
        this.show = this.total !== 0
        if (this.show) {
          this.$nextTick(() => {
            if (!pileInstance) pileInstance = echarts.init(document.getElementById('pile'))
            option.series[0].data[0].value = noticeItem?.num || 0
            option.series[0].data[1].value = warnItem?.num || 0
            option.series[0].data[2].value = faultItem?.num || 0
            pileInstance.setOption(option)
          })
        } else pileInstance = null
      })
    },
    change() {
      if (pileInstance) pileInstance.resize()
    },
    getDateParams(p) {
      this.getPileNum(p)
    },
  }
}
</script>

<style lang="scss">
.comp-analysis-fault-pile {
  .pile {
    height: 40vh;
  }
  .total {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
