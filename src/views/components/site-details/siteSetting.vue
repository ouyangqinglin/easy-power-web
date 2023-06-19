<template>
  <div class="comp-site-set">
    <el-card>
      <common-flex class="comp-site-set-content">
        <div class="comp-site-set-content-nav">
          <div class="comp-site-set-content-nav-item" @click="changeNav(v)" :class="{ opacityTrans: active === v }" v-for="(v, k) in navBar">{{ k }}</div>
        </div>
        <div style="flex-grow: 1; min-height: 650px">
          <template v-if="+active === 1">
            <div class="remote">
              <div class="set-part">
                <div class="set-type">System Setting</div>
                <el-form :model="deviceBase" label-position="top" :rules="rules" size="small" hide-required-asterisk>
                  <el-row :gutter="20">
                    <el-col :span="8">
                      <el-form-item label="Work Mode" prop="0">
                        <el-select v-model="deviceBase[0]">
                          <el-option v-for="(i, k) of workOption" :value="i.label" :label="i.label" :key="k"></el-option>
                        </el-select>
                        <el-button type="primary" plain style="margin-left: 10px" @click="setDevice(0)">Set</el-button>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="PV input type" prop="14">
                        <el-select v-model="deviceBase[14]">
                          <el-option v-for="(i, k) of pvTypeOption" :value="i.label" :label="i.label" :key="k"></el-option>
                        </el-select>
                        <el-button type="primary" plain style="margin-left: 10px" @click="setDevice(14)">Set</el-button>
                      </el-form-item>
                    </el-col>
                    <!--                    <el-col :span="8">-->
                    <!--                      <el-form-item label="Modbus Addr" prop="33">-->
                    <!--                        <el-input style="width: auto" v-model="deviceBase[33]" @blur="inputVerify(0, 99, 33)" placeholder="[0,99]"></el-input>-->
                    <!--                        <el-button type="primary" plain style="margin-left: 10px" :disabled="!deviceBase[33]" @click="setDevice(33)">Set</el-button>-->
                    <!--                      </el-form-item>-->
                    <!--                    </el-col>-->
                  </el-row>
                  <div class="peak-box" v-if="deviceBase[0] === 'Peak Shaving'">
                    <span>Peak Shaving</span>
                    <el-button style="margin-left: 10px" type="primary" plain @click="setTimeList" size="small">Set</el-button>
                    <el-row :gutter="12" style="margin-top: 12px">
                      <el-col :span="8">
                        <common-flex class="time-range" align="center">
                          <div class="time-range-label">Charging time1</div>
                          <common-flex class="time-range-picker" align="center">
                            <el-time-select size="small" v-model="peakShaving.chargeS1" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                            <div>-</div>
                            <el-time-select size="small" v-model="peakShaving.chargeE1" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                          </common-flex>
                        </common-flex>
                      </el-col>
                      <el-col :span="8">
                        <common-flex class="time-range" align="center">
                          <div class="time-range-label">Charging time2</div>
                          <common-flex class="time-range-picker" align="center">
                            <el-time-select size="small" v-model="peakShaving.chargeS2" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                            <div>-</div>
                            <el-time-select size="small" v-model="peakShaving.chargeE2" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                          </common-flex>
                        </common-flex>
                      </el-col>
                      <el-col :span="8">
                        <common-flex class="time-range" align="center">
                          <div class="time-range-label">Charging time3</div>
                          <common-flex class="time-range-picker" align="center">
                            <el-time-select size="small" v-model="peakShaving.chargeS3" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                            <div>-</div>
                            <el-time-select size="small" v-model="peakShaving.chargeE3" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                          </common-flex>
                        </common-flex>
                      </el-col>
                    </el-row>
                    <el-row :gutter="12" style="margin-top: 12px">
                      <el-col :span="8">
                        <common-flex class="time-range" align="center">
                          <div class="time-range-label">discharging time1</div>
                          <common-flex class="time-range-picker" align="center">
                            <el-time-select size="small" v-model="peakShaving.dischargeS1" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                            <div>-</div>
                            <el-time-select size="small" v-model="peakShaving.dischargeE1" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                          </common-flex>
                        </common-flex>
                      </el-col>
                      <el-col :span="8">
                        <common-flex class="time-range" align="center">
                          <div class="time-range-label">discharging time2</div>
                          <common-flex class="time-range-picker" align="center">
                            <el-time-select size="small" v-model="peakShaving.dischargeS2" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                            <div>-</div>
                            <el-time-select size="small" v-model="peakShaving.dischargeE2" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                          </common-flex>
                        </common-flex>
                      </el-col>
                      <el-col :span="8">
                        <common-flex class="time-range" align="center">
                          <div class="time-range-label">discharging time3</div>
                          <common-flex class="time-range-picker" align="center">
                            <el-time-select size="small" v-model="peakShaving.dischargeS3" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                            <div>-</div>
                            <el-time-select size="small" v-model="peakShaving.dischargeE3" :picker-options="{start: '00:00', step: '00:01', end: '24:00'}"></el-time-select>
                          </common-flex>
                        </common-flex>
                      </el-col>
                    </el-row>
                  </div>
                  <el-row :gutter="20">
                    <el-col :span="4">
                      <el-form-item prop="21" label="Backup Enable"><el-switch v-model="deviceBase[21]" @change="setDevice(21)" /></el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item prop="25" label="Battery awaken"><el-switch v-model="deviceBase[25]" @change="setDevice(25)" /></el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item prop="13" label="Anti reflux"><el-switch v-model="deviceBase[13]" @change="setDevice(13)" /></el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item prop="31" label="ARC enable"><el-switch v-model="deviceBase[31]" @change="setDevice(31)" /></el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item prop="38" label="On/off enable"><el-switch v-model="deviceBase[38]" @change="setDevice(38)" /></el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
              <div class="set-part">
                <div class="set-type">Battery parameters</div>
                <el-form :model="deviceBase" label-position="top" :rules="rules" size="small" hide-required-asterisk>
                  <el-row :gutter="20">
                    <el-col :span="8">
                      <el-form-item prop="15" label="Battery type">
                        <el-select v-model="deviceBase[15]">
                          <el-option v-for="(i, k) of batTypeOption" :value="i.label" :label="i.label" :key="k"></el-option>
                        </el-select>
                        <el-button type="primary" plain style="margin-left: 10px" @click="setDevice(15)">Set</el-button>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item prop="1" label="Battery grid DOD(%)">
                        <el-input style="width: auto" @blur="inputVerify(10, 90, 1)" v-model.trim="deviceBase[1]" placeholder="[10,90]"></el-input>
                        <el-button type="primary" plain style="margin-left: 10px" :disabled="!deviceBase[1]" @click="setDevice(1)">Set</el-button>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item prop="30" label="Battery Off-grid DOD(%)">
                        <el-input style="width: auto" @blur="inputVerify(10, 90, 30)" v-model.trim="deviceBase[30]" placeholder="[10,90]"></el-input>
                        <el-button type="primary" plain style="margin-left: 10px" :disabled="!deviceBase[30]" @click="setDevice(30)">Set</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="8">
                      <el-form-item prop="24" label="Battery EodHyst(%)">
                        <el-input style="width: auto" @blur="inputVerify(10, 90, 24)" v-model.trim="deviceBase[24]" placeholder="[10,90]"></el-input>
                        <el-button type="primary" plain style="margin-left: 10px" :disabled="!deviceBase[24]" @click="setDevice(24)">Set</el-button>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item prop="11" label="Battery communication type">
                        <el-select v-model="deviceBase[11]">
                          <el-option v-for="(i, k) of batComuTypeOption" :value="i.label" :label="i.label" :key="k"></el-option>
                        </el-select>
                        <el-button type="primary" plain style="margin-left: 10px" @click="setDevice(11)">Set</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
              <div class="set-part">
                <div class="set-type">Operating parameters</div>
                <el-form :model="deviceBase" label-position="top" :rules="rules" size="small" hide-required-asterisk>
                  <el-row :gutter="20">
                    <el-col :span="8">
                      <el-form-item prop="3" label="Grid Power(%)">
                        <el-input @blur="inputVerify(0, 100, 3)" v-model.trim="deviceBase[3]" style="width: auto" placeholder="[0,100]"></el-input>
                        <el-button type="primary" plain style="margin-left: 10px" :disabled="!deviceBase[3]" @click="setDevice(3)">Set</el-button>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item prop="4" label="Battery discharge power(%)">
                        <el-input @blur="inputVerify(0, 100, 4)" v-model.trim="deviceBase[4]" style="width: auto" placeholder="[0,100]"></el-input>
                        <el-button type="primary" plain style="margin-left: 10px" :disabled="!deviceBase[4]" @click="setDevice(4)">Set</el-button>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item prop="17" label="PV Power(%)">
                        <el-input @blur="inputVerify(0, 100, 17)" v-model.trim="deviceBase[17]" style="width: auto" placeholder="[0,100]"></el-input>
                        <el-button type="primary" plain style="margin-left: 10px" :disabled="!deviceBase[17]" @click="setDevice(17)">Set</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="8">
                      <el-form-item prop="7" label="Grid Voltage low(V)">
                        <el-input @blur="inputVerify(150, 220, 7)" v-model.trim="deviceBase[7]" type="primary" plain style="width: auto" placeholder="[150,220]"></el-input>
                        <el-button type="primary" plain style="margin-left: 10px" :disabled="!deviceBase[7]" @click="setDevice(7)">Set</el-button>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item prop="8" label="Grid Voltage high(V)">
                        <el-input @blur="inputVerify(240, 280, 8)" v-model.trim="deviceBase[8]" type="primary" plain style="width: auto" placeholder="[240,280]"></el-input>
                        <el-button type="primary" plain style="margin-left: 10px" :disabled="!deviceBase[8]" @click="setDevice(8)">Set</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
              <div class="set-part">
                <div class="set-type">Grid Standard</div>
                <el-form :model="deviceBase" label-position="top" :rules="rules" size="small" hide-required-asterisk>
                  <el-row :gutter="20">
                    <el-col :span="8">
                      <el-form-item prop="19" label="Grid Standard">
                        <el-select v-model="deviceBase[19]">
                          <el-option v-for="(i, k) of gridOption" :value="i.label" :label="i.label" :key="k"></el-option>
                        </el-select>
                        <el-button type="primary" plain style="margin-left: 10px" @click="setDevice(19)">Set</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
              <div class="set-part">
                <div class="set-type">Clear record</div>
                <span>Clear record</span><el-button size="small" type="primary" plain style="margin-left: 10px" @click="confirmSetDevice(23)">Set</el-button>
              </div>
              <div class="set-part">
                <div class="set-type">Restore Factory Setting</div>
                <span>Restore Factory Setting</span><el-button size="small" type="primary" plain style="margin-left: 10px" @click="confirmSetDevice(22)">Set</el-button>
              </div>
            </div>
          </template>
          <template v-else-if="+active === 2">
            <common-flex justify="space-between" align="center" style="margin-bottom: 24px">
              <div style="font-weight: 600">Set Record</div>
              <el-date-picker
                style="margin-right: 40px"
                format="MM-dd-yyyy"
                value-format="yyyy-M-d"
                v-model="queryParams.createTime"
                @change="getList"
              />
            </common-flex>
            <div style="min-height: 300px">
              <el-table :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}"
                        v-loading="loading" :data="list"
              >
                <el-table-column label="No." type="index" />
                <el-table-column label="Time" prop="">
                  <template slot-scope="{ row }">
                    <span v-if="row.createTime && row.createTime !== '--'">{{ UTC_DATE_FORMAT(+row.createTime, base.timeZone) }}</span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
                <el-table-column label="Parameter Name" prop="desc"></el-table-column>
                <el-table-column label="Parameter Value" prop="param" show-overflow-tooltip></el-table-column>
                <el-table-column label="Set Result" prop="status">
                  <template slot-scope="{ row }"><span>{{ ['', 'Success', 'Failed'][+row.status] }}</span></template>
                </el-table-column>
                <el-table-column label="Client Type" prop="clientType">
                  <template slot-scope="{ row }"><span>{{ ['', 'APP', 'Web'][+row.clientType] }}</span></template>
                </el-table-column>
                <el-table-column label="User Name" prop="createBy"></el-table-column>
              </el-table>
            </div>
            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="getList"
            />
          </template>
          <template v-else-if="+active === 3">
            <common-flex justify="space-between" align="center">
              <div class="card-title">Multi-time setting</div>
              <el-button type="primary" :disabled="whole()" @click="submit">Submit</el-button>
            </common-flex>
            <common-flex justify="space-between" class="top-container">
              <div class="top-container-item">
                <div class="off">
                  <div class="header">Off-Peak</div>
                  <common-flex class="timer-container" wrap="wrap">
                    <div class="timer-container-item">
                      <el-checkbox-group class="timer-container-item-group" v-model="checkOffList">
                        <el-checkbox :label="i.id" v-for="i of offList" :key="i.id">{{ i.startTime + '-' + i.endTime }}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </common-flex>
                </div>
                <common-flex justify="center">
                  <el-button size="small" icon="el-icon-arrow-down" @click="offDown(1)"></el-button>
                  <el-button size="small" type="primary" icon="el-icon-arrow-up" @click="offUp(1)"></el-button>
                </common-flex>
              </div>
              <div class="top-container-item">
                <div class="mid">
                  <div class="header">Mid-Peak</div>
                  <common-flex class="timer-container" wrap="wrap">
                    <div class="timer-container-item">
                      <el-checkbox-group class="timer-container-item-group" v-model="checkMidList">
                        <el-checkbox :label="i.id" v-for="i of midList" :key="i.id">{{ i.startTime + '-' + i.endTime }}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </common-flex>
                </div>
                <common-flex justify="center">
                  <el-button size="small" icon="el-icon-arrow-down" @click="offDown(2)"></el-button>
                  <el-button size="small" type="primary" icon="el-icon-arrow-up" @click="offUp(2)"></el-button>
                </common-flex>
              </div>
              <div class="top-container-item">
                <div class="on">
                  <div class="header">On-Peak</div>
                  <common-flex class="timer-container" wrap="wrap">
                    <div class="timer-container-item">
                      <el-checkbox-group class="timer-container-item-group" v-model="checkOnList">
                        <el-checkbox :label="i.id" v-for="i of onList" :key="i.id">{{ i.startTime + '-' + i.endTime }}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </common-flex>
                </div>
                <common-flex justify="center">
                  <el-button size="small" icon="el-icon-arrow-down" @click="offDown(3)"></el-button>
                  <el-button size="small" type="primary" icon="el-icon-arrow-up" @click="offUp(3)"></el-button>
                </common-flex>
              </div>
            </common-flex>
            <div class="time-total">
              <div class="time-total-header">Time Interval</div>
              <div class="time-total-container">
                <el-checkbox-group class="timer-container-item-group" v-model="checkTotalList">
                  <el-checkbox :disabled="i.disabled" :label="i.id" v-for="i of totalList" :key="i.id">{{ i.startTime + '-' + i.endTime }}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </template>
        </div>

      </common-flex>

    </el-card>
  </div>
</template>

<script>
import { siteSetting, siteSettingSubmit } from '@/api/site'
import {setRecodeList, getSettingInfo, deviceSet, orderRes} from '@/api/device'

let timerInter = null
let times = 1
let copyDeviceInfo = {}
export default {
  name: "siteSetting",
  props: {
    base: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    base: {
      handler(v) {
        if (v) {
          this.siteCode = this.$route.query?.siteCode
          this.queryParams.siteCode = this.siteCode
          this.active = '1'
          this.getDeviceSet()
        }
      },
      immediate: true
    },
  },
  data() {
    return {
      total: 0,
      loading: false,
      list: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        siteCode: '',
        createTime: new Date()
      },
      peakShaving: {
        chargeS1: '',
        chargeS2: '',
        chargeS3: '',
        chargeE1: '',
        chargeE2: '',
        chargeE3: '',
        dischargeS1: '',
        dischargeS2: '',
        dischargeS3: '',
        dischargeE1: '',
        dischargeE2: '',
        dischargeE3: '',
      },
      workOption: [
        {
          label: 'Self Consumption',
          value: 0
        },
        {
          label: 'Peak Shaving',
          value: 1
        },
        {
          label: 'Battery Priority',
          value: 2
        }
      ],
      pvTypeOption: [
        {
          label: 'Independent',
          value: 0
        },
        {
          label: 'Parallel',
          value: 1
        },
        {
          label: 'Constant Voltage',
          value: 2
        },
      ],
      batTypeOption: [
        {
          label: 'DC-source',
          value: 0
        },
        {
          label: 'Lead acid',
          value: 1
        },
        {
          label: 'Lithium',
          value: 2
        }
      ],
      batComuTypeOption: [
        {
          label: 'CAN',
          value: 1
        },
        {
          label: '485',
          value: 2
        }
      ],
      gridOption: [
        {
          label: 'Australia',
          value: 0
        },
        {
          label: 'West Australia',
          value: 1
        },
        {
          label: 'New Zealand',
          value: 2
        },
        {
          label: 'United Kingdom',
          value: 3
        },
        {
          label: 'Pakistan',
          value: 4
        },
        {
          label: 'Korea',
          value: 5
        },
        {
          label: 'The Philippines',
          value: 6
        },
        {
          label: 'China',
          value: 7
        },
        {
          label: 'The United States',
          value: 8
        },
        {
          label: 'Thailand',
          value: 9
        },
        {
          label: 'South Africa',
          value: 10
        },
        {
          label: 'Custom',
          value: 11
        },
        {
          label: 'Poland',
          value: 12
        },
        {
          label: 'EN50549',
          value: 13
        },
        {
          label: 'VDE4105',
          value: 14
        },
        {
          label: 'Japan',
          value: 15
        },
      ],
      siteCode: '',
      checkOffList: [],
      checkMidList: [],
      checkOnList: [],
      checkTotalList: [],
      offList: [],
      midList: [],
      onList: [],
      totalList: [],
      navBar: {
        'Remote Set': '1',
        'Set Record': '2',
        'Multi-time': '3',
      },
      active: '1',
      setLoading: '',
      deviceBase: {},
      rules: {
        1: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        2: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        3: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        4: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        7: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        8: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        17: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        24: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        30: [
          { required: false, message: '', trigger: ['blur', 'change'] }
        ],
        33: [
          { required: false, message: '', trigger: 'blur' }
        ],
      }
    }
  },
  beforeDestroy() {
    clearInterval(timerInter)
  },
  methods: {
    inputVerify(min, max, type) {
      if (!Number.isInteger(+this.deviceBase[type])) {
        this.deviceBase[type] = ''
        this.rules[+type][0].message = 'Please enter the number'
        this.rules[+type][0].required = true
      } else if (+this.deviceBase[type] > max || +this.deviceBase[type] < min) {
        this.deviceBase[type] = ''
        this.rules[+type][0].message = `Please enter the number in [${min}, ${max}]`
        this.rules[+type][0].required = true
      } else {
        this.rules[+type][0].required = false
        this.rules[+type][0].message = ''
      }

      this.rules = {...this.rules}

    },
    setTimeList() {
      let timeList = []
      for(let i = 1; i < 4; i++) {
        let item = {}
        if (this.peakShaving[`chargeS${i}`] && this.peakShaving[`chargeE${i}`]) {
          item.chargeStartTime = this.peakShaving[`chargeS${i}`]
          item.chargeEndTime = this.peakShaving[`chargeE${i}`]
        } else {
          item.chargeStartTime = '00:00'
          item.chargeEndTime = '00:00'
        }
        if (this.peakShaving[`dischargeS${i}`] && this.peakShaving[`dischargeE${i}`]) {
          item.dischargeStartTime = this.peakShaving[`dischargeS${i}`]
          item.dischargeEndTime = this.peakShaving[`dischargeE${i}`]
        } else {
          item.dischargeStartTime = '00:00'
          item.dischargeEndTime = '00:00'
        }
        timeList.push(item)
      }
      let params = {
        type: 34,
        siteCode: this.siteCode,
        timeList
      }
      deviceSet(params).then(res => {
        console.log('时间设置', res)
        if ([1002, 10030, 10031, 10032, 10033].includes(+res.code)) {
          this.$modal.msgError(res.msg)
          this.getDeviceSet()
        } else {
          let statusList = ['NO_RESPONSE', 'SUCCESS', 'ERROR', 'EXECUTING', 'NOT_ONLINE', 'UN_EXIST_FILE', 'SUBMIT_SUCCESS', 'NO_MATCH']
          if (+res.data === 3) {
            this.openLoading()
            this.getOrderRes()
          } else {
            this.$modal.msgError(statusList[+res.data])
            this.getDeviceSet()
          }
        }
      })
    },
    confirmSetDevice(type) {
      let message = +type === 23 ? 'Please confirm whether to clear the record' : 'Please confirm whether to restore factory settings'
      this.$modal.confirm(message).then(() => {
        return this.setDevice(type)
      })
    },
    getOrderRes() {
      let statusList = ['NO_RESPONSE', 'SUCCESS', 'ERROR', 'EXECUTING', 'NOT_ONLINE', 'UN_EXIST_FILE', 'SUBMIT_SUCCESS', 'NO_MATCH']
      let data = {
        siteCode: this.siteCode
      }
      clearInterval(timerInter)
      timerInter = setInterval(() => {
        times++
        orderRes(data).then(res => {
          if (+res.data === 3) {
            if(times > 15) {
              times = 1
              clearInterval(timerInter)
              this.getDeviceSet()
              this.setLoading.close()
              return this.$modal.msgError('timeout')
            }
            this.getOrderRes()
          } else {
            times = 1
            if (+res.data === 1) {
              this.$modal.msgSuccess('SUCCESS')
            } else this.$modal.msgError(statusList[+res.data])
            clearInterval(timerInter)
            this.getDeviceSet()
            this.setLoading.close()
          }
        })
      }, 1000)
    },
    setDevice(type) {
      if (copyDeviceInfo[type] === this.deviceBase[type]) {
        if (![22, 23].includes(+type)) return this.$modal.confirm('Value not changed')
      }
      let data = {
        siteCode: this.siteCode,
        type,
        baseParam: this.deviceBase[type]
      }
      let arr = [13, 21, 25, 31, 38]
      if (arr.includes(+type)) {
        if (this.deviceBase[type]) data.baseParam = 1
        else data.baseParam = 0
      }
      deviceSet(data).then(res => {
        if ([1002, 10030, 10031, 10032, 10033].includes(+res.code)) {
          this.$modal.msgError(res.msg)
          this.getDeviceSet()
        } else {
          let statusList = ['NO_RESPONSE', 'SUCCESS', 'ERROR', 'EXECUTING', 'NOT_ONLINE', 'UN_EXIST_FILE', 'SUBMIT_SUCCESS', 'NO_MATCH']
          if (+res.data === 3) {
            this.openLoading()
            this.getOrderRes()
          } else {
            this.$modal.msgError(statusList[+res.data])
            this.getDeviceSet()
          }
        }
      })
    },
    getDeviceSet() {
      let data = {
        siteCode: this.siteCode
      }
      getSettingInfo(data).then(res => {
        let item = {}
        res.data.forEach(i => {
          let arr = [13, 21, 25, 31, 38]
          if (arr.includes(+i.type)) {
            item[+i.type] = +i.param === 1
          } else item[i.type] = i.param
        })
        this.deviceBase = item
        if (this.deviceBase[34]) {
          let timeList = JSON.parse(this.deviceBase[34])
          timeList.forEach((i, index) => {
            this.peakShaving[`chargeS${index+1}`] = i.chargeStartTime
            this.peakShaving[`chargeE${index+1}`] = i.chargeEndTime
            this.peakShaving[`dischargeS${index+1}`] = i.dischargeStartTime
            this.peakShaving[`dischargeE${index+1}`] = i.dischargeEndTime
          })
        }
        copyDeviceInfo = JSON.parse(JSON.stringify(this.deviceBase))
      })
    },
    openLoading() {
      this.setLoading = this.$loading({
        lock: true,
        text: 'Setting',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    getList() {
      this.queryParams.createTime = this.DATE_FORMAT('yyyy-MM-dd', this.queryParams.createTime)
      this.loading = true
      let data = {
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
        siteCode: this.queryParams.siteCode,
        startTime: (this.ISD_TIMESTAMP(`${this.queryParams.createTime} 00:00:00`, this.base.timeZone)) / 1000,
        endTime: (this.ISD_TIMESTAMP(`${this.queryParams.createTime} 23:59:59`, this.base.timeZone)) / 1000,
      }
      setRecodeList(data).then(res => {
        this.list = res.rows
        this.total = res.total
      }).finally(() => {
        this.loading = false
      })
    },
    changeNav(v) {
      this.active = v
      if (+v === 1) this.getDeviceSet()
      if (+v === 2) this.getList()
      if (+v === 3) this.getSetting()
    },
    whole() {
      let i = 0
      for(i; i < this.totalList.length; i++) {
        if (this.totalList[i].disabled === false) break
      }
      return i < 23
    },
    getSetting() {
      let data = {
        pageNum: 1,
        pageSize: 24,
        siteCode: this.siteCode
      }
      siteSetting(data).then(res => {
        res.rows.forEach(i => i.disabled = true)
        this.totalList = res.rows
        this.offList = res.rows.filter(i => +i.type === 1)
        this.midList = res.rows.filter(i => +i.type === 2)
        this.onList = res.rows.filter(i => +i.type === 3)
      })
    },
    offDown(type) {
      if (type === 1) {
        if (this.checkOffList.length) {
          this.checkOffList.forEach(i => {
            let indexOf
            this.offList.forEach((k, index) => {
              if (k.id === i) indexOf = index
            })
            this.offList.splice(indexOf, 1)
            this.totalList.forEach(j => {
              if (j.id === i) j.disabled = false
            })
            this.totalList = [...this.totalList]
          })
          this.checkOffList = []
        }
      } else if (type === 2) {
        if (this.checkMidList.length) {
          this.checkMidList.forEach(i => {
            let indexOf
            this.midList.forEach((k, index) => {
              if (k.id === i) indexOf = index
            })
            this.midList.splice(indexOf, 1)
            this.totalList.forEach(j => {
              if (j.id === i) j.disabled = false
            })
            this.totalList = [...this.totalList]
          })
          this.checkMidList = []
        }
      } else if (type === 3) {
        if (this.checkOnList.length) {
          this.checkOnList.forEach(i => {
            let indexOf
            this.onList.forEach((k, index) => {
              if (k.id === i) indexOf = index
            })
            this.onList.splice(indexOf, 1)
            this.totalList.forEach(j => {
              if (j.id === i) j.disabled = false
            })
            this.totalList = [...this.totalList]
          })
          this.checkOnList = []
        }
      }
    },
    offUp(type) {
      if (type === 1) {
        if (this.checkTotalList.length) {
          this.checkTotalList.forEach(i => {
            let item
            this.totalList.forEach((o, index) => {
              if (o.id === i) item = o
            })
            this.offList.push(item)
            this.totalList.forEach(j => {
              if (j.id === i) {
                j.disabled = true
              }
            })
            this.totalList = [...this.totalList]
          })
          this.offList.sort((a, b) => {
            return a.id - b.id
          })
          this.checkTotalList = []
        }
      } else if (type === 2) {
        if (this.checkTotalList.length) {
          this.checkTotalList.forEach(i => {
            let item
            this.totalList.forEach((o, index) => {
              if (o.id === i) item = o
            })
            this.midList.push(item)
            this.totalList.forEach(j => {
              if (j.id === i) {
                j.disabled = true
              }
            })
            this.totalList = [...this.totalList]
          })
          this.midList.sort((a, b) => {
            return a.id - b.id
          })
          this.checkTotalList = []
        }
      } else if (type === 3) {
        if (this.checkTotalList.length) {
          this.checkTotalList.forEach(i => {
            let item
            this.totalList.forEach((o, index) => {
              if (o.id === i) item = o
            })
            this.onList.push(item)
            this.totalList.forEach(j => {
              if (j.id === i) {
                j.disabled = true
              }
            })
            this.totalList = [...this.totalList]
          })
          this.onList.sort((a, b) => {
            return a.id - b.id
          })
          this.checkTotalList = []
        }
      }
    },
    submit() {
      let offPeakList = [], midPeakList = [], onPeakList = []
      this.offList.forEach(i => offPeakList.push(i.id))
      this.midList.forEach(i => midPeakList.push(i.id))
      this.onList.forEach(i => onPeakList.push(i.id))
      let data = {
        siteCode: this.siteCode,
        offPeakList,
        midPeakList,
        onPeakList
      }

      siteSettingSubmit(data).then(res => {
        if (+res.code === 200) {
          this.$message({
            type: 'success',
            message: 'Succeeded!'
          })
          setTimeout(() => {
            this.getSetting()
          }, 500)
        }
      })
    },
  }
}
</script>

<style lang="scss">
.comp-site-set {
  .card-title {
    margin-bottom: 24px;
    font-weight: 700;
  }
  .top-container {
    margin-top: 16px;
    &-item {
      margin-bottom: 16px;
      width: calc(100% / 3 - 16px);
      border-radius: 2px 2px 2px 2px;

    }
    .off, .mid, .on {
      margin-bottom: 16px;
      border: 1px solid #D8DCE6;
      .header {
        height: 40px;
        text-indent: 16px;
        font-weight: 700;
        line-height: 40px;
        border-bottom: 1px solid #D8DCE6;
      }
      .timer-container {
        padding: 16px 0 0 16px;
        height: 220px;
        overflow-y: auto;
        @include scrollbar();
        &-item {
          &-group {
            display: flex;
            flex-wrap: wrap;
            .el-checkbox {
              width: calc(100% / 3);
              height: 30px;
            }
          }
        }
      }
    }
  }
  .time-total {
    margin: 30px 0 26px;
    border: 1px solid #D8DCE6;
    &-header {
      height: 40px;
      text-indent: 16px;
      font-weight: 700;
      line-height: 40px;
      border-bottom: 1px solid #D8DCE6;
    }
    &-container {
      padding: 26px 0 0 16px;
      .el-checkbox {
        height: 46px;
      }
    }
  }
  &-content {
    margin-top: 24px;

    &-nav {
      flex-shrink: 0;
      margin-right: 48px;
      width: 160px;
      border-right: 1px solid #D8DCE6;
      @media screen and (max-width: 1334px) {
        width: 100px;
        font-size: 12px;
      }

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
  }
  .remote {
    padding: 24px;
    border: 1px solid #D8DCE6;
    border-radius: 2px;
    .set-part {
      margin-bottom: 40px;
    }
    .set-type {
      margin-bottom: 10px;
      width: 100%;
      border-bottom: 1px solid #D8DCE6;
      font-weight: 600;
    }
    .el-input__inner {
      @media screen and (max-width: 1334px) {
        width: 130px;
      }
    }
    .peak-box {
      padding: 16px 0 24px 10px;
      border: 1px solid #D8DCE6;
      border-radius: 2px;
      .time-range {
        &-label {
          margin-right: 10px;
          text-align: right;
          width: 100px;
          @include nFont(12 #828282)
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
        .el-input {
          width: 80px !important;
          @media screen and (max-width: 1334px) {
            width: 50px !important;
          }
        }
        .el-input__inner {
          width: 80px;
          border: none !important;
          padding: 0 14px;
          @media screen and (max-width: 1334px) {
            width: 50px !important;
            padding: 0 5px;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
