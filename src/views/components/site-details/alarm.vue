<template>
  <div class="comp-alarm">
    <el-card>
      <el-form :inline="true" :model="queryParams" label-width="100px" ref="queryForm" size="small">
        <common-flex>
          <common-flex style="flex-grow: 1">
            <el-form-item label="Importance：" prop="type">
              <el-select placeholder="All" v-model="queryParams.type">
                <el-option v-for="i of impOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Status：" prop="recoveryStatus">
              <el-select placeholder="All" v-model="queryParams.recoveryStatus">
                <el-option v-for="i of statusOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
              </el-select>
            </el-form-item>
          </common-flex>
          <el-form-item>
            <el-button size="small" type="primary" @click="handleQuery">Query</el-button>
            <el-button size="small" @click="resetQuery">Reset</el-button>
          </el-form-item>
        </common-flex>
      </el-form>
    </el-card>
    <el-card style="margin-top: 24px; padding-bottom: 20px">
      <p>Alarm List</p>
      <el-table :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}"
                v-loading="loading" :data="list"
      >
        <el-table-column label="No" align="center" width="60">
          <template slot-scope="scope">
            {{ (+queryParams.pageNum - 1) * (+queryParams.pageSize) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="Alarm" prop="fault" min-width="180" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span v-if="row.deviceErrorInfo">{{ row.deviceErrorInfo }}：</span>
            <span>{{ row.fault || '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Fault code" prop="faultCode"></el-table-column>
        <el-table-column label="SN" prop="sn"></el-table-column>
        <el-table-column label="Importance" prop="type" width="120">
          <template slot-scope="{ row }"><span>{{ ['--', 'Warning', 'Fault', 'Notice'][+row.type] }}</span></template>
        </el-table-column>
        <el-table-column label="Status" prop="recoveryStatus" width="120">
          <template slot-scope="{ row }"><span>{{ ['Open', 'Closed'][+row.recoveryStatus] }}</span></template>
        </el-table-column>
        <el-table-column label="Alarm Start Time" prop="createTime" min-width="160">
          <template slot-scope="{ row }">
            <span v-if="row.createTime && row.createTime !== '--'">{{ UTC_DATE_FORMAT(+row.createTime , base.timeZone) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="Alarm Recovery Time" prop="" min-width="160">
          <template slot-scope="{ row }">
            <span v-if="row.recoveryTime && row.recoveryTime !== '--'">{{ UTC_DATE_FORMAT(+row.recoveryTime , base.timeZone) }}</span>
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
import { alarmList } from '@/api/site'
export default {
  name: "comp-alarm",
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
      total: 0,
      loading: false,
      list: [],
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
      ],
      statusOptions: [
        {
          label: 'Open',
          value: 0
        },
        {
          label: 'Closed',
          value: 1
        },
      ],
      queryParams: {
        siteCode: '',
        pageNum: 1,
        pageSize: 10,
        type: '',
        recoveryStatus: ''
      }
    }
  },
  watch: {
    base: {
      handler(v) {
        this.queryParams.siteCode = this.$route.query?.siteCode
        this.getList()
      },
      immediate: true
    }
  },
  methods: {
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    getList() {
      this.loading = true
      alarmList(this.queryParams).then(res => {
        this.list = res.rows;
        this.total = res.total;
        this.loading = false
      })
    },
    resetQuery() {
      this.resetForm("queryForm")
      this.handleQuery()
    },
  }
}
</script>

<style lang="scss">
.comp-alarm {
  p {
    font-weight: 600;
  }
}
</style>
