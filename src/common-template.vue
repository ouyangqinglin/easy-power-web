<template>
  <div class="pages-common-template app-container">
    <el-card>
      <el-form :inline="true" :model="queryParams" label-width="100px" ref="queryForm" size="small">
        <common-flex>
          <common-flex style="flex-grow: 1">
            <el-form-item label="Importance：" prop="importance">
              <el-select placeholder="All" v-model="queryParams.importance">
                <el-option v-for="i of queryParams.impOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Status：" prop="status">
              <el-select placeholder="All" v-model="queryParams.status">
                <el-option v-for="i of queryParams.statusOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
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
      <p>Alarm List</p>
      <el-table :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}"
                v-loading="loading" :data="list"
      >
        <el-table-column label="No." type="index" />
        <el-table-column label="Alarm" prop=""></el-table-column>
        <el-table-column label="Importance" prop=""></el-table-column>
        <el-table-column label="Status" prop=""></el-table-column>
        <el-table-column label="Alarm Start Time" prop="">
          <template slot-scope="{ row }">
            <span v-if="row.updateTime && row.updateTime !== '--'">{{ DATE_FORMAT('M/d/yyyy hh:mm', +row.updateTime*1000) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="Alarm Recovery Time" prop="">
          <template slot-scope="{ row }">
            <span v-if="row.updateTime && row.updateTime !== '--'">{{ DATE_FORMAT('M/d/yyyy hh:mm', +row.updateTime*1000) }}</span>
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
export default {
  name: "pages-common-template",
  data() {
    return {
      total: 0,
      loading: false,
      list: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        importance: '',
        status: '',
        impOptions: [
          {
            label: 'Warning',
            value: '0'
          },
          {
            label: 'Fault',
            value: '1'
          },
        ],
        statusOptions: [
          {
            label: 'Open',
            value: '0'
          },
          {
            label: 'Closed',
            value: '1'
          },
        ],
      }
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
    },
  }
}
</script>

<style lang="scss">
.pages-common-template {
  p {
    font-weight: 600;
  }
}
</style>
