<template>
  <div class="pages-fault app-container">
    <el-card class="pages-fault-card pane">
      <el-tabs v-model="queryParams.recoveryStatus" @tab-click="getList()">
        <el-tab-pane name="0" label="Active Fault"></el-tab-pane>
        <el-tab-pane name="1" label="Fault History"></el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card style="margin-top: 24px">
      <el-form :inline="true" :model="queryParams" label-width="100px" ref="queryForm" size="small">
        <el-row :gutter="1">
          <el-col :span="7">
            <el-form-item label="Alarm：" prop="fault">
              <el-input @keyup.enter.native="handleQuery" placeholder="Please enter" v-model="queryParams.fault"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="160px" label="Fault Code：" prop="faultCode">
              <el-input @keyup.enter.native="handleQuery" placeholder="Please enter" v-model="queryParams.faultCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Site Name：" prop="siteName">
              <el-input @keyup.enter.native="handleQuery" placeholder="Please enter" v-model="queryParams.siteName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-button type="primary" @click="handleQuery">Query</el-button>
              <el-button @click="resetQuery">Reset</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="1">
          <el-col :span="7">
            <el-form-item label="Importance：" prop="type">
              <el-select placeholder="All" v-model="queryParams.type">
                <el-option v-for="i of impOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label-width="160px" placeholder="Please select" label="Occurrence Time：" prop="createTime">
              <el-date-picker
                clearable
                v-model="queryParams.createTime"
                type="date"
                format="M/d/yyyy"
                value-format="yyyy-M-d"
                placeholder="Please select">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card style="margin-top: 24px">
      <p>Alarm List</p>
<!--      <el-table-->
<!--        class="my-expanded"-->
<!--        ref="multipleTable"-->
<!--        @row-click="rowClick"-->
<!--        :data="list"-->
<!--        style="width: 100%">-->
<!--        <el-table-column type="expand">-->
<!--          <template slot-scope="props">-->
<!--            <el-form label-position="left" inline class="demo-table-expand">-->
<!--              <el-form-item label="商品名称">-->
<!--                <span>{{ props.row.name }}</span>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="所属店铺">-->
<!--                <span>{{ props.row.shop }}</span>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="商品 ID">-->
<!--                <span>{{ props.row.id }}</span>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="店铺 ID">-->
<!--                <span>{{ props.row.shopId }}</span>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="商品分类">-->
<!--                <span>{{ props.row.category }}</span>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="店铺地址">-->
<!--                <span>{{ props.row.address }}</span>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="商品描述">-->
<!--                <span>{{ props.row.desc }}</span>-->
<!--              </el-form-item>-->
<!--            </el-form>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--      </el-table>-->
      <el-table :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}"
                v-loading="loading" :data="list"
      >
        <el-table-column label="No" align="center" width="60">
          <template slot-scope="scope">
            {{ (+queryParams.pageNum - 1) * (+queryParams.pageSize) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="Site Name" prop="siteName" min-width="120">
          <template slot-scope="{ row }">
            <span style="color: #3EBCD4">{{ row.siteName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Device" prop="deviceErrorInfo">
          <template slot-scope="{row}">
            <span>{{ deviceType[+row.deviceType] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Device SN" prop="sn" show-overflow-tooltip min-width="120" />
        <el-table-column label="Alarm" prop="fault" min-width="180" show-overflow-tooltip />
        <el-table-column label="Importance" prop="type" width="120">
          <template slot-scope="{ row }"><span>{{ ['--', 'Warning', 'Fault', 'Notice'][+row.type] }}</span></template>
        </el-table-column>
        <el-table-column label="Fault code" prop="faultCode" min-width="120" />
        <el-table-column label="Collection Source" prop="collectionSource" min-width="140" />
        <el-table-column label="Source SN" prop="sn" show-overflow-tooltip min-width="120" />
        <el-table-column label="Status" prop="recoveryStatus" width="120">
          <template slot-scope="{ row }"><span>{{ ['Open', 'Closed'][+row.recoveryStatus] }}</span></template>
        </el-table-column>
        <el-table-column label="Occurrence Time" prop="createTime" min-width="160">
          <template slot-scope="{ row }">
            <span v-if="row.createTime && row.createTime !== '--'">{{ DATE_FORMAT('M/d/yyyy hh:mm', +row.createTime*1000) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column v-if="+queryParams.recoveryStatus === 1" label="Recovery Time" prop="recoveryTime" min-width="160">
          <template slot-scope="{ row }">
            <span v-if="row.recoveryTime && row.recoveryTime !== '--'">{{ DATE_FORMAT('M/d/yyyy hh:mm', +row.recoveryTime*1000) }}</span>
            <span v-else>--</span>
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
import {alarmList} from "@/api/site";

let storage_id = ''
export default {
  name: "pages-fault",
  data() {
    return {
      deviceType: {
        '1': 'Inverter',
        '2': 'Battery',
        '3': 'EV Charger',
        '4': 'Stick Logger',
        '6': 'Photovoltaic'
      },
      total: 0,
      loading: false,
      list: [],
      queryParams: {
        siteName: '',
        fault: '',
        faultCode: '',
        createTime: '',
        recoveryStatus: 0,
        pageNum: 1,
        pageSize: 10,
        type: '',
        status: ''
      },
      impOptions: [
        {
          label: "Warning",
          value: 1,
        },
        {
          label: "Fault",
          value: 2,
        },
        {
          label: "Notice",
          value: 3,
        },
      ]
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
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
      let timestamp = {
        createTime: new Date(this.queryParams.createTime).getTime() / 1000,
        startTime: new Date((`${this.queryParams.createTime} 00:00:00`)).getTime() / 1000,
        endTime: new Date((`${this.queryParams.createTime} 23:59:59`)).getTime() / 1000
      }
      let data = {
        ...this.queryParams, ...timestamp
      }
      let params
      params = this.queryParams.createTime ? data : this.queryParams
      alarmList(params).then(res => {
        this.list = res.rows
        this.total = res.total
        this.loading = false
      })
    },
    rowClick(row){
      //第二个参数是布尔值
      if (storage_id) {
        if (storage_id !== row.id) {
          let item = this.list.find(i => i.id === storage_id)
          this.$refs.multipleTable.toggleRowExpansion(item, false)
          this.$refs.multipleTable.toggleRowExpansion(row, row.listStatus)
          storage_id = row.id
        } else  {
          this.$refs.multipleTable.toggleRowExpansion(row, !row.listStatus)
          row.listStatus = !row.listStatus
        }
      } else {
        storage_id = row.id
        this.$refs.multipleTable.toggleRowExpansion(row, row.listStatus)
      }
      this.list.forEach( i => {
        if (row.id === i.id) {}
        else i.listStatus = true
      })
    }
  }
}
</script>

<style lang="scss">
.pages-fault {
  &-card {
    padding-bottom: 20px;
    &-title {
      margin-bottom: 25px;
      font-weight: 700;
    }
  }
  .pane {
    padding-bottom: 0;
    .el-tabs__nav-wrap {
      &:after {
        background-color: #fff;
      }
    }
    .el-card__body {
      padding-bottom: 0;
    }
  }
  p {
    font-weight: 600;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .my-expanded {
    .el-table__expand-icon {
      display: none;
    }
  }
}
</style>
