<template>
  <div class="pages-alarm app-container">
    <el-card>
      <el-form
        :inline="true"
        :model="queryParams"
        label-width="100px"
        ref="queryForm"
      >
        <common-flex>
          <common-flex style="flex-grow: 1">
            <el-form-item label="Importance：" prop="importance">
              <el-select
                clearable
                v-model="queryParams.type"
                placeholder="All"
                @keyup.enter.native="handleSearch"
              >
                <el-option
                  v-for="item in impOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Status：" prop="status">
              <el-select
                clearable
                v-model="queryParams.recoveryStatus"
                placeholder="All"
                @keyup.enter.native="handleSearch"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="SN：" prop="sn">
              <el-input
                clearable
                placeholder="Please enter"
                v-model="queryParams.sn"
              ></el-input>
            </el-form-item>
          </common-flex>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">Search</el-button>
            <el-button @click="resetSearch">Reset</el-button>
          </el-form-item>
        </common-flex>
      </el-form>
    </el-card>
    <el-card style="margin-top: 24px">
      <p>Alarm List</p>
      <el-table
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
        v-loading="loading"
        :data="alarmList"
      >
        <el-table-column label="No." type="index">
          <template slot-scope="scope">
            {{
              (+queryParams.pageNum - 1) * +queryParams.pageSize +
              scope.$index +
              1
            }}
          </template>
        </el-table-column>
        <el-table-column label="SN" prop="sn"></el-table-column>
        <el-table-column label="Fault code" prop="faultCode"></el-table-column>
        <el-table-column label="Alarm" prop="fault"></el-table-column>
        <el-table-column label="Importance" prop="type">
          <template slot-scope="{ row }">
            <dict-tag :options="dict.type.importance_state" :value="row.type" />
          </template>
        </el-table-column>
        <el-table-column label="Status" prop="recoveryStatus">
          <template slot-scope="{ row }">
            <dict-tag
              :options="dict.type.recovery_status"
              :value="row.recoveryStatus"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="Site"
          prop="siteName"
          min-width="130"
        ></el-table-column>
        <el-table-column
          label="Alarm Start Time"
          prop="createTime"
          min-width="100"
        >
          <template slot-scope="{ row }">
            <span v-if="row.createTime && row.createTime !== '--'">{{ DATE_FORMAT('M/d/yyyy hh:mm:ss', +row.createTime * 1000) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Alarm Recovery Time"
          prop="recoveryTime"
          min-width="100"
        >
          <template slot-scope="{ row }">
            <span v-if="row.recoveryTime && row.recoveryTime !== '--'">{{ DATE_FORMAT('M/d/yyyy hh:mm:ss', +row.recoveryTime * 1000) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getAlarmList"
      />
    </el-card>
  </div>
</template>

<script>
import { getList } from "@/api/bms";
export default {
  name: "pages-alarm",
  dicts: ["importance_state", "recovery_status"],
  data() {
    return {
      total: 0,
      // 遮罩层
      loading: false,
      // 告警列表
      alarmList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: "",
        recoveryStatus: "",
        sn: "",
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
      ],
      statusOptions: [
        {
          label: "Open",
          value: 0,
        },
        {
          label: "Closed",
          value: 1,
        },
      ],
    };
  },
  created() {
    this.getAlarmList();
  },
  methods: {
    // 查询告警列表
    getAlarmList() {
      this.loading = true;
      getList(this.queryParams).then((response) => {
        response.rows.forEach((i) => {
          Object.keys(i).forEach((k) => {
            if (k !== "recoveryStatus" && !i[k]) i[k] = "--";
          });
        });
        this.alarmList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 查询
    handleSearch() {
      this.queryParams.pageNum = 1;
      this.getAlarmList();
    },
    // 重置
    resetSearch() {
      this.queryParams.type = "";
      this.queryParams.recoveryStatus = "";
      this.queryParams.sn = "";
      this.handleSearch();
    },
  },
};
</script>

<style lang="scss">
.pages-alarm {
  p {
    font-weight: 600;
  }
}
</style>
