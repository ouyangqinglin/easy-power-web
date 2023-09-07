<template>
  <div class="comp-device-card-content-right" style="flex-grow: 1">
    <common-flex auto>
      <common-flex direction="column" align="center">
        <img class="device-battery" :src="require('./img/device-stick.svg')" alt=""><br>
        <span class="status-tips" v-if="+curDevInfo.net === 1">on-line</span>
        <span class="status-tips" v-else>off-line</span>
      </common-flex>
      <common-flex direction="column" auto class="comp-device-card-content-right-container">
        <div class="item" v-for="i of dataInfo">
          <div class="item-title">{{ i.title }}</div>
          <common-flex class="item-body" wrap="wrap" justify="space-between">
            <div class="item-body-item charge" v-for="(v, k) of i.info">
              <div class="item-body-item-key">{{ k }}</div>
              <div class="item-body-item-value">{{ v || '--' }}</div>
            </div>
          </common-flex>
        </div>
      </common-flex>
    </common-flex>
    <el-dialog v-if="configNetShow" :visible.sync="configNetShow" title="Networking"
               :before-close="beforeClose"
               :close-on-click-modal ="false"
               width="30%">
      <div style="width: 66%; margin: 0 auto" v-show="startNetShow">
        <el-form @submit.native.prevent :model="network" :rules="networkRules" ref="networkRef">
          <el-form-item prop="wifi">
            <el-input v-model="network.wifi">
              <svg-icon slot="prefix" icon-class="wifi" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input :type="inputType" v-model="network.password">
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
              <template #suffix>
                <svg-icon v-if="eyes" @click.native="eyes = !eyes" style="cursor: pointer; margin-right: 10px" icon-class="eye" class="el-input__icon input-icon" />
                <svg-icon v-else @click.native="eyes = !eyes" style="cursor: pointer; margin-right: 10px" icon-class="eye-open" class="el-input__icon input-icon" />
              </template>
            </el-input>
          </el-form-item>
        </el-form>
        <common-flex style="margin-top: 30px" justify="center">
          <el-button type="primary" @click="startNet">Start to configure</el-button>
        </common-flex>
      </div>
      <template v-if="!startNetShow">
        <common-flex direction="column" align="center" class="network">
          <img src="./img/network.png" alt="">
          <common-flex direction="column" align="flex-start">
            <p :class="{step: stepActive === 1}">1.Device searching{{ stepActive === 1 ? '...': ''}}</p>
            <p :class="{step: stepActive === 2}">2.Device connection{{ stepActive === 2 ? '...': ''}}</p>
            <p :class="{step: stepActive === 3}">3.Command sending{{ stepActive === 3 ? '...': ''}}</p>
            <p :class="{step: stepActive === 4}">4.Device networking{{ stepActive === 4 ? '...': ''}}</p>
            <p :class="{step: stepActive === 5}">5.Server connection{{ stepActive === 5 ? '...': ''}}</p>
            <p :class="{step: stepActive === 6}">6.Data synchronization{{ stepActive === 6 ? '...': ''}}</p>
          </common-flex>
          <div style="width: 90%">
            <el-progress :percentage="percentage"></el-progress>
          </div>
        </common-flex>
      </template>
    </el-dialog>
  </div>
</template>

<script>
let timerNet = null, timesNet = 1
export default {
  name: 'comp-sticker',
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
    }
  },
  computed: {
    inputType() {
      return this.eyes ? 'password' : 'text'
    },
    percentage() {
      let percentageList = [10, 26, 42, 58, 74, 100]
      return percentageList[this.stepActive -1]
    },
  },
  data() {
    return {
      stepActive: 1,
      startNetShow: true,
      network: {
        wifi: '',
        password: ''
      },
      networkRules: {
        wifi: [
          { required: true, message: 'Please enter', trigger: 'blur' },
        ],
        password: [
          { required: true, message: 'Please enter', trigger: 'blur' },
        ]
      },
      eyes: true,
      configNetShow: false,
    }
  },
  methods: {
    beforeClose() {
      this.configNetShow = false
      clearInterval(timerNet)
      this.stepActive = 1
      this.startNetShow = true
      timesNet = 1

    },
    startNet() {
      this.$refs.networkRef.validate(v => {
        if (v) {
          this.startNetShow = false
          timerNet = setInterval(() => {
            if (timesNet === 6) this.stepActive = 2
            if (timesNet === 12) this.stepActive = 3
            if (timesNet === 18) this.stepActive = 4
            if (timesNet === 24) this.stepActive = 5
            if (timesNet === 30) this.stepActive = 6
            timesNet++
            if (timesNet > 31) {
              this.beforeClose()
              this.$modal.alertSuccess('Configuration succeeded')
            }
          }, 1000)
        }
      })
    },
  }
}
</script>

<style lang="scss">

</style>
