<template>
  <div class="app-container pages-user-account">
    <el-card class="pages-user-account-card pane">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="Customer" name="1"></el-tab-pane>
        <el-tab-pane label="Installer" name="2"></el-tab-pane>
        <el-tab-pane label="Agency" name="3"></el-tab-pane>
        <el-tab-pane v-if="+($store.state.user.userType) !== 3" label="Administrator" name="5"></el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card class="pages-user-account-card pane">
      <el-form :model="queryParams" :inline="true" ref="queryForm" v-show="showSearch" label-width="160px">
        <common-flex>
          <common-flex wrap="wrap">
            <el-form-item label="User:" prop="userName">
              <el-input
                v-model="queryParams.userName"
                placeholder="Please enter"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="User Account:" prop="email">
              <el-input
                v-model="queryParams.email"
                placeholder="Please enter"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="Status:" prop="status">
              <el-select
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
            <el-form-item v-if="![4, 5].includes(+queryParams.type)" label="Agency:" prop="agentName">
              <el-input
                v-model="queryParams.agentName"
                placeholder="Please enter"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </common-flex>
          <common-flex style="flex-grow: 1; flex-shrink: 0" justify="flex-end">
            <el-form-item>
              <el-button type="primary" @click="handleQuery">Query</el-button>
              <el-button @click="resetQuery">Reset</el-button>
            </el-form-item>
          </common-flex>
        </common-flex>
      </el-form>
    </el-card>
    <el-card class="pages-user-account-card">
      <common-flex justify="space-between">
        <div class="pages-user-account-card-title">User List</div>
        <div>
          <el-button type="primary" @click="show = true" v-hasPermi="['ati:user:account:add']">Add</el-button>
        </div>
      </common-flex>
      <el-table v-loading="loading" :data="atiUserList"
                key="1"
                :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}"
                @selection-change="handleSelectionChange">
        <el-table-column label="No" align="center" width="60">
          <template slot-scope="scope">
            {{ (+queryParams.pageNum - 1) * (+queryParams.pageSize) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column v-if="+queryParams.type === 1" label="User Account" align="center" prop="email" min-width="270">
          <template slot-scope="{ row }">
            <span style="margin-right: 6px">{{ row.email }}</span>
            <el-tag v-if="+queryParams.type === 1" size="mini" :type="['', 'success', 'info'][+row.active]">{{['', 'Active','Not active'][+row.active] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-else label="User Account" align="center" prop="email" min-width="140" />
        <el-table-column label="User" align="center" prop="userName" min-width="120" show-overflow-tooltip />
        <el-table-column label="Role" align="center" prop="rolesList" min-width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column v-if="+queryParams.type === 1" label="Phone" align="center" prop="phone" min-width="120" show-overflow-tooltip/>
        <el-table-column v-if="+queryParams.type !== 5" label="Agency" align="center" prop="agentName" min-width="140" show-overflow-tooltip />
        <el-table-column v-if="+queryParams.type === 3" label="Agency Code" align="center" prop="agencyCode" min-width="120" />
        <el-table-column label="Status" align="center" prop="status">
          <template slot-scope="{ row }">
            <span v-if="row.status && row.status !== '--'">{{ ['--', 'Valid', 'Invalid'][+row.status] }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="Remarks" align="center" show-overflow-tooltip prop="remark" />
        <el-table-column label="Creation Time" align="center" prop="createTime" min-width="160">
          <template slot-scope="{ row }">
            <span v-if="row.createTime && row.createTime !== '--'">{{ DATE_FORMAT('M/d/yyyy hh:mm:ss', +row.createTime*1000) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="Created by" align="center" prop="createBy" min-width="130" show-overflow-tooltip />
        <el-table-column label="Last update Time" align="center" prop="updateTime" min-width="160">
          <template slot-scope="{ row }">
            <span v-if="row.updateTime && row.updateTime !== '--'">{{ DATE_FORMAT('M/d/yyyy hh:mm:ss', +row.updateTime*1000) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="Last updated by" align="center" prop="updateBy" min-width="130" show-overflow-tooltip />
        <el-table-column label="Operat" align="center" fixed="right" class-name="small-padding fixed-width" min-width="120">
          <template slot-scope="scope">
            <el-button
              :disabled="+($store.state.user.userId) === +scope.row.id"
              type="text"
              @click="openModify(scope.row)"
              v-hasPermi="['ati:user:account:edit']"
            >Modify</el-button>
            <el-button
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['ati:user:account:remove']"
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
    <AccountAdd v-if="show" :show.sync="show" :type="+queryParams.type" @refresh="getList" />
    <AccountModify :show.sync="showModify" :type="+queryParams.type" :id="userId" @refresh="getList" />
  </div>
</template>

<script>
import { listAtiUser, getAtiUser, delAtiUser, addAtiUser, updateAtiUser } from "@/api/user"
import AccountAdd from '@/views/components/user/account-add'
import AccountModify from '@/views/components/user/account-modify'
const storageList = {}
// 添加customer 类型账号要agency && siteList 添加其他类型账号不需要siteList
// 添加admin 类型账号不需要agency && siteList
export default {
  name: "pages-account",
  components: { AccountAdd, AccountModify },
  data() {
    return {
      userId: '',
      show: false,
      showModify: false,
      activeName: '1',
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
      // 用户表格数据
      atiUserList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        email: null,
        type: 1,
        userName: null,
        agentUid: null,
        status: '',
        agentName: ''
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
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "手机号不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    openModify(i) {
      this.showModify = true
      this.userId = i.id + ''
    },
    handleClick() {
      this.queryParams.type = +this.activeName
      if (storageList[this.queryParams.type]) {
        this.atiUserList = storageList[this.queryParams.type].rows
        this.total = storageList[this.queryParams.type].total
      } else this.getList()

    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listAtiUser(this.queryParams).then(response => {
        response.rows.forEach(i => {
          Object.keys(i).forEach(k => {
            if (!i[k]) i[k] = '--'
          })
        })
        storageList[this.queryParams.type] = response
        this.atiUserList = response.rows
        this.total = response.total
        this.loading = false
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
        email: null,
        password: null,
        phone: null,
        type: null,
        createTime: null,
        userName: null,
        agentUid: null
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
      this.title = "添加用户";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getAtiUser(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateAtiUser(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAtiUser(this.form).then(response => {
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
      this.$modal.confirm('Please confirm whether to delete').then(() => {
        this.$modal.loading()
        return delAtiUser(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("Deleted!");
      }).finally(() => this.$modal.closeLoading());
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ati/atiUser/export', {
        ...this.queryParams
      }, `atiUser_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
<style lang="scss">
.pages-user-account {
  &-card {
    margin-bottom: 24px;
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
  .el-radio__label {
    display: none;
  }
}
</style>
