<template>
  <div class="comp-device-details app-container">
    <el-card>
      <span style="font-weight: 600">Device Info</span>
      <el-form class="form" disabled :model="base">
        <common-flex wrap="wrap">
          <el-form-item label="Product Type" prop="deviceType">
            <el-input v-model="deviceType[base.deviceType]"></el-input>
          </el-form-item>
          <el-form-item label="SN" prop="sn">
            <el-input v-model="base.sn"></el-input>
          </el-form-item>
          <el-form-item label="Agency" prop="agency">
            <el-input v-model="base.agency"></el-input>
          </el-form-item>
          <el-form-item label="Installation Status" prop="installStatus">
            <el-input v-model="installStatus[base.installStatus]"></el-input>
          </el-form-item>
          <el-form-item label="Networking Status" prop="net" v-if="+base.installStatus === 1">
            <el-input v-model="netStatus[base.net]"></el-input>
          </el-form-item>
          <el-form-item label="Capacity(kWh)" prop="capacity" v-if="[2, 6].includes(+base.deviceType)">
            <el-input v-model="base.capacity"></el-input>
          </el-form-item>
        </common-flex>
      </el-form>
    </el-card>
    <el-card style="margin-top: 20px" v-if="+base.installStatus === 0">
      <span style="font-weight: 600">Unbind Info</span>
      <el-form class="form" disabled :model="base">
        <common-flex wrap="wrap">
          <el-form-item label="Time of Device Unbind" prop="unBindTime">
            <el-input v-model="base.unBindTime"></el-input>
          </el-form-item>
          <el-form-item label="Unbind Operator" prop="unBindOperator">
            <el-input v-model="base.unBindOperator"></el-input>
          </el-form-item>
        </common-flex>
      </el-form>
    </el-card>
    <el-card style="margin-top: 20px">
      <span style="font-weight: 600">Historical Installation Info</span>
      <el-form class="form" disabled :model="base">
        <common-flex wrap="wrap">
          <el-form-item label="Time of Device Installed" prop="installTime">
            <el-input v-model="base.installTime"></el-input>
          </el-form-item>
          <el-form-item label="Installed Operator" prop="bindOperator">
            <el-input v-model="base.bindOperator"></el-input>
          </el-form-item>
          <el-form-item label="Site Name" prop="siteName">
            <el-input v-model="base.siteName"></el-input>
          </el-form-item>
          <el-form-item label="Site Code" prop="siteCode">
            <el-input v-model="base.siteCode"></el-input>
          </el-form-item>
          <el-form-item label="Address" prop="address">
            <el-input type="textarea" v-model="base.address"></el-input>
          </el-form-item>
          <el-form-item label="Region" prop="city">
            <el-input v-model="base.region || '--'"></el-input>
          </el-form-item>
        </common-flex>
      </el-form>
    </el-card>
    <el-card v-if="+base.deviceType === 4" style="margin-top: 20px">
      <div style="font-weight: 600; margin-bottom: 20px">Firmware update</div>
      <el-form disabled :model="currentApk">
        <el-row :gutter="36">
          <el-col :span="6">
            <el-form-item label="Software version" prop="currentVersion">
              <el-input v-model="currentApk.currentVersion"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Hardware version" prop="hardVersion">
              <el-input v-model="currentApk.hardVersion"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Upgrade Time" prop="upgradeTime">
              <el-input v-model="currentApk.upgradeTime"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" style="margin-top: 36px" :disabled="false" @click="openShow">Upgrade</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div style="font-weight: 600; margin: 20px 0">Upgrade Record</div>
      <el-table :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}"
                v-loading="loading" :data="list"
      >
        <el-table-column label="No." align="center" width="60">
          <template slot-scope="scope">
            {{ (+queryParams.pageNum - 1) * (+queryParams.pageSize) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="File Type" prop="fileType" min-width="160">
          <template slot-scope="{ row }">
            <dict-tag :options="dict.type.file_type" :value="row.fileType"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column label="Software version" prop="versionNum"></el-table-column>
        <el-table-column label="Operation time" prop="">
          <template slot-scope="{ row }">
            <span v-if="row.createTime && row.createTime !== '--'">{{ DATE_FORMAT('M/d/yyyy hh:mm:ss', row.createTime) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="Status" prop="status">
          <template slot-scope="{ row }">
            <span>{{ ['', 'Success', 'Fail', 'Upgrading'][row.status] }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>
    <common-flex style="margin-top: 20px" justify="center"><el-button @click="cancel">Cancel</el-button></common-flex>
    <div v-if="show">
      <el-dialog :visible.sync="show" title="Upgrade"
                 :before-close="beforeClose"
                 :close-on-click-modal ="false"
                 width="46%">
        <el-form :model="toastData" :rules="toastRules" ref="toastRef" label-position="top">
          <el-row>
            <el-col :span="10">
              <el-form-item label="File Type" prop="fileType">
                <el-select @change="changeFileType" v-model="toastData.fileType" style="width: 300px;">
                  <el-option v-for="(i, k) of fileTypeOptions" :value="i.value" :label="i.label" :key="k"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="Version" prop="newVersion">
                <el-select v-model="toastData.newVersion" style="width: 300px;">
                  <el-option v-for="(i, k) of newVersionList" :value="i" :label="i" :key="k"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <common-flex justify="center">
          <el-button type="primary" @click="submit">Submit</el-button>
          <el-button @click="abort">Cancel</el-button>
        </common-flex>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { baseDevice } from '@/api/device'
import {versionNew, versionRecord, versionUpgrade} from "@/api/remote"
export default {
  name: "comp-details",
  dicts: ['file_type'],
  data() {
    return {
      toastData: {
        newVersion: '',
        fileType: 0
      },
      toastRules: {
        newVersion: [
          { required: true, trigger: 'change', message: 'Please select'}
        ],
        fileType: [
          { required: true, trigger: 'change', message: 'Please select'}
        ]
      },
      newVersionList: [],
      show: false,
      fileTypeOptions: [
        {
          value: 0,
          label: 'Communication module software upgrade package'
        },
        {
          value: 18,
          label: 'Hybrid_app*'
        },
        {
          value: 19,
          label: 'Hybrid_boot*'
        },
        {
          value: 20,
          label: 'HybridInverter5K_app*'
        },
        {
          value: 21,
          label: 'HybridInverter5K_flash*'
        },
      ],
      currentApk: {
        currentVersion: '',
        hardVersion: '',
        upgradeTime: ''
      },
      total: 0,
      loading: false,
      list: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sn: ''
      },
      base: {},
      deviceType: {
        '1': 'Inverter',
        '2': 'Battery',
        '3': 'EV Charger',
        '4': 'Stick Logger',
        '6': 'Photovoltaic',
      },
      installStatus: {
        '0': 'Unbind',
        '1': 'Installed'
      },
      netStatus: {
        '0': 'Off-line',
        '1': 'On-line'
      }
    }
  },
  mounted() {
    baseDevice(this.$route.params.id).then(res => {
      if (res.data.installTime) res.data.installTime = this.DATE_FORMAT('M/d/yyyy hh:mm', (+res.data.installTime) * 1000)
      if (res.data.unBindTime) res.data.unBindTime = this.DATE_FORMAT('M/d/yyyy hh:mm', (+res.data.unBindTime) * 1000)
      res.data.region = ''
      if (res.data.city) res.data.region = `${res.data.city}`
      if (res.data.province) res.data.region = `${res.data.region}${res.data.province}`
      if (res.data.country) res.data.region = `${res.data.region}${res.data.country}`
      this.queryParams.sn = res.data.sn
      this.base = res.data
      if (+this.base.deviceType === 4) this.getList()
      if (res.data.upgradeTime) this.currentApk.upgradeTime = this.DATE_FORMAT('M/d/yyyy hh:mm:ss', (+res.data.upgradeTime) * 1000)
      this.currentApk.currentVersion = res.data.version
      this.currentApk.hardVersion = res.data.hardVersion
    })
  },
  methods: {
    changeFileType() {
      this.getVersionList()
      this.toastData.newVersion = ''
    },
    submit() {
      this.$refs.toastRef.validate(v => {
        if (v) {
          this.$modal.loading("Upgrading")
          let data = {
            sn: this.queryParams.sn,
            version: this.toastData.newVersion,
            fileType: this.toastData.fileType
          }
          versionUpgrade(data).then(res => {
            console.log('Upgrade', res)
            if (+res.code === 200) {
              this.$modal.msgSuccess("Succeeded")
              this.getList()
              this.beforeClose()
            }
          }).finally(() => {
            this.$modal.closeLoading()
          })
        }
      })
    },
    abort() {
      this.beforeClose()
    },
    openShow() {
      this.show = true
      this.getVersionList()
    },
    getVersionList() {
      let version = {
        versionNum: this.currentApk.currentVersion || '0.0.0',
        fileType: this.toastData.fileType
      }
      versionNew(version).then(res => {
        this.newVersionList = res.data
      })
    },
    beforeClose() {
      this.show = false
      this.toastData.newVersion = ''
      this.toastData.fileType = 0
    },
    cancel() {
      history.go(-1)
    },
    getList() {
      this.loading = true
      versionRecord(this.queryParams).then(res => {
        this.list = res.rows
        this.total = res.total
      }).finally(() => {
        this.loading = false
      })
    },
  }
}
</script>

<style lang="scss">
.comp-device-details {
  .el-icon-arrow-left {
    margin-right: 5px;
    cursor: pointer;
    font-weight: 700;
  }
  .form {
    margin-top: 10px;
    .el-form-item {
      margin-right: 60px;
      width: calc(100% / 3 - 60px);
    }
    >:nth-child(3n) {
      margin-right: 0;
    }
  }
}
</style>
