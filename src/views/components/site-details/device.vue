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
        <common-flex auto class="comp-device-card-content-right" v-if="+active === 4">
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
        <div v-else-if="+active === 2" style="flex-grow: 1">
          <common-flex style="border-bottom: 1px solid #D8DCE6; margin-bottom: 15px;" wrap="wrap">
            <div class="bat-item" v-for="(i, k) of batList" :key="k" @click="changeCurBat(i.serialNumber)">
              <div class="posr">
                <div class="bat-pile" :id="`batPile${k}`"></div>
                <div class="posa bat-title">
                  <div>SOC</div>
                  <div style="text-align: center; line-height: 20px">{{ i.soc }}</div>
                </div>
              </div>
              <div class="bat-sn" :class="{curClick: batCur === i.serialNumber}">{{ i.serialNumber }}</div>
            </div>
          </common-flex>
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
        <div v-else-if="+active === 3" style="width: 100%">
          <el-tabs v-model="curPile" @tab-click="changeCurPile">
            <template v-for="i of pileList">
              <el-tab-pane :name="i.serialNumber" :label="i.serialNumber"></el-tab-pane>
            </template>
          </el-tabs>
          <common-flex auto class="comp-device-card-content-right">
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
        </div>
        <div v-else-if="+active === 6" style="flex-grow: 1">
<!--          <div style="border-bottom: 1px solid #D8DCE6">-->
<!--            <el-tabs v-model="curPv" @tab-click="changeCurPv">-->
<!--              <template v-for="i of pvList">-->
<!--                <el-tab-pane :name="i.serialNumber" :label="i.serialNumber">  </el-tab-pane>-->
<!--              </template>-->
<!--            </el-tabs>-->
<!--          </div>-->
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
                  <div class="item-body-item">
                    <div class="item-body-item-key">New installation or not</div>
                    <div class="item-body-item-value">{{ ['', 'Yes', 'No'][pvInfo.installation] || '--' }}</div>
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
              <div class="pvChart" v-if="!this.navBar['Inverter']">
                <no-data />
              </div>
              <div v-else id="pvChart" class="pvChart"></div>
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
                <div class="item-body-item charge">
                  <div class="item-body-item-key">New installation or not</div>
                  <div class="item-body-item-value">{{ ['', 'Yes', 'No'][inverterInfo.installation] || '--' }}</div>
                </div>
                <div class="item-body-item charge">
                  <div class="item-body-item-key">Rated Power (kW)</div>
                  <div class="item-body-item-value">{{ inverterInfo.nameplateCapacity }}</div>
                </div>
                <div class="item-body-item charge">
                  <div class="item-body-item-key">Lifetime</div>
                  <div class="item-body-item-value">{{ inverterInfo.lifetime }}</div>
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
               width="66%">
      <common-flex align="center">
        <strong>Stick Logger</strong>
        <common-flex v-if="!addDialogInfo[4]">
          <el-tooltip class="item" effect="dark" content="Add Manually" placement="top">
            <img class="device-plus" :src="require('@img/site/device-plus.svg')" alt="" @click="addSn(4)">
          </el-tooltip>
          <img class="device-refresh" :class="{rotateAni: activeStick}" :src="require('@img/site/refresh.svg')" alt="" @click="findDevice('Stick')">
        </common-flex>
      </common-flex>
      <el-form @submit.native.prevent v-if="addDialogInfo[4]">
        <div class="dialog-form">
          <el-form-item label="SN">
            <el-input maxlength="20" @change="change(4)" :disabled="addDialogInfo[4].disabled" v-model.trim="addDialogInfo[4].serialNumber" placeholder="Please enter the serial number"></el-input>
          </el-form-item>
          <div style="margin-top: 15px; cursor: pointer" v-if="!addDialogInfo[4].disabled" @click="deleteSn(4)"><img style="width: 20px" :src="require('@img/site/delete.svg')" alt=""></div>
        </div>
      </el-form>
      <div class="empty" v-else>No data</div>
      <common-flex align="center">
        <strong>Inverter</strong>
        <common-flex v-if="!addDialogInfo[1]">
          <el-tooltip class="item" effect="dark" content="Add Manually" placement="top">
            <img class="device-plus" :src="require('@img/site/device-plus.svg')" alt="" @click="addSn(1)">
          </el-tooltip>
          <img class="device-refresh" :class="{rotateAni: activeInverter}" :src="require('@img/site/refresh.svg')" alt="" @click="findDevice('Inverter')">
        </common-flex>
      </common-flex>
      <el-form @submit.native.prevent v-if="addDialogInfo[1]" style="margin-top: 16px">
        <div class="dialog-form">
          <el-form-item label="SN">
            <el-input maxlength="20" @change="change(1)" :disabled="addDialogInfo[1].disabled" v-model.trim="addDialogInfo[1].serialNumber" placeholder="Please enter the serial number"></el-input>
          </el-form-item>
          <el-form-item label="Rated Power (kW)">
            <el-input maxlength="20" @input="checkCapacity(1)" :disabled="addDialogInfo[1].disabled" v-model.trim="addDialogInfo[1].nameplateCapacity" placeholder="Please enter"></el-input>
            <div class="err-msg posa">{{ inverterCapacityMsg['msg'] }}</div>
          </el-form-item>
          <el-form-item label="New installation or not">
            <el-select style="width: 100%" :disabled="addDialogInfo[1].disabled" @change="checkInstall(1)" v-model="addDialogInfo[1].installation" placeholder="Please select">
              <el-option v-for="(i, k) of installOption" :value="i.value" :label="i.label" :key="k"></el-option>
            </el-select>
            <div class="err-msg posa">{{ inverterInstallMsg['msg'] }}</div>
          </el-form-item>
          <div style="margin-top: 15px; cursor: pointer" v-if="!addDialogInfo[1].disabled" @click="deleteSn(1)"><img style="width: 20px" :src="require('@img/site/delete.svg')" alt=""></div>
        </div>
      </el-form>
      <div class="empty" v-else>No data</div>
      <template v-if="addDialogInfo[2]">
        <common-flex align="center">
          <strong>Battery</strong>
          <el-tooltip class="item" effect="dark" content="Add Manually" placement="top">
            <img class="device-plus" :src="require('@img/site/device-plus.svg')" alt="" @click="addSn(2)">
          </el-tooltip>
          <img class="device-refresh" :class="{rotateAni: activeBat}" :src="require('@img/site/refresh.svg')" alt="" @click="findDevice('Bat')">
        </common-flex>
        <template v-for="(i, k) of addDialogInfo[2]">
          <el-form @submit.native.prevent :model="i">
            <div class="dialog-form">
<!--              11111-->
              <el-form-item label="SN">
                <el-input maxlength="20" @change="change(2, k)" :disabled="i.disabled" v-model.trim="i.serialNumber" placeholder="Please enter the serial number"></el-input>
              </el-form-item>
              <el-form-item label="Capacity (kWh)">
                <el-input @input="checkCapacity(2, k)" type="text" :disabled="i.disabled" v-model.trim="i.nameplateCapacity" placeholder="Please enter the capacity"></el-input>
                <div class="err-msg posa">{{ batCapacityMsg[k] }}</div>
              </el-form-item>
              <el-form-item label="New installation or not">
                <el-select style="width: 100%" :disabled="i.disabled" @change="checkInstall(2, k)" v-model="i.installation" placeholder="Please select">
                  <el-option v-for="(i, k) of installOption" :value="i.value" :label="i.label" :key="k"></el-option>
                </el-select>
                <div class="err-msg posa">{{ batInstallMsg[k] }}</div>
              </el-form-item>
              <div style="margin-top: 15px; cursor: pointer" v-if="!i.disabled" @click="deleteSn(2, k)"><img style="width: 20px" :src="require('@img/site/delete.svg')" alt=""></div>
            </div>
          </el-form>
        </template>
        <div class="empty" v-if="!addDialogInfo[2].length">No data</div>
      </template>
      <el-form @submit.native.prevent v-if="addDialogInfo[3]" style="margin-top: 16px">
        <common-flex align="center">
          <strong>EV Charger</strong>
          <el-tooltip class="item" effect="dark" content="Add Manually" placement="top">
            <img class="device-plus" :src="require('@img/site/device-plus.svg')" alt="" @click="addSn(3)">
          </el-tooltip>
          <img class="device-refresh" :class="{rotateAni: activeCharger}" :src="require('@img/site/refresh.svg')" alt="" @click="findDevice('Charger')">
        </common-flex>
        <div class="dialog-form" v-for="(i, k) of addDialogInfo[3]">
          <el-form-item label="SN">
            <el-input maxlength="20" @change="change(3, k)" :disabled="i.disabled" v-model.trim="i.serialNumber" placeholder="Please enter the serial number"></el-input>
          </el-form-item>
          <el-form-item label="New installation or not">
            <el-select style="width: 100%" :disabled="i.disabled" @change="checkInstall(3, k)" v-model="i.installation" placeholder="Please select">
              <el-option v-for="(i, k) of installOption" :value="i.value" :label="i.label" :key="k"></el-option>
            </el-select>
            <div class="err-msg posa">{{ chargeInstallMsg[k] }}</div>
          </el-form-item>
          <div style="margin-top: 15px; cursor: pointer" v-if="!i.disabled" @click="deleteSn(3, k)"><img style="width: 20px" :src="require('@img/site/delete.svg')" alt=""></div>
        </div>
        <div class="empty" v-if="!addDialogInfo[3].length">No data</div>
      </el-form>
      <template v-if="addDialogInfo[6]">
        <common-flex align="center" style="margin-top: 16px">
          <strong>Photovoltaic</strong>
          <template v-if="addDialogInfo[6].length < 1">
            <el-tooltip class="item" effect="dark" content="Add Manually" placement="top">
              <img class="device-plus" :src="require('@img/site/device-plus.svg')" alt="" @click="addSn(6)">
            </el-tooltip>
            <img class="device-refresh" :class="{rotateAni: activePhotovoltaic}" :src="require('@img/site/refresh.svg')" alt="" @click="findDevice('Photovoltaic')">
          </template>
        </common-flex>
        <template v-for="(i, k) of addDialogInfo[6]">
          <el-form @submit.native.prevent :model="i" style="margin-top: 16px">
            <div class="dialog-form" >
              <el-form-item label="SN">
                <!--            1111111-->
                <el-input maxlength="20" @change="change(6, k)" :disabled="i.disabled" v-model.trim="i.serialNumber" placeholder="Please enter the serial number"></el-input>
              </el-form-item>
              <el-form-item label="Capacity (kW)">
                <el-input @input="checkCapacity(6, k)" type="text" :disabled="i.disabled" v-model.trim="i.nameplateCapacity" placeholder="Please enter the capacity"></el-input>
                <div class="err-msg posa">{{ pvCapacityMsg[k] }}</div>
              </el-form-item>
              <el-form-item label="New installation or not">
                <el-select style="width: 100%" :disabled="i.disabled" @change="checkInstall(6, k)" v-model="i.installation" placeholder="Please select">
                  <el-option v-for="(i, k) of installOption" :value="i.value" :label="i.label" :key="k"></el-option>
                </el-select>
                <div class="err-msg posa">{{ pvInstallMsg[k] }}</div>
              </el-form-item>
              <div style="margin-top: 15px; cursor: pointer" v-if="!i.disabled" @click="deleteSn(6, k)"><img style="width: 20px" :src="require('@img/site/delete.svg')" alt=""></div>
            </div>
          </el-form>
        </template>
        <div class="empty" v-if="!addDialogInfo[6].length">No data</div>
      </template>

      <common-flex style="margin-top: 30px" justify="center">
        <el-button @click="submitAdd" :disabled="addSubType">Submit</el-button>
        <el-button @click="addShow = false; fillAddDialog(); addSubType = true;">Cancel</el-button>
      </common-flex>
    </el-dialog>
    <el-dialog v-if="delShow" :visible.sync="delShow" title="Delete Device"
               :before-close="beforeClose"
               :close-on-click-modal ="false"
               width="50%">
      <el-form @submit.native.prevent class="dialog-form" label-position="top">
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
          <el-select style="width: 100%" @change="chooseSn" v-model="delDialogInfo.sn">
            <el-option v-for="(i, k) of delDialogInfo.snOption" :value="i" :label="i" :key="k"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Capacity(KWh)">
          <el-input disabled v-model="delDialogInfo.nameplateCapacity"></el-input>
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

import { listDevice, infoDevice, addBatchDevice, setDevice, delDevice, stopCharge, batHistoryData, pvHistoryData, netList, orderRes } from '@/api/device'
let deviceNavInfo = {}
let batteryInstance = null
let pvInstance = null
let timer = null, timerInter = null
let times = 1
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
      inverterCapacityMsg: {},
      batCapacityMsg: {},
      pvCapacityMsg: {},
      inverterInstallMsg: {},
      batInstallMsg: {},
      pvInstallMsg: {},
      chargeInstallMsg: {},
      installOption: [
        {
          label: 'Yes',
          value: 1
        },
        {
          label: 'No',
          value: 2
        }
      ],
      activeStick: false,
      activeInverter: false,
      activeBat: false,
      activeCharger: false,
      activePhotovoltaic: false,
      batteryHis: {
        batteryType: 'Voltage',
        dateVal: new Date()
      },
      pvHis: {
        pvType: 'Voltage',
        dateVal: new Date()
      },
      batListInstance: [],
      batList: [],
      pvList: [],
      pileList: [],
      batCur: 0,
      curPile: '',
      curPv: '',
      activeBattery: 'first',
      activePv: 'first',
      dynamicSoc: '',
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        delFlag: 0,
        siteCode: ''
      },
      listDev: [],
      curDevInfo: {},
      currentItem: null,
      sn: '',
      navBar: {},
      addDialogInfo: {},
      delDialogInfo: {
        id: '',
        deviceType: '',
        nameplateCapacity: '',
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
            label: 'Charge pile',
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
        ],
        sn: '',
        snOption: []
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
            'Nameplate capacity (kWh)': '',
            'Connected Inverter': '',
            'New installation or not': ''
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
          'title': 'Charge pile Operation Time',
          'info': {
            'Lifetime': '',
            'New installation or not': ''
          },
        },
        {
          'title': 'Basic Info',
          'info': {
            'Serial Number': '',
          },
        },
      ],
      stickInfo: [

        {
          'title': 'Basic Info',
          'info': {
            'Serial Number': '',
          },
        },
      ],
      delSubType: '',
      localChangeList: {},
      waitLoading: '',
      addSubType: true,
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
          this.getBatHisData()
          window.addEventListener('resize', this.changeSize)
        })
      }
    },
    activePv (v) {
      if (v === 'second') {
        if (!this.navBar['Inverter']) return
        this.$nextTick(() => {
          pvInstance = echarts.init(document.getElementById('pvChart'))
          this.getPvHisData()
          window.addEventListener('resize', this.changeSize)
        })
      }
    }
  },
  beforeDestroy() {
    clearInterval(timerInter)
    clearTimeout(timer)
    window.removeEventListener('resize', this.changeSize)
  },
  methods: {
    addSn(deviceType) {
      let item = {
        deviceType,
        nameplateCapacity: '',
        installation: '',
        serialNumber: '',
        disabled: false
      }
      if ([1, 4].includes(deviceType)) this.addDialogInfo[deviceType] = item
      else this.addDialogInfo[deviceType].push(item)
    },
    deleteSn(deviceType, index) {
      if ([1, 4].includes(deviceType)) {
        this.addDialogInfo[deviceType] = null
        this.inverterCapacityMsg = {}
        this.inverterInstallMsg = {}
        return
      }
      this.addDialogInfo[deviceType].splice(index, 1)
      let mapCapacity = {
        1: 'inverterCapacityMsg',
        2: 'batCapacityMsg',
        6: 'pvCapacityMsg'
      }
      let mapInstall = {
        2: 'batInstallMsg',
        6: 'pvInstallMsg',
        3: 'chargeInstallMsg'
      }
      if (deviceType !== 3) this.$delete(this[mapCapacity[deviceType]], index)
      this.$delete(this[mapInstall[deviceType]], index)
    },
    findDevice(str) {
      let item = this.listDev.find(i => +i.deviceType === 4)
      this.requestLoading()
      this[`active${str}`] = true
      if (item && item.serialNumber) {
        let params = {
          sn: item.serialNumber
        }
        netList(params).then(res => {
          let findBatList = res.data.batteryList || []
          let inverList = res.data.inverterSnList || []
          if (!findBatList.length && !inverList.length) return this.$modal.alert('Device not found')
          if (findBatList.length) {
            let arr = [...findBatList, ...this.addDialogInfo[2]]
            this.addDialogInfo[2] = Array.from(arr.reduce((acc, cur) => {
              acc.has(cur.serialNumber) || acc.set(cur.serialNumber, cur)
              return acc;
            }, new Map()).values())
          }
          if (inverList.length) {
            this.addDialogInfo[1] = {
              deviceType: 1,
              disabled: true,
              serialNumber: inverList[0].serialNumber,
            }
          }
        }).catch(err => {
          this.$modal.alert('Device not found')
        }).finally(() => {
          this[`active${str}`] = false
          this.waitLoading.close()
        })
      } else {
        this.waitLoading.close()
        this.$modal.alert('Device not found')
        this[`active${str}`] = false
      }
    },
    changeCurBat(sn) {
      this.batCur = sn
      this.sn = sn
      this.activeBattery = 'first'
      this.commonStore()
    },
    commonStore() {
      this.currentItem = this.listDev.find(i => i.serialNumber === this.sn)
      if (deviceNavInfo[this.sn]) {
        this.curDevInfo = deviceNavInfo[this.sn]
        this.tempInfo()
      } else this.getDeviceInfo()
    },
    changeCurPv() {
      this.sn = this.curPv
      this.activePv = 'first'
      this.commonStore()
    },
    changeCurPile() {
      this.sn = this.curPile
      this.commonStore()
    },
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
          arr1.push(batData[i].maxTemperature)
          arr2.push(batData[i].minTemperature)
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
          name: 'minTemperature',
          symbol: 'none',
          type: 'line',
          smooth: true,
          itemStyle: {
            color: '#FFB968'
          },
          data: arr2
        }
        itemOne.name = 'maxTemperature'
        optionBat.series.push(itemTwo)
      }
      optionBat.series.push(itemOne)
      // if (batteryInstance) batteryInstance.dispose()
      // batteryInstance = echarts.init(document.getElementById('batteryChart'))
      batteryInstance.setOption(optionBat)
      console.log('changeBat')
    },
    getBatHisData() {
      this.requestLoading()
      let format = this.DATE_FORMAT('yyyy-MM-dd', this.batteryHis.dateVal)
      let params = {
        siteCode: this.queryParams.siteCode,
        sn: this.sn,
        startTimeLong: (new Date(`${format} 00:00:00`).getTime()) / 1000,
        endTimeLong: (new Date(`${format} 23:59:59`).getTime()) / 1000
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
      if (!this.navBar['Inverter']) return
      this.getPvHisData()
    },
    changePvType() {
      if (!this.navBar['Inverter']) return
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
      this.requestLoading()
      let format = this.DATE_FORMAT('yyyy-MM-dd', this.pvHis.dateVal)
      let params = {
        siteCode: this.queryParams.siteCode,
        sn: this.sn,
        startTimeLong: (new Date(`${format} 00:00:00`).getTime()) / 1000,
        endTimeLong: (new Date(`${format} 23:59:59`).getTime()) / 1000
      }
      pvHistoryData(params).then(res => {
        // console.log('hisPv', res.data)
        arrX2 = []
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
      clearTimeout(timer)
      timer = setTimeout(() => {
        if (batteryInstance) batteryInstance.resize()
        if (pvInstance) pvInstance.resize()
      }, 500)
    },
    getOrderRes() {
      let data = {
        sn: this.sn,
      }
      let statusList = ['NO_RESPONSE', 'SUCCESS', 'ERROR', 'EXECUTING', 'NOT_ONLINE', 'UN_EXIST_FILE', 'SUBMIT_SUCCESS', 'NO_MATCH']
      clearInterval(timerInter)
      timerInter = setInterval(() => {
        times++
        orderRes(data).then(res => {
          if (+res.data === 3) {
            if(times > 15) {
              times = 1
              clearInterval(timerInter)
              this.getList()
              this.waitLoading.close()
              return this.$modal.msgError('timeout')
            }
            this.getOrderRes()
          } else {
            if (+res.data === 1) {
              this.$modal.msgSuccess('SUCCESS')
              this.getList()
            } else this.$modal.msgError(statusList[+res.data])
            clearInterval(timerInter)
            this.waitLoading.close()
          }
        })
      }, 1000)
    },
    stopCharge() {
      let data = {
        siteCode: this.queryParams.siteCode,
        sn: this.sn
      }
      stopCharge(data).then(res => {
        let statusList = ['NO_RESPONSE', 'SUCCESS', 'ERROR', 'EXECUTING', 'NOT_ONLINE', 'UN_EXIST_FILE', 'SUBMIT_SUCCESS', 'NO_MATCH']
        if (+res.data === 3) {
          this.requestLoading()
          this.getOrderRes()
        } else this.$modal.msg(statusList[+res.data])
      })
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
    chooseSn() {
      this.delSubType = 'primary'
      let deviceType = +this.delDialogInfo.deviceType
      if (deviceType === 2) {
        this.batList.forEach(i => {
          if (i.serialNumber === this.delDialogInfo.sn) {
            this.delDialogInfo.id = i.id
            this.delDialogInfo.nameplateCapacity = i.nameplateCapacity
          }
        })
      }
      if (deviceType === 3) {
        this.pileList.forEach(i => {
          if (i.serialNumber === this.delDialogInfo.sn) {
            this.delDialogInfo.id = i.id
            this.delDialogInfo.nameplateCapacity = i.nameplateCapacity
          }
        })
      }
      if (deviceType === 6) {
        this.pvList.forEach(i => {
          if (i.serialNumber === this.delDialogInfo.sn) {
            this.delDialogInfo.id = i.id
            this.delDialogInfo.nameplateCapacity = i.nameplateCapacity
          }
        })
      }
    },
    watchSelect() {
      this.delDialogInfo.sn = this.delDialogInfo.nameplateCapacity = this.delDialogInfo.id = ''
      let deviceType = +this.delDialogInfo.deviceType
      let item = this.listDev.find(i => +i.deviceType === deviceType)
      let snList = []
      if (deviceType === 2) {
        this.batList.forEach(i => {
          snList.push(i.serialNumber)
        })
      }
      if (deviceType === 3) {
        this.pileList.forEach(i => {
          snList.push(i.serialNumber)
        })
      }
      if (deviceType === 6) {
        this.pvList.forEach(i => {
          snList.push(i.serialNumber)
        })
      }
      if ([1, 4].includes(deviceType)) {
        if (item) {
          snList.push(item.serialNumber)
          this.delDialogInfo.id = item.id
        } else {
          this.delDialogInfo.sn = ''
          this.delDialogInfo.id = ''
        }
      }
      this.delDialogInfo.snOption = snList
      this.delSubType = this.delDialogInfo.sn ? 'primary' : ''
    },
    submitAdd () {
      let item = {}
      let data = {
        deviceList: [],
        siteCode: this.queryParams.siteCode
      }
      let deviceList = []
      for (let v in this.addDialogInfo) {
        if ([2, 6, 3].includes(+v)) {
          this.addDialogInfo[v].forEach((i, index) => {
            item = {
              deviceType: +i.deviceType,
              serialNumber: i.serialNumber,
              nameplateCapacity: +i.nameplateCapacity,
              installation: i.installation,
              index: index + 1
            }
            if (i.serialNumber) deviceList.push(item)
          })
        } else if (+v === 1) {
          item = {
            deviceType: +v,
            serialNumber: this.addDialogInfo[v]?.serialNumber,
            nameplateCapacity: +this.addDialogInfo[v]?.nameplateCapacity,
            installation: this.addDialogInfo[v]?.installation
          }
          if (this.addDialogInfo[v]?.serialNumber) deviceList.push(item)
        } else {
          item = {
            deviceType: +v,
            serialNumber: this.addDialogInfo[v]?.serialNumber,
          }
          if (this.addDialogInfo[v]?.serialNumber) deviceList.push(item)
        }
      }
      if (!deviceList.length) return
      let i = 0
      let mapCapacity = {
        1: 'inverterCapacityMsg',
        2: 'batCapacityMsg',
        6: 'pvCapacityMsg'
      }
      let mapInstall = {
        1: 'inverterInstallMsg',
        2: 'batInstallMsg',
        6: 'pvInstallMsg',
        3: 'chargeInstallMsg'
      }
      for (i; i < deviceList.length; i++) {
        // 先检验容量
        if ([1, 2, 6].includes(+deviceList[i].deviceType)) {
          if (!deviceList[i].nameplateCapacity) {
            if (deviceList[i].index) this.$set(this[mapCapacity[+deviceList[i].deviceType]], deviceList[i].index - 1, 'please enter capacity')
            else this.$set(this[mapCapacity[+deviceList[i].deviceType]], 'msg', 'please enter rated power')
          }
        }
        // 校验是否选择new installation or not
        if (+deviceList[i].deviceType !== 4) {
          if (!deviceList[i].installation) {
            if (+deviceList[i].deviceType !== 1) this.$set(this[mapInstall[+deviceList[i].deviceType]], deviceList[i].index - 1, 'please select')
            else this.$set(this[mapInstall[+deviceList[i].deviceType]], 'msg', 'please select')
          }
        }
      }
      // 1111111111
      let arrList = ['inverterCapacityMsg', 'batCapacityMsg', 'pvCapacityMsg', 'inverterInstallMsg', 'batInstallMsg', 'pvInstallMsg', 'chargeInstallMsg']
      for (let p = 0; p < arrList.length; p++) {
        for (let k in this[arrList[p]]) {
          if (this[arrList[p]][k]) return
        }
      }
      data.deviceList = deviceList
      this.requestLoading()
      addBatchDevice(data).then(res => {
        if (+res.code === 200) {
          this.$message({
            type: 'success',
            message: 'Succeeded!'
          })
          this.beforeClose()
          this.getList()
        }
      }).finally(() => this.waitLoading.close())
    },
    checkInstall(deviceType, index) {
      let mapInstall = {
        1: 'inverterInstallMsg',
        2: 'batInstallMsg',
        6: 'pvInstallMsg',
        3: 'chargeInstallMsg'
      }
      if (deviceType !== 1) this.$delete(this[mapInstall[deviceType]], index)
      else this.$delete(this[mapInstall[deviceType]], 'msg')
    },
    checkCapacity(deviceType, index) {
      // 1111111111
      let msgType = deviceType === 1 ? 'inverterCapacityMsg' : deviceType === 2 ? 'batCapacityMsg' : 'pvCapacityMsg'
      const reg = /^(?!^\.)(\d*(\.\d{0,3})?)?$/
      // At most three significant decimals
      let capacity
      if (deviceType === 1) capacity = this.addDialogInfo[deviceType].nameplateCapacity.replace(/\s*/g,"")
      else capacity = this.addDialogInfo[deviceType][index].nameplateCapacity.replace(/\s*/g,"")

      if (!capacity) {
        if (deviceType === 1) this.$set(this[msgType], 'msg', 'please enter rated power')
        else this.$set(this[msgType], index, 'please enter capacity')
      } else {
        if (reg.test(capacity)) {
          if (deviceType === 1) this.$set(this[msgType], 'msg', '')
          else this.$set(this[msgType], index, '')
        } else {
          if (deviceType === 1) this.$set(this[msgType], 'msg', 'At most three significant decimals')
          else this.$set(this[msgType], index, 'At most three significant decimals')
        }
      }
    },
    change(deviceType, index) {
      // 1111111111
      let sn = ''
      if ([2, 3, 6].includes(deviceType)) {
        sn = this.addDialogInfo[deviceType][index].serialNumber.replace(/\s*/g,"")
        if (sn) this.$set(this.localChangeList, `${deviceType}${index}`, sn)
        else this.$delete(this.localChangeList, `${deviceType}${index}`)
      } else {
        sn = this.addDialogInfo[deviceType].serialNumber
        if (sn) this.$set(this.localChangeList, deviceType, sn)
        else this.$delete(this.localChangeList, deviceType)
      }
      if (deviceType === 1 && !sn) {
        this.inverterInstallMsg = {}
        this.inverterCapacityMsg = {}
      }
      let arr = Object.keys(this.localChangeList)
      let i = 0;
      for(i; i < arr.length; i++) {
        if (arr[i]) break
      }
      this.addSubType = i >= arr.length
    },
    addDevice() {
      this.fillAddDialog()
      this.addShow = true
    },
    beforeClose() {
      this.addShow = false
      this.delShow = false
      this.delSubType = ''
      this.addSubType = true
    },
    fillAddDialog() {
      let haveTypeList = [4, 1, 2, 6, 3]
      let item = {
        deviceType: 0,
        nameplateCapacity: 0,
        installation: 2,
        serialNumber: '',
        disabled: false
      }
      for(let i = 0; i < haveTypeList.length; i++) {
        if (haveTypeList[i] === 2) {
          this.$set(this.addDialogInfo, 2, [])
          if (this.batList.length) {
            this.batList.forEach(i => {
              item = {
                deviceType: 2,
                nameplateCapacity: i.nameplateCapacity,
                installation: i.installation,
                serialNumber: i.serialNumber,
                disabled: true
              }
              this.addDialogInfo[2].push(item)
            })
          }
        }
        if (haveTypeList[i] === 3) {
          this.$set(this.addDialogInfo, 3, [])
          if (this.pileList.length) {
            this.pileList.forEach(i => {
              item = {
                deviceType: 3,
                nameplateCapacity: i.nameplateCapacity,
                installation: i.installation,
                serialNumber: i.serialNumber,
                disabled: true
              }
              this.addDialogInfo[3].push(item)
            })
          }
        }
        if (haveTypeList[i] === 6) {
          this.$set(this.addDialogInfo, 6, [])
          if (this.pvList.length) {
            this.pvList.forEach(i => {
              item = {
                deviceType: 6,
                nameplateCapacity: i.nameplateCapacity,
                installation: i.installation,
                serialNumber: i.serialNumber,
                disabled: true
              }
              this.addDialogInfo[6].push(item)
            })
          }
        }
        if (haveTypeList[i] === 4) {
          item = this.listDev.find(item => +item.deviceType === 4)
          let info = null
          if (item) {
            info = {
              deviceType: 4,
              disabled: true,
              serialNumber: item.serialNumber,
            }
          }
          this.$set(this.addDialogInfo, 4, info)
        }
        if (haveTypeList[i] === 1) {
          item = this.listDev.find(item => +item.deviceType === 1)
          let info = null
          if (item) {
            info = {
              deviceType: 1,
              disabled: true,
              serialNumber: item.serialNumber,
              nameplateCapacity: item.nameplateCapacity,
              installation: item.installation
            }
          }
          this.$set(this.addDialogInfo, 1, info)
        }
      }
    },
    getList() {
      this.navBar = {}
      this.batList = []
      this.pvList = []
      this.pileList = []
      listDevice(this.queryParams).then(res => {
        this.listDev = res.rows
        let haveBattery = this.listDev.find(i => +i.deviceType === 2)
        let haveCharge = this.listDev.find(i => +i.deviceType === 3)
        let haveInverter = this.listDev.find(i => +i.deviceType === 1)
        let haveStick = this.listDev.find(i => +i.deviceType === 4)
        let havePv = this.listDev.find(i => +i.deviceType === 6)
        if (haveStick) this.$set(this.navBar, 'Stick Logger', '4')
        if (haveInverter) this.$set(this.navBar, 'Inverter', '1')
        if (haveBattery) this.$set(this.navBar, 'Battery', '2')
        if (havePv) this.$set(this.navBar, 'Photovoltaic', '6')
        if (haveCharge) this.$set(this.navBar, 'Charge pile', '3')
        let haveTypeList = [4, 1, 2, 6, 3]
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
        let list = res.rows
        for(let i = 0; i < list.length; i++) {
          if (+list[i]['deviceType'] === 2) this.batList.push(list[i])
          if (+list[i]['deviceType'] === 6) this.pvList.push(list[i])
          if (+list[i]['deviceType'] === 3) this.pileList.push(list[i])
        }
        if (this.batList.length) this.batCur = this.batList[0].serialNumber
        if (this.pvList.length) this.curPv = this.pvList[0].serialNumber
        if (this.pileList.length) this.curPile = this.pileList[0].serialNumber
        for(let i = 0; i < this.batList.length; i++) {
          this.batList[i]['soc'] = JSON.parse(this.batList[i].extInfo)['soc']
          this.batList[i]['curEnergy'] = JSON.parse(this.batList[i].extInfo)['soc']
          this.batList[i]['capacity'] = 100
        }
        if (+this.active === 2) this.$nextTick(() => this.initBatInstance())
      })
    },
    initBatInstance() {
      this.batListInstance = []
      if (this.batList.length) {
        this.$nextTick(() => {
          for(let i = 0; i < this.batList.length; i++) {
            this.batListInstance.push(echarts.init(document.getElementById(`batPile${i}`)))
            if (!this.batList[i]['curEnergy'] || !this.batList[i]['capacity']) {
              this.batList[i]['soc'] = 0 + '%'
              optionBatSoc.series[0].data[0].value = 0
              optionBatSoc.series[0].data[1].value = 1
            } else {
              this.batList[i]['soc'] = (this.batList[i]['curEnergy'] / this.batList[i]['capacity']) * 100 + '%'
              optionBatSoc.series[0].data[0].value = this.batList[i]['curEnergy'] / this.batList[i]['capacity']
              optionBatSoc.series[0].data[1].value = 1 - (this.batList[i]['curEnergy'] / this.batList[i]['capacity'])
            }
            this.batListInstance[i].setOption(optionBatSoc)
          }
        })
      }
    },
    changeNav(v) {
      if (+v === 2 ) this.$nextTick(() => { this.initBatInstance() })
      this.activePv = this.activeBattery = 'first'
      this.active = v
      if ([2, 3, 6].includes(+v)) {
        let list
        if (+v === 2) list = this.batList
        if (+v === 6) list = this.pvList
        if (+v === 3) list = this.pileList
        this.currentItem = this.listDev.find(i => i.serialNumber === list[0].serialNumber)
      } else this.currentItem = this.listDev.find(i => +i.deviceType === +v)
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
              key: 'Nameplate capacity (kWh)',
              value: 'nameplateCapacity'
            },
            {
              key: 'Connected Inverter',
              value: 'connectedInverter'
            },
            {
              key: 'New installation or not',
              value: 'installation'
            },
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
              this.batteryInfo[index]['info'][k.key] = this.curDevInfo.soc
              this.dynamicSoc = this.curDevInfo[k.value] / this.curDevInfo['capacity']
            } else if (k.key === 'Current') {
              if (+this.base.storeConnectStatus === 2) {
                this.batteryInfo[index]['info'][k.key] = 0
                return
              }
              this.batteryInfo[index]['info'][k.key] = this.curDevInfo[k.value] + 'A'
            } else if (k.key === 'Voltage') {
              if (+this.base.storeConnectStatus === 2) {
                this.batteryInfo[index]['info'][k.key] = 0
                return
              }
              this.batteryInfo[index]['info'][k.key] = this.curDevInfo[k.value] + 'V'
            } else if (k.key === 'Power') {
              if (+this.base.storeConnectStatus === 2) {
                this.batteryInfo[index]['info'][k.key] = 0
                return
              }
              this.batteryInfo[index]['info'][k.key] = this.curDevInfo[k.value] + 'kW'
            } else if (k.key === 'New installation or not') {
              this.batteryInfo[index]['info'][k.key] = ['', 'Yes', 'No'][this.curDevInfo[k.value]] || '--'
            } else if (index === 4 || index === 3) {
              if (+this.curDevInfo.installation === 2 && k.key === 'Lifetime') {
                this.batteryInfo[index]['info'][k.key] = '--'
              } else {
                if (index === 3) {
                  let resStr = ''
                  resStr = `${+(this.curDevInfo.periodDay)} Days ${+(this.curDevInfo.periodMonth)} Months ${+(this.curDevInfo.periodYear)} Year`
                  this.batteryInfo[index]['info'][k.key] = resStr
                } else this.batteryInfo[index]['info'][k.key] = this.curDevInfo[k.value]
              }
            } else this.batteryInfo[index]['info'][k.key] = this.curDevInfo[k.value] + 'kWh'
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
            },
            {
              key: 'New installation or not',
              value: 'installation'
            }
          ],
          [
            {
              key: 'Serial Number',
              value: 'serialNumber'
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
            else if (k.key === 'New installation or not') {
              this.chargeInfo[index]['info'][k.key] = ['', 'Yes', 'No'][this.curDevInfo[k.value]] || '--'
            }
            else if (index === 4) {
              if (+this.curDevInfo.installation === 2) {
                this.chargeInfo[index]['info'][k.key] = '--'
              } else {
                let resStr = ''
                resStr += `${+(this.curDevInfo.periodDay)} Days ${+(this.curDevInfo.periodMonth)} Months ${+(this.curDevInfo.periodYear)} Year`
                this.chargeInfo[index]['info'][k.key] = resStr
              }
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
        let objGrid = this.curDevInfo.inverterEntity?.gridEntity, objLoad = this.curDevInfo.inverterEntity?.loadEntity
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
        this.inverterInfo = this.curDevInfo
        if (+this.curDevInfo.installation === 2) {
          this.inverterInfo.lifetime = '--'
        } else {
          let resStr = ''
          resStr += `${+(this.curDevInfo.periodDay)} Days ${+(this.curDevInfo.periodMonth)} Months ${+(this.curDevInfo.periodYear)} Year`
          this.inverterInfo.lifetime = resStr
        }
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
        let obj = this.curDevInfo.pvEntity
        arr.forEach((item, index) => {
          let prefix = `pv${index + 1}`
          item.v = obj[`${prefix}Voltage`] ? obj[`${prefix}Voltage`] : +obj[`${prefix}Voltage`] === 0 ? 0 : '--'
          item.c = obj[`${prefix}Current`] ? obj[`${prefix}Current`] : +obj[`${prefix}Current`] === 0 ? 0 : '--'
          item.p = obj[`${prefix}Power`] ? obj[`${prefix}Power`] : +obj[`${prefix}Power`] === 0 ? 0 : '--'
        })

        this.curDevInfo.pvList = arr
        this.pvInfo = this.curDevInfo
        if (+this.curDevInfo.installation === 2) {
          this.pvInfo.Lifetime = '--'
        } else {
          let resStr = ''
          resStr += `${this.curDevInfo.periodDay} Days ${this.curDevInfo.periodMonth} Months ${this.curDevInfo.periodYear} Year`
          this.pvInfo.Lifetime = resStr
        }
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
          background-color: #3EBCD4;
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
              background: #3EBCD4;
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
  .device-plus, .device-refresh {
    margin-left: 24px;
    @include wh(16);
    cursor: pointer;
  }
  .device-plus {
    @include wh(20);
  }
  .dialog-form {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    opacity: 1;
    transition: all .3s;
    .el-form-item {
      position: relative;
      margin-right: 24px;
      width: calc(100% / 3 - 40px);
      .err-msg {
        left: 0;
        bottom: -30px;
        color: #ff4949;
        font-size: 12px;
      }
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
  .bat-item {
    margin-right: 80px;
    cursor: pointer;
    .bat-pile {
      @include wh(120);
    }
    .bat-title {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      :nth-child(1) {
        @include nFont(12 #828282)
      }
      :nth-child(2) {
        @include nFont(12 #000 600)
      }
    }
    .bat-sn {
      width: 120px;
      text-align: center;
      border-bottom: 3px solid #fff;
    }
    .curClick {
      border-bottom: 3px solid #3EBCD4;
      color: #3EBCD4;
      transition: all .3s;
    }
  }
  .rotateAni {
    animation: autoRotate infinite linear .5s;
  }
  @keyframes  autoRotate{
    from { transform: rotate(0) }
    to { transform: rotate(-360deg) }
  }
  .empty {
    color: #909399;
    text-indent: 8px;
    line-height: 40px;
  }
  strong {
    min-width: 120px;
  }
}
</style>
