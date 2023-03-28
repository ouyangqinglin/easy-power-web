<template>
  <div class="comp-device">
    <el-card class="comp-device-card">
      <common-flex align="center" class="comp-device-card-header">
        <div class="title-text">Device Info</div>
        <common-flex auto justify="flex-end">
          <el-button type="primary" @click="addDevice">Add</el-button>
          <el-button @click="delShow = true">Delete</el-button>
        </common-flex>
      </common-flex>
      <common-flex class="comp-device-card-content" v-if="currentItem">
        <div class="comp-device-card-content-nav">
          <div class="comp-device-card-content-nav-item" @click="changeNav(v)" :class="{ opacityTrans: active === v }" v-for="(v, k) in navBar">{{ k }}</div>
        </div>
        <div v-if="+active === 2" style="flex-grow: 1">
          <el-tabs v-model="activeBattery">
            <el-tab-pane label="Details" name="first"></el-tab-pane>
            <el-tab-pane label="Historical Information" name="second"></el-tab-pane>
          </el-tabs>
          <common-flex auto class="comp-device-card-content-right" v-if="activeBattery === 'first'">
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
            </common-flex>
            <common-flex direction="column" auto class="comp-device-card-content-right-container">
              <div class="item" v-for="i of batteryInfo">
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
          <common-flex auto class="comp-device-card-content-right" direction="column" v-if="activeBattery === 'second'">
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
            <div id="batteryChart" class="batteryChart"></div>
          </common-flex>
        </div>
        <common-flex auto class="comp-device-card-content-right" v-else-if="+active === 3">
          <common-flex direction="column" align="center">
            <img class="device-battery" :src="require('./img/device-discharge.svg')" alt=""><br>
            <el-button type="primary" size="mini" v-if="+curDevInfo.status === 1" @click="stopCharge">Stop Charging</el-button>
            <span class="status-tips" v-else>Not connected</span>
          </common-flex>
          <common-flex direction="column" auto class="comp-device-card-content-right-container">
            <div class="item" v-for="i of chargeInfo">
              <div class="item-title">{{ i.title }}</div>
              <common-flex class="item-body" wrap="wrap">
                <div class="item-body-item charge" v-for="(v, k) of i.info">
                  <div class="item-body-item-key">{{ k }}</div>
                  <div class="item-body-item-value">{{ v || '--' }}</div>
                </div>
              </common-flex>
            </div>
          </common-flex>
        </common-flex>
        <common-flex auto class="comp-device-card-content-right" v-else-if="+active === 4">
          <common-flex direction="column" align="center">
            <img class="device-battery" :src="require('./img/device-stick.svg')" alt=""><br>
            <span class="status-tips" v-if="+curDevInfo.net === 1">on-line</span>
            <span class="status-tips" v-else>off-line</span>
          </common-flex>
          <common-flex direction="column" auto class="comp-device-card-content-right-container">
            <div class="item" v-for="i of stickInfo">
              <div class="item-title">{{ i.title }}</div>
              <common-flex class="item-body" wrap="wrap">
                <div class="item-body-item charge" v-for="(v, k) of i.info">
                  <div class="item-body-item-key">{{ k }}</div>
<!--                  <div class="item-body-item-value" v-if="k === 'Wifi'">{{ v || '&#45;&#45;' }}<br>-->
<!--                    <span style="color: #828282">Password:</span> {{ stickInfo.wifiPassword || '&#45;&#45;' }}-->
<!--                  </div>-->
                  <div class="item-body-item-value">{{ v || '--' }}</div>
                </div>
              </common-flex>
            </div>
          </common-flex>
        </common-flex>

        <div v-else-if="+active === 6" style="flex-grow: 1">
          <el-tabs v-model="activePv">
            <el-tab-pane label="Details" name="first"></el-tab-pane>
            <el-tab-pane label="Historical Information" name="second"></el-tab-pane>
          </el-tabs>
          <common-flex auto class="comp-device-card-content-right" v-if="activePv === 'first'">
            <common-flex direction="column" align="center">
              <img class="device-battery" :src="require('./img/device-pv.svg')" alt=""><br>
              <span class="status-tips" v-if="+curDevInfo.net === 1">on-line</span>
              <span class="status-tips" v-else>off-line</span>
            </common-flex>
            <common-flex direction="column" auto class="comp-device-card-content-right-container">
              <div class="table posr">
                <div class="table-title">Real-Time Data</div>
                <el-table :data="pvInfo.pvList">
                  <el-table-column label="" prop="pvNum"></el-table-column>
                  <el-table-column label="Voltage(V)" prop="v"></el-table-column>
                  <el-table-column label="Current(A)" prop="c"></el-table-column>
                  <el-table-column label="Power(kW)" prop="p"></el-table-column>
                </el-table>
              </div>
              <div class="item">
                <div class="item-title">PV Energy Produced</div>
                <common-flex class="item-body" wrap="wrap">
                  <div class="item-body-item">
                    <div class="item-body-item-key">Today</div>
                    <div class="item-body-item-value">{{ pvInfo.dayPvEnergyProduce || '--' }}kWh</div>
                  </div>
                  <div class="item-body-item">
                    <div class="item-body-item-key">This Month</div>
                    <div class="item-body-item-value">{{ pvInfo.monthPvEnergyProduce || '--' }}kWh</div>
                  </div>
                  <div class="item-body-item">
                    <div class="item-body-item-key">This Year</div>
                    <div class="item-body-item-value">{{ pvInfo.yearPvEnergyProduce || '--' }}kWh</div>
                  </div>
                  <div class="item-body-item">
                    <div class="item-body-item-key">Lifetime</div>
                    <div class="item-body-item-value">{{ pvInfo.allPvEnergyProduce || '--' }}kWh</div>
                  </div>
                </common-flex>
              </div>
              <div class="item">
                <div class="item-title">PV Operation Time</div>
                <common-flex class="item-body" wrap="wrap">
                  <div class="item-body-item">
                    <div class="item-body-item-key">Lifetime</div>
                    <div class="item-body-item-value">{{ pvInfo.Lifetime || '--' }}</div>
                  </div>
                </common-flex>
              </div>
              <div class="item">
                <div class="item-title">Photovoltaic  Basic Info</div>
                <common-flex class="item-body" wrap="wrap">
                  <div class="item-body-item charge">
                    <div class="item-body-item-key">Serial Number</div>
                    <div class="item-body-item-value">{{ pvInfo.sn }}</div>
                  </div>
                  <div class="item-body-item">
                    <div class="item-body-item-key">Capacity (kW)</div>
                    <div class="item-body-item-value">{{ pvInfo.nameplateCapacity }}</div>
                  </div>
                </common-flex>
              </div>
            </common-flex>
          </common-flex>
          <common-flex auto class="comp-device-card-content-right" direction="column" v-if="activePv === 'second'">
            <div class="posr">
              <common-flex class="pv-nav posa" justify="flex-end">
                <el-radio-group v-model="pvHis.pvType" size="small" @change="changePvType">
                  <el-radio-button label="Voltage"></el-radio-button>
                  <el-radio-button label="Current"></el-radio-button>
                  <el-radio-button label="Power"></el-radio-button>
                </el-radio-group>
                <el-date-picker
                  size="small"
                  style="margin: 0 40px 0 10px"
                  format="MM-dd-yyyy"
                  value-format="yyyy-MM-dd"
                  @change="changePvDate"
                  v-model="pvHis.dateVal"
                />
              </common-flex>
              <div id="pvChart" class="pvChart"></div>
            </div>
          </common-flex>
        </div>
        <common-flex auto class="comp-device-card-content-right" v-else>
          <common-flex direction="column" align="center">
            <img class="device-battery" :src="require('./img/device-inverter.svg')" alt=""><br>
<!--            <span class="status-tips" v-if="+curDevInfo.net === 1">on-line</span>-->
<!--            <span class="status-tips" v-else>off-line</span>-->
          </common-flex>
          <common-flex direction="column" auto class="comp-device-card-content-right-container">
            <div class="item">
              <div class="item-title">Inverter Basic Info</div>
              <common-flex class="item-body" wrap="wrap">
                <div class="item-body-item charge">
                  <div class="item-body-item-key">Serial Number</div>
                  <div class="item-body-item-value">{{ inverterInfo.serialNumber }}</div>
                </div>
                <div class="item-body-item">
                  <div class="item-body-item-key">Manufacturer</div>
                  <div class="item-body-item-value">{{ inverterInfo.manufacturer }}</div>
                </div>
              </common-flex>
            </div>
            <div class="table posr">
              <div class="table-before posa">Grid</div>
              <div class="table-export posa" v-if="+base.gridStatus === 1">Export</div>
              <div class="table-export posa" v-if="+base.gridStatus === 2">Import</div>
              <div class="table-title">Real-Time Data</div>
              <el-table :data="inverterInfo.gridList">
                <el-table-column label="" prop="pvNum"></el-table-column>
                <el-table-column label="Voltage(V)" prop="v"></el-table-column>
                <el-table-column label="Current(A)" prop="c"></el-table-column>
                <el-table-column label="Power(kW)" prop="p"></el-table-column>
              </el-table>
            </div>
            <div class="item">
              <div class="item-title">Export Energy</div>
              <common-flex class="item-body" wrap="wrap">
                <div class="item-body-item">
                  <div class="item-body-item-key">Today</div>
                  <div class="item-body-item-value">{{ inverterInfo.dayGridExportEnergy || '--' }}kWh</div>
                </div>
                <div class="item-body-item">
                  <div class="item-body-item-key">This Month</div>
                  <div class="item-body-item-value">{{ inverterInfo.monthGridExportEnergy || '--' }}kWh</div>
                </div>
                <div class="item-body-item">
                  <div class="item-body-item-key">This Year</div>
                  <div class="item-body-item-value">{{ inverterInfo.yearGridExportEnergy || '--' }}kWh</div>
                </div>
                <div class="item-body-item">
                  <div class="item-body-item-key">Lifetime</div>
                  <div class="item-body-item-value">{{ inverterInfo.allGridExportEnergy || '--' }}kWh</div>
                </div>
              </common-flex>
            </div>
            <div class="item">
              <div class="item-title">Import Energy This Month</div>
              <common-flex class="item-body" wrap="wrap">
                <div class="item-body-item">
                  <div class="item-body-item-key">On-Peak</div>
                  <div class="item-body-item-value">{{ inverterInfo.gridOnPeak }}kWh</div>
                </div>
                <div class="item-body-item">
                  <div class="item-body-item-key">Mid-Peak</div>
                  <div class="item-body-item-value">{{ inverterInfo.gridMidPeak }}kWh</div>
                </div>
                <div class="item-body-item">
                  <div class="item-body-item-key">Off-Peak</div>
                  <div class="item-body-item-value">{{ inverterInfo.gridOffPeak }}kWh</div>
                </div>
              </common-flex>
            </div>
            <div class="table posr">
              <div class="table-before posa">Load</div>
              <div class="table-title">Real-Time Data</div>
              <el-table :data="inverterInfo.loadList">
                <el-table-column label="" prop="pvNum"></el-table-column>
                <el-table-column label="Voltage(V)" prop="v"></el-table-column>
                <el-table-column label="Current(A)" prop="c"></el-table-column>
                <el-table-column label="Power(kW)" prop="p"></el-table-column>
              </el-table>
            </div>
          </common-flex>
        </common-flex>
      </common-flex>
    </el-card>
    <el-dialog v-if="addShow" :visible.sync="addShow" title="Add Device"
               :before-close="beforeClose"
               :close-on-click-modal ="false"
               width="50%">
      <el-form @submit.native.prevent class="dialog-form" v-if="addDialogInfo[2]" :model="batteryRequire" :rules="rules" ref="ruleForm">
        <el-form-item label="Battery">
          <el-input @input="change(2, $event)" :disabled="!!navBar['Battery']" v-model.trim="addDialogInfo[2].serialNumber" placeholder="Please enter the serial number"></el-input>
        </el-form-item>
        <el-form-item label="Capacity (kWh)" prop="nameplateCapacity">
          <el-input @blur="change(2)" @input="validateNum(batteryRequire.nameplateCapacity, 'batteryRequire')" type="text" :disabled="!!navBar['Battery']" v-model.trim="batteryRequire.nameplateCapacity" placeholder="Please enter the capacity"></el-input>
        </el-form-item>
      </el-form>
      <el-form @submit.native.prevent class="dialog-form" v-if="addDialogInfo[6]" :model="pvRequire" :rules="pvRules" ref="pvForm">
        <el-form-item label="Photovoltaic">
          <el-input @input="change(6, $event)" :disabled="!!navBar['Photovoltaic']" v-model.trim="addDialogInfo[6].serialNumber" placeholder="Please enter the serial number"></el-input>
        </el-form-item>
        <el-form-item label="Capacity (kW)" prop="nameplateCapacity">
          <el-input @blur="change(6)" @input="validateNum(pvRequire.nameplateCapacity, 'pvRequire')" type="text" :disabled="!!navBar['Photovoltaic']" v-model.trim="pvRequire.nameplateCapacity" placeholder="Please enter the capacity"></el-input>
        </el-form-item>
      </el-form>
      <el-form @submit.native.prevent class="dialog-form" v-if="addDialogInfo[3]">
        <el-form-item label="EV charger">
          <el-input @input="change(3)" :disabled="!!navBar['EV charger']" v-model.trim="addDialogInfo['3'].serialNumber" placeholder="Please enter the serial number"></el-input>
        </el-form-item>
      </el-form>
      <el-form @submit.native.prevent class="dialog-form" v-if="addDialogInfo[1]">
        <el-form-item label="Inverter">
          <el-input @input="change(1)" :disabled="!!navBar['Inverter']" v-model.trim="addDialogInfo['1'].serialNumber" placeholder="Please enter the serial number"></el-input>
        </el-form-item>
      </el-form>
      <el-form @submit.native.prevent class="dialog-form" v-if="addDialogInfo[4]">
        <el-form-item label="Stick Logger">
          <el-input @input="change(4)" :disabled="!!navBar['Stick Logger']" v-model.trim="addDialogInfo['4'].serialNumber" placeholder="Please enter the serial number"></el-input>
        </el-form-item>
      </el-form>
      <common-flex style="margin-top: 30px" justify="center">
        <el-button :type="addSubType" :disabled="!addSubType" @click="submit">Submit</el-button>
        <el-button @click="addShow = false; fillAddDialog(); addSubType = ''">Cancel</el-button>
      </common-flex>
    </el-dialog>
    <el-dialog v-if="delShow" :visible.sync="delShow" title="Delete Device"
               :before-close="beforeClose"
               :close-on-click-modal ="false"
               width="50%">
      <el-form @submit.native.prevent class="dialog-form">
        <el-form-item class="select" label=" Product Type">
          <el-select @change="watchSelect" style="width: 100%" v-model="delDialogInfo.deviceType" placeholder="Please select">
            <el-option v-for="i of delDialogInfo.option"
                       :label="i.label"
                       :value="i.value"
                       :key="i.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SN">
          <el-input disabled v-model="delDialogInfo.sn"></el-input>
        </el-form-item>
      </el-form>
      <common-flex style="margin-top: 30px" justify="center">
        <el-button :type="delSubType" :disabled="!delSubType" @click="delDevice">Delete</el-button>
        <el-button @click="cancelDelete">Cancel</el-button>
      </common-flex>
    </el-dialog>
  </div>
</template>

<script>
import * as echarts from 'echarts'

import { listDevice, infoDevice, addBatchDevice, setDevice, delDevice, stopCharge, batHistoryData, pvHistoryData } from '@/api/device'
let deviceNavInfo = {}
let batteryInstance = null
let pvInstance = null
let timer = null
let arr = [], arr1 = [], arr5 = []
let arrX1 = [], arrX2 = [], pv1 = [], pv2 = [], pv3 = [], pv4 = []
let batData = [], pvData = []
for (let i = 1; i < 25; i++) {
  arr.push(i)
  arrX1.push(i)
}
const optionBat = {
  tooltip: {
    trigger: 'axis',
    position: function (pt) {
      return [pt[0] + 20, pt[1] - 10];
    },
    formatter(v) {
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
      } else return `${v[0].name}<br>${v[0].marker} ${v[0].value}`
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
      left: 60,
      right: 60,
      start: 0,
      // zoomOnMouseWheel: false,
      end: 1999
    },
    {
      height: 22,
      bottom: 15,
      left: 60,
      right: 60,
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
  series: [
    {
      symbol: "none",
      // name: 'A相',
      type: 'line',
      smooth: true,
      itemStyle: {
        color: '#FFB968'
      },
      data: []
    }
  ]
}
const optionPv = {
  tooltip: {
    trigger: 'axis',
    position: function (pt) {
      return [pt[0] + 20, pt[1] - 10];
    },
    formatter(v) {
      let v0, v1, v2, v3, t1, t2, t3, t4, res, unit1, unit2, unit3, unit4
      if (optionPv.yAxis.name === 'kW') {
        if (v[0]) {
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
          v0 = `${v[0].marker}${v[0].seriesName}: ${t1}${unit1}`
        }
        if (v[1]) {
          if (v[1].value < 1) {
            t2 = `${(v[1].value * 1000).toFixed(2)}`
            unit2 = 'W'
          } else if (v[1].value > 1 && v[1].value < 1000) {
            t2 = `${(+v[1].value).toFixed(2)}`
            unit2 = 'kW'
          } else {
            t2 = `${(+v[1].value / 1000).toFixed(2)}`
            unit2 = 'MW'
          }
          v1 = `${v[1].marker}${v[1].seriesName}：${t2}${unit2}`
        }
        if (v[2]) {
          if (v[2].value < 1) {
            t3 = `${(v[2].value * 1000).toFixed(2)}`
            unit3 = 'W'
          } else if (v[2].value > 1 && v[2].value < 1000) {
            t3 = `${(+v[2].value).toFixed(2)}`
            unit3 = 'kW'
          } else {
            t3 = `${(+v[2].value / 1000).toFixed(2)}`
            unit3 = 'MW'
          }
          v2 = `${v[2].marker}${v[2].seriesName}：${t3}${unit3}`
        }
        if (v[3]) {
          if (v[3].value < 1) {
            t4 = `${(v[3].value * 1000).toFixed(2)}`
            unit4 = 'W'
          } else if (v[3].value > 1 && v[3].value < 1000) {
            t4 = `${(+v[3].value).toFixed(2)}`
            unit4 = 'kW'
          } else {
            t4 = `${(+v[3].value / 1000).toFixed(2)}`
            unit4 = 'MW'
          }
          v3 = `${v[3].marker}${v[3].seriesName}：${t4}${unit4}`
        }
        if (v0) res = `${v0}<br>`
        if (v1) res += `${v1}<br>`
        if (v2) res += `${v2}<br>`
        if (v3) res += `${v3}<br>`
        return `${v[0].name}<br>${res}`
      } else {
        if (v[0]) {
          t1 = `${(+v[0].value).toFixed(2)}`
          v0 = `${v[0].marker}${v[0].seriesName}: ${t1}`
        }
        if (v[1]) {
          t2 = `${(+v[1].value).toFixed(2)}`
          v1 = `${v[1].marker}${v[1].seriesName}: ${t2}`
        }
        if (v[2]) {
          t3 = `${(+v[2].value).toFixed(2)}`
          v2 = `${v[2].marker}${v[2].seriesName}: ${t3}`
        }
        if (v[3]) {
          t4 = `${(+v[3].value).toFixed(2)}`
          v3 = `${v[3].marker}${v[3].seriesName}: ${t4}`
        }
        if (v0) res = `${v0}<br>`
        if (v1) res += `${v1}<br>`
        if (v2) res += `${v2}<br>`
        if (v3) res += `${v3}<br>`
        return `${v[0].name}<br>${res}`
      }
    }
  },
  legend: {
    data: ['PV1', 'PV2', 'PV3', 'PV4'],
    icon: 'circle',
    top: '10%',
    left: '5%'
  },
  grid: {
    left: '5%',
    right: '5%',
    top: '30%'
  },
  xAxis: [
    {
      type: 'category',
      show: false,
      boundaryGap: true,
      data: [], // 接受接口时间点
      position: 'bottom',
      axisPointer: {
        show: true
      },
    },
    {
      type: 'category',
      boundaryGap: true,
      axisTick: {
        show: true,
        alignWithLabel: true
      },
      data: arrX1,
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
        type: 'none'
      },
    }

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
      left: 60,
      right: 60,
      start: 0,
      // zoomOnMouseWheel: false,
      end: 1999
    },
    {
      height: 22,
      bottom: 15,
      left: 60,
      right: 60,
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
  series: [
    {
      symbol: "none",
      name: 'PV1',
      type: 'line',
      smooth: true,
      itemStyle: {
        color: '#FFB968'
      },
      data: [],
      zlevel: 1,
      z: 1
    },
    {
      symbol: "none",
      name: 'PV2',
      type: 'line',
      smooth: true,
      itemStyle: {
        color: '#3DAABF'
      },
      data: [],
      zlevel: 2,
      z: 2
    },
    {
      symbol: "none",
      name: 'PV3',
      type: 'line',
      smooth: true,
      itemStyle: {
        color: '#8BEA91'
      },
      data: [],
      zlevel: 3,
      z: 3
    },
    {
      symbol: "none",
      name: 'PV4',
      type: 'line',
      smooth: true,
      itemStyle: {
        color: '#638AE3'
      },
      data: [],
      zlevel: 4,
      z: 4
    }
  ]
}

export default {
  name: "comp-device",
  props: {
    base: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      batteryHis: {
        batteryType: 'Voltage',
        dateVal: new Date()
      },
      pvHis: {
        pvType: 'Voltage',
        dateVal: new Date()
      },
      activeBattery: 'first',
      activePv: 'first',
      loading: '',
      dynamicSoc: '',
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        delFlag: 0,
        siteCode: ''
      },
      listDev: [],
      curDevInfo: {},
      currentItem: {},
      sn: '',
      navBar: {},
      addDialogInfo: {},
      delDialogInfo: {
        id: '',
        deviceType: '',
        sn: '',
        option: [
          {
            label: 'Inverter', // -逆变器
            value: '1'
          },
          {
            label: 'Battery',
            value: '2'
          },
          {
            label: 'EV charger',
            value: '3'
          },
          {
            label: 'Stick Logger', // 通信棒
            value: '4'
          },
          {
            label: 'Photovoltaic',
            value: '6'
          },
        ]
      },
      addShow: false,
      delShow: false,
      active: '',
      inverterInfo: {},
      pvInfo: {},
      batteryInfo: [
        {
          'title': 'Real-Time Data',
          'info': {
            'Soc': '',
            'Current': '',
            'Voltage': '',
            'Power': ''
          },
        },
        {
          'title': 'Charging Energy',
          'info': {
            'Today': '',
            'This Month': '',
            'This Year': '',
            'Lifetime': ''
          },
        },
        {
          'title': 'Discharging Energy',
          'info': {
            'Today': '',
            'This Month': '',
            'This Year': '',
            'Lifetime': ''
          },
        },
        {
          'title': 'Battery Operation Time',
          'info': {
            'Lifetime': '',
          },
        },
        {
          'title': 'Basic Info',
          'info': {
            'Serial Number': '',
            'Manufacturer': '',
            'Nameplate capacity (kWh)': '',
            'Connected Inverter': ''
          },
        },
      ],
      chargeInfo: [
        {
          'title': 'Real-Time Data',
          'info': {
            'Session Started': '',
            'Duration': '',
            'Energy Added': '',
            'L1-Voltage': '',
            'L2-Voltage': '',
          },
        },
        {
          'title': 'Import',
          'info': {
            'Power': '',
            'L1-Current': '',
            'L2-Current': '',
          },
        },
        {
          'title': 'Export',
          'info': {
            'Power': '',
            'L1-Current': '',
            'L2-Current': '',
          },
        },
        {
          'title': 'Charging Energy',
          'info': {
            'Today': '',
            'This Month': '',
            'This Year': '',
            'Lifetime': ''
          },
        },
        {
          'title': 'EV charger Operation Time',
          'info': {
            'Lifetime': '',
          },
        },
        {
          'title': 'Basic Info',
          'info': {
            'Serial Number': '',
            'Manufacturer': ''
          },
        },
      ],
      stickInfo: [

        {
          'title': 'Basic Info',
          'info': {
            'Serial Number': '',
            'Manufacturer': '',
          },
        },
      ],
      addSubType: '',
      delSubType: '',
      localChangeList: [],
      batteryRequire: {
        nameplateCapacity: ''
      },
      rules: {
        nameplateCapacity: [
          { required: false, message: "Please enter the capacity", trigger: ['blur', 'change'] }
        ]
      },
      pvRequire: {
        nameplateCapacity: ''
      },
      pvRules: {
        nameplateCapacity: [
          { required: false, message: "Please enter the capacity", trigger: ['blur', 'change'] }
        ]
      },
      waitLoading: ''
    }
  },
  watch: {
    base: {
      handler(v) {
        deviceNavInfo = {}
        this.queryParams.siteCode = this.$route.query?.siteCode
        this.getList()
      },
      immediate: true
    },
    activeBattery (v) {
      if (v === 'second') {
        this.$nextTick(() => {
          batteryInstance = echarts.init(document.getElementById('batteryChart'))
          this.requestLoading()
          this.getBatHisData()
          window.addEventListener('resize', this.changeSize)
        })
      }
    },
    activePv (v) {
      if (v === 'second') {
        this.$nextTick(() => {
          pvInstance = echarts.init(document.getElementById('pvChart'))
          this.requestLoading()
          this.getPvHisData()
          window.addEventListener('resize', this.changeSize)
        })
      }
    }
  },
  beforeDestroy() {
    clearInterval(timer)
    window.removeEventListener('resize', this.changeSize)
  },
  methods: {
    requestLoading() {
      this.waitLoading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    changeBatDate() {
      this.getBatHisData()
    },
    changeBatType() {
      arr1 = []
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
          arr1.push(batData[i].temperature)
        }
      }
      optionBat.series[0].data = arr1
      batteryInstance.setOption(optionBat)
      console.log('changeBat')
    },
    getBatHisData() {
      let params = {
        siteCode: this.queryParams.siteCode,
        startTime: this.DATE_FORMAT('yyyy-MM-dd', this.batteryHis.dateVal),
      }
      batHistoryData(params).then(res => {
        batData = res.data
        arr5 = []
        for(let i = 0; i < res.data.length; i++) {
          arr5.push(res.data[i].timestamp)
        }
        optionBat.xAxis[0].data = arr5
        this.changeBatType()
      }).finally(() => {
        this.waitLoading.close()
      })
    },
    changePvDate() {
      this.getPvHisData()
    },
    changePvType() {
      pv1 = []
      pv2 = []
      pv3 = []
      pv4 = []
      for(let i = 0; i < pvData.length; i++) {
        pv1.push((+pvData[i][`pv1${this.pvHis.pvType}`]).toFixed(2))
        pv2.push((+pvData[i][`pv2${this.pvHis.pvType}`]).toFixed(2))
        pv3.push((+pvData[i][`pv3${this.pvHis.pvType}`]).toFixed(2))
        pv4.push((+pvData[i][`pv4${this.pvHis.pvType}`]).toFixed(2))
      }
      const weakMap = {
        'Voltage' : 'V',
        'Current' : 'A',
        'Power' : 'kW',
      }
      optionPv.yAxis.name = weakMap[this.pvHis.pvType]
      optionPv.series[0].data = pv1
      optionPv.series[1].data = pv2
      optionPv.series[2].data = pv3
      optionPv.series[3].data = pv4
      pvInstance.setOption(optionPv)
      console.log('changePv')
    },
    getPvHisData() {
      let params = {
        siteCode: this.queryParams.siteCode,
        startTime: this.DATE_FORMAT('yyyy-MM-dd', this.pvHis.dateVal),
      }
      pvHistoryData(params).then(res => {
        // console.log('hisPv', res.data)
        pvData = res.data
        for(let i = 0; i < pvData.length; i++) {
          arrX2.push(res.data[i].timestamp)
        }
        optionPv.xAxis[0].data = arrX2
        this.changePvType()
      }).finally(() => {
        this.waitLoading.close()
      })
    },
    changeSize() {
      clearInterval(timer)
      timer = setTimeout(() => {
        if (batteryInstance) batteryInstance.resize()
        if (pvInstance) pvInstance.resize()
      }, 500)
    },
    openLoading() {
      this.loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    stopCharge() {
      this.openLoading()
      let data = {
        siteCode: this.queryParams.siteCode
      }
      stopCharge(data).then(res => {
        if (+res.code === 200) {
          this.$message({
            type: 'success',
            message: 'Succeeded!'
          })
          this.getList()
        } else {
          this.$message({
            type: 'warning',
            message: 'Not Succeeded!'
          })
        }
      }).finally(() => this.loading.close())
    },
    cancelDelete() {
      this.delShow = false
      this.delDialogInfo.id = ''
      this.delDialogInfo.deviceType = ''
      this.delDialogInfo.sn = ''
    },
    delDevice() {
      delDevice(this.delDialogInfo.id).then(res => {
        if (+res.code === 200) {
          this.$message({
            type: 'success',
            message: 'Succeeded!'
          })
          this.cancelDelete()
          this.getList()
        }
      })
    },
    watchSelect() {
      let item = this.listDev.find(i => +i.deviceType === +this.delDialogInfo.deviceType)
      if (item) {
        this.delDialogInfo.sn = item.serialNumber
        this.delDialogInfo.id = item.id
        this.delSubType = 'primary'
      } else {
        this.delDialogInfo.sn = ''
        this.delSubType = ''
        this.delDialogInfo.id = ''
      }
    },
    validateNum(val, key) {
      val = val.replace(/(^\s*)|(\s*$)/g, "")
      if(!val) {
        this[key].nameplateCapacity = ""
        return
      }
      const reg = /^\d+(\.\d{0,3})?$/
      if (!reg.test(val)) {
        val = val.slice(0, -1)
      }
      this[key].nameplateCapacity = val;
    },
    submit () {
      let v1, v2
      this.$refs.ruleForm.validate(v => {
        v1 = v
      })
      this.$refs.pvForm.validate(v => {
        v2 = v
      })

      if (v1 && v2) {
        this.addDialogInfo[2].nameplateCapacity = +this.batteryRequire.nameplateCapacity
        this.addDialogInfo[6].nameplateCapacity = +this.pvRequire.nameplateCapacity
        let data = {
          deviceList: [],
          siteCode: this.queryParams.siteCode
        }
        let deviceList = []
        for (let v in this.addDialogInfo) {
          let item = {
            deviceType: v,
            serialNumber: this.addDialogInfo[v].serialNumber,
            nameplateCapacity: +this.addDialogInfo[v].nameplateCapacity
          }
          if (this.addDialogInfo[v].serialNumber) deviceList.push(item)
        }
        data.deviceList = deviceList
        addBatchDevice(data).then(res => {
          if (+res.code === 200) {
            this.$message({
              type: 'success',
              message: 'Succeeded!'
            })
            this.beforeClose()
            this.getList()
          }
        })
      }
    },
    change(type) {
      if ([2, 6].includes(type)) {
        if (type === 2) {
          if (this.addDialogInfo[2].serialNumber.replace(/\s*/g,"")) {
            this.rules.nameplateCapacity[0].required = true
            this.rules = {...this.rules}
          } else {
            this.rules.nameplateCapacity[0].required = false
            this.rules = {...this.rules}
          }
        } else {
          if (this.addDialogInfo[6].serialNumber.replace(/\s*/g,"")) {
            this.pvRules.nameplateCapacity[0].required = true
            this.pvRules = {...this.pvRules}
          } else {
            this.pvRules.nameplateCapacity[0].required = false
            this.pvRules = {...this.pvRules}
          }
        }
      }
      if (!this.localChangeList.includes(type)) this.localChangeList.push(type)
      let i = 0;
      for(i; i < this.localChangeList.length; i++) {
        if (this.addDialogInfo[this.localChangeList[i]].serialNumber.replace(/\s*/g,"")) break
      }
      if (i < this.localChangeList.length) this.addSubType = 'primary'

      else this.addSubType = ''
    },
    addDevice() {
      this.addShow = true
    },
    beforeClose() {
      this.addShow = false
      this.addSubType = ''
      this.delShow = false
    },
    fillAddDialog() {
      let haveTypeList = [2, 3, 1, 4, 6]
      haveTypeList.forEach(i => {
        let item = this.listDev.find(item => +item.deviceType === i)
        if (item) {
          if (i === 2) this.batteryRequire.nameplateCapacity = item.nameplateCapacity
          if (i === 6) this.pvRequire.nameplateCapacity = item.nameplateCapacity
          let info = {
            deviceType: i,
            serialNumber: item.serialNumber,
            nameplateCapacity: item.nameplateCapacity
          }
          this.$set(this.addDialogInfo, i, info)
        } else {
          let info = {
            deviceType: i,
            serialNumber: '',
            nameplateCapacity: ''
          }
          this.$set(this.addDialogInfo, i, info)
        }
      })
      if (!this.addDialogInfo[2].serialNumber) this.batteryRequire.nameplateCapacity = ''
      if (!this.addDialogInfo[6].serialNumber) this.pvRequire.nameplateCapacity = ''
    },
    getList() {
      this.navBar = {}
      listDevice(this.queryParams).then(res => {
        this.listDev = res.rows
        let haveBattery = this.listDev.find(i => +i.deviceType === 2)
        let haveCharge = this.listDev.find(i => +i.deviceType === 3)
        let haveInverter = this.listDev.find(i => +i.deviceType === 1)
        let haveStick = this.listDev.find(i => +i.deviceType === 4)
        let havePv = this.listDev.find(i => +i.deviceType === 6)
        if (haveBattery) this.$set(this.navBar, 'Battery', '2')
        if (haveCharge) this.$set(this.navBar, 'EV charger', '3')
        if (haveInverter) this.$set(this.navBar, 'Inverter', '1')
        if (haveStick) this.$set(this.navBar, 'Stick Logger', '4')
        if (havePv) this.$set(this.navBar, 'Photovoltaic', '6')
        let haveTypeList = [2, 3, 1, 4, 6]
        this.fillAddDialog()
        let i = 0
        for(i; i < haveTypeList.length; i++) {
          if (this.listDev.find(item => +item.deviceType === haveTypeList[i])) break
        }
        this.currentItem = this.listDev.find(item => +item.deviceType === haveTypeList[i])
        if (this.currentItem) {
          this.sn = this.currentItem.serialNumber
          this.active = this.currentItem.deviceType + ''
          this.getDeviceInfo()
        }
      })
    },
    changeNav(v) {
      this.activePv = this.activeBattery = 'first'
      this.active = v
      this.currentItem = this.listDev.find(i => +i.deviceType === +v)
      this.sn = this.currentItem.serialNumber
      if (deviceNavInfo[this.sn]) {
        this.curDevInfo = deviceNavInfo[this.sn]
        this.tempInfo()
      } else this.getDeviceInfo()
    },
    getDeviceInfo() {
      let data = {
        sn: this.sn,
        siteCode: this.queryParams.siteCode
      }
      infoDevice(data).then(res => {
        deviceNavInfo[this.sn] = {...res.data, ...this.currentItem}
        this.curDevInfo = deviceNavInfo[this.sn]
        // status 1-充电中 2-已完成
        if (this.curDevInfo.extInfo) {
          this.curDevInfo.extInfo = JSON.parse(this.curDevInfo.extInfo)
        }
        this.tempInfo()
      })
    },
    tempInfo() {
      if (+this.active === 2) {
        let arr = [
          [
            {
              key: 'Soc',
              value: 'curEnergy'
            },
            {
              key: 'Current',
              value: 'current'
            },
            {
              key: 'Voltage',
              value: 'voltage'
            },
            {
              key: 'Power',
              value: 'power'
            },
          ],
          [
            {
              key: 'Today',
              value: 'dayChargeEnergy'
            },
            {
              key: 'This Month',
              value: 'monthChargeEnergy'
            },
            {
              key: 'This Year',
              value: 'yearChargeEnergy'
            },
            {
              key: 'Lifetime',
              value: 'allChargeEnergy'
            },
          ],
          [
            {
              key: 'Today',
              value: 'dayDisChargeEnergy'
            },
            {
              key: 'This Month',
              value: 'monthDisChargeEnergy'
            },
            {
              key: 'This Year',
              value: 'yearDisChargeEnergy'
            },
            {
              key: 'Lifetime',
              value: 'allDisChargeEnergy'
            },
          ],
          [
            {
              key: 'Lifetime',
              value: '' // 没有
            }
          ],
          [
            {
              key: 'Serial Number',
              value: 'serialNumber'
            },
            {
              key: 'Manufacturer',
              value: 'manufacturer'
            },
            {
              key: 'Nameplate capacity (kWh)',
              value: 'nameplateCapacity'
            },
            {
              key: 'Connected Inverter',
              value: 'connectedInverter'
            }
          ],
        ]
        arr.forEach((i, index) => {
          i.forEach(k => {
            if (k.key === 'Soc') {
              if(+this.base.storeConnectStatus === 2) {
                this.batteryInfo[index]['info'][k.key] = 0
                this.dynamicSoc = 0
                return
              }
              this.batteryInfo[index]['info'][k.key] = ((this.curDevInfo[k.value] / this.curDevInfo['capacity']) * 100).toFixed(0) + '%'
              this.dynamicSoc = this.curDevInfo[k.value] / this.curDevInfo['capacity']
            }
            else if (k.key === 'Current') {
              if (+this.base.storeConnectStatus === 2) {
                this.batteryInfo[index]['info'][k.key] = 0
                return
              }
              this.batteryInfo[index]['info'][k.key] = this.curDevInfo[k.value] + 'A'
            }
            else if (k.key === 'Voltage') {
              if (+this.base.storeConnectStatus === 2) {
                this.batteryInfo[index]['info'][k.key] = 0
                return
              }
              this.batteryInfo[index]['info'][k.key] = this.curDevInfo[k.value] + 'V'
            }
            else if (k.key === 'Power') {
              if (+this.base.storeConnectStatus === 2) {
                this.batteryInfo[index]['info'][k.key] = 0
                return
              }
              this.batteryInfo[index]['info'][k.key] = this.curDevInfo[k.value] + 'kW'
            }
            else if (index === 4 || index === 3) {
              if (index === 3) {
                let resStr = ''
                resStr = `${+(this.curDevInfo.periodDay)} Days ${+(this.curDevInfo.periodMonth)} Months ${+(this.curDevInfo.periodYear)} Year`
                this.batteryInfo[index]['info'][k.key] = resStr
              } else this.batteryInfo[index]['info'][k.key] = this.curDevInfo[k.value]
            }
            else this.batteryInfo[index]['info'][k.key] = this.curDevInfo[k.value] + 'kWh'
          })
        })
      } else if (+this.active === 3) {
        let arr = [
          [
            {
              key: 'Session Started',
              value: 'startTime'
            },
            {
              key: 'Duration',
              value: 'duration'
            },
            {
              key: 'Energy Added',
              value: 'energy' // 没有
            },
            {
              key: 'L1-Voltage',
              value: 'l1Voltage'
            },
            {
              key: 'L2-Voltage',
              value: 'l2Voltage'
            },
          ],
          [
            {
              key: 'Power',
              value: 'powerImport'
            },
            {
              key: 'L1-Current',
              value: 'l1CurrentImport'
            },
            {
              key: 'L2-Current',
              value: 'l2CurrentImport'
            }
          ],
          [
            {
              key: 'Power',
              value: 'powerExport'
            },
            {
              key: 'L1-Current',
              value: 'l1CurrentExport'
            },
            {
              key: 'L2-Current',
              value: 'l2CurrentExport'
            }
          ],
          [
            {
              key: 'Today',
              value: 'dayEnergy'
            },
            {
              key: 'This Month',
              value: 'monthEnergy'
            },
            {
              key: 'This Year',
              value: 'yearEnergy'
            },
            {
              key: 'Lifetime',
              value: 'allEnergy'
            },
          ],
          [
            {
              key: 'Lifetime',
              value: 'createTime'
            }
          ],
          [
            {
              key: 'Serial Number',
              value: 'serialNumber'
            },
            {
              key: 'Manufacturer',
              value: 'manufacturer'
            },
          ],
        ]
        arr.forEach((i, index) => {
          i.forEach(k => {
            if (k.key === 'Session Started') {
              if (+this.curDevInfo.status === 1) {
                if (this.curDevInfo[k.value]) this.chargeInfo[index]['info'][k.key] = this.DATE_FORMAT('M/d/yyyy hh:mm', this.curDevInfo[k.value] * 1000)
                else this.chargeInfo[index]['info'][k.key] = '--'
              } else {
                this.chargeInfo[index]['info'][k.key] = '--'
              }
            }
            else if (k.key.includes('Current')) this.chargeInfo[index]['info'][k.key] = this.curDevInfo[k.value] ? this.curDevInfo[k.value] + 'A' : 0
            else if (k.key === 'Duration') {
              if (+this.curDevInfo.status === 1) this.chargeInfo[index]['info'][k.key] = this.curDevInfo[k.value] + ' Hours'
              else this.chargeInfo[index]['info'][k.key] = 0
            }
            else if (k.key.includes('Voltage')) this.chargeInfo[index]['info'][k.key] = this.curDevInfo[k.value] ? this.curDevInfo[k.value] + 'V' : 0
            else if (k.key === 'Power' || k.key === 'Energy Added') {
              if (k.key === 'Energy Added') {
                if (+this.curDevInfo.status === 1) this.chargeInfo[index]['info'][k.key] = this.curDevInfo[k.value] + 'kWh'
                else this.chargeInfo[index]['info'][k.key] = 0
              } else this.chargeInfo[index]['info'][k.key] = this.curDevInfo[k.value] ? this.curDevInfo[k.value] + 'kWh' : 0
            }
            else if (index === 4) {
              let resStr = ''
              resStr += `${+(this.curDevInfo.periodDay)} Days ${+(this.curDevInfo.periodMonth)} Months ${+(this.curDevInfo.periodYear)} Year`
              this.chargeInfo[index]['info'][k.key] = resStr
            } else if (index === 5) {
              this.chargeInfo[index]['info'][k.key] = this.curDevInfo[k.value]
            } else this.chargeInfo[index]['info'][k.key] = this.curDevInfo[k.value] ? (+this.curDevInfo[k.value]).toFixed(2) + 'kWh' : 0
          })
        })
      } else if (+this.active === 4) {
        let arr = [
          [
            {
              key: 'Serial Number',
              value: 'serialNumber'
            },
            {
              key: 'Manufacturer',
              value: 'manufacturer'
            },
            // {
            //   key: 'Wifi',
            //   value: 'wifiName'
            // },
          ],
        ]
        arr.forEach((i, index) => {
          i.forEach(k => {
            this.stickInfo[index]['info'][k.key] = this.curDevInfo[k.value]
          })
        })
      } else if (+this.active === 1) {
        let arr = [
          {
            pvNum: 'pv1',
            v: '',
            c: '',
            p: ''
          },
          {
            pvNum: 'pv2',
            v: '',
            c: '',
            p: ''
          },
          {
            pvNum: 'pv3',
            v: '',
            c: '',
            p: ''
          },
          {
            pvNum: 'pv4',
            v: '',
            c: '',
            p: ''
          },
        ]
        let arrGrid = [
          {
            pvNum: 'A',
            v: '',
            c: '',
            p: ''
          },
          {
            pvNum: 'B',
            v: '',
            c: '',
            p: ''
          },
          {
            pvNum: 'C',
            v: '',
            c: '',
            p: ''
          }
        ]
        let arrLoad = [
          {
            pvNum: 'A',
            v: '',
            c: '',
            p: ''
          },
          {
            pvNum: 'B',
            v: '',
            c: '',
            p: ''
          },
          {
            pvNum: 'C',
            v: '',
            c: '',
            p: ''
          }
        ]
        let objGrid = this.curDevInfo.gridEntity, objLoad = this.curDevInfo.loadEntity
        arrGrid.forEach((item, index) => {
          let prefix = item.pvNum.toLowerCase()
          item.v = objGrid[`${prefix}voltage`]
          item.c = objGrid[`${prefix}current`]
          item.p = objGrid[`${prefix}power`]
        })
        arrLoad.forEach((item, index) => {
          let prefix = item.pvNum.toLowerCase()
          item.v = objLoad[`${prefix}voltage`]
          item.c = objLoad[`${prefix}current`]
          item.p = objLoad[`${prefix}power`]
        })
        this.curDevInfo.gridList = arrGrid
        this.curDevInfo.loadList = arrLoad
        let resStr = ''
        resStr += `${+(this.curDevInfo.periodDay)} Days ${+(this.curDevInfo.periodMonth)} Months ${+(this.curDevInfo.periodYear)} Year`
        this.inverterInfo = this.curDevInfo
        this.inverterInfo.Lifetime = resStr
      } else if (+this.active === 6) {
        let arr = [
          {
            pvNum: 'pv1',
            v: '',
            c: '',
            p: ''
          },
          {
            pvNum: 'pv2',
            v: '',
            c: '',
            p: ''
          },
          {
            pvNum: 'pv3',
            v: '',
            c: '',
            p: ''
          },
          {
            pvNum: 'pv4',
            v: '',
            c: '',
            p: ''
          },
        ]
        let obj = this.curDevInfo
        arr.forEach((item, index) => {
          let prefix = `pv${index + 1}`
          item.v = obj[`${prefix}Voltage`]
          item.c = obj[`${prefix}Current`]
          item.p = obj[`${prefix}Power`]
        })

        this.curDevInfo.pvList = arr

        let resStr = ''
        resStr += `${+(this.curDevInfo.periodDay)} Days ${+(this.curDevInfo.periodMonth)} Months ${+(this.curDevInfo.periodYear)} Year`
        this.pvInfo = this.curDevInfo
        this.pvInfo.Lifetime = resStr
      }
    }
  }
}
</script>

<style lang="scss">
.comp-device {
  &-card {
    padding-bottom: 20px;
    .title-text {
      font-weight: 700;
    }
    &-content {
      margin-top: 24px;
      &-nav {
        flex-shrink: 0;
        margin-right: 48px;
        width: 160px;
        border-right: 1px solid #D8DCE6;
        &-item {
          height: 40px;
          text-indent: 16px;
          cursor: pointer;
          line-height: 40px;
        }
        .opacityTrans {
          color: #fff;
          background-color: #409EFF;
          opacity: 1;
          transition: all .2s;
        }
      }
      &-right {
        padding-bottom: 28px;
        border: 1px solid #D8DCE6;
        border-radius: 2px 2px 2px 2px;
        .device-battery {
          margin: 40px 45px 0 45px;
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
        &-container {
          .item {
            margin-top: 24px;
            &-title {
              font-weight: 700;
              line-height: 26px;
              border-bottom: 1px solid #D8DCE6;
            }
            &-body {
              max-width: 1200px;
              &-item {
                margin-top: 12px;
                flex-grow: 1;
                line-height: 26px;
                font-size: 14px;
                &-key {
                  color: #828282;
                }
                &-value {
                  color: #000;
                  font-weight: 500;
                }
              }
              .charge {
                flex-grow: 0;
                width: calc(100% / 4);
              }
            }
          }
          .table {
            margin: 60px 0 10px 0;
            max-width: 1190px;
            .el-table td.el-table__cell {
              border-bottom: none;
            }
            &-title {
              font-weight: 700;
              line-height: 26px;
              border-bottom: 1px solid #D8DCE6;
            }
            &-before {
              left: -78px;
              top: 0;
              @include wh(72 24);
              background: #FFB968;
              text-indent: 8px;
              @include nFont(14 #fff 600 24)
            }
            &-export {
              left: -78px;
              top: 24px;
              @include wh(72 24);
              @include nFont(14 #828282 24)
            }
          }
        }
      }
    }
  }
  .dialog-form {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .el-form-item {
      width: calc(100% / 2 - 24px);
    }
    .select {
      .el-form-item__label{
        text-align:left;
        float: none;
        word-break: break-word;
      }
    }
  }
  .status-tips {
    margin-right: 10px;
    @include nFont(14 #828282)
  }
  input[type='number'] {
    -moz-appearance: textfield !important;
  }
  input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }
  .time-range {
    &-label {
      margin-right: 15px;
      width: 125px;
      text-align: right;
    }
    &-picker {
      border: 1px solid #dcdfe6;
      border-radius: 4px;
    }
    .el-input__prefix {
      display: none;
    }
    .el-date-editor.el-input {
      width: 100px;
    }
    .el-input__inner {
      border: none !important;
    }
  }
  .pv-nav {
    right: 0;
    top: 10%;
    z-index: 521;
  }
  .batteryChart {
    height: 45vh;
  }
  .pvChart {
    height: 55vh;
  }
}
</style>
