<template>
  <div v-if="show" class="account-modify">
    <el-dialog :visible.sync="show"
               title="Modify"
               :before-close="beforeClose"
               :close-on-click-modal ="false"
               width="65%"
    >
      <el-form class="account-modify-form" :model="base" :rules="rules" ref="ruleForm">
        <template v-for="i of formList">
          <el-form-item :prop="i.prop">
            <template slot="label"><span>{{ i.label }}</span></template>
            <template v-if="i.prop === 'remark'">
              <el-input style="width: 40vw" type="textarea" maxlength="200" v-model="base[i.prop]"></el-input>
            </template>
            <template v-else-if="i.prop === 'phone'">
              <el-input @input="checkPhone" maxlength="20" v-model="base[i.prop]"></el-input>
            </template>
            <template v-else-if="i.prop === 'status'">
              <el-select style="width: 100%" v-model="base[i.prop]" :disabled="+id === +$store.state.user.userId">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
            <template v-else-if="i.prop === 'agencyId'">
              <div class="posr">
                <el-input :disabled="!(+($store.state.user.agencyId) < 0)" readonly @focus="agencyShow = true" :placeholder="i.placeholder" v-model="base['agentName']"></el-input>
                <i @click="+($store.state.user.agencyId) < 0? agencyShow = true : ''" class="el-icon-search posa right-search"></i>
              </div>
            </template>
            <template v-else-if="i.prop === 'roleIds'">
              <el-select :disabled="+id === +$store.state.user.userId" value-key="value" style="width: 100%" v-model="base.roleIds" multiple :placeholder="i.placeholder">
                <el-option v-for="item of roleList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </template>
            <template v-else-if="i.prop === 'allowedSourceList'">
              <el-select style="width: 100%" value-key="value" v-model="base.allowedSourceList" multiple :placeholder="i.placeholder">
                <el-option v-for="item of authorityList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </template>
            <template v-else>
              <el-input :disabled="i.disabled" :placeholder="i.placeholder" v-model="base[i.prop]"></el-input>
            </template>
          </el-form-item>
        </template>
      </el-form>
      <div class="table-content" v-if="+type === 1">
        <common-flex justify="space-between" align="center" style="margin-bottom: 10px">
          <div>Site List</div>
          <div><el-button size="small" type="primary" @click="siteShow = true">Add</el-button></div>
        </common-flex>
        <el-table :data="siteList"
                  :header-cell-style="{'text-align': 'center'}" :cell-style="{'text-align': 'center'}"
        >
          <el-table-column type="index" label="No." prop="id" width="55"></el-table-column>
          <el-table-column label="Site" prop="siteName"></el-table-column>
          <el-table-column label="Site Code" prop="siteCode"></el-table-column>
          <el-table-column label="Operat">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteItem(scope)">Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <common-flex justify="center" style="margin-top: 29px">
        <el-button size="small" type="primary" @click="submit">Submit</el-button>
        <el-button size="small" @click="$emit('update:show', false)">Cancel</el-button>
      </common-flex>
    </el-dialog>
    <siteList v-if="siteShow" :show.sync="siteShow" @change="getSelectSite" :haveSiteList="siteList" />
    <agentList :show.sync="agencyShow" :agencyId="base.agencyId"  @change="getSelectAgent"/>
  </div>
</template>

<script>
import siteList from '@/views/components/site-details/siteList'
import agentList from '@/views/components/user/agencyList'
import {listRole} from "@/api/system/role"
import {addAtiUser, getAtiUser, updateAtiUser} from '@/api/user'

export default {
  name: "account-modify",
  components: { siteList, agentList },
  props: {
    show: Boolean,
    type: Number,
    id: String
  },
  watch: {
    show(r) {
      if (r) {
        let v = this.id
        getAtiUser(v).then(res => {
          const a = {
            roleIds: []
          }
          if (res.data.relationRolesList) {
            if (res.data.relationRolesList.length) {
              res.data.relationRolesList.forEach(i => {
                let item = this.roleList.find(k => +k.roleId === +i.roleId)
                if (item) a.roleIds.push(i.roleId + '')
              })
            }
          }
          this.base = {...this.base, ...res.data, ...a}
          this.siteList = res.data.siteList
        })
      }
    },
    type: {
      immediate: true,
      handler(v) {
        let item = [
            {
              label: 'Agency',
              prop: 'agencyId',
              placeholder: 'Please select'
            },
            {
              label: 'User Account',
              prop: 'email',
              disabled: true,
              placeholder: 'Please enter'
            },
            {
              label: 'User Name',
              prop: 'userName',
              disabled: true,
              placeholder: 'Please enter'
            },
            {
              label: 'Phone',
              prop: 'phone',
              placeholder: 'Please enter'
            },
            {
              label: 'Role',
              prop: 'roleIds',
              placeholder: 'Please select'
            },
            {
              label: 'Status',
              prop: 'status',
              placeholder: 'Please select'
            },
            {
              label: 'App Authority',
              prop: 'allowedSourceList',
              placeholder: 'Please select'
            },
            {
              label: 'Remarks',
              prop: 'remark',
              placeholder: 'Please enter'
            }
          ]
        if (+v === 5) {
          this.formList = item
          this.formList.splice(0, 1)
        } else this.formList = item
      },
    }
  },
  data() {
    return {
      siteShow: false,
      agencyShow: false,
      siteList: [],
      siteCodeList: [],
      roleList: [],
      base: {
        status: 1,
        email: '',
        userName: '',
        phone: '',
        agencyId: '',
        remark: '',
        agentName: '',
        roleIds: []
      },
      options: [
        {
          value: 1,
          label: 'Valid'
        },
        {
          value: 2,
          label: 'Invalid'
        },
      ],
      rules: {
        roleIds: [
          { required: true, message: 'Please select', trigger: 'blur' }
        ],
        agencyId: [
          { required: true, message: 'Please select', trigger: 'change'}
        ]
      },
      formList: []
    }
  },
  computed: {
    authorityList() {
      const userApp = [
        {
          label: 'EasyPower Storage',
          value: '1'
        }
      ]
      const installApp = [
        {
          label: 'EasyPower Install',
          value: '2'
        }
      ]
      return +this.type === 2 ?  installApp : userApp
    }
  },
  mounted() {
    this.getRoleList()
  },
  methods: {
    checkPhone() {
      this.base.phone = this.PHONE_REG(this.base.phone)
    },
    getRoleList() {
      let data = {
        pageNum: 1,
        pageSize: 100,
        status: 0,
        source: 2
      }
      listRole(data).then(res => {
        if (res.rows.length) {
          res.rows.forEach(i => {
            i.label = i.roleName
            i.value = i.roleId + ''
          })
        }
        this.roleList = res.rows
      })
    },
    getSelectSite(v) {
      this.siteList = [...this.siteList, ...v]
      this.siteList = this.removeDuplicateObj(this.siteList)
    },
    getSelectAgent(v) {
      this.base.agencyId = v.id
      this.base.agentName = v.agency
    },
    // 去重
    removeDuplicateObj(arr) {
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
    beforeClose() {
      this.$emit('update:show', false)
    },
    deleteItem(i) {
      this.siteList.splice(i.$index, 1)
    },
    submit() {
      this.$refs.ruleForm.validate((v) => {
        if (v) {
          this.siteCodeList = []
          this.siteList.forEach(i => {
            this.siteCodeList.push(i.siteCode)
          })
          let data = {
            agencyId: +this.base.agencyId,
            remark: this.base.remark,
            phone: this.base.phone,
            siteCodeList: this.siteCodeList,
            status: this.base.status,
            id: +this.id,
            roleIds: this.base.roleIds,
            allowedSourceList: this.base.allowedSourceList
          }
          updateAtiUser(data).then(res => {
            if (+res.code === 200) {
              // modify successfully!
              this.$message({
                type: 'success',
                message: 'Succeeded!'
              })
              this.beforeClose()
              this.$emit('refresh')
            }
          })
        }
      })
    },
  }
}
</script>

<style lang="scss">
.account-modify {
  &-form {
    padding: 0 20px;
    display: flex;
    //justify-content: space-between;
    flex-wrap: wrap;
    .el-form-item {
      margin-right: 60px;
      min-width: calc(100% / 3 - 50px);
    }
    >:nth-child(3n) {
      margin-right: 0;
    }
    .require-prop {
      color: #FF0000;
    }
  }
  .table-content {
    padding: 0 20px;
  }
  .right-search {
    right: 10px;
    bottom: 8px;
    font-size: 20px;
    color: #898989;
    cursor: pointer;
    z-index: 2;
  }
}
</style>
