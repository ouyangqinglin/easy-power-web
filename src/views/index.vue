<template>
  <common-flex direction="column" class="pages-index app-container">
    <div>
      <el-row :gutter="16">
        <el-col :xl="leftXl" :md="leftMd">
          <el-card>
            <common-flex style="height: 100%" direction="column">
              <div class="content-title">Production Overview</div>
              <common-flex class="pages-index-overview" align="center" direction="column">
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
              <common-flex class="pages-index-overview" direction="column" align="center">
                <common-flex justify="center" class="pages-index-overview-img">
                  <img :src="require('@img/home/site.svg')" alt="">
                </common-flex>
                <common-flex justify="center" align="center" style="height: 100%" class="pages-index-overview-info">
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
              <common-flex class="pages-index-overview" align="center" direction="column">
                <common-flex justify="center" align="center" class="pages-index-overview-img">
                  <img :src="require('@img/home/custom.svg')" alt="">
                </common-flex>
                <common-flex v-if="homeData.agent" direction="column" justify="center" class="pages-index-overview-info">
                  <div class="name-des">
                    <div class="num">{{ homeData.consumerNum || '--' }}</div><span></span>
                    <br>Total Customers
                  </div>
                </common-flex>
                <common-flex v-else justify="space-around" align="center" style="height: 100%" class="pages-index-overview-info">
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
          <el-card class="rank-card">
            <div class="chart-header">Today's Site Ranking  (Top 3)</div>
            <div class="rankChart" v-if="rankData.length" id="rankChart"></div>
            <common-flex justify="center" align="center" class="rankChart" v-else>
              <no-data />
            </common-flex>
          </el-card>
        </el-col>
        <el-col :xl="11" :md="9" :sm="8">
          <el-card class="benefit-card">
            <div class="chart-header">Environmental Benefits</div>
            <common-flex justify="center" align="center" class="benefit">
              <common-flex justify="center" class="posr">
                <img class="benefit-bg posa" :src="require('@img/home/benefit-bg.svg')" alt="">

                <common-flex direction="column" justify="center" class="benefit-item" style="padding-right: 25px">
                  <common-flex style="height: 100%" direction="column" align="center">
                    <common-flex direction="column" align="center">
                      <div class="des ellipsis" title="CO₂ Emission Saved">CO₂ Emission Saved</div>
                      <div class="val" style="margin-bottom: 4px">{{ homeData.emissionSaved || '-- ' }}<span> kg</span></div>
                    </common-flex>
                    <img class="benefit-left" :src="require('@img/home/benefit-left.svg')" alt="">
                  </common-flex>
                </common-flex>

                <div style="width: 1px; height: 16px; background-color: #909399"></div>

                <common-flex direction="column" class="benefit-item" style="padding-left: 25px">
                  <common-flex style="height: 100%" direction="column" align="center">
                    <common-flex direction="column" align="center">
                      <div class="des ellipsis" title="Equivalent Trees Planted">Equivalent Trees Planted</div>
                      <div class="val" style="margin-top: 10px">{{ homeData.trees || '--' }}</div>
                    </common-flex>
                    <img class="benefit-right" :src="require('@img/home/benefit-right.svg')" alt="">
                  </common-flex>
                </common-flex>
              </common-flex>

            </common-flex>
          </el-card>
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
export default {
  name: "Index",
  data() {
    return {
      timer: null,
      rankBar: null,
      homeData: {},
      rankData: [],
      params: {
        dataType: 1, // {Number} 数据统计分组方式 1-按小时分组 2-按日分组 3-按月分组 4-按照每15分钟分组
        startTime: '', // {String} 示例值：2022-7-19
        endTime: '', // {String} 示例值：2022-7-19
        scope: 3, // {Number} 说明：1-只要production 2-只要consumption 3-全都要
      }
    }
  },
  computed: {
    leftXl() {
      return +(this.$store.state.user.userType) === 1 ? 17 : 10
    },
    leftMd() {
      return +(this.$store.state.user.userType) === 1 ? 18 : 12
    },
  },
  mounted() {
    this.changeChartSize()
    this.params.endTime = this.params.startTime = this.DATE_FORMAT('yyyy-M-d', new Date())
    this.getHomeData()
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
        rankOption.yAxis.axisLabel.textStyle.fontSize = rankOption.xAxis.axisLabel.textStyle.fontSize = 10
        rankOption.series[0].barWidth = 12
        rankOption.series[0].itemStyle.normal.label.textStyle.fontSize = 10
        rankOption.tooltip.textStyle.fontSize = 10
        rankOption.yAxis.axisLabel.formatter = function(value) {
          let label = ''
          if (value.length > 8) label = value.slice(0, 8) + '\n' + value.slice(8)
          else label = value
          return label
        }
      } else {
        rankOption.series[0].barWidth = 20
        rankOption.grid.bottom = '25%'
        rankOption.series[0].itemStyle.normal.label.textStyle.fontSize = 14
        rankOption.tooltip.textStyle.fontSize = 14
        rankOption.yAxis.axisLabel.textStyle.fontSize = rankOption.xAxis.axisLabel.textStyle.fontSize = 14
        rankOption.yAxis.axisLabel.formatter = function(value) {
          let label = ''
          if (value.length > 12) label = value.slice(0, 12) + '\n' + value.slice(12)
          else label = value
          return label
        }
      }
    },
    getRankData() {
      rankOption.yAxis.data = []
      rankOption.series[0].data = []
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
            this.rankBar.setOption(rankOption)
          })
        }
      })
    },
    getHomeData() {
      homeInfo().then((res) => {
        this.homeData = res.data
      })
    },
    changeSize() {
      this.changeChartSize()
      clearInterval(this.timer)
      this.timer = setTimeout(() => {
        if (this.rankBar) this.rankBar.resize()
      }, 500)
    },
  }
};
</script>

<style lang="scss">
.pages-index {
  position: absolute;
  width: 100%;
  height: 100%;
  .el-row, .el-col, .el-card, .el-card__body {
    height: 100%;
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
    margin-top: 4px;
    flex-grow: 1;
    width: 100%;
    &-img {
      img {
        @include wh(100);
        @media screen and (max-width: 1334px) {
          @include wh(75)
        }
      }
    }
    &-info {
      width: 100%;
      .name-des {
        font-size: 14px;
        color: #000;
        @media screen and (max-width: 1334px) {
          font-size: 10px;
        }
      }
      .num {
        display: inline-block;
        @include nFont(24 #000 700 38);
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
    height: calc(100% - 50px);
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
      left: 50%;
      transform: translateX(-50%);
      width: 140%;
    }
    &-item {
      height: 100%;
      flex-grow: 1;
      .benefit-left {
        margin-top: 66px;
        width: 54px;
      }
      .benefit-right {
        margin-top: 70px;
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
        @include nFont(20 #000 700);
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
