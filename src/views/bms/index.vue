<template>
  <div class="pages-bms app-container">
    <el-card>
      <el-form :inline="true" :model="queryParams" label-width="100px" ref="queryForm">
        <common-flex>
          <common-flex style="flex-grow: 1">
            <el-form-item label="SN：" prop="sn">
              <el-input placeholder="Please enter" v-model="queryParams.sn"></el-input>
            </el-form-item>
            <el-form-item label="Site：" prop="siteName">
              <el-input placeholder="Please enter" v-model="queryParams.siteName"></el-input>
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
        <el-table-column label="No." type="index">
          <template slot-scope="scope">
            {{ (+queryParams.pageNum - 1) * (+queryParams.pageSize) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="SN" prop="sn"></el-table-column>
        <el-table-column label="Capacity(kWh)" prop="capacity"></el-table-column>
        <el-table-column label="Site" prop="siteName"></el-table-column>
        <el-table-column fixed="right" label="Operat" align="center" class-name="small-padding fixed-width" min-width="100">
          <template slot-scope="scope">
            <el-button type="text">
              <router-link :to="`/bms/monitoring/${scope.row.id}`">Monitoring</router-link>
            </el-button>
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
  name: "pages-Monitoring",
  data() {
    return {
      total: 0,
      loading: false,
      list: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sn: '',
        siteName: '',
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
      // this.loading = true
    },
  }
}
</script>

<style lang="scss">
.pages-bms {
  p {
    font-weight: 600;
  }
}
</style>
