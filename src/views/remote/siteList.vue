<template>
  <el-dialog :visible.sync="show" title="Please select"
             :before-close="beforeClose"
             :close-on-click-modal ="false"
             width="66%">
    <el-form @submit.native.prevent :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <common-flex justify="space-between">
        <div>
          <el-form-item label="Site:" prop="siteName">
            <el-input
              v-model="queryParams.siteName"
              placeholder="Please enter"
              maxlength="200"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="Agency:" prop="agency">
            <el-input
              v-model="queryParams.agency"
              placeholder="Please enter"
              maxlength="200"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" size="mini" @click="handleQuery">Query</el-button>
          <el-button size="mini" @click="resetQuery">Reset</el-button>
        </el-form-item>
      </common-flex>
    </el-form>


    <el-table v-loading="loading" :data="atiUserList"
              :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}"
              ref="multipleTable"
              :row-key="(row) => { return row.id }"
              @select="handleSelect"
              @select-all="handleSelectAll"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" :reserve-selection="true" width="75"></el-table-column>
      <el-table-column label="Site" align="center" prop="siteName" show-tooltip-when-overflow />
      <el-table-column label="Logger SN" align="center" prop="serialNumber" min-width="260">
        <template slot-scope="{row}">
          <span>{{ row.serialNumber }}/{{['Off line', 'Online'][+row.net]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Agency" align="center" prop="agency" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <common-flex style="margin-top: 30px" justify="center">
      <el-button :type="btnType" :disabled="!selected.length" @click="change">
        <span>Confirm</span>
      </el-button>
      <el-button @click="cancel">Cancel</el-button>
    </common-flex>

  </el-dialog>
</template>

<script>
import { listDevice } from '@/api/device'

export default {
  name: "comp-add-dialog",
  props: {
    show: Boolean,
    haveSiteList: Array | Object
  },
  data() {
    return {
      selected: [],
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
        deviceType: '4',
        pageNum: 1,
        pageSize: 10,
        siteName: '',
        agency: ''
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
      return this.selected.length ? 'primary' : ''
    }
  },
  watch: {
    show: {
      immediate: true,
      handler(v) {
        if (!v) return
        Object.keys(this.queryParams).forEach(i => {
          this.queryParams[i] = ''
        })
        this.queryParams.pageNum = 1
        this.queryParams.pageSize = 10
        this.queryParams.deviceType = 4
        this.getList()
      }
    }
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable?.toggleRowSelection(row)
        });
      } else {
        this.$refs.multipleTable?.clearSelection()
      }
    },
    handleCurrentChange() {
      let rows = []
      this.atiUserList.forEach(row => {
        this.selected.forEach(item => {
          if (row.id === item.id) {
            rows.push(row)
          }
        })
      })
      this.toggleSelection(rows)
    },
    handleSelectAll(selection) {
      if (selection.length === 0) {
        this.atiUserList.forEach(item => {
          this.handleDelItem(item)
        })
      } else {
        this.selected = this.unique(
          this.selected.concat(this.atiUserList)
        )
      }
    },
    unique(arr) {
      let obj = {}
      arr = arr.reduce((newArr, next) => {
        if (obj[next.id]) {}
        else {
          obj[next.id] = true
          newArr.push(next)
        }
        return newArr
      }, [])
      return arr
    },
    handleSelect(selection, row) {
      let isExited = false
      this.selected.forEach(item => {
        if(item.id === row.id) {
          isExited = true
        }
      })
      if (isExited) this.handleDelItem(row)
      else this.selected.push(row)
    },
    handleDelItem(row){
      let index = -1
      this.selected.forEach((item, idx) => {
        if(item.id === row.id) {
          index = idx
        }
      })
      if (index >= 0) this.selected.splice(index, 1)
    },
    handleSelectionChange(val) {
      this.selected = val
    },
    change() {
      this.$emit('change', this.selected)
      this.$emit('update:show', false)
    },
    beforeClose() {
      this.$emit('update:show', false)
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listDevice(this.queryParams).then(response => {
        this.atiUserList = response.rows
        this.total = response.total
        this.loading = false
        this.selected = [...this.haveSiteList]
        this.handleCurrentChange()
      })
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
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
  }
}
</script>

