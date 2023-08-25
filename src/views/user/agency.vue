<template>
  <div class="pages-user-agency app-container">
    <el-card class="pages-user-agency-card pane">
      <el-form :model="queryParams" :inline="true" ref="queryForm" label-width="120px">
        <common-flex>
          <el-form-item label="Agency:" prop="agency">
            <el-input
              class="same-input"
              v-model="queryParams.agency"
              placeholder="Please enter"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="Agency Code:" prop="agencyCode">
            <el-input
              class="same-input"
              v-model="queryParams.agencyCode"
              placeholder="Please enter"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="Status:" prop="status">
            <el-select
              class="same-input"
              v-model="queryParams.status"
              placeholder="All"
              clearable
              @keyup.enter.native="handleQuery"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-form-item>
          <common-flex style="flex-grow: 1; flex-shrink: 0" justify="flex-end" align="flex-end">
            <el-form-item>
              <el-button type="primary" @click="handleQuery">Query</el-button>
              <el-button @click="resetQuery">Reset</el-button>
            </el-form-item>
          </common-flex>
        </common-flex>
      </el-form>
    </el-card>
    <el-card class="pages-user-agency-card">
      <common-flex justify="space-between">
        <div class="pages-user-agency-card-title">Agency List</div>
        <div>
          <el-button v-hasPermi="['ati:user:agency:add']" type="primary" @click="openToast(1)">Add</el-button>
        </div>
      </common-flex>
      <el-table v-loading="loading" :data="agencyList"
                :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}">
        <el-table-column label="No" align="center" width="60">
          <template slot-scope="scope">
            {{ (+queryParams.pageNum - 1) * (+queryParams.pageSize) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="Agency" align="center" prop="agency" min-width="120" show-overflow-tooltip />
        <el-table-column label="Agency Code" align="center" prop="agencyCode" min-width="120"/>
        <el-table-column label="Status" align="center" prop="status">
          <template slot-scope="{ row }">
            <span v-if="row.status && row.status !== '--'">{{ ['--', 'Valid', 'Invalid'][+row.status] }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="Remarks" align="center" prop="remark" show-overflow-tooltip></el-table-column>
        <el-table-column label="Creation Time" align="center" prop="createTime" min-width="160">
          <template slot-scope="{ row }">
            <span v-if="row.createTime && row.createTime !== '--'">{{ DATE_FORMAT('M/d/yyyy hh:mm:ss', +row.createTime*1000) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="Created by" align="center" prop="createBy" min-width="120" />
        <el-table-column label="Last update Time" align="center" prop="updateTime" min-width="160">
          <template slot-scope="{ row }">
            <span v-if="row.updateTime && row.updateTime !== '--'">{{ DATE_FORMAT('M/d/yyyy hh:mm:ss', +row.updateTime*1000) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="Last updated by" align="center" prop="updateBy" min-width="120" />
        <el-table-column label="Opreat" align="center" fixed="right" class-name="small-padding fixed-width" min-width="120">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="openToast(0, scope.row)"
              v-hasPermi="['ati:user:agency:edit']"
            >Modify</el-button>
            <el-button
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['ati:user:agency:remove']"
            >Delete</el-button>
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
    <AccountAdd v-if="show" :show.sync="show" :type="type" :item="modifyItem" @refresh="getList" />
  </div>
</template>

<script>
import AccountAdd from '@/views/components/user/agency-add'
import { delAtiAgency, getAgencyList } from "@/api/agency"

export default {
  name: "pages-agency",
  components: { AccountAdd },
  data() {
    return {
      type: '',
      modifyItem: {},
      agencyList: [],
      loading: true,
      show: false,
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        agency: null,
        agencyCode: null,
        status: null
      },
      options: [
        {
          value: '1',
          label: 'Valid'
        },
        {
          value: '2',
          label: 'Invalid'
        },
      ],
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    openToast(flag, item) {
      if (flag) this.type = 'add'
      else this.type = 'modify'
      this.show = true
      if (item) this.modifyItem = item
      else this.modifyItem = {}
    },
    handleDelete(row) {
      const ids = row.id
      this.$modal.confirm('Please confirm whether to delete').then(() => {
        this.$modal.loading()
        return delAtiAgency(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("Deleted!")
      }).finally(() => this.$modal.closeLoading())
    },
    getList() {
      this.loading = true;
      getAgencyList(this.queryParams).then(response => {
        response.rows.forEach(i => {
          Object.keys(i).forEach(k => {
            if (!i[k]) i[k] = '--'
          })
        })
        this.agencyList = response.rows
        this.total = response.total
        this.loading = false
      });
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
  }
}
</script>

<style lang="scss">
.pages-user-agency {
  &-card {
    margin-bottom: 24px;
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
      //padding-bottom: 0;
    }
  }
  .el-radio__label {
    display: none;
  }
  .same-input {
    .el-input__inner {
      width: 230px;
      @media screen and (max-width: 1334px) {
        width: 130px;
      }
    }
  }
}
</style>
