<template>
  <el-dialog :visible.sync="show" title="Please select"
             :before-close="beforeClose"
             :close-on-click-modal ="false"
             width="46%">
    <el-form @submit.native.prevent :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <common-flex justify="space-between">
        <el-form-item label="Agency" prop="siteName">
          <el-input
            v-model="queryParams.agency"
            placeholder="Please enter"
            maxlength="200"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="handleQuery">Query</el-button>
          <el-button size="mini" @click="resetQuery">Reset</el-button>
        </el-form-item>
      </common-flex>
    </el-form>


    <el-table v-loading="loading" :data="atiUserList" :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}"
              @selection-change="handleSelectionChange"
    >
            <el-table-column width="85">
              <template slot-scope="{ row }">
                <el-radio class="my-radio" v-model="chooseRadio" :label="row.id"></el-radio>
              </template>
            </el-table-column>
      <el-table-column label="Agency" align="center" prop="agency" />
      <el-table-column label="Agency Code" align="center" prop="agencyCode" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <common-flex style="margin-top: 30px" justify="center">
      <el-button :type="btnType" :disabled="!chooseRadio" @click="change">
        <span>Confirm</span>
      </el-button>
      <el-button @click="cancel">Cancel</el-button>
    </common-flex>

  </el-dialog>
</template>

<script>
import { getAgencyList } from "@/api/agency"
import {addAtiUser, delAtiUser, getAtiUser, updateAtiUser} from "@/api/user";

export default {
  name: "comp-add-dialog",
  props: {
    show: Boolean,
    agencyId: String | Object
  },
  data() {
    return {
      multipleSelection: [],
      chooseRadio: '',
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
        agency: null,
        status: 1
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        email: [
          {required: true, message: "邮箱不能为空", trigger: "blur"}
        ],
        password: [
          {required: true, message: "密码不能为空", trigger: "blur"}
        ],
        phone: [
          {required: true, message: "手机号不能为空", trigger: "blur"}
        ],
      }
    }
  },
  computed: {
    btnType() {
      return this.chooseRadio ? 'primary' : ''
    }
  },
  watch: {
    show(v) {
      if (!v) return
      Object.keys(this.queryParams).forEach(i => {
        this.queryParams[i] = ''
      })
      this.queryParams.pageNum = 1
      this.queryParams.pageSize = 10
      this.queryParams.status = 1
      this.getList();
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    change() {
      let installer
      this.atiUserList.forEach(i => {
        if (i.id === this.chooseRadio) installer = i
      })
      this.$emit('change', installer)
      this.beforeClose()
    },
    beforeClose() {
      this.$emit('update:show', false)
      this.chooseRadio = ''
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      getAgencyList(this.queryParams).then(response => {
        response.rows.forEach(i => {
          Object.keys(i).forEach(k => {
            if (!i[k]) i[k] = '--'
          })
        })
        this.atiUserList = response.rows;
        let item = this.atiUserList.find(i => i.id === this.agencyId)
        if (item) this.chooseRadio = item.id
        this.total = response.total
        this.loading = false
      });
    },
    // 取消按钮
    cancel() {
      this.beforeClose()
    },
    // 表单重置
    reset() {
      this.form = {
        agency: null,
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
      this.queryParams.agency = ''
      this.resetForm("queryForm");
      this.handleQuery();
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
      this.$modal.confirm('是否确认删除用户编号为"' + ids + '"的数据项？').then(function() {
        return delAtiUser(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ati/atiUser/export', {
        ...this.queryParams
      }, `atiUser_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>

<style lang="scss">
.comp-add-dialog {

}
</style>
