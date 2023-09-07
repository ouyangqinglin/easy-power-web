<template>
  <div class="app-container pages-site">
    <el-card class="pages-site-header" >
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-row>
          <el-col :span="6">
            <el-form-item label="Site Name：" prop="siteName">
              <el-input
                v-model="queryParams.siteName"
                placeholder="Please enter"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Site Code：" prop="siteCode">
              <el-input
                v-model="queryParams.siteCode"
                placeholder="Please enter"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="Local time：">
              <el-date-picker
                clearable
                v-model="queryTime"
                type="date"
                format="M/d/yyyy"
                value-format="yyyy-MM-dd"
                placeholder="">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="Communication Module：" prop="loggerExist" label-width="200px">
              <el-select v-model="queryParams.loggerExist" placeholder="All">
                <el-option v-for="i of boundOption" :label="i.label" :value="i.value" :key="i.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form :inline="true" size="small">
        <el-row type="flex" justify="space-between">
          <el-col :span="20">
            <el-form-item class="region" label="Region：" prop="province">
              <el-select
                :disabled="!(queryParams.province && queryParams.country)"
                v-model="queryParams.city"
                placeholder="Please Select City"
                clearable
                @keyup.enter.native="handleQuery"
              >
                <el-option
                  v-for="(item, index) in cityOption"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
              <el-select
                :disabled="!queryParams.country"
                v-model="queryParams.province"
                placeholder="Please Select province"
                clearable
                @keyup.enter.native="handleQuery"
              >
                <el-option
                  v-for="(item, index) in provinceOption"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
              <el-select
                v-model="queryParams.country"
                class="area-select"
                placeholder="Please Select Country/Area"
                clearable
                @keyup.enter.native="handleQuery"
              >
                <el-option
                  v-for="(item, index) in countryOption"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <common-flex justify="flex-end">
              <el-button type="primary" @click="handleQuery">Query</el-button>
              <el-button @click="resetQuery">Reset</el-button>
            </common-flex>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <div style="height: 20px"></div>
    <el-card>
      <div class="table-title">Site List</div>
      <el-table v-loading="loading" :data="siteList" @selection-change="handleSelectionChange">
        <el-table-column label="No" align="center" width="60">
          <template slot-scope="scope">
            {{ (+queryParams.pageNum - 1) * (+queryParams.pageSize) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="Site Name" align="center" prop="siteName" min-width="140" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.siteName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Site Code" align="center" prop="siteCode" min-width="130" />
        <el-table-column label="Installation Status" align="center" prop="status" min-width="140">
          <template slot-scope="{ row }">
            <dict-tag :options="dict.type.site_status" :value="row.status" />
          </template>
        </el-table-column>
        <el-table-column label="Communication Module" align="center" prop="" min-width="180">
          <template slot-scope="{ row }">
            <span>{{['Unbound', 'Bound'][+row.loggerExist]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="City" align="center" prop="city" show-overflow-tooltip />
        <el-table-column label="Province" align="center" prop="province" min-width="120" show-overflow-tooltip />
        <el-table-column label="Country/Area" align="center" prop="country" min-width="140" show-overflow-tooltip />
        <el-table-column label="Time of Installed" align="center" prop="createTime" min-width="130">
          <template slot-scope="{ row }">
            <span v-if="row.createTime && row.createTime !== '--'">{{ UTC_DATE_FORMAT(+row.createTime, row.timeZone) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="Local time" align="center" prop="createTime" min-width="140">
          <template slot-scope="{ row }">
            <span v-if="row.createTime && row.createTime !== '--'">{{ DATE_FORMAT('M/d/yyyy hh:mm', +row.createTime * 1000) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="Agency" align="center" prop="agentName" min-width="140" show-overflow-tooltip />
        <el-table-column label="Last update Time" align="center" prop="updateTime" min-width="130">
          <template slot-scope="{ row }">
            <span v-if="row.updateTime && row.updateTime !== '--'">{{ UTC_DATE_FORMAT(+row.updateTime, row.timeZone) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="Last update by" align="center" prop="updateBy" min-width="140" show-overflow-tooltip />
        <el-table-column fixed="right" label="Operat" align="center" class-name="small-padding fixed-width" min-width="130">
          <template slot-scope="scope">
            <el-button
              type="text"
            >
              <router-link v-hasPermi="['ati:site:view']" :to="`/site/details/${scope.row.id}?siteCode=${scope.row.siteCode}`">Detail</router-link>
            </el-button>
            <el-button
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['ati:site:remove']"
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
  </div>
</template>

<script>
import { listSite, getAddress, delSite, addSite, updateSite } from "@/api/site"

export default {
  name: "pages-site",
  dicts: ['site_status'],
  data() {
    return {
      queryTime: '',
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 站点表格数据
      siteList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      boundOption: [
        {
          label: 'Bound',
          value: 1
        },
        {
          label: 'Unbound',
          value: 0
        },
      ],
      // 查询参数
      queryParams: {
        startTime: '',
        endTime: '',
        loggerExist: '',
        pageNum: 1,
        pageSize: 10,
        siteName: null,
        address: null,
        siteCode: null,
        nickName: null,
        country: null,
        city: null,
        province: null
      },
      countryOption: [],
      provinceOption: [],
      cityOption: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      optionsParams: {
        pageNum: '1',
        pageSize: '100',
        country: '', // 示例值：1 国家
        province: '', // 2 省
        city: '', // 2 城市
      }
    };
  },
  watch: {
    queryTime(v) {
      if (!v) this.queryParams.startTime = this.queryParams.endTime = ''
    },
    'queryParams.country': {
      handler(v) {
        this.optionsParams.country = v
        this.optionsParams.province = this.optionsParams.city = this.queryParams.province = this.queryParams.city = ''
        this.getAddressOption()
      },
    },
    'queryParams.province': {
      handler(v) {
        this.optionsParams.province = v
        this.optionsParams.city = this.queryParams.city = ''
        this.getAddressOption()
      },
    }
  },
  created() {
    this.getList()
    this.getAddressOption()
  },
  methods: {
    getAddressOption() {
      getAddress(this.optionsParams).then(res => {
        if (!this.optionsParams.country) {
          this.countryOption = []
          res.rows.forEach(i => {
            let obj = {
              label: i.country,
              value: i.country,
            }
            this.countryOption.push(obj)
          })
          return
        }
        if (!this.optionsParams.province) {
          this.provinceOption = []
          res.rows.forEach(i => {
            let obj = {
              label: i.province,
              value: i.province,
            }
            this.provinceOption.push(obj)
          })
          return
        }
        if (!this.optionsParams.city) {
          this.cityOption = []
          res.rows.forEach(i => {
            let obj = {
              label: i.city,
              value: i.city,
            }
            this.cityOption.push(obj)
          })
        }
      })
    },
    /** 查询站点列表 */
    getList() {
      if (this.queryTime) {
        this.queryParams.startTime = new Date((`${this.queryTime} 00:00:00`)).getTime() / 1000
        this.queryParams.endTime = new Date((`${this.queryTime} 23:59:59`)).getTime() / 1000
      }
      this.loading = true;
      listSite(this.queryParams).then(response => {
        response.rows.forEach(i => {
          Object.keys(i).forEach(k => {
            if (!i[k] && k !== 'loggerExist') i[k] = '--'
          })
        })
        this.siteList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        siteName: null,
        address: null,
        siteCode: null,
        country: null,
        city: null,
        province: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.country = this.queryParams.province = this.queryParams.city = null
      this.queryTime = ''
      this.queryParams.startTime = this.queryParams.endTime = ''
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加站点";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateSite(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSite(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm(`Please confirm whether to delete`).then(() => {
        this.$modal.loading()
        return delSite(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("Deleted!");
      }).finally(() => this.$modal.closeLoading());
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ati/site/export', {
        ...this.queryParams
      }, `site_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>

<style lang="scss">
.pages-site {
  .region {
    margin-bottom: 0;
  }
  .el-select {
    margin-right: 8px;
  }
  .table-title {
    margin-bottom: 25px;
    font-weight: 700;
  }
  .area-select {
    .el-input__inner {
      min-width: 240px;
    }
  }
}
</style>
