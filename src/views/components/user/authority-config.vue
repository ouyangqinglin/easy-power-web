<template>
  <div class="comp-authority" v-if="show">
    <el-dialog :visible.sync="show"
               title="Authority  Configuration"
               :before-close="beforeClose"
               :close-on-click-modal ="false"
               width="50%"
    >
     <common-flex style="width: 66%; margin: 0 auto" direction="column">
       <div class="comp-authority-title">Please check the required permission</div>
       <el-tree
         :data="menuData"
         class="tree-border"
         show-checkbox
         ref="menu"
         node-key="id"
         :check-strictly="false"
         empty-text="loading"
         :props="defaultProps"
       ></el-tree>
     </common-flex>
      <common-flex justify="center" style="margin-top: 29px">
        <el-button size="small" type="primary" @click="submit" :disabled="submitDisable">Submit</el-button>
        <el-button size="small" @click="$emit('update:show', false)">Cancel</el-button>
      </common-flex>
    </el-dialog>
  </div>
</template>

<script>
import { roleMenuTreeselect, modifyAuthority } from '@/api/system/menu'
import {mapState} from "vuex";
export default {
  name: "authority-config",
  props: {
    show: Boolean,
    id: String | Number,
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    id() {
      this.getMenu()
    },
    item: {
      immediate: true,
      handler(v) {
        this.source = +v.source
      }
    },
  },
  computed: {
    ...mapState({
      'userType': state => state.user.userType,
      'roles': (state) => state.user.roles
    }),
    submitDisable() {
      let flag
      if (+this.source === 1) flag = this.roles.includes('System Admin') ? false : ![4, 5].includes(+this.userType)
      else flag = false
      return flag
    }
  },
  data() {
    return {
      menuData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      source: ''
    }
  },
  mounted() {
    this.getMenu()
  },
  methods: {
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    submit() {
      let checkedKeys = this.getMenuAllCheckedKeys()
      if (checkedKeys.length) {
        let data = {
          roleId: +this.id,
          menuIds: checkedKeys,
          roleSort: 2,
          roleKey: this.item.roleKey,
          roleName: this.item.roleName,
          menuCheckStrictly: false,
          deptCheckStrictly: true,
          flag: false
        }
        this.$modal.loading()
        modifyAuthority(data).then(res => {
          if (+res.code === 200) {
            this.$message({
              type: 'success',
              message: 'Succeeded!'
            })
            this.beforeClose()
            this.$emit('refresh')
          }
        }).finally(() => this.$modal.closeLoading());
      }

    },
    getMenu() {
      roleMenuTreeselect(this.id).then(res => {
        this.menuData = res.menus.filter(i => ![1, 2, 3, 4].includes(i.id))
        res.checkedKeys.forEach((v) => {
          this.$nextTick(()=>{
            this.$refs.menu.setChecked(v, true ,false);
          })
        })
      })
    },
    beforeClose() {
      this.$emit('update:show', false)
    },
  }
}
</script>

<style lang="scss">
.comp-authority {
  &-title {
    margin-bottom: 24px;
  }
  .tree-border {
    padding: 24px 0 50px 24px;
    .el-tree-node {
      margin-top: 6px;
    }
  }
}
</style>
