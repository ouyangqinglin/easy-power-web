<template>
  <div class="pages-bms app-container">
    <el-card>
      <el-form :inline="true" :model="queryParams" label-width="100px" ref="queryForm">
        <common-flex>
          <common-flex style="flex-grow: 1">
            <el-form-item label="SN：" prop="serialNumber">
              <el-input clearable placeholder="Please enter" @keyup.enter.native="handleQuery" v-model="queryParams.serialNumber"></el-input>
            </el-form-item>
            <el-form-item label="Site：" prop="siteName">
              <el-input clearable placeholder="Please enter" @keyup.enter.native="handleQuery" v-model="queryParams.siteName"></el-input>
            </el-form-item>
            <el-form-item label="Follow：" prop="followBms">
              <el-select clearable v-model="queryParams.followBms" placeholder="Please select">
                <el-option v-for="i of followOption" :value="i.value" :label="i.label" :key="i.value"></el-option>
              </el-select>
            </el-form-item>
          </common-flex>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">Query</el-button>
            <el-button @click="resetQuery">Reset</el-button>
          </el-form-item>
        </common-flex>
      </el-form>
    </el-card>
    <el-card style="margin-top: 24px">
      <p>List</p>
      <el-table :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}"
                v-loading="loading" :data="list"
      >
        <el-table-column label="No." type="index">
          <template slot-scope="scope">
            {{ (+queryParams.pageNum - 1) * (+queryParams.pageSize) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="SN" prop="serialNumber"></el-table-column>
        <el-table-column label="Capacity(kWh)" prop="nameplateCapacity"></el-table-column>
        <el-table-column label="Site" prop="siteName" show-tooltip-when-overflow>
          <template slot-scope="{ row }">
            <span>{{ row.siteName }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" class-name="small-padding fixed-width" min-width="100">
          <common-flex justify="center" align="center" slot="header">
            <span>Operat</span>
            <el-tooltip effect="dark" placement="top">
              <span slot="content">
                Click 'Follow' to retain the collected real-time data<br>
                of battery cells and temperature; Cancel 'Follow' and<br>
                only view battery cells and temperature real-time data<br>
                and data retained during historical follow periods.<br>
                Regardless of whether it is' followed 'or not,the data <br>
                viewing ofthe battery pack is not affected
              </span>
              <img style="width: 18px; margin-left: 14px" :src="require('@img/question.svg')" alt="">
            </el-tooltip>
          </common-flex>
          <template slot-scope="scope">
            <common-flex justify="center" align="center">
              <router-link :to="{name: 'monitoring-view', params: {id: scope.row.id, info: scope.row.extInfo, sn: scope.row.serialNumber, siteCode: scope.row.siteCode}}">
                <el-button type="text">Monitoring</el-button>
              </router-link>
              <img @click="follow(2, scope.row.id)" v-if="+scope.row.followBms === 1" class="follow" :src="require('@img/followed.svg')" alt="">
              <img title="Follow" @click="follow(1, scope.row.id)" v-else class="follow" :src="require('@img/follow.svg')" alt="Follow">
            </common-flex>
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
  </div>
</template>

<script>
import { listDevice, editDevice } from '@/api/device'

export default {
  name: "pages-Monitoring",
  data() {
    return {
      total: 0,
      loading: false,
      list: [],
      queryParams: {
        deviceType: '2',
        pageNum: 1,
        pageSize: 10,
        serialNumber: '',
        siteName: '',
        followBms: null
      },
      followOption: [
        {
          label: 'All battery',
          value: '',
        },
        {
          label: 'Battery i followed',
          value: 1,
        },
      ]
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    follow(type, id) {
      let data = {
        followBms: type,
        id
      }
      if (type === 2) {
        this.$modal.confirm(`Please confirm whether to cancel`).then(() => {
          this.changeFollow(data)
        })
      } else this.changeFollow(data)
    },
    changeFollow(data) {
      this.$modal.loading()
      editDevice(data).then(res => {
        this.$modal.msgSuccess("Succeeded!")
      }).finally(() => {
        this.$modal.closeLoading()
        this.getList()
      })
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    resetQuery() {
      this.resetForm("queryForm")
      this.handleQuery()
    },
    getList() {
      this.loading = true
      listDevice(this.queryParams).then(res => {
        this.list = res.rows
        this.total = res.total
      }).finally(() => this.loading = false)
    },
  }
}
</script>

<style lang="scss">
.pages-bms {
  p {
    font-weight: 600;
  }
  .follow {
    margin-left: 20px;
    width: 16px;
    cursor: pointer;
  }
}
</style>
