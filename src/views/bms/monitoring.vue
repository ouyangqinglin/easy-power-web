<template>
  <div class="pages-monitoring app-container">
    <el-card>
      <strong slot="header">Battery Info</strong>
      <el-row>
        <el-col :span="6">
          <div class="label">Serial Number</div>
          <div class="value">{{ base.sn }}</div>
        </el-col>
        <el-col :span="6">
          <div class="label">Capacity (Wh)</div>
          <div class="value">{{ base.capacity }}</div>
        </el-col>
        <el-col :span="6">
          <div class="label">SOH(%)</div>
          <div class="value">{{ base.soc }}</div>
        </el-col>
        <el-col :span="6">
          <div class="label">Cycle Time</div>
          <div class="value">{{ 1000 }}</div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px">
        <el-col :span="6">
          <div class="label">Lifetime</div>
          <div class="value">3 Days   5 Months  1Year</div>
        </el-col>
        <el-col :span="6">
          <div class="label">Hardware version</div>
          <div class="value">1.1.2</div>
        </el-col>
        <el-col :span="6">
          <div class="label">software version</div>
          <div class="value">1.2.1</div>
        </el-col>
        <el-col :span="6">
          <div class="label">Status</div>
          <div class="value">{{ ['', 'Not charge-discharge', 'Charging', 'Discharging'][+base.status] }}</div>
        </el-col>
      </el-row>
      <common-flex wrap="wrap" style="margin-top: 48px" class="flex-container">
        <common-flex class="item" v-for="(i, k) of infoList"
                     :class="{activeBorder: k === +curItem}"
                     :key="k" @click.native="changeItem(k)">
          <div class="item-label">{{ i.label }}</div>
          <div class="item-value posr">
            {{ i.value }}
            <img class="posa trend" :src="require('@img/site/trend.svg')" alt="">
          </div>
        </common-flex>
      </common-flex>
    </el-card>
    <el-card style="margin-top: 24px">
      <strong slot="header">Battery cells monitoring</strong>
      <el-radio-group v-model="dataType" style="margin-bottom: 30px;" @change="changeType">
        <el-radio-button label="0">Voltage(V)</el-radio-button>
        <el-radio-button label="1">Cell_T(°C)</el-radio-button>
        <el-radio-button label="2">Env_T(°C)</el-radio-button>
        <el-radio-button label="3">MOS_T(°C)</el-radio-button>
      </el-radio-group>
      <common-flex wrap="wrap" class="flex-container">
        <common-flex class="item" v-for="(i, k) of dataList"
                     :class="{activeBorder: curSeries.includes(k)}"
                     :key="k" @click.native="changeSeries(k)">
          <div class="item-label">{{ +dataType ? `T${k+1}(℃)` : `Cell${k+1}(V)` }}</div>
          <div class="item-value">{{ i }}</div>
        </common-flex>
      </common-flex>
      <div class="chart-container posr" v-if="dataList && dataList.length">
        <div class="posa date-comp">
          <el-date-picker
            format="dd-MM-yyyy"
            value-format="yyyy-MM-dd"
            v-model="dateVal"
            type="date"
            @change="getData('loading')"
          />
        </div>
        <div class="line" id="line"></div>
      </div>
    </el-card>
    <Trend :show.sync="show" :dataKey="curItem" />
  </div>
</template>

<script>
import { baseDevice, cellData } from '@/api/device'
import Trend from '@/views/components/monitor/trend.vue'
import * as echarts from "echarts"
let arr = [], chartIns = null, timer = null, dataList = []
let viewH = window.innerHeight
for (let i = 1; i < 25; i++) {
  arr.push(i)
}
const color = ['#f47226', '#4498ee', '#44c333', '#f31926', '#9c28e0', '#56e6e5', '#a96e1e', '#f0e140', '#f785f6', '#113464', '#3261e0', '#b1b22f', '#4e8e2f', '#ebb563', '#f78989', '#a6a9ad']
const option = {
  tooltip: {
    trigger: 'axis',
    position: function (pt, params) {
      let height = viewH / 30
      let offsetTop = Math.max(pt[1] - height * (params.length), 0)
      if (params.length > 3) {
        if (params.length > 12 && viewH < 950) return [pt[0] + 20, offsetTop - 80]
        else return [pt[0] + 20, offsetTop]
      } else return [pt[0] + 20, pt[1] - 30];
    }
  },
  grid: {
    left: '2%',
    right: '3%'
  },
  xAxis: [
    {
      type: 'category',
      show: false,
      boundaryGap: true,
      data: [], // 接受接口时间点数组
      position: 'bottom',
    },
    {
      type: 'category',
      boundaryGap: true,
      axisTick: {
        show: true,
        alignWithLabel: true
      },
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
    name: 'V',
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
      left: 28,
      right: 50,
      start: 0,
      // zoomOnMouseWheel: false,
      end: 1999
    },
    {
      height: 22,
      bottom: 15,
      left: 28,
      right: 50,
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
  series: []
}
export default {
  name: "pages-monitoring",
  components: {
    Trend
  },
  data() {
    let dateVal = new Date()
    return {
      curItem: -1,
      curSeries: [0],
      show: false,
      dataType: 0,
      dateVal,
      base: {},
      sn: '',
      infoList: [
        {
          label: 'SOC(%)',
          value: ''
        },
        {
          label: 'Power (kW)',
          value: ''
        },
        {
          label: 'Voltage(V)',
          value: ''
        },
        {
          label: 'Current(A)',
          value: ''
        },
        {
          label: 'Cell Highest _T (°C)',
          value: ''
        },
        {
          label: 'Cell Lowest _T(°C)',
          value: ''
        }
      ],
      voltageList: [],
      cellTList: [],
      envTList: [],
      mosTList: [],
      loading: null,
    }
  },
  computed: {
    dataList() {
      let arr = [this.voltageList, this.cellTList, this.envTList, this.mosTList][+this.dataType]
      if (arr.length) this.$nextTick(() => this.initCanvas())
      return arr
    }
  },
  mounted() {
    if(this.$route.params.info) localStorage.setItem('info', this.$route.params.info)
    let info = JSON.parse(localStorage.getItem('info'))
    this.voltageList = info.cellVList
    this.cellTList = info.cellTList
    this.envTList = info.envTList
    this.mosTList = info.mOSTList

    baseDevice(this.$route.params.id).then(res => {
      this.base = {...res.data, ...info}
      console.log('base', this.base)
      let arr = [this.base.soc, this.base.power, this.base.voltage, this.base.current, this.base.maxTemplate, this.base.minTemplate]
      arr.forEach((item, index) => {
        this.infoList[index]['value'] = item
      })
    })
    this.getData()
  },
  beforeDestroy() {
    clearTimeout(timer)
  },
  methods: {
    changeType() {
      if (this.dataList.length) {
        this.curSeries = [0]
        this.initCanvas()
      }
    },
    requestLoading() {
      this.loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    getData(v) {
      if(v) this.requestLoading()
      let format = this.DATE_FORMAT('yyyy-MM-dd', this.dateVal)
      let params = {
        sn: localStorage.getItem('sn'),
        siteCode: localStorage.getItem('siteCode'),
        startTimeLong: (new Date(`${format} 00:00:00`).getTime()) / 1000,
        endTimeLong: (new Date(`${format} 23:59:59`).getTime()) / 1000
      }
      cellData(params).then(res => {
        dataList = res.data
        option.xAxis[0].data = []
        for(let i = 0; i < dataList.length; i++) {
          option.xAxis[0].data.push(dataList[i].timestamp)
        }
        this.initCanvas()
      }).finally(() => {
        if(v) this.loading.close()
      })

    },
    initCanvas() {
      option.series = []
      if (+this.dataType) {
        option.yAxis.name = '℃'
        const list = ['', 'cell', 'env', 'mos']
        for(let k = 0; k < this.curSeries.length; k++) {
          let arr = []
          for(let i = 0; i < dataList.length; i++) {
            arr.push(dataList[i][`${list[+this.dataType]}_t${k+1}_avg`])
          }
          let item = {
            name: `T${k+1}`,
            symbol: "none",
            type: 'line',
            smooth: true,
            itemStyle: {
              color: color[k]
            },
            data: arr // 接受接口数据值数组
          }
          option.series.push(item)
        }
      } else {
        option.yAxis.name = 'V'
        for(let k = 0; k < this.curSeries.length; k++) {
          // cell_v1_avg
          let arr = []
          for(let i = 0; i < dataList.length; i++) {
            arr.push(dataList[i][`cell_v${k+1}_avg`])
          }
          let item = {
            name: `Cell${k+1}`,
            symbol: "none",
            type: 'line',
            smooth: true,
            itemStyle: {
              color: color[k]
            },
            data: arr // 接受接口数据值数组
          }
          option.series.push(item)
        }
      }
      clearTimeout(timer)
      timer = setTimeout(() => {
        if(chartIns) chartIns.dispose()
        this.$nextTick(() => {
          chartIns = echarts.init(document.getElementById('line'))
          chartIns.setOption(option)
          window.addEventListener('resize', this.changeSize)
        })
      }, 500)
    },
    changeSize() {
      if(chartIns) chartIns.resize()
    },
    changeItem(k) {
      this.curItem = k
      this.show = true
    },
    changeSeries(k) {
      if (this.curSeries.includes(k)) {
        if (this.curSeries.length !== 1) this.curSeries.splice(this.curSeries.indexOf(k), 1)
      } else this.curSeries.push(k)
      this.initCanvas()
    }
  }
}
</script>

<style lang="scss">
.pages-monitoring {
  .label {
    color: #828282;
    line-height: 36px;
  }
  .value {
    color: #000;
    line-height: 36px;
    .trend {
      top: 50%;
      right: 6px;
      transform: translateY(-50%);
     @include wh(20)
    }
  }
  .flex-container {
    .item {
      margin: 6px 8px;
      width: calc(100% / 4 - 12px);
      border: 1px solid #D8DCE6;
      text-align: center;
      cursor: pointer;
      border-radius: 2px;
      &-label {
        width: 50%;
        color: #828282;
        line-height: 40px;
        background-color: #EDEFF2;
        @media screen and (max-width: 1334px) {
          font-size: 12px;
        }
      }
      &-value {
        width: 50%;
        color: #000;
        line-height: 40px;
        @media screen and (max-width: 1334px) {
          font-size: 12px;
        }
        .trend {
          top: 50%;
          right: 6px;
          transform: translateY(-50%);
          @include wh(20)
        }
      }
    }
    .activeBorder {
      border: 1px solid #3EBCD4;
    }
    >:nth-child(4n+1) {
      margin-left: 0;
    }
    >:nth-child(4n) {
      margin-right: 0;
    }
  }
  .chart-container {
    margin-top: 32px;
    height: 50vh;
    .date-comp {
      right: 3%;
      top: 0;
      z-index: 2;
    }
    .line {
      height: 100%;
    }
  }
}
</style>
