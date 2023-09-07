<template>
  <div class="pages-monitoring app-container">
    <el-drawer
      :before-close="cancelExport"
      :visible.sync="drawer">
      <strong slot="title" style="color: #000">Choose the fields to export</strong>
      <div class="drawer-main">
        <common-flex align="center">
          <div style="flex: 1">
            <el-date-picker
              v-if="exportInfo"
              format="MM-dd-yyyy"
              value-format="yyyy-MM-dd"
              v-model="dateVal"
              type="date"
              @change="changeExportDate"
            />
            <el-date-picker
              v-if="exportCell"
              format="MM-dd-yyyy"
              value-format="yyyy-MM-dd"
              v-model="exportDateVal"
              type="date"
              @change="changeExportDate"
            />
          </div>
          <div style="flex: 1">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">Select all field</el-checkbox>
          </div>
        </common-flex>
        <div class="drawer-main-info" v-if="exportInfo">
          <strong>Battery Info</strong>
          <el-checkbox-group v-model="checkedInfo" @change="changeCheckInfo">
            <el-checkbox style="width: calc(100% / 4); margin-top: 12px" v-for="(i, k) in batInfo" :label="i.value" :key="k">{{ i.label }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="drawer-main-info" v-if="cellFlag && exportCell">
          <strong>Battery cells monitoring</strong>
          <el-checkbox-group v-model="checkedCell" @change="changeCheckCell">
            <el-checkbox style="width: calc(100% / 4); margin-top: 12px" v-for="(i, k) in batCell" :label="i.value" :key="k">{{ i.label }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <common-flex justify="center" style="margin-top: 60px">
          <download-excel :data="excelData" :fields="excelHead" :name="excelName">
            <el-button type="primary" v-if="exportInfo" :disabled="!flag">Export</el-button>
            <el-button type="primary" v-if="exportCell" :disabled="exportCellDisabled">Export</el-button>
          </download-excel>
          <el-button style="margin-left: 24px" @click="cancelExport">Cancel</el-button>
        </common-flex>
      </div>
    </el-drawer>
    <el-card>
      <common-flex slot="header" justify="space-between" align="center">
        <strong>Battery Info</strong>
        <el-button type="primary" @click="drawerInfo"><i style="font-size: 16px" class="el-icon-download"></i></el-button>
      </common-flex>
      <common-flex style="width: 100%">
        <common-flex align="center" class="left">
          <div class="container-battery posr">
            <div class="posa dynamicSoc" :style="{height: base.soc * 68 / 100 + 'px'}"></div>
            <img class="battery posa" style="z-index: 1" :src="require('@/views/components/site-details/img/device-battery.svg')" alt="">
          </div>
        </common-flex>
        <div style="flex: 1">
          <el-row>
            <el-col :span="6">
              <div class="label">Serial Number</div>
              <div class="value">{{ base.sn || '--' }}</div>
            </el-col>
            <el-col :span="6">
              <div class="label">Capacity (kWh)</div>
              <div class="value">{{ base.capacity || '--' }}</div>
            </el-col>
            <el-col :span="6">
              <div class="label">SOH(%)</div>
              <div class="value">{{ base.soh || '--' }}</div>
            </el-col>
            <el-col :span="6">
              <div class="label">Cycle Time</div>
              <div class="value">{{ base.cycles || '--' }}</div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 12px">
            <el-col :span="6">
              <div class="label">Lifetime</div>
              <div class="value"> {{base.periodDay}}Days    {{base.periodMonth}}Months  {{base.periodYear}}Year</div>
            </el-col>
            <el-col :span="6">
              <div class="label">Hardware Version</div>
              <div class="value">{{ base.hardVersion || '--' }}</div>
            </el-col>
            <el-col :span="6">
              <div class="label">Software Version</div>
              <div class="value">{{ base.version || '--' }}</div>
            </el-col>
            <el-col :span="6">
              <div class="label">Status</div>
              <div class="value">{{ ['', 'Not charge-discharge', 'Charging', 'Discharging'][+base.storeStatus] }}</div>
            </el-col>
          </el-row>
        </div>
      </common-flex>
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
      <common-flex v-if="cellFlag" slot="header" justify="space-between" align="center">
        <strong>Battery cells monitoring</strong>
        <el-button type="primary" @click="drawerCell"><i style="font-size: 16px" class="el-icon-download"></i></el-button>
      </common-flex>
      <el-radio-group v-model="dataType" style="margin-bottom: 30px;" @change="changeType">
        <el-radio-button label="0">Voltage(V)</el-radio-button>
        <el-radio-button label="1">Cell_T(°C)</el-radio-button>
        <el-radio-button label="2">Env_T(°C)</el-radio-button>
        <el-radio-button label="3">MOS_T(°C)</el-radio-button>
      </el-radio-group>
      <common-flex wrap="wrap" class="flex-container posr">
        <common-flex class="item" v-for="(i, k) of dataList.slice(0, 64)"
                     :key="k">
          <div class="item-label">{{ +dataType ? `T${k+1}(℃)` : `Cell${k+1}(V)` }}</div>
          <div class="item-value">{{ i }}</div>
        </common-flex>
        <common-flex wrap="wrap" style="width: 100%" class="flex-container" v-show="foldShow">
          <common-flex class="item" v-for="(i, k) of dataList.slice(64)"
                       :key="k.label">
            <div class="item-label">{{ +dataType ? `T${k+65}(℃)` : `Cell${k+65}(V)` }}</div>
            <div class="item-value">{{ i }}</div>
          </common-flex>
        </common-flex>
        <common-flex v-if="dataList.length > 64" @click.native="foldShow = !foldShow" align="center" class="posa" style="bottom: -18px; right: 4px; color: #3EBCD4; cursor: pointer">
          {{ foldShow ? 'Collapse' : 'Unfold'}}
          <i class="el-icon-arrow-down" :class="{rotateAni: foldShow}" style="bottom: -16px; right: 5px; font-size: 18px; color: #3EBCD4; cursor: pointer"></i>
        </common-flex>
      </common-flex>
    </el-card>
    <el-card style="margin-top: 24px" v-if="[0, 1].includes(+dataType)">
      <strong slot="header">Analysis curve</strong>
      <common-flex wrap="wrap" class="flex-container">
        <common-flex class="item" v-for="(i, k) of lineList"
                     :class="{activeBorder: curSeries.includes(k)}"
                     @click.native="changeSeries(k)"
                     :key="k">
          <div class="item-label" style="width: 66%;">{{ i.label }}</div>
          <div class="item-value posr" style="width: 33%">{{ i.value }}<img class="posa trend" :src="require('@img/site/trend.svg')" alt=""></div>
        </common-flex>
      </common-flex>
      <div class="chart-container posr">
        <div class="posa date-comp">
          <el-date-picker
            format="MM-dd-yyyy"
            value-format="yyyy-MM-dd"
            v-model="dateVal"
            type="date"
            @change="getInfoData()"
          />
        </div>
        <template v-if="flag">
          <el-skeleton style="width: 100%; height: 100%" :loading="charting" animated>
            <template slot="template">
              <el-skeleton-item
                variant="rect"
                style="width: 100%; height: 50vh;"
              />
            </template>
            <template>
              <div class="line" id="line"></div>
            </template>
          </el-skeleton>
        </template>
        <no-data v-else />
      </div>
    </el-card>
    <Trend :show.sync="show" :dataKey="curItem" />
  </div>
</template>

<script>
import {infoDevice, cellData, batHistoryData} from '@/api/device'
import Trend from '@/views/components/monitor/trend.vue'
import * as echarts from "echarts"
let arr = [], chartIns = null, timer = null, dataList = [], batCellData = []
let viewH = window.innerHeight
for (let i = 0; i < 24; i++) {
  arr.push(i)
}
const color = ['#FFB968', '#3DAABF', '#8BEA91', '#638AE3']
const option = {
  tooltip: {
    trigger: 'axis',
    position: function (pt, params) {
      let xDis
      if (pt[0] > 960) {
        if (params[0].value === 'NaN') xDis = pt[0] - 100
        else xDis = pt[0] - 150
      }
      else xDis = pt[0] + 20
      let height = viewH / 30
      let offsetTop = Math.max(pt[1] - height * (params.length), 0)
      if (params.length > 3) {
        if (params.length > 12 && viewH < 950) return [xDis, offsetTop - 80]
        else return [xDis, offsetTop]
      } else return [xDis, pt[1] - 30];
    },
    formatter(p) {
      if (p[0].value === 'NaN') return 'No data'
      else {
        let str = ''
        for(let i = 0; i < p.length; i++) {
          if (i === 0) str += `${p[i]['name']}<br>${p[i]['marker']}${p[i]['seriesName']}：${p[i]['value']}<br>`
          else str += `${p[i]['marker']}${p[i]['seriesName']}：${p[i]['value']}<br>`
        }
        return str
      }
    },
  },
  grid: {
    left: '3%',
    right: '3%'
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
      data: arr,
      position: 'bottom',
      axisLine: {
        lineStyle: {
          color: '#E7E7E7'
        }
      },
      axisLabel: {
        color: '#000'
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
      left: '3%',
      right: '3%',
      start: 0,
      end: 1999
    },
    {
      height: 22,
      bottom: 15,
      left: '3%',
      right: '3%',
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
      exportCellDisabled: false,
      excelData: [],
      solidExcelHead: {
        'Time': 'time',
        'Serial Number': 'sn'
      },
      dynamicExcelHead: {},
      excelName: '',
      charting: true,
      foldShow: false,
      exportInfo: false,
      exportCell: false,
      batCell: [],
      batInfo: [
        {
          label: 'SOC(%)',
          value: 'storeSoc'
        },
        {
          label: 'Power(kW)',
          value: 'storeChargePower'
        },
        {
          label: 'Voltage(V)',
          value: 'storeVoltage'
        },
        {
          label: 'Current(A)',
          value: 'storeCurrent'
        }
      ],
      checkedInfo: [],
      checkedCell: [],
      isIndeterminate: false,
      checkAll: false,
      drawer: false,
      curItem: -1,
      curSeries: [0],
      show: false,
      dataType: 0,
      dateVal,
      exportDateVal: dateVal,
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
        }
      ],
      voltageList: [],
      cellTList: [],
      envTList: [],
      mosTList: [],
      flag: true,
      zooList: [
        {
          label: 'Cell Highest_Voltage(V)',
          key: 'highVoltage',
          value: 0,
          name: 'Highest_Voltage'
        },
        {
          label: 'Cell Lowest_Voltage(V)',
          key: 'lowVoltage',
          value: 0,
          name: 'Lowest_Voltage'
        },
        {
          label: 'Cell Average_Voltage(V)',
          key: 'avgVoltage',
          value: 0,
          name: 'Average_Voltage'
        },
        {
          label: 'Cell Dropout_Voltage(V)',
          key: 'differVoltage',
          value: 0,
          name: 'Dropout_Voltage'
        },
      ],
      oneList: [
        {
          label: 'Cell Highest_T (°C)',
          key: 'maxTemperature',
          value: 0,
          name: 'Highest_T'
        },
        {
          label: 'Cell Lowest_T(°C)',
          key: 'minTemperature',
          value: 0,
          name: 'Lowest_T'
        },
        {
          label: 'Cell Dropout_T(°C)',
          key: 'differTemplate',
          value: 0,
          name: 'Dropout_T'
        }
      ],
    }
  },
  computed: {
    excelHead() {
      return {...this.solidExcelHead, ...this.dynamicExcelHead}
    },
    dataList() {
      return [this.voltageList, this.cellTList, this.envTList, this.mosTList][+this.dataType]
    },
    cellFlag() {
      return this.voltageList.length || this.cellTList.length || this.envTList.length || this.mosTList.length
    },
    lineList() {
      return +this.dataType === 1 ? this.oneList : this.zooList
    }
  },
  watch: {
    checkedInfo(v) {
      let item = {}
      v.forEach(i => {
        let one = this.batInfo.find(k => k.value === i)
        if (one) {
          item[`${one.label}`] = `${one.value}`
        }
      })
      this.dynamicExcelHead = item
    },
    checkedCell(v) {
      let item = {}
      v.forEach(i => {
        let one = this.batCell.find(k => k.value === i)
        if (one) {
          item[`${one.label}`] = `${one.value}`
        }
      })
      this.dynamicExcelHead = item
    }
  },
  mounted() {
    this.getInfoData()
    this.getCellData()
    let vList = [], cTList = [], eTList = [], mTList = []
    if(this.$route.params.info) {
      localStorage.setItem(`info${this.$route.params.id}`, this.$route.params.info)
      localStorage.setItem(`sn${this.$route.params.id}`, this.$route.params.sn)
      localStorage.setItem(`siteCode${this.$route.params.id}`, this.$route.params.siteCode)
    }
    let info = JSON.parse(localStorage.getItem(`info${this.$route.params.id}`))
    let analyV = [info.highVoltage, info.lowVoltage, info.avgVoltage, info.differVoltage], analyT = [info.maxTemplate, info.minTemplate, info.differTemplate]
    this.zooList.forEach((i, index) => {
      i.value = analyV[index].toFixed(3)
    })
    this.oneList.forEach((i, index) => {
      i.value = analyT[index].toFixed(3)
    })
    this.voltageList = info.cellVList || []
    if (this.voltageList.length) {
      for(let i = 0; i < info.cellVList.length; i++) {
        let item = {
          label: `Cell${i+1}-Voltage(V)`,
          value: `cell_v${i}`
        }
        vList.push(item)
      }
    }
    this.cellTList = info.cellTList || []
    if (this.cellTList.length) {
      for(let i = 0; i < this.cellTList.length; i++) {
        let item = {
          label: `T${i+1}-Cell_T(°C)`,
          value: `cell_t${i}`
        }
        cTList.push(item)
      }
    }
    this.envTList = info.envTList || []
    if (this.envTList.length) {
      for(let i = 0; i < this.envTList.length; i++) {
        let item = {
          label: `T${i+1}-Env_T(°C)`,
          value: `env_t${i}`,
          index: `${i}`
        }
        eTList.push(item)
      }
    }
    this.mosTList = info.mOSTList || []
    if (this.mosTList.length) {
      for(let i = 0; i < this.mosTList.length; i++) {
        let item = {
          label: `T${i+1}-MOS_T(°C)`,
          value: `mos_t${i}`
        }
        mTList.push(item)
      }
    }
    let params = {
      sn: localStorage.getItem(`sn${this.$route.params.id}`),
      siteCode: localStorage.getItem(`siteCode${this.$route.params.id}`),
    }
    this.excelName = `${params.sn}.xls`
    this.batCell = [...vList, ...cTList, ...eTList, ...mTList]
    this.getInfo(info, params)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.changeSize)
    clearTimeout(timer)
  },
  beforeRouteLeave(to, from, next) {
    clearTimeout(timer)
    next()
  },
  methods: {
    changeExportDate() {
      if (this.exportInfo) this.getInfoData('loading')
      else this.getCellData('loading')
    },
    drawerInfo() {
      this.exportInfo = true
      this.drawer = true
      this.excelData = dataList
    },
    drawerCell() {
      this.exportCell = true
      this.excelData = batCellData
      this.drawer = true
    },
    getCellData(v) {
      if (v) this.$modal.loading()
      let format = this.DATE_FORMAT('yyyy-MM-dd', this.exportDateVal)
      let params = {
        sn: localStorage.getItem(`sn${this.$route.params.id}`),
        siteCode: localStorage.getItem(`siteCode${this.$route.params.id}`),
        startTimeLong: (new Date(`${format} 00:00:00`).getTime()) / 1000,
        endTimeLong: (new Date(`${format} 23:59:59`).getTime()) / 1000
      }
      cellData(params).then(res => {
        let arr = res.data
        if (!arr.length || !Object.keys(arr[0]).length) return this.exportCellDisabled = true
        this.exportCellDisabled = false
        console.time('cellTimer')
        for(let i = 0; i < arr.length; i++) {
          arr[i].sn = params.sn
          arr[i].time = this.DATE_FORMAT('MM-dd-yyyy hh:mm:ss', (+arr[i].createTime) * 1000)
          for(let k = 0; k < arr[i].cellVList?.length; k++) {
            arr[i][`cell_v${k}`] = arr[i].cellVList[k]
          }
          for(let m = 0; m < arr[i].cellTList?.length; m++) {
            arr[i][`cell_t${m}`] = arr[i].cellTList[m]
          }
          for(let k = 0; k < arr[i].envTList?.length; k++) {
            arr[i][`env_t${k}`] = arr[i].envTList[k]
          }
          for(let m = 0; m < arr[i].mosTList?.length; m++) {
            arr[i][`mos_t${m}`] = arr[i].mosTList[m]
          }
        }
        console.timeEnd('cellTimer')
        batCellData = arr
      }).finally(() => {
        if (v) this.$modal.closeLoading()
      })
    },
    getInfoData(v) {
      if (v) this.$modal.loading()
      if(chartIns) {
        chartIns.dispose()
        chartIns = null
      }
      let format = this.DATE_FORMAT('yyyy-MM-dd', this.dateVal)
      let params = {
        sn: localStorage.getItem(`sn${this.$route.params.id}`),
        siteCode: localStorage.getItem(`siteCode${this.$route.params.id}`),
        startTimeLong: (new Date(`${format} 00:00:00`).getTime()) / 1000,
        endTimeLong: (new Date(`${format} 23:59:59`).getTime()) / 1000
      }
      this.charting = true
      batHistoryData(params).then(res => {
        dataList = res.data
        this.charting = false
        if (!dataList.length || !(Object.keys(dataList[0])).length) return this.flag = false
        this.flag = true
        dataList.forEach(i => {
          i.sn = params.sn
          i.time = this.DATE_FORMAT('MM-dd-yyyy hh:mm:ss', (+i.time) * 1000)
        })
        this.initCanvas()
      }).finally(() => {
        if (v) this.$modal.closeLoading()
      })
    },
    initCanvas() {
      option.xAxis[0].data = []
      option.series = []
      clearTimeout(timer)
      for(let k = 0; k < this.curSeries.length; k++) {
        let arr = []
        for(let i = 0; i < dataList.length; i++) {
          arr.push((+dataList[i][this.lineList[this.curSeries[k]].key]).toFixed(3)) // 添加key属性的值
        }
        let item = {
          name: this.lineList[this.curSeries[k]].name,
          symbol: "none",
          type: 'line',
          smooth: true,
          itemStyle: {
            color: color[this.curSeries[k]]
          },
          data: arr
        }
        option.series.push(item)
      }
      dataList.forEach(i => {
        option.xAxis[0].data.push(i.timestamp)
      })
      timer = setTimeout(() => {
        if(chartIns) {
          chartIns.dispose()
          chartIns = null
        }
        this.$nextTick(() => {
          chartIns = echarts.init(document.getElementById('line'))
          if(chartIns) chartIns.setOption(option)
          window.addEventListener('resize', this.changeSize)
        })
      }, 500)
    },
    changeSeries(k) {
      if (this.curSeries.includes(k)) {
        if (this.curSeries.length !== 1) this.curSeries.splice(this.curSeries.indexOf(k), 1)
      } else this.curSeries.push(k)
      this.curSeries = this.curSeries.sort((a, b) => a - b)
      this.initCanvas()
    },
    changeSize() {
      if(chartIns) chartIns.resize()
    },
    async getInfo(info, params) {
      await infoDevice(params).then(res => {
        this.base = {...info, ...res.data}
        let arr = [this.base.soc, this.base.power, this.base.voltage, this.base.current]
        arr.forEach((item, index) => {
          if (item || item === 0) this.infoList[index]['value'] = item
          else this.infoList[index]['value'] = '--'
        })
      })
    },
    cancelExport() {
      this.drawer = false
      this.checkedInfo = []
      this.checkedCell = []
      this.exportCell = false
      this.exportInfo = false
      this.checkAll = false
      this.isIndeterminate = false
    },
    changeCheckInfo() {
      let chooseAll = [...this.checkedInfo, ...this.checkedCell]
      this.checkAll = chooseAll.length === (this.batCell.length + this.batInfo.length)
      this.isIndeterminate = chooseAll.length > 0 && chooseAll.length < (this.batCell.length + this.batInfo.length)
    },
    changeCheckCell() {
      let chooseAll = [...this.checkedInfo, ...this.checkedCell]
      this.checkAll = chooseAll.length === (this.batCell.length + this.batInfo.length)
      this.isIndeterminate = chooseAll.length > 0 && chooseAll.length < (this.batCell.length + this.batInfo.length)
    },
    handleCheckAllChange(v) {
      this.isIndeterminate  = false
      if (v) {
        if (this.exportCell) {
          this.batCell.forEach(i => {
            this.checkedCell.push(i.value)
          })
        }
        if (this.exportInfo) {
          this.batInfo.forEach(i => {
            this.checkedInfo.push(i.value)
          })
        }
      } else {
        this.checkedCell = []
        this.checkedInfo = []
      }
    },
    changeType() {
      this.curSeries = [0]
      if ([0,1].includes(+this.dataType)) this.initCanvas()
    },
    changeItem(k) {
      this.curItem = k
      this.show = true
    },
  }
}
</script>

<style lang="scss">
.pages-monitoring {
  &-export {
    @include wh(48);
    position: fixed;
    top: 20%;
    right: 2px;
    background-color: #3EBCD4;
    border-radius: 4px 0 0 4px;
  }
  .label {
    color: #828282;
    line-height: 32px;
  }
  .value {
    color: #000;
    line-height: 32px;
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
      border: 2px solid #3EBCD4;
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
  .left {
    margin-right: 45px;
    width: 80px;
  }
  .container-battery {
    @include wh(80);
  }
  .battery {
    bottom: 3px;
    left: 0;
    @include wh(80);
  }
  .dynamicSoc {
    z-index: 0;
    width: 50px;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #8be186;
    transition: all .3s;
    border-radius: 4px;
  }
  .el-drawer__header {
    margin-bottom: 0;
    padding-bottom: 14px;
  }
  .drawer-main {
    padding: 24px;
    border-top: 1px #E7E7E7 solid;
    &-info {
      margin-top: 32px;
    }
  }
  .rotateAni {
    transform: rotate(180deg);
    transition: all .3s;
  }
}
</style>
