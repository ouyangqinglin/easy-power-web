<template>
  <div>
    <el-card>
      <el-row type="flex" justify="space-between" align="center" style="margin-bottom: 20px">
        <strong>Firmware update</strong>
        <el-button type="primary" @click="openShow">Upgrade</el-button>
      </el-row>
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
      <div style="padding-bottom: 20px">
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
    </el-card>
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
import {versionNew, versionRecord, versionUpgrade} from "@/api/remote";

export default {
  name: "comp-site-firmware",
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
      newVersionList: [],
      list: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        siteCode: '',
      },
    }
  },
  mounted() {
    this.queryParams.siteCode = this.$route.query?.siteCode
    this.getList()
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
            siteCode: this.$route.query?.siteCode,
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
    openShow() {
      this.show = true
      this.getVersionList()
    },
    getVersionList() {
      let version = {
        versionNum: this.currentApk.currentVersion || '0.0.0',
        fileType: this.toastData.fileType,
        siteCode: this.$route.query?.siteCode
      }
      versionNew(version).then(res => {
        this.newVersionList = res.data
      })
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
    beforeClose() {
      this.show = false
      this.toastData.newVersion = ''
      this.toastData.fileType = 0
    },
    abort() {
      this.beforeClose()
    }
  }
}
</script>

<style lang="scss">

</style>
