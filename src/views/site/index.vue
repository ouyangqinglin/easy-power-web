<template>
  <div class="app-container pages-site">
    <el-card class="pages-site-header" >
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <common-flex>
          <el-form-item label="Site Name：" prop="siteName">
            <el-input
              v-model="queryParams.siteName"
              placeholder="Please enter a name"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item class="second-item" label="Time of Installed：" prop="createTime">
            <el-date-picker
              clearable
              v-model="queryParams.createTime"
              type="date"
              format="M/d/yyyy"
              value-format="yyyy-M-d"
              placeholder="">
            </el-date-picker>
          </el-form-item>
          <common-flex style="flex: 1" justify="flex-end">
            <el-form-item>
              <el-button type="primary" @click="handleQuery">Query</el-button>
              <el-button @click="resetQuery">Reset</el-button>
            </el-form-item>
          </common-flex>
        </common-flex>
      </el-form>
      <el-form :inline="true">
        <el-form-item class="region" label="Region" prop="province">
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
            <span style="white-space: pre-wrap">{{ row.siteName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Site Code" align="center" prop="siteCode" min-width="130" />
        <el-table-column label="City" align="center" prop="city" show-overflow-tooltip />
        <el-table-column label="Province" align="center" prop="province" min-width="120" show-overflow-tooltip />
        <el-table-column label="Country/Area" align="center" prop="country" min-width="140" show-overflow-tooltip />
        <el-table-column label="Time of Installed" align="center" prop="createTime" min-width="130">
          <template slot-scope="{ row }">
            <span>{{ DATE_FORMAT('M/d/yyyy hh:mm', row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Agency" align="center" prop="agentName" min-width="140" show-overflow-tooltip />
        <el-table-column label="Installation Status" align="center" prop="status" min-width="140">
          <template slot-scope="{ row }">
            <dict-tag :options="dict.type.site_status" :value="row.status" />
          </template>
        </el-table-column>
        <el-table-column label="Last update Time" align="center" prop="updateTime" min-width="130">
          <template slot-scope="{ row }">
            <span v-if="row.updateTime && row.updateTime !== '--'">{{ DATE_FORMAT('M/d/yyyy hh:mm', row.updateTime) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="Last update by" align="center" prop="updateBy" min-width="140" />
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

    <!-- 添加或修改站点对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="站点名称" prop="siteName">
          <el-input v-model="form.siteName" placeholder="请输入站点名称" />
        </el-form-item>
        <el-form-item label="站点详细地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入站点详细地址" />
        </el-form-item>
        <el-form-item label="站点封面" prop="cover">
          <el-input v-model="form.cover" placeholder="请输入站点封面" />
        </el-form-item>
        <el-form-item label="当日生产电量" prop="dayProduce">
          <el-input v-model="form.dayProduce" placeholder="请输入当日生产电量" />
        </el-form-item>
        <el-form-item label="当前月生产电量" prop="monthProduce">
          <el-input v-model="form.monthProduce" placeholder="请输入当前月生产电量" />
        </el-form-item>
        <el-form-item label="当前年生产电量" prop="yearProduce">
          <el-input v-model="form.yearProduce" placeholder="请输入当前年生产电量" />
        </el-form-item>
        <el-form-item label="总生产电量" prop="allProduce">
          <el-input v-model="form.allProduce" placeholder="请输入总生产电量" />
        </el-form-item>
        <el-form-item label="最高功率" prop="peakPower">
          <el-input v-model="form.peakPower" placeholder="请输入最高功率" />
        </el-form-item>
        <el-form-item label="关联的用户id" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入关联的用户id" />
        </el-form-item>
        <el-form-item label="安装人员id" prop="installUid">
          <el-input v-model="form.installUid" placeholder="请输入安装人员id" />
        </el-form-item>
        <el-form-item label="站点编码" prop="siteCode">
          <el-input v-model="form.siteCode" placeholder="请输入站点编码" />
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="form.latitude" placeholder="请输入纬度" />
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="form.longitude" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="0-正常 2-删除" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入0-正常 2-删除" />
        </el-form-item>
        <el-form-item label="关联的任务id" prop="taskId">
          <el-input v-model="form.taskId" placeholder="请输入关联的任务id" />
        </el-form-item>
        <el-form-item label="站点别名" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入站点别名" />
        </el-form-item>
        <el-form-item label="国家" prop="country">
          <el-input v-model="form.country" placeholder="请输入国家" />
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="form.city" placeholder="请输入城市" />
        </el-form-item>
        <el-form-item label="省/州" prop="province">
          <el-input v-model="form.province" placeholder="请输入省/州" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listSite, getAddress, delSite, addSite, updateSite } from "@/api/site"

export default {
  name: "pages-site",
  dicts: ['site_status'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 站点表格数据
      siteList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        createTime: '',
        siteName: null,
        address: null,
        cover: null,
        dayProduce: null,
        monthProduce: null,
        yearProduce: null,
        allProduce: null,
        peakPower: null,
        status: null,
        uid: null,
        installUid: null,
        siteCode: null,
        latitude: null,
        longitude: null,
        taskId: null,
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

    // 24 寸左右 分辨率1920 * 1080 以上 HDMI+VGA接口
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
      this.loading = true;
      listSite(this.queryParams).then(response => {
        response.rows.forEach(i => {
          Object.keys(i).forEach(k => {
            if (!i[k]) i[k] = '--'
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
        cover: null,
        dayProduce: null,
        monthProduce: null,
        yearProduce: null,
        allProduce: null,
        createTime: null,
        updateTime: null,
        peakPower: null,
        status: 0,
        uid: null,
        installUid: null,
        siteCode: null,
        latitude: null,
        longitude: null,
        delFlag: null,
        taskId: null,
        nickName: null,
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
      this.$modal.confirm(`Please confirm whether to delete`).then(function() {
        return delSite(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("Deleted!");
      }).catch(() => {});
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
  .el-form-item__label {
    min-width: 160px;
  }
  .second-item {
    margin-left: 60px;
  }
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
