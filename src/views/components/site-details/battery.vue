<template>
  <div class="comp-battery" style="flex-grow: 1">
    <div class="total-box">
      <div class="item" style="width: 100%">
        <div class="item-title">Real Time Data</div>
        <common-flex class="item-body" justify="space-between" style="max-width: 100%">
          <div class="item-body-item real">
            <div class="item-body-item-key">SOC</div>
            <div class="item-body-item-value">{{ batEnergy.soc || '--' }}%</div>
          </div>
          <div class="item-body-item real">
            <div class="item-body-item-key">Voltage</div>
            <div class="item-body-item-value">{{ batEnergy.voltage || '--' }}V</div>
          </div>
          <div class="item-body-item real">
            <div class="item-body-item-key">Temperature</div>
            <div class="item-body-item-value">{{ batEnergy.temperature || '--' }}℃</div>
          </div>
          <div class="item-body-item real">
            <div class="item-body-item-key">Power</div>
            <div class="item-body-item-value">{{ batEnergy.power || '--' }}kW</div>
          </div>
          <div class="item-body-item real">
            <div class="item-body-item-key">Current</div>
            <div class="item-body-item-value">{{ batEnergy.current || '--' }}A</div>
          </div>
          <div class="item-body-item real">
            <div class="item-body-item-key">Total Capacity</div>
            <div class="item-body-item-value">{{ batEnergy.totalCapacity || '--' }}kWh</div>
          </div>
          <div class="item-body-item real">
            <div class="item-body-item-key">Status</div>
            <div class="item-body-item-value">{{ ['', 'Not charge-discharge', 'Charging', 'Discharging'][+batEnergy.batteryStatus] }}</div>
          </div>
        </common-flex>
      </div>
      <common-flex justify="space-between">
        <div class="item">
          <div class="item-title">Total Charging Energy</div>
          <common-flex class="item-body">
            <div class="item-body-item">
              <div class="item-body-item-key">Today</div>
              <div class="item-body-item-value">{{ batEnergy.dayChargeEnergy }}kWh</div>
            </div>
            <div class="item-body-item">
              <div class="item-body-item-key">This Month</div>
              <div class="item-body-item-value">{{ batEnergy.monthChargeEnergy }}kWh</div>
            </div>
          </common-flex>
          <common-flex class="item-body">
            <div class="item-body-item">
              <div class="item-body-item-key">This Year</div>
              <div class="item-body-item-value">{{ batEnergy.yearChargeEnergy }}kWh</div>
            </div>
            <div class="item-body-item">
              <div class="item-body-item-key">Lifetime</div>
              <div class="item-body-item-value">{{ batEnergy.allChargeEnergy }}kWh</div>
            </div>
          </common-flex>
        </div>
        <div class="item">
          <div class="item-title">Total Discharging Energy</div>
          <common-flex class="item-body">
            <div class="item-body-item">
              <div class="item-body-item-key">Today</div>
              <div class="item-body-item-value">{{ batEnergy.dayDisChargeEnergy }}kWh</div>
            </div>
            <div class="item-body-item">
              <div class="item-body-item-key">This Month</div>
              <div class="item-body-item-value">{{ batEnergy.monthDisChargeEnergy }}kWh</div>
            </div>
          </common-flex>
          <common-flex class="item-body">
            <div class="item-body-item">
              <div class="item-body-item-key">This Year</div>
              <div class="item-body-item-value">{{ batEnergy.yearDisChargeEnergy }}kWh</div>
            </div>
            <div class="item-body-item">
              <div class="item-body-item-key">Lifetime</div>
              <div class="item-body-item-value">{{ batEnergy.allDisChargeEnergy }}kWh</div>
            </div>
          </common-flex>
        </div>
      </common-flex>
    </div>
    <common-flex style="border-bottom: 1px solid #D8DCE6; margin-bottom: 15px;" wrap="wrap">
      <div class="bat-item" v-for="(i, k) of batList" :key="k" @click="changeCurBat(i.serialNumber)">
        <div class="posr">
          <div class="posa offline"><el-tag size="mini" style="background-color: #F8696A; border-color: #F8696A" effect="dark" v-if="!i.net">Off line</el-tag></div>
          <div class="bat-pile" :id="`batPile${k}`"></div>
          <div class="posa bat-title">
            <div>SOC</div>
            <div style="text-align: center; line-height: 20px">{{ i.soc }}%</div>
          </div>
        </div>
        <div class="bat-sn" :class="{curClick: batCur === i.serialNumber}">{{ i.serialNumber }}</div>
      </div>
    </common-flex>
    <el-tabs v-model="activeBattery">
<!--      非1.5通信盒（1.0通信棒或1.5mini盒）则Details该模块不显-->
      <el-tab-pane label="Details" name="first" v-if="detailsFlag"></el-tab-pane>
      <el-tab-pane label="Basic Info" name="second"></el-tab-pane>
    </el-tabs>
    <common-flex auto class="comp-device-card-content-right" v-if="activeBattery === 'second'">
      <common-flex direction="column" auto class="comp-device-card-content-right-container" style="padding: 0 24px">
        <div class="item" v-for="i of dataInfo">
          <div class="item-title">{{ i.title }}</div>
          <common-flex class="item-body">
            <div class="item-body-item" v-for="(v, k) of i.info">
              <div class="item-body-item-key">{{ k }}</div>
              <div class="item-body-item-value">{{ v || '--' }}</div>
            </div>
          </common-flex>
        </div>
      </common-flex>
    </common-flex>
    <common-flex auto class="comp-device-card-content-right" direction="column" v-if="activeBattery === 'first'">
      <common-flex style="border-bottom: 1px solid #D8DCE6">
        <common-flex direction="column" align="center">
          <div class="posr">
            <div v-if="+base.storeConnectStatus === 1" class="posa dynamicSoc" :style="{height: dynamicSoc * 68 + 'px'}"></div>
            <img class="device-battery posr" style="z-index: 1" :src="require('./img/device-battery.svg')" alt=""><br>
          </div>
          <template v-if="+base.storeConnectStatus === 1">
            <span class="status-tips" v-if="+curDevInfo.storeStatus === 1">Not charge-discharge</span>
            <span class="status-tips" v-else-if="+curDevInfo.storeStatus === 2">Charging</span>
            <span class="status-tips" v-else-if="+curDevInfo.storeStatus === 3">Discharging</span>
          </template>
          <router-link :to="{name: 'monitoring-view', params: {id: curDevInfo.id, info: curDevInfo.extInfo, sn: curDevInfo.sn, siteCode: $route.query.siteCode}}">
            <el-button type="text">Go to BMS</el-button>
          </router-link>
        </common-flex>
        <common-flex class="comp-device-card-content-right-container" style="flex-grow: 1">
          <div class="item" style="flex-grow: 1">
            <div class="item-title">Real-Time Data</div>
            <common-flex class="item-body">
              <div class="item-body-item">
                <div class="item-body-item-key">Soc</div>
                <div class="item-body-item-value">{{ curDevInfo.soc }}%</div>
              </div>
              <div class="item-body-item">
                <div class="item-body-item-key">Current</div>
                <div class="item-body-item-value">{{ curDevInfo.current }}A</div>
              </div>
              <div class="item-body-item">
                <div class="item-body-item-key">Voltage</div>
                <div class="item-body-item-value">{{ curDevInfo.voltage }}V</div>
              </div>
              <div class="item-body-item">
                <div class="item-body-item-key">Power</div>
                <div class="item-body-item-value">{{ curDevInfo.power }}kW</div>
              </div>
            </common-flex>
          </div>
        </common-flex>
      </common-flex>
      <common-flex justify="space-between" align="center">
        <strong style="text-indent: 16px">Historical Information</strong>
        <common-flex justify="flex-end" style="margin: 40px 0 20px 0">
          <el-radio-group size="small" v-model="batteryHis.batteryType" @change="changeBatType">
            <el-radio-button label="Voltage"></el-radio-button>
            <el-radio-button label="Current"></el-radio-button>
            <el-radio-button label="Power"></el-radio-button>
            <el-radio-button label="SOC"></el-radio-button>
            <el-radio-button label="Temperature"></el-radio-button>
          </el-radio-group>
          <el-date-picker
            size="small"
            style="margin: 0 40px 0 10px"
            format="MM-dd-yyyy"
            value-format="yyyy-MM-dd"
            @change="changeBatDate"
            v-model="batteryHis.dateVal"
          >
          </el-date-picker>
        </common-flex>
      </common-flex>
      <el-skeleton style="width: 100%; height: 45vh" :loading="loading" animated>
        <template slot="template">
          <el-skeleton-item
            variant="rect"
            style="width: 100%; height: 45vh;"
          />
        </template>
        <template slot="default">
          <div id="batteryChart" class="batteryChart"></div>
        </template>
      </el-skeleton>
    </common-flex>
  </div>
</template>

<script>
import { batEnergy, stopCharge, batHistoryData, pvHistoryData, orderRes } from '@/api/device'
import * as echarts from "echarts";
let batteryInstance = null
let arr = [], arr1 = [], arr5 = [], batData = []
for (let i = 0; i < 24; i++) {
  arr.push(i)
}
const optionBat = {
  tooltip: {
    trigger: 'axis',
    position: function (pt, param) {
      if (pt[0] > 960) {
        if (param.length > 1) {
          if (param[0].value === 'NaN') return [pt[0] - 100, pt[1] - 10]
          else return [pt[0] - 220, pt[1] - 10]
        }
        else return [pt[0] - 100, pt[1] - 10]
      }
      return [pt[0] + 20, pt[1] - 10];
    },
    formatter(v) {
      if (v[0].value === 'NaN') return 'No data'
      if (optionBat.yAxis.name === 'kW') {
        let t1, unit1
        if (v[0].value < 1) {
          t1 = `${(v[0].value * 1000).toFixed(2)}`
          unit1 = 'W'
        } else if (v[0].value > 1 && v[0].value < 1000) {
          t1 = `${(+v[0].value).toFixed(2)}`
          unit1 = 'kW'
        } else {
          t1 = `${(+v[0].value / 1000).toFixed(2)}`
          unit1 = 'MW'
        }
        return `${v[0].name}<br>${v[0].marker} ${t1}${unit1}`
      } else {
        if (v.length > 1) return `${v[0].name}<br>${v[0].marker}${v[0].seriesName} ${v[0].value}<br>${v[1].marker}${v[1].seriesName} ${v[1].value}`
        else return `${v[0].name}<br>${v[0].marker} ${v[0].value}`
      }
    }
  },
  grid: {
    left: '5%',
    right: '5%'
  },
  xAxis: [
    {
      type: 'category',
      show: false,
      boundaryGap: true,
      data: [], // 接受接口时间点
      position: 'bottom',
    },
    {
      type: 'category',
      boundaryGap: true,
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
      left: '5%',
      right: '5%',
      start: 0,
      // zoomOnMouseWheel: false,
      end: 1999
    },
    {
      height: 22,
      bottom: 15,
      left: '5%',
      right: '5%',
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

const optionBatSoc = {
  color: ['#98e69f', '#f3f3f3'],
  series: [
    {
      type: 'pie',
      radius: ['70%', '90%'],
      labelLine: {
        show: false
      },
      data: [
        { value: 0, name: '' },
        { value: 0, name: '' }
      ]
    }
  ]
}

export default {
  name: 'comp-battery',
  props: {
    base: {
      type: Object,
      default: () => {
        return {}
      }
    },
    curDevInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    dataInfo: {
      type: Array,
      default: () => {
        return []
      }
    },
    batList: {
      type: Array,
      default: () => {
        return []
      }
    },
  },
  computed: {
    dynamicSoc() {
      return +this.curDevInfo.soc / 100
    }
  },
  data() {
    const that = this
    return {
      loading: false,
      batListInstance: [],
      batEnergy: {},
      batCur: '',
      detailsFlag: true,
      activeBattery: 'first',
      batteryHis: {
        batteryType: 'Voltage',
        dateVal: new Date(that.UTC_START_OF(this.base.timeZone))
      },
    }
  },
  watch: {
    batList: {
      handler(v) {
        // 设备类型 1-1.5 2-mini  3-1.0
        if (v.length) {
          this.batCur = v[0].serialNumber
          let curBat = this.batList.find(i => i.serialNumber === this.batCur)
          this.detailsFlag = +curBat.type === 1
          this.activeBattery = +curBat.type === 1 ? 'first' : 'second'
          this.$nextTick(() => this.initBatInstance())
        }
      },
      immediate: true
    },
    activeBattery: {
      handler(v) {
        if (v === 'first') {
          this.$nextTick(() => {
            this.getBatHisData()
            window.addEventListener('resize', this.changeSize)
          })
        }
      },
      immediate: true
    },
  },
  mounted() {
    this.getBatEnergy()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.changeSize)
  },
  methods: {
    changeSize() {
      if (batteryInstance) batteryInstance.resize()
    },
    initBatInstance() {
      this.batListInstance = []
      for(let i = 0; i < this.batList.length; i++) {
        this.batListInstance.push(echarts.init(document.getElementById(`batPile${i}`)))
        if (!this.batList[i]['curEnergy'] || !this.batList[i]['capacity']) {
          optionBatSoc.series[0].data[0].value = 0
          optionBatSoc.series[0].data[1].value = 1
        } else {
          optionBatSoc.series[0].data[0].value = this.batList[i]['curEnergy'] / this.batList[i]['capacity']
          optionBatSoc.series[0].data[1].value = 1 - (this.batList[i]['curEnergy'] / this.batList[i]['capacity'])
        }
        this.batListInstance[i].setOption(optionBatSoc)
      }
    },
    changeBatDate() {
      this.getBatHisData()
    },
    changeBatType() {
      arr1 = []
      let arr2 = []
      optionBat.series = []
      if (this.batteryHis.batteryType === 'Voltage') {
        optionBat.yAxis.name = 'V'
        for(let i = 0; i < batData.length; i++) {
          arr1.push((+batData[i].storeVoltage).toFixed(2))
        }
      }
      if (this.batteryHis.batteryType === 'Current') {
        optionBat.yAxis.name = 'A'
        for(let i = 0; i < batData.length; i++) {
          arr1.push((+batData[i].storeCurrent).toFixed(2))
        }
      }
      if (this.batteryHis.batteryType === 'Power') {
        optionBat.yAxis.name = 'kW'
        for(let i = 0; i < batData.length; i++) {
          arr1.push((+batData[i].storeChargePower).toFixed(2))
        }
      }
      if (this.batteryHis.batteryType === 'SOC') {
        optionBat.yAxis.name = '%'
        for(let i = 0; i < batData.length; i++) {
          arr1.push((+batData[i].storeSoc).toFixed(2))
        }
      }
      if (this.batteryHis.batteryType === 'Temperature') {
        optionBat.yAxis.name = '℃'
        for(let i = 0; i < batData.length; i++) {
          arr1.push((+batData[i].maxTemperature).toFixed(2))
          arr2.push((+batData[i].minTemperature).toFixed(2))
        }
      }
      let itemOne = {
        symbol: "none",
        // name: 'A相',
        type: 'line',
        smooth: true,
        itemStyle: {
          color: '#3EBCD4'
        },
        data: arr1
      }
      if (this.batteryHis.batteryType === 'Temperature') {
        let itemTwo = {
          name: 'minTemperature:',
          symbol: 'none',
          type: 'line',
          smooth: true,
          itemStyle: {
            color: '#FFB968'
          },
          data: arr2
        }
        itemOne.name = 'maxTemperature:'
        optionBat.series.push(itemTwo)
      }
      optionBat.series.push(itemOne)
      if (batteryInstance) {
        batteryInstance.dispose()
        batteryInstance= null
      }
      this.$nextTick(() => {
        batteryInstance = echarts.init(document.getElementById('batteryChart'))
        batteryInstance.setOption(optionBat)
      })
    },
    getBatHisData() {
      this.loading = true
      if (batteryInstance) {
        batteryInstance.dispose()
        batteryInstance= null
      }
      let formatTime = this.DATE_FORMAT('yyyy-MM-dd', this.batteryHis.dateVal)
      let params = {
        sn: this.batCur,
        siteCode: this.$route.query?.siteCode,
        startTimeLong: (this.ISD_TIMESTAMP(`${formatTime} 00:00:00`, this.base.timeZone)) / 1000,
        endTimeLong: (this.ISD_TIMESTAMP(`${formatTime} 23:59:59`, this.base.timeZone)) / 1000,
      }
      batHistoryData(params).then(res => {
        this.loading = false
        batData = res.data
        arr5 = []
        for(let i = 0; i < res.data.length; i++) {
          arr5.push(res.data[i].timestamp)
        }
        optionBat.xAxis[0].data = arr5
        this.changeBatType()
      })
    },
    getBatEnergy() {
      let params = {
        siteCode: this.$route.query?.siteCode
      }
      batEnergy(params).then(res => {
        this.batEnergy = res.data
      })
    },
    changeCurBat(sn) {
      this.batCur = sn
      let curBat = this.batList.find(i => i.serialNumber === this.batCur)
      this.detailsFlag = +curBat.type === 1
      this.activeBattery = +curBat.type === 1 ? 'first' : 'second'
      if (this.detailsFlag) this.getBatHisData()
      this.$emit('common', sn)
    },
  }
}
</script>

<style lang="scss">
.comp-battery {
  .offline {
    left: 50%;
    top: 6px;
    transform: translateX(-50%);
    z-index: 2;
  }
}
</style>
