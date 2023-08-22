<template>
  <div class="pages-remote-details app-container">
    <el-card>
      <el-form>
        <el-row>
          <el-col :span="10">
            <el-form-item label="File Type:" prop="fileType" label-width="160px">
              <dict-tag :options="dict.type.file_type" :value="base.fileType"></dict-tag>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="Version:" prop="versionNum" label-width="140px"><span>{{base.versionNum}}</span></el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="Upload Time:" prop="versionNum" label-width="120px"><span>{{ DATE_FORMAT('M/d/yyyy hh:mm:ss', new Date(base.updateTime)) }}</span></el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="Firmware package:" prop="name" label-width="160px">
              <el-link :href="`${baseUrl}${base.path}`" :underline="false" target="_blank">
                <span style="color: #3EBCD4">{{ base.name }}</span>
              </el-link>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="Firmware Name:" prop="name" label-width="140px">
              <el-tooltip :content="base.name" placement="top">
                <div style="width: 360px" class="ellipsis">{{base.name}}</div>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="Upload by:" prop="updateBy" label-width="120px"><span>{{ base.updateBy }}</span></el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="Version description:" prop="remark" label-width="160px">
              <span>{{ base.remark }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card style="margin-top: 20px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="Upgrade Task" name="1">
          <el-row justify="space-between" type="flex">
            <el-col :span="5">
              <el-input clearable prefix-icon="el-icon-search" @input="searchList()" v-model.trim="params.name" placeholder="Please enter a task name"></el-input>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" @click="addShow = true">Add</el-button>
            </el-col>
          </el-row>
          <el-table style="margin-top: 20px" :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}"
                    v-loading="loading" :data="taskList"
          >
            <el-table-column label="No." align="center" width="60">
              <template slot-scope="scope">
                {{ (+params.pageNum - 1) * (+params.pageSize) + scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="Task ID" prop="code"></el-table-column>
            <el-table-column label="Task Name" prop="name"></el-table-column>
            <el-table-column label="QTY of Site" prop="num">
              <template slot-scope="{row}">
                <span style="color: #3EBCD4; cursor: pointer" @click="lookNum(row.code)">{{row.num}}</span>
              </template>
            </el-table-column>
            <el-table-column label="Status" prop="status">
              <template slot-scope="{ row }">
                <span>{{ ['', 'In progress', 'To be started', 'Completed'][+row.status] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Remarks" prop="remark"></el-table-column>
            <el-table-column label="Creation Time" prop="createTime">
              <template slot-scope="{row}">
                <span>{{DATE_FORMAT('M/d/yyyy hh:mm:ss', new Date(row.createTime))}}</span>
              </template>
            </el-table-column>
            <el-table-column label="Creation By" prop="createBy"></el-table-column>
          </el-table>
          <pagination
            v-show="params.total>0"
            :total="params.total"
            :page.sync="params.pageNum"
            :limit.sync="params.pageSize"
            @pagination="getUpgradeTaskList"
          />
        </el-tab-pane>
        <el-tab-pane label="Upgrade Record" name="2">
          <el-row justify="space-between" type="flex">
            <el-col :span="5">
              <el-input clearable prefix-icon="el-icon-search" @input="searchList()" v-model.trim="queryParams.name" placeholder="Please enter a task name or site name"></el-input>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" @click="excelExport"><svg-icon style="width: 20px" icon-class="download"></svg-icon></el-button>
            </el-col>
          </el-row>
          <el-table style="margin-top: 20px" :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}"
                    v-loading="loading" :data="recordList"
          >
            <el-table-column label="No." align="center" width="60">
              <template slot-scope="scope">
                {{ (+queryParams.pageNum - 1) * (+queryParams.pageSize) + scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="Site Name" prop="siteName"></el-table-column>
            <el-table-column label="Upgrade Mode" prop="upgradeType">
              <template slot-scope="{row}">
                <span>{{['', 'Manual', 'Automatic'][+row.upgradeType]}}</span>
              </template>
            </el-table-column>
            <el-table-column label="Upgrade Version" prop="currentVersion">
              <template slot-scope="{row}">
                <span v-if="row.oldVersion && row.currentVersion">{{ row.oldVersion }}->{{row.currentVersion}}</span>
              </template>
            </el-table-column>
            <el-table-column label="Status" prop="status">
              <template slot-scope="{ row }">
                <span>{{ ['', 'Success', 'Fail', 'Upgrading'][+row.status] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Remarks" prop="remark"></el-table-column>
            <el-table-column label="Operation Time" prop="createTime">
              <template slot-scope="{row}">
                <span>{{DATE_FORMAT('M/d/yyyy hh:mm:ss', new Date(row.createTime))}}</span>
              </template>
            </el-table-column>
            <el-table-column label="Task Name" prop="name"></el-table-column>
            <el-table-column label="Agency" prop="agency"></el-table-column>
          </el-table>
          <pagination
            v-show="queryParams.total>0"
            :total="queryParams.total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getTaskRecord"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog :visible.sync="show" title="QTY of Site"
               :before-close="beforeClose"
               width="66%">
      <el-form :inline="true" @submit.native.prevent size="small">
        <el-row type="flex" justify="space-between" align="middle">
          <el-col :span="10">
            <el-form-item label="Site:">
              <el-input clearable @keyup.enter.native="getNumList" type="text" placeholder="Please enter" v-model.trim="numParams.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-button type="primary" size="mini" @click="getNumList">Query</el-button>
            <el-button size="mini" @click="resetGetNumList">Reset</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-form>
        <el-row>
          <el-col :span="5">
            <el-form-item label="Success:"><span style="color: #3EBCD4">{{ successNum }}</span></el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="Waiting:"><span style="color: #3EBCD4">{{ waitingNum }}</span></el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="Upgrading:"><span style="color: #3EBCD4">{{ upgradingNum }}</span></el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="Fail:"><span style="color: #3EBCD4">{{ failNum }}</span>  <el-link @click="againUpgradeTask" type="primary" style="margin-bottom: 3px">  Click here to Upgrade again</el-link></el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}"
               :data="numList"
      >
        <el-table-column label="No." align="center" width="60">
          <template slot-scope="scope">
            {{ (+numParams.pageNum - 1) * (+numParams.pageSize) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="Site Name" prop="siteName"></el-table-column>
        <el-table-column label="Logger SN" prop="sn">
          <template slot-scope="{row}">
            <span>{{ row.sn }}/{{['Off line', 'Online'][+row.net]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Upgrade Version" prop="currentVersion">
          <template slot-scope="{row}">
            <span v-if="row.oldVersion && row.currentVersion">{{ row.oldVersion }}->{{row.currentVersion}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Status" prop="status">
          <template slot-scope="{ row }">
            <span>{{ ['', 'Success', 'Fail', 'Upgrading', 'Waiting'][+row.status] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Operation Time" prop="createTime">
          <template slot-scope="{row}">
            <span>{{DATE_FORMAT('M/d/yyyy hh:mm:ss', new Date(row.createTime))}}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="numParams.total>0"
        :total="numParams.total"
        :page.sync="numParams.pageNum"
        :limit.sync="numParams.pageSize"
        @pagination="getNumList"
      />
      <common-flex justify="center" style="margin-top: 16px">
        <el-button @click="show = false">Cancel</el-button>
      </common-flex>
    </el-dialog>

    <el-dialog :visible.sync="addShow" title="Newly Upgrade Task"
               :before-close="beforeClose"
               width="66%">
      <el-form label-position="top" :model="addModal" :rules="rules" ref="addModal">
        <el-row>
          <el-col :span="8">
            <el-form-item label="Task Name" prop="name">
              <el-input maxlength="50" type="text" placeholder="Please enter" v-model.trim="addModal.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Remarks">
          <el-input maxlength="200" type="textarea" placeholder="Please enter" v-model.trim="addModal.remark"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="space-between">
        <strong>Upgrade List</strong>
        <div>
          <el-button type="primary" size="mini" @click="siteShow = true">Add</el-button>
          <el-button size="mini" @click="deleteSel">Delete</el-button>
        </div>
      </el-row>
      <el-table style="margin-top: 20px" :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}"
                :data="siteList" @selection-change="addSelect" max-height="460px"
      >
        <el-table-column
          v-if="deleteShow"
          type="selection"
          width="55" />
        <el-table-column label="No." type="index" align="center" width="60"></el-table-column>
        <el-table-column label="Site Name" prop="siteName"></el-table-column>
        <el-table-column label="Logger SN" prop="sn">
          <template slot-scope="{row}">
            <span>{{ row.serialNumber }}/{{['Off line', 'Online'][+row.net]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Operation" prop="createTime">
          <template slot-scope="{row}">
            <el-button type="text" @click="removeArrItem(row.id)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
      <common-flex justify="center" style="margin-top: 16px">
        <el-button :type="siteList.length ? 'primary' : ''" :disabled="!siteList.length" @click="addUpgrade">Upgrade</el-button>
        <el-button @click="closeAdd">Cancel</el-button>
      </common-flex>
    </el-dialog>

    <siteList v-if="siteShow" :show.sync="siteShow" @change="getSelectSite" :haveSiteList="siteList" />
  </div>
</template>

<script>
import {
  versionDetails,
  upgradeTaskList,
  upgradeTaskRecord,
  upgradeNum,
  againUpgrade,
  addUpgradeTask
} from '@/api/remote'
import siteList from './siteList'
let timer = null
export default {
  dicts: ['file_type'],
  name: "pages-remote-details",
  components: { siteList },
  data() {
    return {
      siteList: [],
      selected: [],
      siteShow: false,
      deleteShow: false,
      addModal: {
        name: '',
        remark: '',
        snList: [],
        versionId: ''
      },
      rules:{
        name: [
          { required: true, message: 'Please enter', trigger: 'blur'}
        ]
      },
      addShow: false,
      show: false,
      baseUrl: process.env.VUE_APP_BASE_API,
      id: '',
      activeName: '1',
      base: {},
      loading: false,
      taskList: [],
      recordList: [],
      numList: [],
      params: {
        versionId: '',
        total: 0,
        name: '',
        pageNum: 1,
        pageSize: 10
      },
      queryParams: {
        total: 0,
        name: '',
        pageNum: 1,
        pageSize: 10
      },
      upgradeNumber: [],
      numParams: {
        name: '',
        total: 0,
        pageNum: 1,
        pageSize: 10,
        taskCode: ''
      },
    }
  },
  computed: {
    //1-成功 2-失败 3-升级中 4-waiting
    successNum() {
      let item = this.upgradeNumber.find(i => +i.status === 1)
      return item ? item.num : 0
    },
    failNum() {
      let item = this.upgradeNumber.find(i => +i.status === 2)
      return item ? item.num : 0
    },
    upgradingNum() {
      let item = this.upgradeNumber.find(i => +i.status === 3)
      return item ? item.num : 0
    },
    waitingNum() {
      let item = this.upgradeNumber.find(i => +i.status === 4)
      return item ? item.num : 0
    },
  },
  mounted() {
    this.id = this.$route.params.id
    this.getVersionBase()
    this.getUpgradeTaskList()
  },
  methods: {
    closeAdd() {
      this.addShow = false
      this.addModal.name = ''
      this.addModal.remark = ''
      this.siteList = []
    },
    addUpgrade() {
      this.$refs.addModal.validate(v => {
        if (v) {
          let snList = []
          for (let i = 0; i < this.siteList.length; i++) {
            snList.push(this.siteList[i].serialNumber)
          }
          let data = {
            name: this.addModal.name,
            remarks: this.addModal.remark,
            snList,
            versionId: this.id
          }
          addUpgradeTask(data).then(res => {
            if (+res.code === 200) {
              this.$modal.msgSuccess('Succeed')
              this.getUpgradeTaskList()
              this.closeAdd()
            }
          })
        }
      })
    },
    deleteSel() {
      this.deleteShow = !this.deleteShow
      if (this.selected.length) {
        for (let i = 0; i < this.selected.length; i++) {
          this.removeArrItem(this.selected[i].id)
        }
      }
    },
    removeArrItem(id) {
      this.siteList = this.siteList.filter(i => i.id !== id)
    },
    getSelectSite(v) {
      this.siteList = [...this.siteList, ...v]
      this.siteList = this.removeDuplicateObj(this.siteList)
    },
    // 去重
    removeDuplicateObj(arr) {
      let obj = {}
      arr = arr.reduce((newArr, next) => {
        if (obj[next.id]) {}
        else {
          obj[next.id] = true
          newArr.push(next)
        }
        return newArr
      }, [])
      return arr
    },
    addSelect(v) {
      this.selected = v
    },
    againUpgradeTask() {
      let data = {
        taskCode: this.numParams.taskCode
      }
      againUpgrade(data).then(res => {
        if (+res.code === 200) {
          this.$modal.msgSuccess('Succeed')
          this.getNumList()
          this.getUpgradeNum()
        }
      })
    },
    resetGetNumList() {
      this.numParams.name = ''
      this.getNumList()
    },
    beforeClose() {
      this.show = false
    },
    searchList() {
      clearTimeout(timer)
      timer = setTimeout(() => {
        if (+this.activeName === 1) this.getUpgradeTaskList()
        else this.getTaskRecord()
      }, 1000)
    },
    handleClick() {
      if (+this.activeName === 2) {
        this.queryParams.pageSize = 10
        this.queryParams.pageNum = 1
        this.getTaskRecord()
      } else {
        this.params.pageNum = 1
        this.params.pageSize = 10
        this.getUpgradeTaskList()
      }
    },
    getTaskRecord() {
      this.loading = true
      upgradeTaskRecord({...this.queryParams, versionId: this.id }).then(res => {
        this.recordList = res.rows
        this.queryParams.total = res.total
        this.loading = false
      })
    },
    getUpgradeTaskList() {
      this.loading = true
      upgradeTaskList(this.params).then(res => {
        this.taskList = res.rows
        this.params.total = res.total
        this.loading = false
      })
    },
    getNumList() {
      upgradeTaskRecord({...this.numParams, versionId: this.id }).then(res => {
        this.numList = res.rows
        this.numParams.total = res.total
        this.show = true
      })
    },
    lookNum(code) {
      this.numParams.taskCode = code
      this.getNumList()
      this.getUpgradeNum()
    },
    getUpgradeNum() {
      let data = {
        taskCode: this.numParams.taskCode
      }
      upgradeNum(data).then(res => {
        this.upgradeNumber = res.data
      })
    },
    getVersionBase() {
      versionDetails(this.id).then(res => {
        this.base = res.data
      })
    },
    excelExport() {
      let data = {
        versionId: this.id
      }
      this.download('/upgradeTask/export', {
        ...data
      }, `upgrade_${new Date().getTime()}.xlsx`)
    },
  }
}
</script>

<style lang="scss">
.pages-remote-details {

}
</style>
