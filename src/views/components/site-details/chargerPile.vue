<template>
  <div style="width: 100%">
    <el-tabs v-model="sn" @tab-click="changeCurPile">
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
        <div class="item" v-for="i of dataInfo">
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
</template>

<script>
import {orderRes, stopCharge} from "@/api/device";
let timerInter = null, times = 1
export default {
  name: 'comp-charger',
  props: {
    curDevInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    dataInfo: {
      type: Array,
      default: () => {
        return []
      }
    },
    pileList: {
      type: Array,
      default: () => {
        return []
      }
    },
  },
  watch: {
    pileList: {
      handler(v) {
        if (v.length) {
          this.sn = v[0].serialNumber
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      sn: '',
      waitLoading: '',
    }
  },
  methods: {
    changeCurPile() {
      this.$emit('common', this.sn)
    },
    requestLoading() {
      this.waitLoading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    stopCharge() {
      let data = {
        siteCode: this.$route.query?.siteCode,
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
            times = 1
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
  },
}
</script>
<style lang="scss">

</style>
