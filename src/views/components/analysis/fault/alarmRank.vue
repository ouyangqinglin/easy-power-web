<template>
  <div class="comp-analysis-fault-rank">
    <common-flex justify="space-between" align="center">
      <strong>Alarm Ranking (Top 10)</strong>
      <DateTypePicker @emitDate="getDateParams" />
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
import { alarmRank, siteAlarmRank } from '@/api/fault'
import {mapState} from "vuex";
let lineAxis = [], chartsInstanceOne = null, chartsInstanceTwo = null, alarmNameArr = [], siteNameArr = []
for (let i = 10; i > 0; i--) {
  lineAxis.push(i)
}
let optionOne = {
  title: {
    text: 'Alarm Name Ranking  (Top 10)',
    textStyle: {
      fontSize: 12,
      color: '#909399'
    },
  },
  tooltip: {
    show: false
  },
  grid: {
    left: '8%',
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
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    },
    axisLabel: {
      textStyle: {
        color: '#000',
      }
    },
  },
  yAxis: {
    data: lineAxis,
    type: 'category',
    axisLine: {
      lineStyle: {
        color: '#E7E7E7'
      }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      textStyle: {
        color: '#000',
        width: 16,
        height: 16,
      },
      rich: {
        one: {
          width: 16,
          height: 16,
          align: 'center',
          backgroundColor: '#FF6464',
          shadowColor: 'rgba(255, 100, 100, 0.50)',
          shadowOffsetX: 0,
          shadowOffsetY: 3,
          shadowBlur: 6,
          borderRadius: 12,
          padding: 2,
          color: '#fff',
        },
        two: {
          width: 16,
          height: 16,
          align: 'center',
          backgroundColor: '#FFC96B',
          shadowColor: 'rgba(255, 201, 107, 0.50)',
          shadowOffsetX: 0,
          shadowOffsetY: 3,
          shadowBlur: 6,
          borderRadius: 12,
          padding: 2,
          color: '#fff'
        },
        three: {
          width: 16,
          height: 16,
          align: 'center',
          backgroundColor: '#68B4FF',
          shadowColor: 'rgba(104, 180, 255, 0.50)',
          shadowOffsetX: 0,
          shadowOffsetY: 3,
          shadowBlur: 6,
          borderRadius: 12,
          padding: 2,
          color: '#fff'
        }
      },
      formatter(v) {
        if (+v === 1) return `{one|${v}}`
        else if (+v === 2) return `{two|${v}}`
        else if (+v === 3) return `{three|${v}}`
        else return v
      },
    },
  },
  series: [
    {
      type: 'bar',
      color: '#68B4FF',
      data: [],
      barWidth: 16,
      label: {
        show: true,
        position: [2, -12],
        rich: {
          a: {
            align: 'left',
            color: '#909399',
            fontSize: 12
          },
          b: {
            align: 'right',
            fontSize: 14,
            fontWeight: 700,
            color: '#000'
          }
        },
        formatter(v) {
          return `{a|${alarmNameArr[v.dataIndex]}}   {b|${v.value}}`
        },
      }
    }
  ]
}
let optionTwo = {
  title: {
    text: 'Site Alarm Ranking  (Top 10)',
    textStyle: {
      fontSize: 12,
      color: '#909399'
    },
  },
  tooltip: {
    show: false
  },
  grid: {
    left: '8%',
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
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    },
    axisLabel: {
      textStyle: {
        color: '#000',
      }
    },
  },
  yAxis: {
    data: lineAxis,
    type: 'category',
    axisLine: {
      lineStyle: {
        color: '#E7E7E7'
      }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      textStyle: {
        color: '#000',
        width: 16,
        height: 16,
      },
      rich: {
        one: {
          width: 16,
          height: 16,
          align: 'center',
          backgroundColor: '#FF6464',
          shadowColor: 'rgba(255, 100, 100, 0.50)',
          shadowOffsetX: 0,
          shadowOffsetY: 3,
          shadowBlur: 6,
          borderRadius: 12,
          padding: 2,
          color: '#fff',
        },
        two: {
          width: 16,
          height: 16,
          align: 'center',
          backgroundColor: '#FFC96B',
          shadowColor: 'rgba(255, 201, 107, 0.50)',
          shadowOffsetX: 0,
          shadowOffsetY: 3,
          shadowBlur: 6,
          borderRadius: 12,
          padding: 2,
          color: '#fff'
        },
        three: {
          width: 16,
          height: 16,
          align: 'center',
          backgroundColor: '#68B4FF',
          shadowColor: 'rgba(104, 180, 255, 0.50)',
          shadowOffsetX: 0,
          shadowOffsetY: 3,
          shadowBlur: 6,
          borderRadius: 12,
          padding: 2,
          color: '#fff'
        }
      },
      formatter(v) {
        if (+v === 1) return `{one|${v}}`
        else if (+v === 2) return `{two|${v}}`
        else if (+v === 3) return `{three|${v}}`
        else return v
      },
    },
  },
  series: [
    {
      type: 'bar',
      color: '#68B4FF',
      data: [],
      barWidth: 16,
      label: {
        show: true,
        position: [2, -12],
        rich: {
          a: {
            align: 'left',
            color: '#909399',
            fontSize: 12
          },
          b: {
            align: 'right',
            fontSize: 14,
            fontWeight: 700,
            color: '#000'
          }
        },
        formatter(v) {
          return `{a|${siteNameArr[v.dataIndex]}}   {b|${v.value}}`
        },
      }
    }
  ]
}
export default {
  name: 'comp-analysis-fault-rank',
  components: {DateTypePicker},
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
    chartsInstanceOne = echarts.init(document.getElementById('rankOne'))
    chartsInstanceTwo = echarts.init(document.getElementById('rankTwo'))
    this.getAlarmRank(data)
    this.getSiteAlarmRank(data)
    window.addEventListener('resize', this.change)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.change)
  },
  methods: {
    getAlarmRank(data) {
      optionOne.series[0].data = []
      alarmNameArr = []
      alarmRank(data).then(res => {
        res.data.forEach(i => {
          optionOne.series[0].data.unshift(i.num)
          alarmNameArr.push(i.name)
        })
        chartsInstanceOne.setOption(optionOne)
      })
    },
    getSiteAlarmRank(data) {
      optionTwo.series[0].data = []
      siteNameArr = []
      siteAlarmRank(data).then(res => {
        res.data.forEach(i => {
          optionTwo.series[0].data.unshift(i.num)
          siteNameArr.push(i.name)
        })
        chartsInstanceTwo.setOption(optionTwo)
      })
    },
    change() {
      if (chartsInstanceOne) chartsInstanceOne.resize()
      if (chartsInstanceTwo) chartsInstanceTwo.resize()
    },
    getDateParams(p) {
      this.getAlarmRank(p)
      this.getSiteAlarmRank(p)
    },
  },
}
</script>

<style lang="scss">
.comp-analysis-fault-rank{
  .charts {
    margin-top: 16px;
    height: 60vh;
  }
}
</style>
