<template>
  <div class="comp-site-info">
    <el-card class="comp-site-info-card">
      <common-flex justify="space-between">
        <div class="comp-site-info-card-title">Site Profile</div>
        <el-button v-has-permi="['ati:site:edit']" type="primary" @click="modify">Edit</el-button>
      </common-flex>
      <el-form class="comp-site-info-card-form" :model="base" disabled>
        <el-form-item :prop="i.prop" v-for="i of formList" :key="i.prop">
          <template slot="label"><span>{{ i.label }}</span></template>
          <template v-if="i.prop === 'siteStatus'">
            <el-input v-model="['Completed', 'Commissioning'][+base[i.prop] - 1]"></el-input>
          </template>
          <template v-else-if="i.prop === 'address'">
            <el-input type="textarea" autosize v-model="base[i.prop]"></el-input>
          </template>
          <template v-else>
            <el-input v-model="base[i.prop]"></el-input>
          </template>
        </el-form-item>
        <el-form-item label="Time Zone" prop="timeZone"><el-input v-model="base.timeZone"></el-input></el-form-item>
      </el-form>
    </el-card>
    <el-card class="comp-site-info-card">
      <div class="comp-site-info-card-title">Site Correlation Details</div>
      <el-table :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}" class="comp-site-info-card-table" :data="base.userList">
        <el-table-column type="index" width="80" label="No"></el-table-column>
        <el-table-column label="User Name" prop="userName" show-tooltip-when-overflow />
        <el-table-column label="E-mail" prop="email" />
        <el-table-column label="Phone" prop="phone" />
      </el-table>
    </el-card>
    <el-dialog :visible.sync="show" title="Modify"
               :before-close="beforeClose"
               :close-on-click-modal ="false"
               width="70%">
      <el-form class="comp-site-info-card-form" :model="copyBase" :rules="rules" ref="modifyForm">
        <el-form-item :prop="i.prop" v-for="(i, index) of formList" :key="i.prop">
          <template slot="label"><span>{{ i.label }}</span></template>
          <template v-if="i.prop === 'siteStatus'">
            <el-input disabled v-model="['Completed', 'Commissioning'][+copyBase[i.prop] - 1]"></el-input>
          </template>
          <template v-else-if="i.prop === 'region'">
            <el-select filterable class="region-select" :disabled="!region.province" @change="select('city', $event)" v-model="region.city">
              <el-option v-for="i of cityList" :label="i.name" :value="i.name" :key="i.id"></el-option>
            </el-select>
            <el-select filterable class="region-select" :disabled="!region.country" @change="select('province', $event)" v-model="region.province">
              <el-option v-for="i of proList" :label="i.name" :value="i.name" :key="i.id"></el-option>
            </el-select>
            <el-select filterable class="region-select" @change="select('country', $event)" v-model="region.country">
              <el-option v-for="i of countryList" :label="i.name" :value="i.name" :key="i.id"></el-option>
            </el-select>
          </template>
          <template v-else-if="['siteName', 'nickName'].includes(i.prop)">
            <el-input v-model="copyBase[i.prop]" maxlength="50"></el-input>
          </template>
          <template v-else-if="i.prop === 'address'">
            <el-input type="textarea" show-word-limit maxlength="200" v-model="copyBase[i.prop]"></el-input>
          </template>
          <template v-else>
            <el-input :disabled="index > 0 && index < 5" v-model="copyBase[i.prop]"></el-input>
          </template>
        </el-form-item>
        <el-form-item label="Time Zone" style="margin-right: 60px" prop="timeZone">
          <el-select style="width: 100%" v-model="copyBase.timeZone">
            <el-option v-for="i of timeZoneArr" :label="i.label" :value="i.timeZone" :key="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="mapBox" id="mapBox" />
      <common-flex style="margin-top: 30px" justify="center">
        <el-button type="primary" @click="submit">Submit</el-button>
        <el-button @click="beforeClose">Cancel</el-button>
      </common-flex>
    </el-dialog>
  </div>
</template>

<script>
import { updateSite, timeZoneList } from "@/api/site"
import { Loader } from "@googlemaps/js-api-loader"
const loader = new Loader({
  apiKey: "AIzaSyBKQp9U9gHx7dLGYs6XBZiukvXZsM0JpMw", //之前的key
  version: "weekly", //版本
  libraries: ["places"],
})
let address = ''
export default {
  name: "comp-SiteInfo",
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
      countryList: [],
      cityList: [],
      proList: [],
      rules: {
        siteName: [
          { required: true, trigger: ['blur', 'change'], message: 'Please enter' }
        ],
        address: [
          { required: true, trigger: ['blur', 'change'], message: 'Please enter' }
        ],
        region: [
          { required: true, trigger: ['blur', 'change'], message: 'Please enter' }
        ],
      },
      region: {
        city: '',
        province: '',
        country: '',
      },
      formList: [
        {
          label: 'Site Name',
          prop: 'siteName'
        },
        {
          label: 'Nick Name',
          prop: 'nickName'
        },
        {
          label: 'Site Code',
          prop: 'siteCode'
        },
        {
          label: 'Agency',
          prop: 'agency'
        },
        {
          label: 'Time of Installed',
          prop: 'installTime'
        },
        {
          label: 'Installation Status',
          prop: 'siteStatus'
        },
        {
          label: 'Address',
          prop: 'address'
        },
        {
          label: 'Region',
          prop: 'region'
        },
      ],
      google: '',
      map: '',
      service: '',
      infoWindow: '',
      marker: '',
      lat: '',
      lng: '',
      show: false,
      copyBase: {},
      timer: null,
      moveTimer: null,
      timeZoneArr: [],
    }
  },
  watch: {
    base: {
      handler(v) {
        if (v) {
          this.copyBase = JSON.parse(JSON.stringify(v))
          this.getRegion()
        }
      },
      immediate: true
    },
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  mounted() {
    this.getCityJson().then(res => {
      this.countryList = res
    })
  },
  methods: {
    getCityJson() {
      return new Promise((resolve, reject) => {
        import('../../../../public/country.json').then(res => {
          resolve(res.default)
        })
      })
    },
    getRegion() {
      this.region.country = this.copyBase.country
      this.region.city = this.copyBase.city
      this.region.province = this.copyBase.province
    },
    select(type, e) {
      if (this.countryList.length) {
        if (type === 'country') {
          let item = this.countryList.find(i => i.name === e)
          this.region.country = item.name
          this.region.province = this.region.city = ''
          this.proList = item.state
          this.searchMap(item.name).then(res => {
            this.getDetailsInfo(res, 'select')
          })
        }
        if (type === 'province') {
          let proItem = this.proList.find(i => i.name === e)
          this.cityList = proItem.city
          this.region.province = proItem.name
          this.region.city = ''
          let searchText = `${this.region.country} ${proItem.name}`
          this.searchMap(searchText).then(res => {
            this.getDetailsInfo(res, 'select')
          })
        }
        if (type === 'city') {
          let cityItem = this.cityList.find(i => i.name === e)
          this.region.city = cityItem.name
          let searchText = `${this.region.country}${this.region.province}${cityItem.name}`
          clearInterval(this.timer)
          this.timer = setTimeout(() => {
            this.searchMap(searchText).then(res => {
              this.getDetailsInfo(res, 'select')
            })
          }, 500)
        }
      }
    },
    modify() {
      this.show = true
      if (!this.timeZoneArr.length) this.getTimeZoneList()
      if (!this.google) this.initMap()
      if (this.region.country) {
        let item = this.countryList.find(i => i.name === this.region.country)
        if (item) this.proList = item.state
      }
      if (this.region.province) {
        let item = this.proList.find(i => i.name === this.region.province)
        if (item) this.cityList = item.city
      }
    },
    getTimeZoneList() {
      const params = {
        pageNum: 1,
        pageSize: 1000,
      }
      timeZoneList(params).then(res => {
        const arr = res.rows
        if (arr.length) {
          for (let i = 0; i < arr.length; i++) {
            arr[i].label = `(${(arr[i].utcTime)}) ${arr[i].timeZone.replace('/', ',')}`
          }
        }
        this.timeZoneArr = arr
      })
    },
    beforeClose() {
      this.show = false
      this.copyBase = JSON.parse(JSON.stringify(this.base))
      this.getRegion()
    },
    submit() {
      if (this.region.city && this.region.province && this.region.country) this.$set(this.copyBase, 'region', true)
      else this.$set(this.copyBase, 'region', '')
      this.$nextTick(() => {
        this.$refs.modifyForm.validate(v => {
          const data = {}
          this.formList.forEach(i => {
            data[i.prop] = this.copyBase[i.prop]
          })
          data.installTime = this.DATE_FORMAT('yyyy-MM-dd hh:mm:ss', new Date(this.copyBase.installTime))
          data.id = this.$route.params.id
          data.lat = this.lat
          data.lng = this.lng
          data.country = this.region.country
          data.province = this.region.province
          data.city = this.region.city
          data.timeZone = this.copyBase.timeZone
          data.region = `${this.region.city},${this.region.province},${this.region.country}`
          if (v) {
            this.$modal.loading()
            updateSite(data).then(res => {
              if (+res.code === 200) {
                this.$message({
                  type: 'success',
                  message: 'Succeeded!'
                })
                this.$emit('refresh')
                this.beforeClose()
              }
            }).finally(() => this.$modal.closeLoading());
          }
        })
      })
    },
    getAddressInfo() {
      this.searchMap(this.copyBase.address).then(res => {
        this.getDetailsInfo(res, 'search')
      })
    },
    getDetailsInfo(placeId, type) {
      const request = {
        placeId,
        fields: ['formatted_address', 'address_components', 'geometry'],
      }
      this.service.getDetails(request, (res, status) => {
        if (status === this.google.maps.places.PlacesServiceStatus.OK) {
          console.log('details', res)
          this.lat = res.geometry.location.lat()
          this.lng = res.geometry.location.lng()
          this.marker.setPosition(res.geometry.location)
          let addressList = res.address_components, street = res.formatted_address.split(' ')
          let i = 0;
          for(i; i < addressList.length; i++) {
            if (type === 'click') {
              if (addressList[i].types.includes('country')) this.region.country = addressList[i].short_name
              if (addressList[i].types.includes('administrative_area_level_1')) this.region.province = addressList[i].short_name
              if (addressList[i].types.includes('locality')) this.region.city = addressList[i].short_name
              else if (addressList[i].types.includes('sublocality_level_1')) this.region.city = addressList[i].short_name
              else if (addressList[i].types.includes('neighborhood')) this.region.city = addressList[i].short_name
              this.copyBase.address = street[0]
            }
          }
        }
      })
    },
    // 查找地点请求
    searchMap(query) {
      console.log('搜索地名',  query)
      this.marker.setMap(null) // 清除之前的标记
      return new Promise((resolve, reject) => {
        const request = {
          query,
          fields: ['name', 'geometry', 'place_id'],
        }
        this.service.textSearch(request, (results, status) => {
          if (status === this.google.maps.places.PlacesServiceStatus.OK) {
            console.log('search', results[0])
            let res = results[0]
            this.marker = new this.google.maps.Marker({
              position: res.geometry.location,
              map: this.map,
            })
            this.map.setCenter(this.marker.getPosition())
            let myLatLngBounds = new this.google.maps.LatLngBounds(res.geometry.viewport, 20) // 当前地点的几何视口
            this.map.fitBounds(myLatLngBounds) // 设置视口，使其包含指定边界。改变zoom缩放级别
            console.log(this.map.getZoom())
            if (+this.map.getZoom() > 12) this.map.setZoom(10)
            this.marker.addListener("click", (e) => {
              console.log('点击标记', e)
              // this.infoWindow.setContent(res.name);
              // this.infoWindow.open(this.map, this.marker);
              this.map.setZoom(this.map.getZoom() + 1)
              this.map.setCenter(this.marker.getPosition())
            })
            if(res.place_id) resolve(res.place_id)
            setTimeout(() => {
              this.$nextTick(() => {
                console.log('DOM', document.getElementsByClassName('gm-control-active'))
                let a = document.getElementsByClassName('gm-control-active')[4]
                if (a) {
                  a.addEventListener('click', () => {
                    this.map.setCenter(this.marker.getPosition())
                  })
                }
              })
            }, 1000)
          }
        })
      })
    },
    // 地图移动
    drag() {
      this.marker.setPosition(this.map.getCenter())
      const location = new this.google.maps.LatLng(this.map.getCenter())
      const geocoder = new this.google.maps.Geocoder()
      clearInterval(this.moveTimer)
      this.moveTimer = setTimeout(() => {
        geocoder.geocode({ location: location }).then(res => {
          console.log('geocoder', res)
          let result = res.results
          console.log('geocoder', result)
          let firstRes = result[0]
          console.log('firstRes', firstRes)
          if (firstRes.place_id) this.getDetailsInfo(firstRes.place_id, 'click')
        })
      }, 1000)
    },
    // 地图监听点击事件
    clickMap(e) {
      let newCenter = e.latLng
      this.map.setCenter(newCenter)
      if(e.placeId) {
        this.getDetailsInfo(e.placeId, 'click')
      }
    },
    initMap() {
      const mapOptions = {
        center: { lat: 22.602, lng: 114.043 },
        zoom: 6
      }
      loader
        .load()
        .then((google) => {
          this.google = google
          this.map = new this.google.maps.Map(
            document.getElementById("mapBox"),
            mapOptions
          )
          this.service = new google.maps.places.PlacesService(this.map)
          this.infoWindow = new google.maps.InfoWindow({
            content: "",
            // disableAutoPan: true,
          })
          this.marker = new google.maps.Marker()
          this.getAddressInfo()
          this.google.maps.event.addListener(this.map, 'click', this.clickMap)
          this.google.maps.event.addListener(this.map, 'drag', this.drag)
        }).catch((e) => {
        console.log(e)
      })
    },
  }
}
</script>

<style lang="scss">
.comp-site-info {
  .mapBox {
    margin: 0 auto;
    width: calc(100% - 100px);
    height: 40vh;
    //.gmnoprint {
    //  display: none;
    //}
    .gm-style-cc, .gm-svpc, .gm-style-mtc {
      display: none;
    }
    //.gm-style {
    //  a {
    //    display: none !important;
    //  }
    //}
  }
  &-card {
    margin-bottom: 24px;
    padding-bottom: 20px;
    &-title {
      font-weight: 700;
    }
    &-form {
      padding: 0 50px;
      display: flex;
      //justify-content: space-between;
      flex-wrap: wrap;
      .el-form-item {
        margin-right: 60px;
        min-width: calc(100% / 3 - 80px);
        .region-select {
          margin-right: 2px;
          width: calc(100% / 4);
        }
      }
      >:nth-child(3n) {
        margin-right: 0;
      }
      .el-form-item__label{
        text-align:left;
        float: none;
        word-break: break-word;
      }
    }
    &-table {
      margin-top: 25px;
    }
  }
}
</style>
