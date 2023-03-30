<template>
  <div class="pages-authority app-container">
    <el-card>
      <el-form :inline="true" :model="queryParams" label-width="120px" ref="queryForm">
        <common-flex>
          <common-flex style="flex-grow: 1">
            <el-form-item label="Role Name：" prop="roleName">
              <el-input placeholder="Please enter" @keyup.enter.native="handleQuery" v-model="queryParams.roleName"></el-input>
            </el-form-item>
            <el-form-item label="Status：" prop="status">
              <el-select placeholder="All" v-model="queryParams.status">
                <el-option v-for="i of statusOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
              </el-select>
            </el-form-item>
          </common-flex>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">Query</el-button>
            <el-button @click="resetQuery">Reset</el-button>
          </el-form-item>
        </common-flex>
      </el-form>
    </el-card>
    <el-card class="pages-authority-card">
      <common-flex justify="space-between">
        <div class="pages-authority-card-title">Role List</div>
        <div><el-button type="primary" @click="addShow = true" v-hasPermi="['system:role:add']">Add</el-button></div>
      </common-flex>
      <el-table v-loading="loading" :data="dataList"
                :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}">
        <el-table-column label="No" align="center" width="60">
          <template slot-scope="scope">
            {{ (+queryParams.pageNum - 1) * (+queryParams.pageSize) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="Role Name" align="center" prop="roleName" min-width="120" show-overflow-tooltip />
        <el-table-column label="Data Sources" align="center" prop="source" min-width="120">
          <template slot-scope="{ row }">
            <dict-tag :options="dict.type.role_source" :value="row.source"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column label="Web Authority" min-width="140">
          <template slot-scope="{ row }">
            <!-- 系统预置-->
            <div v-if="+row.source === 1">
              <!-- 所有Installer都显示--   -->
              <div v-if="row.roleKey === 'Installer'">--</div>
              <!-- 所有System Admin都显示ALL   -->
              <div v-else-if="['System Admin', 'admin'].includes(row.roleKey)">ALL</div>
              <!-- 不是Installer, 也不是system admin   -->
              <template v-else>
                <!-- 管理员账号则都可以配置   -->
                <div type="text" v-if="[4, 5].includes(+userType)">
                  <el-button type="text" @click="config(row)">Configuration</el-button>
                </div>
                <!-- 非管理员账号当列表项为System Admin角色时展示ALL，其他展示Configuration且只能查看不能submit   -->
                <div v-else>
                  <el-button type="text" @click="config(row)">Configuration</el-button>
                </div>
              </template>
            </div>
            <!-- 手动添加-->
            <el-button type="text" v-else @click="config(row)">Configuration</el-button>
          </template>
        </el-table-column>
        <el-table-column label="Status" prop="status">
          <template slot-scope="{ row }">
            <span>{{ ['Valid', 'Invalid'][row.status] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Remarks" prop="remark" min-width="160" show-overflow-tooltip />
        <el-table-column label="Agency" prop="agency" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="Last update Time" align="center" prop="updateTime" min-width="160">
          <template slot-scope="{ row }">
            <span v-if="row.updateTime && row.updateTime !== '--'">{{ DATE_FORMAT('M/d/yyyy hh:mm:ss', row.updateTime) }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="Last updated by" align="center" prop="updateBy" min-width="120" />
        <el-table-column fixed="right" min-width="120" label="Operat">
          <template slot-scope="{ row }" v-if="+row.source === 2">
            <el-button type="text" @click="modifyOpen(row)" v-hasPermi="['system:role:edit']">Modify</el-button>
            <el-button type="text" @click="deleteRole(row.roleId)" v-hasPermi="['system:role:remove']">Delete</el-button>
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
    <ConfigRole v-if="show" :show.sync="show" :id="id" :item="item" @refresh="getList" />
    <el-dialog :visible.sync="addShow"
               class="form-dialog"
               title="Newly Build"
               :before-close="beforeClose"
               :close-on-click-modal ="false"
               width="50%">
      <el-form :inline="true" :model="addInfo" :rules="addRule" ref="addForm" label-width="120px">
        <common-flex direction="column">
          <el-form-item label="Agency：" prop="agencyId" v-if="![4, 5].includes(+userType)"><el-button type="text">{{ agency }}</el-button></el-form-item>
          <el-form-item label="Role Name" prop="roleName"><el-input v-model="addInfo.roleName" maxlength="50" placeholder="Please enter"></el-input></el-form-item>
          <el-form-item label="Status" prop="status">
            <el-select v-model="addInfo.status">
              <el-option v-for="i of addStatusOption" :key="i.value" :label="i.label" :value="i.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Remarks" prop="remark">
            <el-input type="textarea" maxlength="200" v-model="addInfo.remark"></el-input>
          </el-form-item>
        </common-flex>
      </el-form>
      <common-flex justify="center">
        <el-button type="primary" @click="submit('addForm')">Save</el-button>
        <el-button @click="beforeClose">Cancel</el-button>
      </common-flex>
    </el-dialog>
    <el-dialog :visible.sync="modifyShow"
               class="form-dialog"
               title="Modify"
               :before-close="beforeCloseModify"
               :close-on-click-modal ="false"
               width="50%">
      <el-form :inline="true" :model="modifyInfo" :rules="addRule" ref="modifyForm" label-width="120px">
        <common-flex direction="column">
          <el-form-item label="Agency：" prop="agencyId" v-if="![4, 5].includes(+userType)"><el-button type="text">{{ agency }}</el-button></el-form-item>
          <el-form-item label="Role Name" prop="roleName"><el-input disabled v-model="modifyInfo.roleName" placeholder="Please enter"></el-input></el-form-item>
          <el-form-item label="Status" prop="status">
            <el-select v-model="modifyInfo.status">
              <el-option v-for="i of addStatusOption" :key="i.value" :label="i.label" :value="i.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Remarks" prop="remark">
            <el-input type="textarea" max-length="200" v-model="modifyInfo.remark"></el-input>
          </el-form-item>
        </common-flex>
      </el-form>
      <common-flex justify="center">
        <el-button type="primary" @click="submit('modifyForm')">Save</el-button>
        <el-button @click="beforeCloseModify">Cancel</el-button>
      </common-flex>
    </el-dialog>
  </div>
</template>

<script>
import {listRole, addRole, updateRole, delRole} from "@/api/system/role"
import ConfigRole from '@/views/components/user/authority-config'
import {mapState} from "vuex"
import {delTask} from "@/api/task"
import {roleMenuTreeselect} from "@/api/system/menu"


export default {
  name: "pages-authority",
  components: { ConfigRole },
  dicts: ['role_source', 'role_app_auth'],
  data() {
    return {
      item: {},
      id: '',
      loading: false,
      show: false,
      addShow: false,
      modifyShow: false,
      addInfo: {
        roleKey: Math.random() * 10,
        roleName: '',
        roleSort: '0',
        status: 0,
        remark: '',
        agencyId: ''
      },
      modifyInfo: {
        roleId: '',
        roleKey: '',
        roleName: '',
        roleSort: '0',
        status: 0,
        remark: '',
        agencyId: '',
        menuIds: [],
        menuCheckStrictly: false,
        deptCheckStrictly: true,
      },
      addRule: {
        roleName: [
          { required: true, message: 'Please enter', trigger: 'blur' }
        ]
      },
      addStatusOption: [
        {
          label: 'Valid',
          value: 0
        },
        {
          label: 'Invalid',
          value: 1
        }
      ],
      addAppOption: [
        {
          label: 'No Pemission',
          value: 1
        },
        {
          label: 'ATI Storage',
          value: 2
        },
        {
          label: 'ATI Install',
          value: 3
        }
      ],
      dataList: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: '',
        status: ''
      },
      statusOptions: [
        {
          label: 'Valid',
          value: '0'
        },
        {
          label: 'Invalid',
          value: '1'
        },
      ],
    }
  },
  computed: {
    ...mapState({
      'userType': state => state.user.userType,
      'agency': state => state.user.agency
    })
  },
  mounted() {
    this.getList()
  },
  methods: {
    getMenu(id) {
      roleMenuTreeselect(id).then(res => {
        this.modifyInfo.menuIds = res.checkedKeys
      })
    },
    modifyOpen(item) {
      this.getMenu(item.roleId)
      Object.keys(this.modifyInfo).forEach(i => {
        if (item[i] && item[i] !== '--') {
          if (i === 'status') this.modifyInfo[i] = +item[i]
          else this.modifyInfo[i] = item[i]
        }
      })
      this.modifyShow = true
    },
    beforeCloseModify() {
      this.modifyShow = false
    },
    deleteRole(ids) {
      this.$modal.confirm(`Please confirm whether to delete`).then(function() {
        return delRole(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("Deleted!")
      }).catch(() => {})
    },
    beforeClose() {
      this.addShow = false
      this.addInfo.roleName = ''
      this.addInfo.remark = ''
      this.addInfo.status = 0
    },
    submit(form) {
      this.$refs[form].validate(v => {
        if (v) {
          if (form === 'addForm') this.addSubmit()
          else this.modifySubmit()
        }
      })
    },
    addSubmit() {
      addRole(this.addInfo).then(res => {
        if (+res.code === 200) {
          this.$message({
            type: 'success',
            message: 'Succeeded!'
          })
          this.getList()
          this.beforeClose()
        }
      })
    },
    modifySubmit() {
      updateRole(this.modifyInfo).then(res => {
        if (+res.code === 200) {
          this.$message({
            type: 'success',
            message: 'Succeeded!'
          })
          this.getList()
          this.beforeCloseModify()
        }
      })
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    resetQuery() {
      this.resetForm("queryForm")
      this.handleQuery()
    },
    getList() {
      this.loading = true;
      listRole(this.queryParams).then(response => {
        response.rows.forEach(i => {
          Object.keys(i).forEach(k => {
            if (!i[k]) i[k] = '--'
          })
        })
        this.dataList = response.rows
        this.total = response.total
        this.loading = false
      });
    },
    config(item) {
      this.id = item.roleId
      this.item = item
      this.show = true
    }
  }
}
</script>

<style lang="scss">
.pages-authority {
  &-card {
    margin: 24px 0;
    &-title {
      margin-bottom: 25px;
      font-weight: 700;
    }
  }
  .form-dialog {
    .el-input__inner, .el-textarea__inner {
      min-width: 360px;
    }
  }
}
</style>
