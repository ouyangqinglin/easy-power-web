<template>
  <el-dialog :visible.sync="show" :title="header"
             :before-close="beforeClose"
             :close-on-click-modal ="false"
             width="65%">
    <el-form @submit.native.prevent :model="optionParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <common-flex justify="space-between">
        <el-form-item label="Name" prop="userName">
          <el-input
            v-model="optionParams.userName"
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


    <el-table v-loading="loading" :data="atiUserList" :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}">
      <el-table-column width="85">
        <template slot-scope="{ row }">
          <el-radio class="my-radio" v-model="chooseRadio" :label="row.id"></el-radio>
        </template>
      </el-table-column>
      <el-table-column label="Name" align="center" prop="userName" show-tooltip-when-overflow />
      <el-table-column label="Account" align="center" prop="email" />
      <el-table-column label="Agency" align="center" prop="agentName" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="optionParams.pageNum"
      :limit.sync="optionParams.pageSize"
      @pagination="getList"
    />
    <common-flex style="margin-top: 30px" justify="center">
      <el-button :type="btnType" :disabled="!chooseRadio" @click="change">Confirm</el-button>
      <el-button @click="cancel">Cancel</el-button>
    </common-flex>

  </el-dialog>
</template>

<script>
import { listAtiUser, getAtiUser, delAtiUser, addAtiUser, updateAtiUser } from "@/api/user"

export default {
  name: "comp-add-dialog",
  props: {
    show: Boolean,
    type: Number,
    header: String,
    haveSelect: String | Object
  },
  data() {
    return {
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
      optionParams: {
        pageNum: 1,
        pageSize: 10,
        email: null,
        password: null,
        phone: null,
        type: null,
        userName: null,
        agentUid: null
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
      if (!v) {
        this.chooseRadio = ''
        return
      }
      Object.keys(this.optionParams).forEach(i => {
        this.optionParams[i] = ''
      })
      this.optionParams.pageNum = 1
      this.optionParams.pageSize = 10
      this.optionParams.type = this.type
      this.getList();
    }
  },
  mounted() {
    this.optionParams.type = 1
    this.getList();
  },
  methods: {
    change() {
      if (+this.type === 1) {
        this.$router.push(`/task/install/add/${this.chooseRadio}`)
        this.beforeClose()
        return
      }
      let installer
      this.atiUserList.forEach(i => {
        if (i.id === this.chooseRadio) installer = i
      })
      this.$emit('change', installer)
      this.beforeClose()
    },
    beforeClose() {
      this.$emit('update:show', false)
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listAtiUser(this.optionParams).then(response => {
        response.rows.forEach(i => {
          Object.keys(i).forEach(k => {
            if (!i[k]) i[k] = '--'
          })
        })
        this.atiUserList = response.rows
        let item = this.atiUserList.find(i => i.id === this.haveSelect)
        if (item) this.chooseRadio = item.id
        this.total = response.total
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.beforeClose()
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
      this.optionParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
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
        ...this.optionParams
      }, `atiUser_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>

<style lang="scss">
.comp-add-dialog {

}
</style>
