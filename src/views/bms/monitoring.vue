<template>
  <div class="pages-monitoring app-container">
    <el-drawer
      :visible.sync="drawer">
      <strong slot="title" style="color: #000">Choose the fields to export</strong>
      <div class="drawer-main">
        <common-flex align="center">
          <div style="flex: 1">
            <el-date-picker
              format="MM-dd-yyyy"
              value-format="yyyy-MM-dd"
              v-model="dateVal"
              type="date"
              @change="getData()"
            />
          </div>
          <div style="flex: 1">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">Select all field</el-checkbox>
          </div>
        </common-flex>
        <div class="drawer-main-info">
          <strong>Battery Info</strong>
          <el-checkbox-group v-model="checkedInfo" @change="changeCheckInfo">
            <el-checkbox style="width: calc(100% / 4); margin-top: 12px" v-for="(i, k) in batInfo" :label="i.value" :key="k">{{ i.label }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="drawer-main-info" v-if="cellFlag">
          <strong>Battery cells monitoring</strong>
          <el-checkbox-group v-model="checkedCell" @change="changeCheckCell">
            <el-checkbox style="width: calc(100% / 4); margin-top: 12px" v-for="(i, k) in batCell" :label="i.value" :key="k">{{ i.label }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <common-flex justify="center" style="margin-top: 120px">
          <download-excel :data="excelData" :fields="excelHead" :name="excelName">
            <el-button type="primary">Export</el-button>
          </download-excel>
          <el-button style="margin-left: 24px" @click="cancelExport">Cancel</el-button>
        </common-flex>
      </div>
    </el-drawer>
    <common-flex @click.native="drawer = true" justify="center" align="center" class="pages-monitoring-export">
      <img :src="require('@img/export.svg')" alt="">
    </common-flex>
    <el-card>
      <strong slot="header">Battery Info</strong>
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
              <div class="label">Hardware version</div>
              <div class="value">{{ base.hardVersion || '--' }}</div>
            </el-col>
            <el-col :span="6">
              <div class="label">software version</div>
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
            format="MM-dd-yyyy"
            value-format="yyyy-MM-dd"
            v-model="dateVal"
            type="date"
            @change="getData()"
          />
        </div>
        <div class="line" id="line"></div>
      </div>
      <div class="chart-container" style="height: 200px" v-else>
        <no-data />
      </div>
    </el-card>
    <Trend :show.sync="show" :dataKey="curItem" />
  </div>
</template>

<script>
import {cellData, infoDevice} from '@/api/device'
import Trend from '@/views/components/monitor/trend.vue'
import * as echarts from "echarts"
let arr = [], chartIns = null, timer = null, dataList = []
let viewH = window.innerHeight
for (let i = 0; i < 24; i++) {
  arr.push(i)
}
const color = ['#f47226', '#4498ee', '#44c333', '#f31926', '#9c28e0', '#56e6e5', '#a96e1e', '#f0e140', '#f785f6', '#113464', '#3261e0', '#b1b22f', '#4e8e2f', '#ebb563', '#f78989', '#a6a9ad']
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
      batCell: [],
      batInfo: [
        {
          label: 'SOH(%)',
          value: 'soh'
        },
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
        },
        {
          label: 'Cell Highest_T (°C)',
          value: 'maxTemperature'
        },
        {
          label: 'Cell Lowest_T(°C)',
          value: 'minTemperature'
        },
      ],
      checkedInfo: [],
      checkedCell: [],
      isIndeterminate: true,
      checkAll: false,
      drawer: false,
      excelName: '',
      excelData: [],
      solidExcelHead: {
        'Time': 'time',
        'Serial Number': 'sn'
      },
      dynamicExcelHead: {},
      curItem: -1,
      curSeries: [],
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
      flag: true
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
      return this.voltageList.length && this.cellTList.length && this.envTList.length && this.mosTList.length
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
      this.checkedCell.forEach(i => {
        let one = this.batCell.find(k => k.value === i)
        if (one) {
          item[`${one.label}`] = `${one.value}`
        }
      })
      this.dynamicExcelHead = item
    },
    checkedCell(v) {
      let item = {}
      this.checkedInfo.forEach(i => {
        let one = this.batInfo.find(k => k.value === i)
        if (one) {
          item[`${one.label}`] = `${one.value}`
        }
      })
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
    let vList = [], cTList = [], eTList = [], mTList = []
    if(this.$route.params.info) localStorage.setItem(`info${this.$route.params.id}`, this.$route.params.info)
    let info = JSON.parse(localStorage.getItem(`info${this.$route.params.id}`))
    this.voltageList = info.cellVList
    if (info.cellVList.length) {
      this.curSeries = []
      this.curSeries.push(0)
      for(let i = 0; i < info.cellVList.length; i++) {
        let item = {
          label: `Cell${i+1}-Voltage(V)`,
          value: `cell_v${i+1}_avg`
        }
        vList.push(item)
      }
    }
    this.cellTList = info.cellTList
    if (this.cellTList.length) {
      for(let i = 0; i < this.cellTList.length; i++) {
        let item = {
          label: `T${i+1}-Cell_T(°C)`,
          value: `cell_t${i+1}_avg`
        }
        cTList.push(item)
      }
    }
    this.envTList = info.envTList
    if (this.envTList.length) {
      for(let i = 0; i < this.envTList.length; i++) {
        let item = {
          label: `T${i+1}-Env_T(°C)`,
          value: `env_t${i+1}_avg`
        }
        eTList.push(item)
      }
    }
    this.mosTList = info.mOSTList
    if (this.mosTList.length) {
      for(let i = 0; i < this.mosTList.length; i++) {
        let item = {
          label: `T${i+1}-MOS_T(°C)`,
          value: `mos_t${i+1}_avg`
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
    infoDevice(params).then(res => {
      this.base = {...info, ...res.data}
      let arr = [this.base.soc, this.base.power, this.base.voltage, this.base.current, this.base.maxTemplate, this.base.minTemplate]
      arr.forEach((item, index) => {
        if (item || item === 0) this.infoList[index]['value'] = item
        else this.infoList[index]['value'] = '--'
      })
    })
    this.getData()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.changeSize)
    clearTimeout(timer)
  },
  beforeRouteLeave(to, from, next) {
    if (this.loading) this.loading.close()
    this.flag = false
    clearTimeout(timer)
    next()
  },
  methods: {
    cancelExport() {
      this.drawer = false
      this.checkedInfo = []
      this.checkedCell = []
      this.checkAll = false
      this.isIndeterminate = true
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
        this.batCell.forEach(i => {
          this.checkedCell.push(i.value)
        })
        this.batInfo.forEach(i => {
          this.checkedInfo.push(i.value)
        })
      } else {
        this.checkedCell = []
        this.checkedInfo = []
      }
    },
    changeType() {
      if (this.dataList.length) {
        this.curSeries = [0]
        this.initCanvas()
      } else this.curSeries = []
    },
    requestLoading() {
      this.loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    getData() {
      this.requestLoading()
      let format = this.DATE_FORMAT('yyyy-MM-dd', this.dateVal)
      let params = {
        sn: localStorage.getItem(`sn${this.$route.params.id}`),
        siteCode: localStorage.getItem(`siteCode${this.$route.params.id}`),
        startTimeLong: (new Date(`${format} 00:00:00`).getTime()) / 1000,
        endTimeLong: (new Date(`${format} 23:59:59`).getTime()) / 1000
      }
      cellData(params).then(res => {
        dataList = res.data
        option.xAxis[0].data = []
        for(let i = 0; i < dataList.length; i++) {
          dataList[i].sn = params.sn
          dataList[i].time = this.DATE_FORMAT('MM-dd-yyyy hh:mm:ss', (+dataList[i].time) * 1000)
          option.xAxis[0].data.push(dataList[i].timestamp)
        }
        this.excelData = dataList
        this.initCanvas()
      }).finally(() => {
        this.loading.close()
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
            arr.push((+dataList[i][`${list[+this.dataType]}_t${k+1}_avg`]).toFixed(3))
          }
          let item = {
            name: `T${this.curSeries[k]+1}`,
            symbol: "none",
            type: 'line',
            smooth: true,
            itemStyle: {
              color: color[this.curSeries[k]]
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
            arr.push((+dataList[i][`cell_v${k+1}_avg`]).toFixed(3))
          }
          let item = {
            name: `Cell${this.curSeries[k]+1}`,
            symbol: "none",
            type: 'line',
            smooth: true,
            itemStyle: {
              color: color[this.curSeries[k]]
            },
            data: arr // 接受接口数据值数组
          }
          option.series.push(item)
        }
      }
      if (!this.curSeries.length) return
      clearTimeout(timer)
      timer = setTimeout(() => {
        if(chartIns) chartIns.dispose()
        this.$nextTick(() => {
          if (this.flag) {
            chartIns = echarts.init(document.getElementById('line'))
            if(chartIns) chartIns.setOption(option)
            window.addEventListener('resize', this.changeSize)
          }
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
      this.curSeries = this.curSeries.sort((a, b) => a - b)
      this.initCanvas()
    }
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
    cursor: pointer;
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
}
</style>
