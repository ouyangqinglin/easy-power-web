<template>
  <common-flex direction="column" class="pages-index app-container">
<!--    :style="{flexGrow: +$store.state.user.userType === 1 ? 2 : 3}"-->
    <div>
      <el-row :gutter="16">
        <el-col :xl="leftXl" :md="leftMd">
          <el-card>
            <common-flex style="height: 100%" direction="column">
              <div class="content-title">Production Overview</div>
              <common-flex class="pages-index-overview" align="center">
                <common-flex justify="center" align="center" class="pages-index-overview-img">
                  <img :src="require('@img/home/pro.svg')" alt="">
                </common-flex>
                <common-flex wrap="wrap" justify="space-around" align="center" class="pages-index-overview-info" v-if="+$store.state.user.userType === 1">
                  <div class="pages-index-overview-info-left name-des">
                    <template v-if="+homeData.dayProduce < 1000">
                      <div class="num">{{ homeData.dayProduce }}</div>
                      <span>(Wh)</span><br>Today
                    </template>
                    <template v-else-if="+homeData.dayProduce > 1000 && +homeData.dayProduce < 1000000">
                      <div class="num">{{ (+homeData.dayProduce / 1000).toFixed(2) }}</div>
                      <span>(kWh)</span><br>Today
                    </template>
                    <template v-else>
                      <div class="num">{{ (+homeData.dayProduce / 1000000).toFixed(2) }}</div>
                      <span>(MWh)</span><br>Today
                    </template>
                  </div>
                  <div class="name-des">
                    <template v-if="+homeData.monthProduce < 1000">
                      <div class="num">{{ +(homeData.monthProduce).toFixed(2) }}</div>
                      <span>(Wh)</span><br>This Month
                    </template>
                    <template v-else-if="+homeData.monthProduce > 1000 && +homeData.monthProduce < 1000000">
                      <div class="num">{{ (+homeData.monthProduce / 1000).toFixed(2) }}</div>
                      <span>(kWh)</span><br>This Month
                    </template>
                    <template v-else>
                      <div class="num">{{ (+homeData.monthProduce / 1000000).toFixed(2) }}</div>
                      <span>(MWh)</span><br>This Month
                    </template>
                  </div>
                  <div class="pages-index-overview-info-left name-des">
                    <template v-if="+homeData.yearProduce < 1000">
                      <div class="num">{{ (+homeData.yearProduce).toFixed(2) }}</div>
                      <span>(Wh)</span><br>This Year
                    </template>
                    <template v-else-if="+homeData.yearProduce > 1000 && +homeData.yearProduce < 1000000">
                      <div class="num">{{ (+homeData.yearProduce / 1000).toFixed(2) }}</div>
                      <span>(kWh)</span><br>This Year
                    </template>
                    <template v-else>
                      <div class="num">{{ (+homeData.yearProduce / 1000000).toFixed(2) }}</div>
                      <span>(MWh)</span><br>This Year
                    </template>
                  </div>
                  <div class="name-des">
                    <template v-if="+homeData.allProduce < 1000">
                      <div class="num">{{ (+homeData.allProduce).toFixed(2) }}</div>
                      <span>(Wh)</span><br>Lifetime
                    </template>
                    <template v-else-if="+homeData.allProduce > 1000 && +homeData.allProduce < 1000000">
                      <div class="num">{{ (+homeData.allProduce / 1000).toFixed(2) }}</div>
                      <span>(kWh)</span><br>Lifetime
                    </template>
                    <template v-else>
                      <div class="num">{{ (+homeData.allProduce / 1000000).toFixed(2) }}</div>
                      <span>(MWh)</span><br>Lifetime
                    </template>
                  </div>
                </common-flex>
                <common-flex direction="column" justify="space-around" class="pages-index-overview-info" v-else>
                  <common-flex justify="space-around" style="width: 100%;">
                    <div class="name-des">
                      <div>
                        <template v-if="+homeData.dayProduce < 1000">
                          <div class="num">{{ homeData.dayProduce }}</div>
                          <span>(Wh)</span><br>Today
                        </template>
                        <template v-else-if="+homeData.dayProduce > 1000 && +homeData.dayProduce < 1000000">
                          <div class="num">{{ (+homeData.dayProduce / 1000).toFixed(2) }}</div>
                          <span>(kWh)</span><br>Today
                        </template>
                        <template v-else-if="+homeData.dayProduce > 1000000">
                          <div class="num">{{ (+homeData.dayProduce / 1000000).toFixed(2) }}</div>
                          <span>(MWh)</span><br>Today
                        </template>
                      </div>
                      <div style="margin-top: 16px">
                        <template v-if="+homeData.yearProduce < 1000">
                          <div class="num">{{ (+homeData.yearProduce).toFixed(2) }}</div>
                          <span>(Wh)</span><br>This Year
                        </template>
                        <template v-else-if="+homeData.yearProduce > 1000 && +homeData.yearProduce < 1000000">
                          <div class="num">{{ (+homeData.yearProduce / 1000).toFixed(2) }}</div>
                          <span>(kWh)</span><br>This Year
                        </template>
                        <template v-else>
                          <div class="num">{{ (+homeData.yearProduce / 1000000).toFixed(2) }}</div>
                          <span>(MWh)</span><br>This Year
                        </template>
                      </div>
                    </div>
                    <div class="name-des">
                      <div>
                        <template v-if="+homeData.monthProduce < 1000">
                          <div class="num">{{ homeData.monthProduce }}</div>
                          <span>(Wh)</span><br>This Month
                        </template>
                        <template v-else-if="+homeData.monthProduce > 1000 && +homeData.monthProduce < 1000000">
                          <div class="num">{{ (+homeData.monthProduce / 1000).toFixed(2) }}</div>
                          <span>(kWh)</span><br>This Month
                        </template>
                        <template v-else>
                          <div class="num">{{ (+homeData.monthProduce / 1000000).toFixed(2) }}</div>
                          <span>(MWh)</span><br>This Month
                        </template>
                      </div>
                      <div style="margin-top: 16px">
                        <template v-if="+homeData.allProduce < 1000">
                          <div class="num">{{ (+homeData.allProduce).toFixed(2) }}</div>
                          <span>(Wh)</span><br>Lifetime
                        </template>
                        <template v-else-if="+homeData.allProduce > 1000 && +homeData.allProduce < 1000000">
                          <div class="num">{{ (+homeData.allProduce / 1000).toFixed(2) }}</div>
                          <span>(kWh)</span><br>Lifetime
                        </template>
                        <template v-else>
                          <div class="num">{{ (+homeData.allProduce / 1000000).toFixed(2) }}</div>
                          <span>(MWh)</span><br>Lifetime
                        </template>
                      </div>
                    </div>
                  </common-flex>
                </common-flex>
              </common-flex>
            </common-flex>
          </el-card>
        </el-col>
        <el-col :xl="7" :md="6">
          <el-card>
            <common-flex style="height: 100%" direction="column">
              <div class="content-title">Site Info</div>
              <common-flex class="pages-index-overview" align="center">
                <common-flex justify="center" align="center" class="pages-index-overview-img">
                  <img :src="require('@img/home/site.svg')" alt="">
                </common-flex>
                <common-flex direction="column" justify="center" class="pages-index-overview-info">
                  <div class="name-des">
                    <div class="num">{{ homeData.siteNum || '--' }}</div><span></span>
                    <br>Total Sites
                  </div>
                </common-flex>
              </common-flex>
            </common-flex>
          </el-card>
        </el-col>
        <el-col :xl="7" :md="6" v-if="+($store.state.user.userType) !== 1">
          <el-card>
            <common-flex style="height: 100%" direction="column">
              <div class="content-title" v-if="homeData.agent">Agency: {{ $store.state.user.agency }}</div>
              <div class="content-title" v-else>Customer</div>
              <common-flex class="pages-index-overview" align="center">
                <common-flex justify="center" align="center" class="pages-index-overview-img">
                  <img :src="require('@img/home/custom.svg')" alt="">
                </common-flex>
                <common-flex v-if="homeData.agent" direction="column" justify="center" class="pages-index-overview-info">
                  <div class="name-des">
                    <div class="num">{{ homeData.consumerNum || '--' }}</div><span></span>
                    <br>Total Customers
                  </div>
                </common-flex>
                <common-flex v-else direction="column" justify="space-between" class="pages-index-overview-info">
                  <div class="pages-index-overview-info-left name-des">
                    <div class="num">{{  homeData.agentNum || '--' }}</div>
                    <br>Total Agencies
                  </div>
                  <div class="pages-index-overview-info-left name-des">
                    <div class="num">{{ homeData.consumerNum || '--' }}</div>
                    <br>Total Customers
                  </div>
                </common-flex>
              </common-flex>
            </common-flex>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div style="flex-grow: 1; margin-top: 16px">
      <el-row :gutter="16">
        <el-col :xl="13" :md="15" :sm="16">
          <el-card>
            <common-flex direction="column" style="width: 100%; height: 100%">
              <common-flex style="width: 100%" align="center">
                <div class="chart-header">Yield Statistics</div>
                <common-flex justify="flex-end" style="flex-grow: 1">
                  <el-radio-group v-model="dateType" style="margin-right: 5px" size="small">
                    <el-radio-button label="date">Day</el-radio-button>
                    <el-radio-button label="week">Week</el-radio-button>
                    <el-radio-button label="month">Month</el-radio-button>
                    <el-radio-button label="year">Year</el-radio-button>
                  </el-radio-group>
                  <el-date-picker
                    ref="endDate"
                    size="small"
                    :key="timeType"
                    @change="sureDate"
                    v-model="dateVal"
                    :type="timeType"
                    :format="displayFormat"
                    :value-format="dateFormat"
                    start-placeholder="start time"
                    :picker-options="closePicker"
                    end-placeholder="end time">
                  </el-date-picker>
                </common-flex>
              </common-flex>
              <div class="barchart-box posr">
                <template v-if="barNoData">
                  <div id="userChart" v-if="dateType === 'date'" class="userChart"></div>
                  <div id="barChart" v-else class="barChart"></div>
                </template>
                <template v-else>
                  <div style="height: 100%"><no-data /></div>
                </template>
                <div class="barChart-total" v-if="+totalPvGenerateEnergy > 1000000">{{ +(totalPvGenerateEnergy / 1000000).toFixed(2) || '--' }}<span>MWh</span></div>
                <div class="barChart-total" v-else-if="+totalPvGenerateEnergy > 1000 && +totalPvGenerateEnergy < 1000000">{{ +(totalPvGenerateEnergy / 1000).toFixed(2) }}<span>kWh</span></div>
                <div class="barChart-total" v-else>{{ (+totalPvGenerateEnergy).toFixed(2) }}<span>Wh</span></div>
              </div>
            </common-flex>
          </el-card>
        </el-col>
        <el-col :xl="11" :md="9" :sm="8">
          <common-flex style="width: 100%; height: 100%;" direction="column">
            <el-card class="rank-card" style="flex-grow: 1">
              <div class="chart-header">Today's Site Ranking  (Top 3)</div>
              <div class="rankChart" v-if="rankData.length" id="rankChart"></div>
              <common-flex justify="center" align="center" class="rankChart" v-else>
                <no-data />
              </common-flex>
            </el-card>
            <el-card class="benefit-card" style="height: 66%; margin-top: 16px">
              <div class="chart-header">Environmental Benefits</div>
              <common-flex justify="center" class="benefit posr">
                <img class="benefit-bg posa" :src="require('@img/home/benefit-bg.svg')" alt="">
                <common-flex direction="column" justify="space-between" align="flex-end" class="benefit-item" style="padding-right: 25px">
                  <common-flex style="height: 100%" direction="column" justify="space-between" align="center">
                    <common-flex direction="column" align="center">
                      <div class="des ellipsis" title="CO2 Emission Saved">CO2 Emission Saved</div>
                      <div class="val">{{ homeData.emissionSaved || '-- ' }}<span> kg</span></div>
                    </common-flex>
                    <img class="benefit-left" :src="require('@img/home/benefit-left.svg')" alt="">
                  </common-flex>
                </common-flex>
                <div style="width: 1px; height: 16px; background-color: #909399"></div>
                <common-flex direction="column" align="flex-start" class="benefit-item" style="padding-left: 25px">
                  <common-flex style="height: 100%" direction="column" justify="space-between" align="center">
                    <common-flex direction="column" align="center">
                      <div class="des ellipsis" title="Equivalent Trees Planted">Equivalent Trees Planted</div>
                      <div class="val">{{ homeData.trees || '--' }}</div>
                    </common-flex>
                    <img class="benefit-right" :src="require('@img/home/benefit-right.svg')" alt="">
                  </common-flex>
                </common-flex>
              </common-flex>
            </el-card>
          </common-flex>
        </el-col>
      </el-row>
    </div>
  </common-flex>
</template>

<script>
import { homeInfo, homeChart, rankChart } from '@/api/index'
import * as echarts from 'echarts'

function detectZoom() {
  let ratio = 0
  const screen = window.screen
  const ua = navigator.userAgent.toLowerCase()
  if (window.devicePixelRatio !== undefined) {
    ratio = window.devicePixelRatio
  } else if (~ua.indexOf('msie')) {
    if (screen.deviceXDPI && screen.logicalXDPI) {
      ratio = screen.deviceXDPI / screen.logicalXDPI
    }
  } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
    ratio = window.outerWidth / window.innerWidth
  }
  if (ratio) {
    ratio = Math.round(ratio * 100)
  }
  return ratio
}
let xAxisData = []
let data1 = []
let data2 = []
const emphasisStyle = {
  itemStyle: {
    shadowBlur: 10,
    shadowColor: 'rgba(0,0,0,0.3)'
  }
}

const lineOption = {
    color: ['#3EBCD4'],
    tooltip: {
      show: true,
      trigger: 'axis',
      formatter (v) {
        let v0, t1, unit1
        if (v[0]) {
          if (+v[0].value < 1) {
            t1 = `${(+v[0].value * 1000).toFixed(2)}`
            unit1 = 'Wh'
          } else if (+v[0].value > 1 && +v[0].value < 1000) {
            t1 = `${(+v[0].value).toFixed(2)}`
            unit1 = 'kWh'
          } else {
            t1 = `${(+v[0].value / 1000).toFixed(2)}`
            unit1 = 'MWh'
          }
          v0 = `${v[0].marker}  ${t1}${unit1}`
        }
        return `${v[0].name}<br>${v0}`
      }
    },
    grid: {
      left: 50,
      bottom: 30
    },
    xAxis: {
      type: 'category',
      data: [],
      axisLine: {
        lineStyle: {
          color: '#E7E7E7'
        }
      },
      axisTick: {
        alignWithLabel: true
      },
      axisLabel: {
        textStyle: {
          color: '#000',
          fontSize: 10
        }
      },
    },
    yAxis: {
      name: 'kWh',
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
      },
      axisLabel: {
        textStyle: {
          fontSize: 10,
        }
      }
    },
    series: [
      {
        data: [],
        // smooth: true,
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                {offset: 0, color: '#a8e1ec'},
                {offset: 0.5, color: '#d9f2f7'},
                {offset: 1, color: '#f1fafc'}
              ]
            )
          }
        },
        type: 'line'
      }
    ]
  }
const rankOption = {
  color: '#68B4FF',
  tooltip: {
    show: true,
    formatter(c) {
      let unit, v
      if (c.value < 1) {
        v = (+c.value * 1000).toFixed(2)
        unit = 'Wh'
      } else if (c.value > 1 && c.value < 1000) {
        v = (+c.value).toFixed(2)
        unit = 'kWh'
      } else {
        v = (+c.value / 1000).toFixed(2)
        unit = 'MWh'
      }
      return `${c.name}: ${v} ${unit}`
    },
textStyle: {
  fontSize: 10
}
},
grid: {
  left: '18%',
  right: '14%',
  top: '8%',
  // bottom: '10%'
},
xAxis: {
  name: 'kWh',
    type: 'value',
    boundaryGap: [0, 0.01],
    splitLine: {
    lineStyle: {
      type: 'dashed'
    }
  },
  axisTick: {
    show: false,
  },
  axisLine: {
    show: false,
  },
  axisLabel: {
    textStyle: {
      fontSize: 10,
    }
  }
},
yAxis: {
  type: 'category',
    data: [],
    axisTick: {
    show: false
  },
  axisLine: {
    lineStyle: {
      color: '#E7E7E7'
    }
  },
  axisLabel: {
    textStyle: {
      fontSize: 10,
        color: '#000'
    },
  },
},
series: [
  {
    type: 'bar',
    data: [],
    itemStyle: {
      normal: {
        label: {
          show: true,
          position: 'right',
          formatter(c) {
            let unit, v
            if (c.value < 1) {
              v = (+c.value * 1000).toFixed(2)
              unit = 'Wh'
            } else if (c.value > 1 && c.value < 1000) {
              v = (+c.value).toFixed(2)
              unit = 'kWh'
            } else {
              v = (+c.value / 1000).toFixed(2)
              unit = 'MWh'
            }
            return `${v} ${unit}`
          },
          textStyle: {
            fontSize: 14,
            color: '#000'
          }
        }
      }
    },
    // barWidth: 20
  },
]
}
const barOption = {
    color: ['#3daabf', '#8bea91'],
    legend: {
      data: ['Export', 'Used'],
      right: '130',
    },
    xAxis: {
      data: [],
      splitLine: { show: false },
      splitArea: { show: false },
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#E7E7E7'
        }
      },
      axisLabel: {
        textStyle: {
          fontSize: 10,
        }
      }
    },
    yAxis: {
      name: 'kWh',
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
      },
      axisLabel: {
        textStyle: {
          fontSize: 10,
        }
      }
    },
    grid: {
      left: 50,
      bottom: 30
    },
    series: [
      {
        name: 'Export',
        type: 'bar',
        stack: 'one',
        emphasis: emphasisStyle,
        data: [],
        barWidth: 12
      },
      {
        name: 'Used',
        type: 'bar',
        stack: 'one',
        emphasis: emphasisStyle,
        data: [],
        barWidth: 12
      },
    ]
  }
export default {
  name: "Index",
  data() {
    const dateVal = new Date()
    const that = this
    return {
      closePicker: {
        onPick(a) {
          that.$refs.endDate.handleClose()
          setTimeout(() => {
            that.params.startTime = that.DATE_FORMAT('yyyy-M-d', a.minDate)
            that.dateVal = []
            that.dateVal.push(that.params.startTime)
            that.sureDate(that.dateVal)
          }, 200)
        },
      },
      barNoData: true,
      totalPvGenerateEnergy: '',
      dateType: 'date',
      dateVal: dateVal,
      timer: null,
      bar: null,
      rankBar: null,
      userChart: null,
      homeData: {},
      rankData: [],
      dateFormat: 'yyyy-M-d',
      displayFormat: 'MM-dd-yyyy',
      params: {
        dataType: 1, // {Number} 数据统计分组方式 1-按小时分组 2-按日分组 3-按月分组 4-按照每15分钟分组
        startTime: '', // {String} 示例值：2022-7-19
        endTime: '', // {String} 示例值：2022-7-19
        scope: 3, // {Number} 说明：1-只要production 2-只要consumption 3-全都要
      }
    }
  },
  computed: {
    timeType() {
      const arr = {
        'date': 'date',
        'week': 'daterange',
        'month': 'month',
        'year': 'year'
      }
      return arr[this.dateType]
    },
    leftXl() {
      return +(this.$store.state.user.userType) === 1 ? 17 : 10
    },
    leftMd() {
      return +(this.$store.state.user.userType) === 1 ? 18 : 12
    },
  },
  watch: {
    dateType(v) {
      if (v === 'date' || v === 'week') {
        this.dateVal = new Date()
        if (v === 'date') {
          this.params.startTime = this.params.endTime = this.DATE_FORMAT('yyyy-M-d', this.dateVal)
        } else {
          const startStampTime = (new Date(this.dateVal)).getTime() - 6 * 24 * 60 * 60 * 1000
          this.params.endTime = this.DATE_FORMAT('yyyy-M-d', new Date(this.dateVal))
          this.params.startTime = this.DATE_FORMAT('yyyy-M-d', startStampTime)
          let v1, v2
          v1 = this.DATE_FORMAT('MM-dd-yyyy', this.params.startTime)
          v2 = this.DATE_FORMAT('MM-dd-yyyy', this.params.endTime)
          this.dateVal = [v1, v2]
        }
        this.dateFormat = 'MM-dd-yyyy'
        this.displayFormat = 'MM-dd-yyyy'
      } else if (v === 'month') {
        this.dateVal = new Date()
        const firstDate = this.DATE_FORMAT('yyyy-M', this.dateVal) + '-1'
        this.params.startTime = firstDate
        this.params.endTime = this.DATE_FORMAT('yyyy-M-d', this.dateVal)
        this.dateFormat = 'yyyy-MM'
        this.displayFormat = 'MM-yyyy'
      } else if (v === 'year') {
        this.dateVal = new Date()
        const year = this.DATE_FORMAT('yyyy', this.dateVal)
        this.params.startTime = `${year}-1-1`
        let curYear = this.DATE_FORMAT('yyyy', new Date())
        if (+year !== +curYear) this.params.endTime = `${year}-12-31`
        else this.params.endTime = this.DATE_FORMAT('yyyy-M-d', new Date())
        this.dateFormat = 'yyyy'
        this.displayFormat = 'yyyy'
      }
      const arr = {
        'date': 1,
        'week': 2,
        'month': 2,
        'year': 3
      }
      this.params.dataType = arr[v]
      this.sureDate()
    },
  },
  mounted() {
    this.changeChartSize()
    this.params.endTime = this.params.startTime = this.DATE_FORMAT('yyyy-M-d', new Date())
    this.getHomeData()
    this.getChartData()
    this.getRankData()
    window.addEventListener('resize', this.changeSize)
  },
  beforeDestroy() {
    clearInterval(this.timer)
    window.removeEventListener('resize', this.changeSize)
  },
  methods: {
    changeChartSize() {
      let scaleScreen = detectZoom()
      if (scaleScreen > 100 && innerHeight < 1000) {
        rankOption.yAxis.axisLabel.textStyle.fontSize = rankOption.xAxis.axisLabel.textStyle.fontSize = lineOption.xAxis.axisLabel.textStyle.fontSize = lineOption.yAxis.axisLabel.textStyle.fontSize = barOption.xAxis.axisLabel.textStyle.fontSize = barOption.yAxis.axisLabel.textStyle.fontSize = 10
        rankOption.series[0].barWidth = 12
        rankOption.series[0].itemStyle.normal.label.textStyle.fontSize = 10
        rankOption.tooltip.textStyle.fontSize = 10
        rankOption.yAxis.axisLabel.formatter = function(value) {
          let label = ''
          if (value.length > 10) label = value.slice(0, 8) + '...'
          else label = value
          return label
        }
      } else {
        rankOption.series[0].barWidth = 20
        rankOption.grid.bottom = '25%'
        rankOption.series[0].itemStyle.normal.label.textStyle.fontSize = 14
        rankOption.tooltip.textStyle.fontSize = 14
        rankOption.yAxis.axisLabel.textStyle.fontSize = rankOption.xAxis.axisLabel.textStyle.fontSize = lineOption.xAxis.axisLabel.textStyle.fontSize = lineOption.yAxis.axisLabel.textStyle.fontSize = barOption.xAxis.axisLabel.textStyle.fontSize = barOption.yAxis.axisLabel.textStyle.fontSize = 14
        rankOption.yAxis.axisLabel.formatter = function(value) {
          let label = ''
          if (value.length > 15) label = value.slice(0, 15) + '...'
          else label = value
          return label
        }
      }
    },
    sureDate(v) {
      if (v) {
        if (this.dateType === 'date') this.params.startTime = this.params.endTime = this.DATE_FORMAT('yyyy-M-d', v)
        else if (this.dateType === 'week') {
          const endStampTime = (new Date(v[0])).getTime() +  6 * 24 * 60 * 60 * 1000
          this.params.endTime = this.DATE_FORMAT('yyyy-M-d', endStampTime)
          let v1, v2
          v1 = this.DATE_FORMAT('MM-dd-yyyy', this.params.startTime)
          v2 = this.DATE_FORMAT('MM-dd-yyyy', this.params.endTime)
          this.dateVal = [v1, v2]
        } else if (this.dateType === 'month') {
          const maxMonth = [1, 3, 5, 7, 8, 10, 12]
          const month = this.DATE_FORMAT('M', new Date(this.dateVal))
          const startTime = `${v}-01`
          let endStampTime
          if (maxMonth.includes(+month)) {
            endStampTime = (new Date(startTime)).getTime() +  30 * 24 * 60 * 60 * 1000
          } else if (+month === 2) endStampTime = (new Date(startTime)).getTime() + 27 * 24 * 60 * 60 * 1000
          else endStampTime = (new Date(startTime)).getTime() + 29 * 24 * 60 * 60 * 1000
          this.params.startTime = startTime
          this.params.endTime = this.DATE_FORMAT('yyyy-MM-dd', endStampTime)
        } else {
          this.params.startTime = `${v}-1-1`
          let curYear = this.DATE_FORMAT('yyyy', new Date())
          if (+v !== +curYear) this.params.endTime = `${v}-12-31`
          else this.params.endTime = this.DATE_FORMAT('yyyy-M-d', new Date())
        }
      }
      this.$nextTick(() => {
        this.getChartData()
      })
    },
    getRankData() {
      const params = {
        num: 3
      }
      rankChart(params).then(res => {
        this.rankData = res.data
        this.rankData.reverse()
        this.rankData.forEach((i, index) => {
          rankOption.yAxis.data.push(i.siteName)
          rankOption.series[0].data.push(i.dayProduce / 1000)
        })
        if (this.rankData.length) {
          if (!this.rankBar) this.$nextTick(() => {
            this.rankBar = echarts.init(document.getElementById('rankChart'))
            this.initRankOption()
          })
        }
      })
    },
    getHomeData() {
      homeInfo().then((res) => {
        this.homeData = res.data
      })
    },
    getChartData() {
      const data = {
        startTime: new Date((`${this.params.startTime} 00:00:00`)).getTime() / 1000,
        endTime: new Date((`${this.params.endTime} 23:59:59`)).getTime() / 1000,
        dataType: this.params.dataType,
        scope: this.params.scope
      }
      homeChart(data).then(res => {
        const lineData = res.data.list
        this.barNoData = res.data && !!lineData.length
        if (this.barNoData) {
          if (this.dateType === 'date') {
            if (!this.userChart) this.$nextTick(() => this.userChart = echarts.init(document.getElementById('userChart')))
          }else {
            if (!this.bar) this.$nextTick(() => this.bar = echarts.init(document.getElementById('barChart')))
          }
        } else return
        this.totalPvGenerateEnergy = (lineData.reduce((sum, i) => {
          return sum + i.systemProduction
        }, 0)).toFixed(2)
        if (this.dateType === 'date') {
          lineOption.xAxis.data = []
          lineOption.series[0].data = []
          lineData.forEach(i => {
            lineOption.xAxis.data.push(i.time)
            lineOption.series[0].data.push(((+i.pvGenerateEnergy + (+i.storeDischargeEnergy)) / 1000).toFixed(2))
          })
          this.initUserChart()
        } else {
          const netDischargeEnergyTotal = (lineData.reduce((sum, i) => {
            return sum + i.export / 1000
          }, 0)).toFixed(2)
          const familyUsedTotal = (lineData.reduce((sum, i) => {
            return sum + i.used / 1000
          }, 0)).toFixed(2)
          if (this.totalPvGenerateEnergy && this.totalPvGenerateEnergy !== '0.00') {
            const exportPercent = ((netDischargeEnergyTotal / (+this.totalPvGenerateEnergy / 1000)) * 100).toFixed(0)
            const userPercent = 100 - exportPercent
            barOption.legend.formatter = (name) => {
              return name === 'Used' ? `${name}（${userPercent}%）` : `${name}（${exportPercent}%）`
            }
          } else {
            barOption.legend.formatter = (name) => {
              return `${name}（--）`
            }
          }
          barOption.xAxis.data = xAxisData = []
          data1 = []
          data2 = []
          if (+this.totalPvGenerateEnergy > 1000000) {
            barOption.yAxis.name = 'MWh'
            lineData.forEach((i) => {
              xAxisData.push(i.time)
              data1.push(i.export / 1000000)
              data2.push(i.used / 1000000)
            })
          } else {
            lineData.forEach((i) => {
              barOption.yAxis.name = 'kWh'
              xAxisData.push(i.time)
              data1.push(i.export / 1000)
              data2.push(i.used / 1000)
            })
          }
          this.initOption()
        }
      })
    },
    changeSize() {
      this.changeChartSize()
      clearInterval(this.timer)
      this.timer = setTimeout(() => {
        if (this.bar) this.bar.resize()
        if (this.rankBar) this.rankBar.resize()
        if (this.userChart) this.userChart.resize()
      }, 500)
    },
    initOption() {
      const that = this
      this.bar = echarts.init(document.getElementById('barChart'))
      barOption.series[0].data = data1
      barOption.series[1].data = data2
      barOption.xAxis.data = xAxisData
      if (this.dateType === 'year') {
        barOption.xAxis.axisLabel = {
          interval: 'auto',
          textStyle: {
            color: '#000'
          }
        }
      } else {
        barOption.xAxis.axisLabel = {
          interval: 'auto',
          textStyle: {
            color: '#000'
          }
        }
      }
      barOption.tooltip = {
        show: true,
        axisPointer: {
          label: {
            show: true,
          },
          trigger: 'axis',
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(170, 178, 188, .16)'
          }
        },
        formatter(v) {
          let v0, v1, t1, t2, total, res, unit1, unit2, unit3
          if (barOption.yAxis.name === 'MWh') {
            if (v[0]) {
              if (v[0].value < 1) {
                t1 = `${(v[0].value * 1000).toFixed(2)}`
                unit1 = 'kWh'
              } else if (v[0].value > 1 && v[0].value < 1000) {
                t1 = `${(+v[0].value).toFixed(2)}`
                unit1 = 'MWh'
              }
              v0 = `${v[0].marker}${v[0].seriesName}: ${t1}${unit1}`
            }
            if (v[1]) {
              if (v[1].value < 1) {
                t2 = `${(v[1].value * 1000).toFixed(2)}`
                unit2 = 'kWh'
              } else if (v[1].value > 1 && v[1].value < 1000) {
                t2 = `${(+v[1].value).toFixed(2)}`
                unit2 = 'MWh'
              }
              v1 = `${v[1].marker}${v[1].seriesName}：${t2}${unit2}`
            }
            if (v0) {
              res = `${v0}<br>`
              total = +v[0].value
            }
            if (v1) {
              res += `${v1}<br>`
              total += +v[1].value
            }
            if (+total < 1 ) {
              unit3 = 'kWh'
              total = total * 1000
            }
            else unit3 = 'MWh'
          } else {
            if (v[0]) {
              if (v[0].value < 1) {
                t1 = `${(v[0].value * 1000).toFixed(2)}`
                unit1 = 'Wh'
              } else if (v[0].value > 1 && v[0].value < 1000) {
                t1 = `${(+v[0].value).toFixed(2)}`
                unit1 = 'kWh'
              } else {
                t1 = `${(+v[0].value / 1000).toFixed(2)}`
                unit1 = 'MWh'
              }
              v0 = `${v[0].marker}${v[0].seriesName}: ${t1}${unit1}`
            }
            if (v[1]) {
              if (v[1].value < 1) {
                t2 = `${(v[1].value * 1000).toFixed(2)}`
                unit2 = 'Wh'
              } else if (v[1].value > 1 && v[1].value < 1000) {
                t2 = `${(+v[1].value).toFixed(2)}`
                unit2 = 'kWh'
              } else {
                t2 = `${(+v[1].value / 1000).toFixed(2)}`
                unit2 = 'MWh'
              }
              v1 = `${v[1].marker}${v[1].seriesName}：${t2}${unit2}`
            }
            if (v0) {
              res = `${v0}<br>`
              total = +v[0].value
            }
            if (v1) {
              res += `${v1}<br>`
              total += +v[1].value
            }
            if (+total > 1 && +total < 1000 ) unit3 = 'kWh'
            else if (+total > 1000) {
              unit3 = 'MWh'
              total = +total / 1000
            } else {
              total = +total * 1000
              unit3 = 'Wh'
            }
          }
          total = (+total).toFixed(2)
          return `${v[0].name}<br>${res}<span style="margin-right: 14px"></span>Total：${total}${unit3}`
        },
        backgroundColor: '#fff',
        extraCssText: 'box-shadow: 0px 3px 6px 1px rgba(0,0,0,0.16);',
        textStyle: {
          color: '#000'
        }
      }
      this.$nextTick(() => {
        this.bar.setOption(barOption)
      })
    },
    initUserChart() {
      echarts.init(document.getElementById('userChart')).dispose()
      this.userChart = echarts.init(document.getElementById('userChart'))
      this.$nextTick(() => {
        this.userChart.setOption(lineOption)
      })
    },
    initRankOption() {
      this.rankBar.setOption(rankOption)
    }
  }
};
</script>

<style lang="scss">
.pages-index {
  position: absolute;
  padding: 16px;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  .el-row, .el-col, .el-card, .el-card__body {
    height: 100%;
  }
  .el-date-editor.el-input {
    width: 220px;
  }
  .el-date-editor--daterange.el-input__inner {
    width: 220px;
  }
  p {
    font-weight: 700;
  }
  .content-title {
    margin-bottom: 10px;
    font-weight: bold;
    text-align: left;
    @media screen and (max-width: 1334px) {
      font-size: 12px;
    }
  }
  &-overview {
    flex-grow: 1;
    width: 100%;
    &-img {
      flex-shrink: 0;
      flex-grow: 1;
      img {
        @include wh(100);
        @media screen and (max-width: 1334px) {
          @include wh(75)
        }
      }
    }
    &-info {
      flex-grow: 1.5;
      height: 100%;
      .name-des {
        font-size: 14px;
        color: #000;
        @media screen and (max-width: 1334px) {
          font-size: 10px;
        }
      }
      .num {
        display: inline-block;
        @include nFont(24 #000 700 35);
        @media screen and (max-width: 1334px) {
          @include nFont(14 #000 700 25);
          width: 42px;
        }
      }
      span {
        margin-left: 15px;
        @include nFont(12 #909399 35);
      }
    }
  }
  .el-card {
    color: #000;
  }
  .barchart-box {
    margin-top: 20px;
    position: relative;
    flex-grow: 1;
    .barChart, .userChart {
      width: 100%;
      height: 100%;
    }
    .barChart-total {
      position: absolute;
      z-index: 55;
      right: 10px;
      top: -2px;
      @include nFont(20 #000 700);
      span {
        margin-left: 14px;
        @include nFont(12 #909399 35 400);
      }
      @media screen and (max-width: 1334px) {
        font-size: 14px;
        top: -5px;
      }
    }
  }
  .rank-card, .benefit-card {
    .el-card__body {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
  .chart-header {
    font-weight: 700;
    margin: 0.8vw 0;
    @media screen and (max-width: 1334px) {
      font-size: 12px;
    }
  }
  .rankChart {
    width: 100%;
    height: calc(100% - 10px);
  }
  .benefit-card {
    .el-card__body {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
  .benefit {
    width: 100%;
    flex-grow: 1;
    border-bottom: 1px solid #636363;
    &-bg {
      bottom: 0;
      left: 0;
      width: 100%;
    }
    &-item {
      height: 100%;
      flex-grow: 1;
      .benefit-left {
        width: 54px;
      }
      .benefit-right {
        width: 36px;
      }
      .des {
        color: #909399;
        font-size: 16px;
        @media screen and (max-width: 1334px) {
          font-size: 12px;
          width: 140px;
        }
      }
      .val {
        margin-top: 5px;
        @include nFont(18 #000 700);
        @media screen and (max-width: 1334px) {
          font-size: 12px;
        }
        span {
          font-size: 12px;
          font-weight: 400;
        }
      }
    }
  }
}
</style>
