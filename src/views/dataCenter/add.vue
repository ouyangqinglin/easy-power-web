<template>
  <el-dialog
    title="Newly Build"
    :before-close="beforeClose"
    :close-on-click-modal="false"
    width="65%"
    :visible.sync="show">
    <el-form :model="addBase" label-position="top" :rules="rules" ref="formBase">
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="Data Center Name" prop="name">
            <el-input placeholder="Please enter" v-model="addBase.name" maxlength="50" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="API" prop="api">
            <el-input placeholder="Please enter" v-model="addBase.api" maxlength="50" show-word-limit></el-input>
          </el-form-item>
        </el-col>
<!--        <el-col :span="8">-->
<!--          <el-form-item label="Port" prop="apiPort">-->
<!--            <el-input placeholder="Please enter" maxlength="50" disabled v-model.number="addBase.apiPort"></el-input>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="Logger Server Address--Version 1.0" prop="loggerV1Url">
            <el-input @change="checkUrl('loggerV1')" placeholder="Please enter" v-model="addBase.loggerV1Url" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Port" prop="loggerV1Port">
            <el-input @change="checkUrl('loggerV1')" maxlength="5" placeholder="Please enter" v-model.number="addBase.loggerV1Port"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="Logger Server Address--Non 1.0 version" prop="loggerV2Url">
            <el-input @change="checkUrl('loggerV2')" placeholder="Please enter" v-model="addBase.loggerV2Url" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Port" prop="loggerV2Port">
            <el-input @change="checkUrl('loggerV2')" maxlength="5" placeholder="Please enter" v-model.number="addBase.loggerV2Port"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="EV Charger Address" prop="pileUrl">
            <el-input placeholder="Please enter" @change="checkUrl('pile')" maxlength="50" v-model="addBase.pileUrl">
              <el-select v-model="addBase.schema" slot="prepend" placeholder="Please select">
                <el-option label="ws://" :value="1"></el-option>
                <el-option label="wss://" :value="2"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Port" prop="pilePort">
            <el-input @change="checkUrl('pile')" maxlength="5" placeholder="Please enter" v-model.number="addBase.pilePort"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="Remarks" prop="remarks">
        <el-input type="textarea" v-model="addBase.remarks" maxlength="200" show-word-limit placeholder="Please enter"></el-input>
      </el-form-item>
    </el-form>
    <common-flex justify="center" style="margin-top: 29px">
      <el-button type="primary" @click="submit">Submit</el-button>
      <el-button @click="beforeClose">Cancel</el-button>
    </common-flex>
  </el-dialog>
</template>

<script>
import { add } from '@/api/dataCenter'
export default {
  props: {
    show: Boolean
  },
  data() {
    return {
      addBase: {
        name: '',
        loggerV1Url: '',
        loggerV2Url: '',
        loggerV1Port: '',
        loggerV2Port: '',
        api: '',
        apiPort: 80,
        schema: 1,
        pilePort: '',
        pileUrl: '',
        remarks: ''
      },
      rules: {
        name: [
          { required: true, message: 'Please enter', trigger: ['blur', 'change']}
        ],
        api: [
          { required: true, message: 'Please enter', trigger: ['blur', 'change']}
        ],
        loggerV1Url: [
          { required: false, message: 'Please enter', trigger: ['blur', 'change']}
        ],
        loggerV1Port: [
          { required: false, message: 'Please enter', trigger: ['blur', 'change']}
        ],
        loggerV2Url: [
          { required: false, message: 'Please enter', trigger: ['blur', 'change']}
        ],
        loggerV2Port: [
          { required: false, message: 'Please enter', trigger: ['blur', 'change']}
        ],
        pileUrl: [
          { required: false, message: 'Please enter', trigger: ['blur', 'change']}
        ],
        pilePort: [
          { required: false, message: 'Please enter', trigger: ['blur', 'change']}
        ],
      }

    }
  },
  methods: {
    submit() {
      this.$refs.formBase.validate(v => {
        if (v) {
          this.$modal.loading()
          add(this.addBase).then(res => {
            if (+res.code === 200) {
              this.beforeClose()
              this.$emit('refresh')
            }
          }).finally(() => this.$modal.closeLoading())
        }
      })
    },
    checkUrl(type) {
      this.rules[`${type}Port`][0].required = !!this.addBase[`${type}Url`]
      this.rules[`${type}Url`][0].required = !!this.addBase[`${type}Port`]
      this.rules = {...this.rules}
    },
    beforeClose() {
      this.$emit('update:show', false)
      setTimeout(() => {
        this.resetBase()
      }, 600)
    },
    resetBase() {
      Object.keys(this.addBase).forEach(i => {
        this.addBase[i] = ''
      })
      this.addBase.apiPort = 80
      this.addBase.schema = 1
    },
  }
}
</script>
