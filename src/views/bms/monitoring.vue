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
<!--    <common-flex @click.native="drawer = base.export" justify="center" align="center" class="pages-monitoring-export" :style="{cursor: base.export ? 'pointer' : 'not-allowed'}">-->
<!--      <img :src="require('@img/export.svg')" alt="">-->
<!--    </common-flex>-->
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
      <common-flex wrap="wrap" class="flex-container" style="max-height: 550px; overflow-y: auto">
        <common-flex class="item" v-for="(i, k) of dataList"
                     :key="k">
          <div class="item-label">{{ +dataType ? `T${k+1}(℃)` : `Cell${k+1}(V)` }}</div>
          <div class="item-value">{{ i }}</div>
        </common-flex>
      </common-flex>
    </el-card>
    <Trend :show.sync="show" :dataKey="curItem" />
  </div>
</template>

<script>
import {infoDevice} from '@/api/device'
import Trend from '@/views/components/monitor/trend.vue'
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
      isIndeterminate: false,
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
      return this.voltageList.length || this.cellTList.length || this.envTList.length || this.mosTList.length
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
    this.voltageList = info.cellVList || []
    if (this.voltageList.length) {
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
    this.cellTList = info.cellTList || []
    if (this.cellTList.length) {
      for(let i = 0; i < this.cellTList.length; i++) {
        let item = {
          label: `T${i+1}-Cell_T(°C)`,
          value: `cell_t${i+1}_avg`
        }
        cTList.push(item)
      }
    }
    this.envTList = info.envTList || []
    if (this.envTList.length) {
      for(let i = 0; i < this.envTList.length; i++) {
        let item = {
          label: `T${i+1}-Env_T(°C)`,
          value: `env_t${i+1}_avg`
        }
        eTList.push(item)
      }
    }
    this.mosTList = info.mOSTList || []
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
    this.getInfo(info, params)
  },
  methods: {
    async getInfo(info, params) {
      await infoDevice(params).then(res => {
        this.base = {...info, ...res.data}
        let arr = [this.base.soc, this.base.power, this.base.voltage, this.base.current, this.base.maxTemplate, this.base.minTemplate]
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
