<template>
  <div class="comp-overview">
    <el-card class="comp-overview-card">
      <p>Production Overview</p>
      <el-row>
        <el-col :span="6">
          <common-flex class="comp-overview-card-total" direction="column" align="center">
            <div v-if="+base.dayProduce < 1000"><span class="num">{{ (+base.dayProduce).toFixed(2) }}</span><span class="unit">（Wh）</span></div>
            <div v-else-if="+base.dayProduce > 1000 && +base.dayProduce < 1000000"><span class="num">{{ (base.dayProduce / 1000).toFixed(2) }}</span><span class="unit">（kWh）</span></div>
            <div v-else><span class="num">{{ (+base.dayProduce / 1000000).toFixed(2) }}</span><span class="unit">（MWh）</span></div>
            <div>Today</div>
          </common-flex>
        </el-col>
        <el-col :span="6">
          <common-flex class="comp-overview-card-total" direction="column" align="center">
            <div v-if="+base.monthProduce < 1000"><span class="num">{{ (base.monthProduce).toFixed(2) }}</span><span class="unit">（Wh）</span></div>
            <div v-else-if="+base.monthProduce > 1000 && +base.monthProduce < 1000000"><span class="num">{{ (base.monthProduce / 1000).toFixed(2) }}</span><span class="unit">（kWh）</span></div>
            <div v-else><span class="num">{{ (+base.monthProduce / 1000000).toFixed(2) }}</span><span class="unit">（MWh）</span></div>
            <div>This Month</div>
          </common-flex>
        </el-col>
        <el-col :span="6">
          <common-flex class="comp-overview-card-total" direction="column" align="center">
            <div v-if="+base.yearProduct < 1000">
              <span class="num">{{ (+base.yearProduct).toFixed(2) }}</span><span class="unit">（Wh）</span>
            </div>
            <div v-else-if="+base.yearProduct > 1000 && +base.yearProduct < 1000000">
              <span class="num">{{ (base.yearProduct / 1000).toFixed(2) }}</span><span class="unit">（kWh）</span>
            </div>
            <div v-else><span class="num">{{ (+base.yearProduct / 1000000).toFixed(2) }}</span><span class="unit">（MWh）</span></div>
            <div>This Year</div>
          </common-flex>
        </el-col>
        <el-col :span="6">
          <common-flex class="comp-overview-card-total" direction="column" align="center">
            <div v-if="+base.allProduce < 1000">
              <span class="num" >{{ (+base.allProduce).toFixed(2) }}</span><span class="unit">（Wh）</span>
            </div>
            <div v-else-if="+base.allProduce > 1000 && +base.allProduce < 1000000">
              <span class="num" >{{ (+base.allProduce / 1000).toFixed(2) }}</span><span class="unit">（kWh）</span>
            </div>
            <div v-else><span class="num">{{ (+base.allProduce / 1000000).toFixed(2) }}</span><span class="unit">（MWh）</span></div>
            <div>Lifetime</div>
          </common-flex>
        </el-col>
      </el-row>
    </el-card>
    <el-row class="comp-overview-row" :gutter="24">
      <el-col class="comp-overview-row-col" :xl="10" :md="11">
        <el-card class="comp-overview-row-col-card">
          <common-flex class="comp-overview-row-col-card-title" justify="space-between">
            <div>Real-time power</div>
            <el-tag style="background-color: #F8696A; border-color: #F8696A" v-if="!online" effect="dark">Off line</el-tag>
          </common-flex>
          <common-flex class="circle-container posr" justify="center">
            <common-flex justify="center" align="center" class="posa offline" v-if="!online">
              <div class="posa">Off line</div>
            </common-flex>
<!--            <common-flex justify="center" align="center" class="circle-container-box posr" :style="{height: +base.pvExist ? '90%' : '80%'}">-->
            <common-flex justify="center" align="center" class="circle-container-box posr" :style="{height: '90%'}">
<!--              pv 线-->
              <div class="posa" :class="{middleTopBottom: +base.solarPower > 0 }"></div>
<!--              <div class="posa" :class="{middleTopBottom: +base.solarPower > 0 }" v-if="+base.pvExist"></div>-->
<!--              Battery 线-->
              <div class="posa" v-if="+base.storeConnectStatus === 1" :class="{middleLeftRightArrow: +base.storeStatus === 2, middleRightLeftArrow: +base.storeStatus === 3}"></div>
<!--              grid 线-->
              <div class="posa" :class="{gridExport: +base.gridStatus === 2, gridImport: +base.gridStatus === 1}"></div>
<!--              Load 线-->
              <div class="posa" :class="{middleBottomLeft: +base.devicePower > 0}"></div>
<!--              Charger 线-->
<!--              <div class="posa" :class="{middleBottomRight: base.pilePower}"></div>-->
              <div class="posr" style="z-index: 2">
                <img class="middle-bg" :src="require('./img/inverter.svg')" alt="">
                <div class="middle-text posa">Inverter</div>
              </div>
              <common-flex direction="column" justify="center" align="center" class="circle top posa">
<!--              <common-flex direction="column" justify="center" align="center" class="circle top posa" v-if="+base.pvExist">-->
                <img :src="require('./img/pv.svg')" alt="">
                <div v-if="+base.solarPower < 1000">{{ base.solarPower }}<br><span>kW</span></div>
                <div v-else>{{ (+base.solarPower / 1000).toFixed(2) }}<br><span>MW</span></div>
              </common-flex>
              <common-flex direction="column" justify="center" align="center" class="circle left posa">
                <div class="posa soc">{{ base.soc || 0 }}%<br><span style="color: #666">SOC</span></div>
                <img :src="require('./img/battery.svg')" alt="">
                <template v-if="+base.storeConnectStatus === 1">
                  <div v-if="+base.storePower < 1000">{{ base.storePower }}<br><span>kW</span></div>
                  <div v-else>{{ (+base.storePower / 1000).toFixed(2) }}<br><span>MW</span></div>
                </template>
                <div v-else>0<br><span>kW</span></div>
              </common-flex>
              <common-flex direction="column" justify="center" align="center" class="circle right posa">
                <img :src="require('./img/grid.svg')" alt="">
                <div v-if="+base.electricPower < 1000">{{ base.electricPower }}<br><span>kW</span></div>
                <div v-else>{{ (+base.electricPower / 1000).toFixed(2) }}<br><span>MW</span></div>
              </common-flex>
              <common-flex direction="column" justify="center" align="center" class="circle bottom-left posa">
                <img :src="require('./img/load.svg')" alt="">
                <div v-if="+base.devicePower < 1000">{{ base.devicePower }}<br><span>kW</span></div>
                <div v-else>{{ (+base.devicePower / 1000).toFixed(2) }}<br><span>MW</span></div>
              </common-flex>
              <common-flex v-if="+base.pileNum" direction="column" justify="center" align="center" class="circle bottom-right posa">
                <div v-if="base.pilePower" class="bottom-right-dot posa"></div>
                <img :src="require('./img/pile.svg')" alt="">
                <div v-if="+base.pilePower < 1000">{{ base.pilePower }}<br><span>kW</span></div>
                <div v-else>{{ (+base.pilePower / 1000).toFixed(2) }}<br><span>MW</span></div>
              </common-flex>
            </common-flex>
          </common-flex>
        </el-card>
      </el-col>
      <el-col class="comp-overview-row-col" :xl="6" :md="5">
        <el-card class="comp-overview-row-col-card">
          <common-flex direction="column" style="height: 100%">
            <common-flex class="comp-overview-row-col-card-title" justify="space-between">
              <div>Environmental Benefits</div>
            </common-flex>
            <common-flex class="comp-overview-row-col-card-content" direction="column" justify="space-around">
              <common-flex direction="column" align="center">
                <div class="num">{{ base.emissionSaved }} <span class="unit">kg</span></div>
                <img :src="require('./img/house.svg')" alt="">
                <div class="des">CO2 Emission Saved</div>
              </common-flex>
              <common-flex direction="column" align="center">
                <div class="num">{{ base.trees }}</div>
                <img :src="require('./img/tree.svg')" alt="">
                <div class="des">Equivalent Trees Planted</div>
              </common-flex>
            </common-flex>
          </common-flex>
        </el-card>
      </el-col>
      <el-col class="comp-overview-row-col" :xl="8" :md="8">
        <el-card class="comp-overview-row-col-card">
          <common-flex direction="column" style="height: 100%">
            <common-flex class="comp-overview-row-col-card-title" justify="space-between">
              <div>Local Weather</div>
            </common-flex>
            <common-flex class="comp-overview-row-col-card-content" direction="column" justify="space-around">
              <common-flex justify="space-around">
                <img class="cur-wea-img" :src="weatherImg[weatherCodeEnum[weatherData.weatherId]]" alt="">
                <div style="margin-right: 4.5vw">
                  <div class="comp-overview-row-col-card-content-temperature">{{ weatherData.currentWeather }}<br>
                    {{ weatherData.currentTemp }}°C<br>
                    Feels like {{ weatherData.feelsLike }}°C<br>
                  </div>
                  <span class="comp-overview-row-col-card-content-weather">Wind SE,{{ weatherData.windSpeed }}km/h<br>
                    Humidity {{ weatherData.humidity }}%<br>
                    Sunrise at
                    <span v-if="weatherData.sunrise">{{ sunriseUTC }}</span>
                    <span v-else>--</span>
                    <br>
                    Sunset at
                    <span v-if="weatherData.sunset">{{ sunsetUTC }}</span>
                    <span v-else>--</span>
                    <br>
                  </span>
                </div>
              </common-flex>
              <common-flex justify="space-around">
                <common-flex direction="column" align="center" v-for="i of weatherData.futureWeathers" :key="i.dayOfWeek">
                  <div class="comp-overview-row-col-card-content-day">{{ i.dayOfWeek }}</div>
                  <img class="comp-overview-row-col-card-content-weather-img" :src="weatherImg[weatherCodeEnum[i.futureWeatherId]]" alt="">
                  <div class="comp-overview-row-col-card-content-random">{{ i.minTemp }}-{{i.maxTemp }}°C</div>
                  <div class="comp-overview-row-col-card-content-cloud">{{ i.weather }}</div>
                </common-flex>
              </common-flex>
            </common-flex>
          </common-flex>
        </el-card>
      </el-col>
    </el-row>
    <div class="comp-overview-chart">
      <el-card>
        <common-flex style="height: 100%" direction="column" justify="space-between">
          <common-flex direction="column" class="comp-overview-chart-production posr">
            <common-flex style="width: 100%" align="center">
              <div style="flex-shrink: 0"><p>Production</p></div>
              <common-flex justify="flex-end" style="flex-grow: 1">
                <el-radio-group v-model="dateType" style="margin-right: 5px" size="small">
                  <el-radio-button label="date">Day</el-radio-button>
                  <el-radio-button label="week">Week</el-radio-button>
                  <el-radio-button label="month">Month</el-radio-button>
                  <el-radio-button label="year">Year</el-radio-button>
                </el-radio-group>
                <el-date-picker
                  :key="timeType"
                  size="small"
                  ref="dataEnd"
                  @change="sureDate"
                  v-model="dateVal"
                  :type="timeType"
                  range-separator="->"
                  :format="displayFormat"
                  :picker-options="closePicker"
                  :value-format="dateFormat"
                  start-placeholder="start time"
                  end-placeholder="end time">
                </el-date-picker>
              </common-flex>
            </common-flex>
            <div id="barProduction" class="barChart"></div>
            <common-flex class="barChart-total" align="center">
              <el-tooltip effect="dark" placement="top">
                <span slot="content">
                  Total system production, including solar<br>production and battery discharge
                </span>
                <img class="question" :src="require('@img/question.svg')" alt="">
              </el-tooltip>
              <div v-if="+totalPvGenerateEnergy < 1000">{{ totalPvGenerateEnergy }}<span>Wh</span></div>
              <div v-else-if="+totalPvGenerateEnergy > 1000 && +totalPvGenerateEnergy < 1000000">{{ (+totalPvGenerateEnergy / 1000).toFixed(2) }}<span>kWh</span></div>
              <div v-else>{{ +(totalPvGenerateEnergy / 1000000).toFixed(2) }}<span>MWh</span></div>
            </common-flex>
          </common-flex>
          <common-flex direction="column" class="comp-overview-chart-consumption posr">
            <div style="flex-shrink: 0"><p>Consumption</p></div>
            <div id="barConsumption" class="barChart"></div>
            <div class="barChart-total" v-if="+consumpeTotal < 1000">{{ consumpeTotal }}<span>Wh</span></div>
            <div class="barChart-total" v-else-if="+consumpeTotal > 1000 && +consumpeTotal < 1000000">{{ (+consumpeTotal / 1000).toFixed(2) }}<span>kWh</span></div>
            <div class="barChart-total" v-else>{{ +(consumpeTotal / 1000000).toFixed(2) }}<span>MWh</span></div>
          </common-flex>
        </common-flex>
      </el-card>
    </div>
  </div>
</template>

<script>
import {getWeather, homeChart, getNet} from "@/api/index"
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

const emphasisStyle = {
  itemStyle: {
    shadowBlur: 10,
    shadowColor: 'rgba(0,0,0,0.3)'
  }
}
let xAxisData = [];
let data1 = [];
let data2 = [];

let xAxisDataConsu = []
let data3 = [], data4 = []
const weatherCodeEnum = {
  "200": "thunderstorm", //雷雨
  "201": "thunderstorm",
  "202": "thunderstorm",
  "210": "thunderstorm",
  "211": "thunderstorm",
  "212": "thunderstorm",
  '221': "thunderstorm",
  '230': "thunderstorm",
  "231": "thunderstorm",
  "232": "thunderstorm",
  "300": "drizzle", //小雨
  "301": "drizzle",
  "302": "drizzle",
  '310': "drizzle",
  "311": "drizzle",
  '312': "drizzle",
  "313": "drizzle",
  "314": "drizzle",
  "321": "drizzle",
  "500": "drizzle",
  "501": "heavyRain",
  "502": "heavyRain", //大雨
  "503": "heavyRain",
  "504": "heavyRain",
  "511": "heavyRain",
  "520": "heavyRain",
  "521": "heavyRain",
  "522": "heavyRain",
  "531": "heavyRain",
  "600": "lightSonw", //小雪
  "601": "lightSonw",
  "602": "heavySnow", //大雪
  "611": "heavySnow",
  "612": "heavySnow",
  '613': "heavySnow",
  "615": "heavySnow",
  "616": "heavySnow",
  "620": "heavySnow",
  "621": "heavySnow",
  '622': "heavySnow",
  "701": "fog", // 雾
  "711": "fog",
  "721": "fog",
  "731": "fog",
  "741": "fog",
  "751": "fog",
  "761": "fog",
  "762": "fog",
  "771": "fog",
  "781": "fog",
  "800": "sunny", // 晴朗
  "801": "clounds", // 多云
  "802": "clounds",
  "803": "clounds",
  "804": "overcast", // 阴天
};
export default {
  name: "comp-overview",
  props: {
    base: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    const dateVal = new Date(this.UTC_START_OF(this.base.timeZone))
    const that = this
    return {
      weatherCodeEnum,
      closePicker: {
        onPick(a) {
          that.$refs.dataEnd.handleClose()
          setTimeout(() => {
            that.params.startTime = that.DATE_FORMAT('yyyy-MM-dd', a.minDate)
            that.dateVal = []
            that.dateVal.push(that.params.startTime)
            that.sureDate(that.dateVal)
          }, 200)
        },
      },
      weatherImgDay: {
        "sunny": require("./img/weather_day_sunny.png"),
        //多云
        "clounds": require("./img/weather_day_cloud.png"),
        //阴天
        "overcast": require("./img/weather_day_overcast.png"),
        // 小雨
        "drizzle": require("./img/weather_day_lightrain.png"),
        // 大雨
        "heavyRain": require("./img/weather_day_heavyrain.png"),
        //雷雨
        "thunderstorm": require("./img/weather_day_thunderstorm.png"),
        // 小雪
        "lightSonw": require("./img/weather_day_lightsnow.png"),
        // 大雪
        "heavySnow": require("./img/weather_day_heavysnow.png"),
        // 冰雹
        "hail": require("./img/weather_day_hail.png"),
        // 雾
        "fog": require("./img/weather_day_fog.png")
      },
      weatherImgNight: {
        // 晴天
        "sunny": require("./img/weather_night_sunny.png"),
        //多云
        "clounds": require("./img/weather_night_cloud.png"),
        //阴天  assets/png/weather_night_overcast.png
        "overcast": require("./img/weather_night_overcast.png"),
        // 小雨
        "drizzle": require("./img/weather_night_lightrain.png"),
        // 大雨
        "heavyRain": require("./img/weather_night_heavyrain.png"),
        //雷雨
        "thunderstorm": require("./img/weather_night_thunderstorm.png"),
        // 小雪
        "lightSonw": require("./img/weather_night_lightsnow.png"),
        // 大雪
        "heavySnow": require("./img/weather_night_heavysnow.png"),
        // 冰雹
        "hail": require("./img/weather_night_hail.png"),
        // 雾
        "fog": require("./img/weather_night_fog.png")
      },
      weatherData: {},
      flag: false,
      dateType: 'date',
      dateVal: dateVal,
      dateFormat: 'yyyy-M-d',
      displayFormat: 'MM-dd-yyyy',
      params: {
        dataType: 1, // {Number} 数据统计分组方式 1-按小时分组 2-按日分组 3-按月分组 4-按照每15分钟分组
        startTime: '', // {String} 示例值：2022-7-19
        endTime: '', // {String} 示例值：2022-7-19
        siteCode: ''
      },
      totalPvGenerateEnergy: '',
      consumpeTotal: '',
      option: {
        color: ['#3daabf', '#8bea91'],
        legend: {
          data: ['Export', 'Used'],
          right: '13%',
        },
        xAxis: {
          data: [],
          splitLine: { show: false },
          splitArea: { show: false },
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
          }
        },
        grid: {
          left: '5%',
          right: 5,
          bottom: '10%'
        },
        series: [
          {
            name: 'Export',
            type: 'bar',
            stack: 'production',
            emphasis: emphasisStyle,
            data: [],
            barWidth: 12
          },
          {
            name: 'Used',
            type: 'bar',
            stack: 'production',
            emphasis: emphasisStyle,
            data: [],
            barWidth: 12
          },
        ]
      },
      optionTwo: {
        color: ['#8BC4EA', '#638AE3'],
        legend: {
          data: ['Self Consumption', 'Import'],
          right: '12%',
        },
        axisPointer: {
          type: 'shadow'
        },
        xAxis: {
          data: [],
          splitLine: { show: false },
          splitArea: { show: false },
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
        },
        grid: {
          left: '5%',
          right: 5,
          bottom: '10%'
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
          }
        },
        series: [
          {
            name: 'Self Consumption',
            type: 'bar',
            stack: 'two',
            emphasis: emphasisStyle,
            data: [],
            barWidth: 12
          },
          {
            name: 'Import',
            type: 'bar',
            stack: 'two',
            emphasis: emphasisStyle,
            data: [],
            barWidth: 12
          },
        ]
      },
      barProduction: null,
      barConsumption: null,
      timer: null,
      online: 1,
    }
  },
  watch: {
    base(v) {
      this.params.siteCode = this.$route.query?.siteCode
      let params = {
        latitude: v.latitude,
        longitude: v.longitude
      }
      this.getWeatherData(params)
      this.getOnline()
      if (this.dateType === 'date') {
        this.dateVal = new Date(this.UTC_START_OF(this.base.timeZone))
        this.params.startTime = this.params.endTime = this.DATE_FORMAT('yyyy-MM-dd', this.dateVal)
        this.$nextTick(() => {
          this.getDataOption()
        })
      } else this.dateType = 'date'
    },
    dateType(v) {
      if (v === 'date' || v === 'week') {
        this.dateVal = new Date(this.UTC_START_OF(this.base.timeZone))
        if (v === 'date') {
          this.params.startTime = this.params.endTime = this.DATE_FORMAT('yyyy-MM-dd', new Date(this.dateVal))
        } else {
          const startStampTime = (new Date(this.dateVal)).getTime() - 6 * 24 * 60 * 60 * 1000
          this.params.endTime = this.DATE_FORMAT('yyyy-MM-dd', new Date(this.dateVal))
          this.params.startTime = this.DATE_FORMAT('yyyy-MM-dd', startStampTime)
          let v1, v2
          v1 = this.DATE_FORMAT('MM-dd-yyyy', this.params.startTime)
          v2 = this.DATE_FORMAT('MM-dd-yyyy', this.params.endTime)
          this.dateVal = [v1, v2]
        }
        this.dateFormat = 'MM-dd-yyyy'
        this.displayFormat = 'MM-dd-yyyy'
      } else if (v === 'month') {
        this.dateVal = new Date(this.UTC_START_OF(this.base.timeZone))
        const firstDate = this.DATE_FORMAT('yyyy-MM', this.dateVal) + '-01'
        this.params.startTime = firstDate
        this.params.endTime = this.DATE_FORMAT('yyyy-MM-dd', this.dateVal)
        this.dateFormat = 'yyyy-MM'
        this.displayFormat = 'MM-yyyy'
      } else if (v === 'year') {
        this.dateVal = new Date(this.UTC_START_OF(this.base.timeZone))
        const year = this.DATE_FORMAT('yyyy', this.dateVal)
        this.params.startTime = `${year}-01-01`
        this.params.endTime = this.DATE_FORMAT('yyyy-MM-dd', new Date(this.dateVal))
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
  computed: {
    weatherImg() {
      return +this.weatherData.dayType === 1 ? this.weatherImgDay : this.weatherImgNight
    },
    timeType() {
      const arr = {
        'date': 'date',
        'week': 'daterange',
        'month': 'month',
        'year': 'year'
      }
      return arr[this.dateType]
    },
    sunriseUTC() {
      if (this.base.timeZone) return (this.UTC_DATE_FORMAT(+this.weatherData.sunrise, this.base.timeZone)).slice(-5)
      else return '--'
    },
    sunsetUTC() {
      if (this.base.timeZone) return (this.UTC_DATE_FORMAT(+this.weatherData.sunset, this.base.timeZone)).slice(-5)
      else return '--'
    }
  },
  mounted() {
    window.addEventListener('resize', this.changeSize)
  },
  beforeDestroy() {
    clearInterval(this.timer)
    window.removeEventListener('resize', this.changeSize)
  },
  methods: {
    getOnline() {
      let p = {
        deviceType: 4,
        siteCode: this.params.siteCode
      }
      getNet(p).then(res => {
        this.online = +res.net
      })
    },
    getWeatherData(params) {
      getWeather(params).then(res => {
        this.weatherData = res.data
      })
    },
    getDataOption() {
      this.barProduction = echarts.init(document.getElementById('barProduction'))
      this.barConsumption = echarts.init(document.getElementById('barConsumption'))
      this.getChartData()
      this.getConsumptionData()
    },
    changeSize() {
      clearInterval(this.timer)
      this.timer = setTimeout(() => {
        if (this.barProduction) this.barProduction.resize()
        if (this.barConsumption) this.barConsumption.resize()
      }, 500)
    },
    sureDate(v) {
      if (v) {
        if (this.dateType === 'date') this.params.startTime = this.params.endTime = this.DATE_FORMAT('yyyy-MM-dd', v)
        else if (this.dateType === 'week') {
          const endStampTime = (new Date(v[0])).getTime() +  6 * 24 * 60 * 60 * 1000
          this.params.endTime = this.DATE_FORMAT('yyyy-MM-dd', endStampTime)
          let v1, v2
          v1 = this.DATE_FORMAT('MM-dd-yyyy', this.params.startTime)
          v2 = this.DATE_FORMAT('MM-dd-yyyy', this.params.endTime)
          this.dateVal = [v1, v2]
        } else if (this.dateType === 'month') {
          const maxMonth = [1, 3, 5, 7, 8, 10, 12]
          const month = this.DATE_FORMAT('MM', new Date(this.dateVal))
          const startTime = `${v}-01`
          let endStampTime
          if (maxMonth.includes(+month)) {
            endStampTime = (new Date(startTime)).getTime() +  30 * 24 * 60 * 60 * 1000
          } else if (+month === 2) endStampTime = (new Date(startTime)).getTime() + 27 * 24 * 60 * 60 * 1000
          else endStampTime = (new Date(startTime)).getTime() + 29 * 24 * 60 * 60 * 1000
          this.params.startTime = startTime
          this.params.endTime = this.DATE_FORMAT('yyyy-MM-dd', endStampTime)
        } else {
          this.params.startTime = `${v}-01-01`
          let curYear = this.DATE_FORMAT('yyyy', new Date())
          if (+v !== +curYear) this.params.endTime = `${v}-12-31`
          else this.params.endTime = this.DATE_FORMAT('yyyy-MM-dd', new Date())
        }
      }
      setTimeout(() => {
        if (this.dateType === 'week') {
          this.option.series.forEach(i => i.barWidth = 16)
          this.optionTwo.series.forEach(i => i.barWidth = 16)
        } else {
          this.option.series.forEach(i => i.barWidth = 12)
          this.optionTwo.series.forEach(i => i.barWidth = 12)
        }
        this.getChartData()
        this.getConsumptionData()
      })
    },
    getChartData() {
      this.$set(this.params, 'scope', 1)
      const data = {
        startTime: (this.ISD_TIMESTAMP(`${this.params.startTime} 00:00:00`, this.base.timeZone)) / 1000,
        endTime: (this.ISD_TIMESTAMP(`${this.params.endTime} 23:59:59`, this.base.timeZone)) / 1000,
        dataType: this.params.dataType,
        scope: this.params.scope,
        siteCode: this.params.siteCode
      }
      homeChart(data).then(res => {
        const lineData = res.data.list
        this.totalPvGenerateEnergy = (lineData.reduce((sum, i) => {
          return sum + i.systemProduction
        }, 0)).toFixed(2)

        const netDischargeEnergyTotal = (lineData.reduce((sum, i) => {
          return sum + i.export / 1000
        }, 0)).toFixed(2)

        if (this.totalPvGenerateEnergy && this.totalPvGenerateEnergy !== '0.00') {
          const exportPercent = ((netDischargeEnergyTotal / (+this.totalPvGenerateEnergy / 1000)) * 100).toFixed(0)

          const userPercent = 100 - exportPercent

          this.option.legend.formatter = (name) => {
            return name === 'Used' ? `${name}（${userPercent}%）` : `${name}（${exportPercent}%）`
          }
        } else {
          this.option.legend.formatter = (name) => {
            return `${name}（--）`
          }
        }
        this.option.xAxis.data = xAxisData = []
        data1 = []
        data2 = []
        for (let i = 0; i < lineData.length; i++) {
          xAxisData.push(lineData[i].time)
          data1.push(lineData[i].export / 1000)
          data2.push(lineData[i].used / 1000)
        }
        this.initOption()
      })
    },
    getConsumptionData() {
      this.$set(this.params, 'scope', 2)
      const data = {
        startTime: (this.ISD_TIMESTAMP(`${this.params.startTime} 00:00:00`, this.base.timeZone)) / 1000,
        endTime: (this.ISD_TIMESTAMP(`${this.params.endTime} 23:59:59`, this.base.timeZone)) / 1000,
        dataType: this.params.dataType,
        scope: this.params.scope,
        siteCode: this.params.siteCode
      }
      homeChart(data).then(res => {
        const lineData = res.data.list

        const firstToatl = (lineData.reduce((sum, i) => {
          return sum + i.selfConsumption
        }, 0)).toFixed(2)

        const secondTotal = (lineData.reduce((sum, i) => {
          return sum + i.netBuyEnergy
        }, 0)).toFixed(2)

        const totalPvGenerateEnergy = (lineData.reduce((sum, i) => {
          return sum + i.consumption
        }, 0)).toFixed(2)

        this.consumpeTotal = totalPvGenerateEnergy
        if (totalPvGenerateEnergy && totalPvGenerateEnergy !== '0.00') {
          const firstToatlPercent = ((firstToatl / totalPvGenerateEnergy) * 100).toFixed(0)
          const secondTotalPercent = ((secondTotal / totalPvGenerateEnergy) * 100).toFixed(0)
          this.optionTwo.legend.formatter = (name) => {
            return name === 'Self Consumption' ? `${name}（${firstToatlPercent}%）` : `${name}（${secondTotalPercent}%）`
          }
        } else {
          this.optionTwo.legend.formatter = (name) => {
            return `${name}（--）`
          }
        }
        this.optionTwo.xAxis.data = xAxisDataConsu = []
        data3 = []
        data4 = []
        lineData.forEach((i) => {
          xAxisDataConsu.push(i.time)
          data3.push(i.selfConsumption / 1000)
          data4.push(i.netBuyEnergy / 1000)
        })
        this.initConsuOption()
      })
    },
    initConsuOption() {
      // Import - netBuyEnergy Battery-storeDischargeEnergy Solar-pvUsedEnergy
      this.optionTwo.series[0].data = data3
      this.optionTwo.series[1].data = data4
      this.optionTwo.xAxis.data = xAxisDataConsu
      this.optionTwo.tooltip = {
        show: true,
        trigger: 'axis',
        axisPointer: {
          label: {
            show: true,
          },
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(170, 178, 188, .16)'
          }
        },
        formatter(v) {
          let v0, v1, t1, t2, total, res, unit1, unit2, unit3
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
          total = (+total).toFixed(2)
          return `${v[0].name}<br>${res}<span style="margin-right: 14px"></span>Total：${total}${unit3}`
        },
        backgroundColor: '#fff',
        extraCssText: 'box-shadow: 0px 3px 6px 1px rgba(0,0,0,0.16);',
        textStyle: {
          color: '#000'
        }
      }
      this.barConsumption.setOption(this.optionTwo)
    },
    initOption() {
      this.option.series[0].data = data1
      this.option.series[1].data = data2
      this.option.xAxis.data = xAxisData
      this.option.tooltip = {
        show: true,
        trigger: 'axis',
        axisPointer: {
          label: {
            show: true,
          },
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(170, 178, 188, .16)'
          }
        },
        formatter(v) {
          let v0, v1, t1, t2, total, res, unit1, unit2, unit3
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
          total = (+total).toFixed(2)
          return `${v[0].name}<br>${res}<span style="margin-right: 14px"></span>Total：${total}${unit3}`
        },
        backgroundColor: '#fff',
        extraCssText: 'box-shadow: 0px 3px 6px 1px rgba(0,0,0,0.16);',
        textStyle: {
          color: '#000'
        }
      }
      this.barProduction.setOption(this.option)
    },
  }
}
</script>

<style lang="scss">
.comp-overview {
  p {
    font-weight: 700;
  }
  .el-date-editor.el-input {
    min-width: 350px;
  }
  &-card {
    margin-bottom: 24px;
    padding-bottom: 20px;
    p {
      font-weight: 700;
    }
    &-total{
      div {
        line-height: 35px;
        font-size: 14px;
      }
      .num {
        @include nFont(24 700);
        @media screen and (max-width: 1334px) {
          font-size: 18px;
        }
      }
      .unit {
        color: #909399;
        font-size: 12px;
      }
    }
  }
  &-row {
    height: 50vh;
   &-col {
     height: 100%;
     &-card {
       height: 100%;
       .el-card__body {
         height: 100%;
       }
       &-title {
         :first-child {
           color: #000000;
           font-weight: 700;
           @media screen and (max-width: 1334px) {
             font-size: 14px;
           }
         }
         :nth-child(2) {
           @media screen and (max-width: 1334px) {
             font-size: 14px;
           }
         }
       }
       &-content {
         flex-grow: 1;
         img {
           margin: 18px 0 6px;
           @media screen and (max-width: 1334px) {
             margin-top: 5px;
             transform: scale(0.7);
           }
         }
         .cur-wea-img {
           margin-top: 30px;
           @include wh(80);
         }
         .num {
           @include nFont(24 700);
           @media screen and (max-width: 1334px) {
             font-size: 16px;
           }
         }
         .unit {
           @include nFont(12 400 #000)
         }
         .des {
           font-size: 12px;
           color: #909399;
         }
         &-temperature {
           line-height: 24px;
           @media screen and (max-width: 1334px) {
             font-size: 12px;
             line-height: 16px;
           }
         }
         &-weather {
           @include nFont(12 #909399 24);
           @media screen and (max-width: 1334px) {
             line-height: 16px;
           }
         }
         &-day {
           @include nFont(14 #000 24);
           @media screen and (max-width: 1334px) {
             font-size: 12px;
             line-height: 14px;
           }
         }
         &-random, &-cloud {
           @include nFont(12 #909399 22);
           text-align: center;
         }
         &-weather-img {
           @include wh(56);
         }
       }
       .circle-container {
         padding-top: 20px;
         width: 100%;
         height: 90%;
         .middle-text {
           bottom: 10%;
           left: 50%;
           transform: translateX(-50%);
           color: #000000;
           font-weight: 700;
           z-index: 2;
           @media screen and (max-width: 1334px) {
             font-size: 12px;
           }
         }
         .offline {
           padding-bottom: 54px;
           position: absolute;
           top: 20px;
           left: 0;
           width: 100%;
           height: calc(100% - 20px);
           background: linear-gradient(0deg, rgba(0, 0, 0, .32) 0%, rgba(84, 84, 84, .32) 100%);
           border-radius: 8px 8px 8px 8px;
           z-index: 2;
           div {
             right: 4px;
             top: 4px;
             font-size: 32px;
             font-weight: bold;
             color: #FFFFFF;
           }
         }
         &-box {
           width: 90%;
           z-index: 0;
           .middleTopBottom {
             background-color: #6FD87F;
             width: 2px;
             height: 50%;
             left: 50%;
             top: 0;
             transform: translateX(-50%);
             z-index: 1;
             &:after {
               content: '';
               position: absolute;
               bottom: 30%;
               left: 50%;
               transform: translate(-50%, -30%);
               width: 0;
               height: 0;
               border: 6px solid;
               border-color: #6FD87F transparent transparent transparent;
             }
           }
           .middleBottomLeft {
             background-color: #6FD87F;
             width: 2px;
             height: 50%;
             left: 40%;
             bottom: 0;
             transform: translateX(-50%) rotate(30deg);
             z-index: 1;
             &:after {
               content: '';
               position: absolute;
               bottom: 50%;
               left: 50%;
               transform: translate(-50%, -50%);
               width: 0;
               height: 0;
               border: 6px solid;
               border-color: #6FD87F transparent transparent transparent;
             }
           }
           .middleBottomRight {
             background-color: #6FD87F;
             width: 2px;
             height: 50%;
             left: 60%;
             bottom: 0;
             transform: translateX(-50%) rotate(-30deg);
             z-index: 1;
             &:after {
               content: '';
               position: absolute;
               bottom: 60px;
               left: 50%;
               transform: translateX(-50%);
               width: 0;
               height: 0;
               border: 6px solid;
               border-color: #6FD87F transparent transparent transparent;
             }
           }
           .middle-store-one {
             background-color: #6FD87F;
             width: 50%;
             height: 2px;
             left: 0;
             top: 50%;
             transform: translateY(-50%);
             z-index: 1;
           }
           .middleRightLeftArrow {
             background-color: #6FD87F;
             width: 50%;
             height: 2px;
             left: 0;
             top: 50%;
             transform: translateY(-50%);
             z-index: 1;
             &:after {
               content: '';
               position: absolute;
               top: 50%;
               left: 50%;
               transform: translate(-50%, -50%);
               width: 0;
               height: 0;
               border: 6px solid;
               border-color: transparent transparent transparent #6FD87F;
             }
           }
           .middleLeftRightArrow {
             background-color: #6FD87F;
             width: 50%;
             height: 2px;
             left: 0;
             top: 50%;
             transform: translateY(-50%);
             z-index: 1;
             &:after {
               content: '';
               position: absolute;
               top: 50%;
               left: 50%;
               transform: translate(-50%, -50%);
               width: 0;
               height: 0;
               border: 6px solid;
               border-color: transparent #6FD87F transparent transparent;
             }
           }
           .middle-right-left {
             background-color: #3EBCD4;
             width: 50%;
             height: 2px;
             right: 0;
             top: 50%;
             transform: translateY(-50%);
             z-index: 1;
           }
           .gridExport {
             background-color: #FFB968;
             width: 50%;
             height: 2px;
             right: 0;
             top: 50%;
             transform: translateY(-50%);
             z-index: 1;
             &:after {
               content: '';
               position: absolute;
               top: 50%;
               left: 50%;
               transform: translate(-50%, -50%);
               width: 0;
               height: 0;
               border: 6px solid;
               border-color: transparent #FFB968 transparent transparent;
             }
           }
           .gridImport {
             background-color: #FFB968;
             width: 50%;
             height: 2px;
             right: 0;
             top: 50%;
             transform: translateY(-50%);
             z-index: 1;
             &:after {
               content: '';
               position: absolute;
               top: 50%;
               left: 50%;
               transform: translate(-50%, -50%);
               width: 0;
               height: 0;
               border: 6px solid;
               border-color: transparent transparent transparent #FFB968;
             }
           }
           .circle {
             @include wh(80);
             border-radius: 50%;
             border: 1px solid #3EBCD4;
             @media screen and (max-width: 1334px) {
               @include wh(60);
             }
             div {
               margin-top: 5px;
               @include nFont(12 #000 700);
               text-align: center;
               @media screen and (max-width: 1334px) {
                 margin-top: -2px;
                 font-size: 10px;
               }
             }
             span {
               @include nFont(12 #909399 400)
             }
             z-index: 2;
             background-color: #fff;
             img {
               @media screen and (max-width: 1334px) {
                 transform: scale(0.7);
               }
             }
           }
           .top {
             top: 0;
             left: 50%;
             transform: translateX(-50%);
             &::before {
               content: 'PV';
               position: absolute;
               left: -28px;
               @include nFont(16 #000 700);
               @media screen and (max-width: 1334px) {
                 font-size: 12px;
               }
             }
           }
           .left {
             top: 50%;
             left: 0;
             transform: translateY(-50%);
             &::before {
               content: 'Battery';
               position: absolute;
               bottom: -28px;
               @include nFont(16 #000 700);
               @media screen and (max-width: 1334px) {
                 font-size: 12px;
                 transform: translateY(-80%);
               }
             }
             .soc {
               top: -40px;
               left: 50%;
               transform: translateX(-50%);
             }
           }
           .right {
             top: 50%;
             right: 0;
             transform: translateY(-50%);
             &::before {
               content: 'Grid';
               position: absolute;
               bottom: -28px;
               @include nFont(16 #000 700);
               @media screen and (max-width: 1334px) {
                 font-size: 12px;
                 transform: translateY(-80%);
               }
             }
           }
           .bottom-left {
             bottom: 0;
             left: 25%;
             &::before {
               content: 'Load';
               position: absolute;
               bottom: -28px;
               @include nFont(16 #000 700);
               @media screen and (max-width: 1334px) {
                 font-size: 12px;
                 transform: translateY(-80%);
               }
             }
           }
           .bottom-right {
             bottom: 0;
             right: 25%;
             &::before {
               width: 120px;
               text-align: center;
               content: 'EV Charger';
               position: absolute;
               bottom: -28px;
               @include nFont(16 #000 700);
               @media screen and (max-width: 1334px) {
                 font-size: 12px;
                 transform: translateY(-80%);
               }
             }
             &-dot {
               right: -5px;
               top: 50%;
               transform: translateX(-60%);
               @include wh(10);
               border-radius: 50%;
               background-color: #6fd87f;
               animation: light linear 3s infinite;
             }
             @keyframes light {
               0% { opacity: .6; transform: scale(.8) }
               25% { opacity: .8; transform: scale(1) }
               50% { opacity: 1; transform: scale(1.2) }
               75% { opacity: .8; transform: scale(1) }
               100% { opacity: .6; transform: scale(.8) }
             }
           }
         }
       }
     }
   }
  }
  &-chart {
    margin-top: 24px;
    height: 100vh;
    .el-card, .el-card__body {
      height: 100%;
    }
    &-production, &-consumption {
      height: 50vh;
      .barChart {
        margin-top: 20px;
        flex: 1 0 auto;
        &-total {
          position: absolute;
          z-index: 55;
          right: 3%;
          top: 70px;
          @include nFont(20 #000 700);
          span {
            margin-left: 14px;
            @include nFont(12 #909399 400);
          }
        }
      }
      .question {
        margin-right: 3px;
        width: 18px;
        cursor: pointer;
      }
    }
  }
}
</style>
