<template>
  <div class="app-container pages-repair">
    <el-card class="pages-repair-header" >
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
          <el-form-item class="second-item" label="Repairman：" prop="installer">
            <el-input
              class="same-input"
              v-model="queryParams.installer"
              placeholder="Please enter"
              @keyup.enter.native="handleQuery"
              clearable />
          </el-form-item>
          <common-flex style="flex: 1" justify="flex-end">
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
        <el-form-item class="second-item" label="Time of Task  Completed：" prop="createTime" style="margin-bottom: 0">
          <el-date-picker
            class="same-input"
            clearable
            v-model="queryTime"
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
          <el-button @click="openAdd" type="primary" v-hasPermi="['ati:task:repair:add']">Add</el-button>
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
        <el-table-column label="Repairman" align="center" prop="installer" min-width="130" show-overflow-tooltip />
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
        <el-table-column label="Agency" align="center" prop="agentName" min-width="130" />

        <el-table-column label="Creation Time" align="center" prop="createTime" min-width="180">
          <template slot-scope="{ row }">
            <span v-if="row.createTime && row.createTime !== '--'">{{ DATE_FORMAT('M/d/yyyy hh:mm', new Date(row.createTime)) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="Created by" align="center" prop="createBy" min-width="140" />
        <el-table-column label="Last update Time" align="center" prop="updateTime" min-width="140">
          <template slot-scope="{ row }">
            <span v-if="row.updateTime && row.updateTime !== '--'">{{ DATE_FORMAT('M/d/yyyy hh:mm', new Date(row.updateTime)) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="Last update by" align="center" prop="updateBy" min-width="140" />
        <el-table-column fixed="right" label="Operat" align="center" class-name="small-padding fixed-width" min-width="160">
          <template slot-scope="scope">
            <el-button
              type="text"
            >
              <router-link v-hasPermi="['ati:task:repair:view']" :to="`/task/repair/view/${scope.row.id}`">Detail</router-link>
            </el-button>
            <el-button
              :disabled="+scope.row.status > 1"
              type="text"
            >
              <router-link v-if="!(+scope.row.status > 1)" v-hasPermi="['ati:task:repair:edit']" :to="`/task/repair/modify/${scope.row.id}`">Modify</router-link>
              <span v-else>Modify</span>
            </el-button>
            <el-button
              :disabled="+scope.row.status > 1"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['ati:task:repair:remove']"
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
  </div>
</template>

<script>
import { listTask, delTask } from "@/api/task"
import AddDialog from "@/views/components/task/siteList"

export default {
  name: "pages-repair",
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
      queryTime: '',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        endTime: '', // 2022-9-23
        status: '', // {number} 1-pending 2-procession 3-complete
        code: '', // 任务编码
        installer: '', // {number} 安装用户id
        type: 1
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
  watch: {
    queryTime(v) {
      if (!v) this.queryParams.startTime = this.queryParams.endTime = ''
    },
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
      if (this.queryTime) {
        this.queryParams.startTime = new Date((`${this.queryTime} 00:00:00`)).getTime() / 1000
        this.queryParams.endTime = new Date((`${this.queryTime} 23:59:59`)).getTime() / 1000
      }
      listTask(this.queryParams).then(response => {
        response.rows.forEach(i => {
          Object.keys(i).forEach(k => {
            if (i === 'remark') {}
            else if (!i[k]) i[k] = '--'
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
      this.$modal.confirm(`Please confirm whether to delete`).then(function() {
        return delTask(ids);
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
.pages-repair {
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
