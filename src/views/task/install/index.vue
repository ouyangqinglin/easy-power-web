<template>
  <div class="app-container pages-task">
    <el-card class="pages-task-header" >
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="200px">
        <common-flex>
          <el-form-item label="Task Code：" prop="code">
            <el-input
              class="same-input"
              v-model="queryParams.code"
              placeholder="Please enter"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item class="second-item" label="Installer：" prop="installer">
            <el-input
              class="same-input"
              v-model="queryParams.installer"
              placeholder="Please enter"
              @keyup.enter.native="handleQuery"
              clearable />
          </el-form-item>
          <common-flex style="flex-grow: 1; flex-shrink: 0" justify="flex-end">
            <el-form-item>
              <el-button type="primary" @click="handleQuery">Query</el-button>
              <el-button @click="resetQuery">Reset</el-button>
            </el-form-item>
          </common-flex>
        </common-flex>
      </el-form>
      <el-form :model="queryParams" :inline="true" label-width="200px">
        <el-form-item class="region" label="Status：" prop="status" style="margin-bottom: 0">
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
        <el-form-item class="second-item" label="Time of Task  Completed：" prop="endTime" style="margin-bottom: 0">
          <el-date-picker
            class="same-input"
            clearable
            v-model="queryParams.endTime"
            type="date"
            format="MM/dd/yyyy"
            value-format="yyyy-M-d"
            placeholder="">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </el-card>
    <div style="height: 20px"></div>
    <el-card>
      <common-flex justify="space-between">
        <div class="table-title">Task List</div>
        <div>
          <el-button @click="openAdd" type="primary" v-hasPermi="['ati:task:install:add']">Add</el-button>
        </div>
      </common-flex>
      <el-table :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}"
        v-loading="loading" :data="taskList" @selection-change="handleSelectionChange">
        <el-table-column label="No" align="center" width="60">
          <template slot-scope="scope">
            {{ (+queryParams.pageNum - 1) * (+queryParams.pageSize) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="Task Code" align="center" prop="code" min-width="210" />
        <el-table-column label="Task Type" align="center" prop="type" min-width="130">
          <template slot-scope="{ row }">
            <dict-tag :options="dict.type.install_type" :value="row.type"/>
          </template>
        </el-table-column>
        <el-table-column label="Status" align="center" prop="status" min-width="100">
          <template slot-scope="{ row }">
            <dict-tag :options="dict.type.install_status" :value="row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="Customer" align="center" prop="customer" min-width="130" show-tooltip-when-overflow />
        <el-table-column label="Installer" align="center" prop="installer" min-width="130" show-tooltip-when-overflow />
        <el-table-column label="Time of Appointment" align="center" prop="appointTime" min-width="180">
          <template slot-scope="{ row }">
            <span v-if="row.appointTime && row.appointTime !== '--'">{{ DATE_FORMAT('M/d/yyyy hh:mm', new Date(row.appointTime)) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="Time of Task Receiving" align="center" prop="startTime" min-width="180">
          <template slot-scope="{ row }">
            <span v-if="row.startTime && row.startTime !== '--'">{{ DATE_FORMAT('M/d/yyyy hh:mm', new Date(row.startTime)) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="Time of Task Completed" align="center" prop="endTime" min-width="180">
          <template slot-scope="{ row }">
            <span v-if="row.endTime && row.endTime !== '--'">{{ DATE_FORMAT('M/d/yyyy hh:mm', new Date(row.endTime)) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="Agency" align="center" prop="agentName" min-width="140" show-overflow-tooltip />

        <el-table-column label="Creation Time" align="center" prop="createTime" min-width="180">
          <template slot-scope="{ row }">
            <span v-if="row.createTime && row.createTime !== '--'">{{ DATE_FORMAT('M/d/yyyy hh:mm', row.createTime) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="Created by" align="center" prop="createBy" min-width="140" />
        <el-table-column label="Last update Time" align="center" prop="updateTime" min-width="140">
          <template slot-scope="{ row }">
            <span v-if="row.updateTime && row.updateTime !== '--'">{{ DATE_FORMAT('M/d/yyyy hh:mm', row.updateTime) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="Last update by" align="center" prop="updateBy" min-width="140" />
        <el-table-column fixed="right" label="Operat" align="center" class-name="small-padding fixed-width" min-width="160">
          <template slot-scope="scope">
            <el-button
              type="text"
            >
              <router-link v-hasPermi="['ati:task:install:view']" :to="`/task/install/view/${scope.row.id}`">Detail</router-link>
            </el-button>
            <el-button
              :disabled="+scope.row.status > 1"
              type="text"
            >
              <router-link v-if="!(+scope.row.status > 1)" v-hasPermi="['ati:task:install:edit']" :to="`/task/install/modify/${scope.row.id}`">Modify</router-link>
              <span v-else>Modify</span>
            </el-button>
            <el-button
              :disabled="+scope.row.status > 1"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['ati:task:install:remove']"
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
    <AddDialog :show.sync="showModel" :type="1" header="Please select a customer" />

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
import { listTask, delTask } from "@/api/task"
import AddDialog from "@/views/components/add-dialog"

export default {
  name: "pages-install",
  components: { AddDialog },
  dicts: ['install_type', 'install_status'],
  data() {
    return {
      showModel: false, // 选择用户弹窗
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
      taskList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        endTime: '', // 2022-9-23
        status: '', // {number} 1-pending 2-procession 3-complete
        code: '', // 任务编码
        installer: '', // {number} 安装用户id
        type: 2
      },
      options: [
        {
          value: 1,
          label: 'Pending'
        },
        {
          value: 2,
          label: 'Processing'
        },
        {
          value: 3,
          label: 'Completed'
        },
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
    };
  },
  created() {
    this.getList()
  },
  methods: {
    // 打开add弹窗
    openAdd() {
      this.showModel = true
    },
    /** 查询站点列表 */
    getList() {
      this.loading = true;
      listTask(this.queryParams).then(response => {
        response.rows.forEach(i => {
          Object.keys(i).forEach(k => {
            if (!i[k]) i[k] = '--'
          })
        })
        this.taskList = response.rows;
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
        endTime: null,
        status: null,
        code: null,
        installer: null,
      }
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.status = ''
      this.queryParams.endTime = ''
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
      const ids = row.id || this.ids
      this.$modal.confirm(`Please confirm whether to delete`).then(function() {
        return delTask(ids);
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("Deleted!")
      }).catch(() => {})
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
.pages-task {
  .el-radio__label {
    display: none;
  }
  .table-title {
    margin-bottom: 25px;
    font-weight: 700;
  }
  .same-input {
    .el-input__inner {
      width: 230px;
      @media screen and (max-width: 1334px) {
        width: 160px;
      }
    }
  }
}
</style>
