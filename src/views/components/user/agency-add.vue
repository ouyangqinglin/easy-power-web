<template>
  <div v-if="show" class="agency-add">
    <el-dialog :visible.sync="show"
               :title="type === 'add' ? 'Newly Build' : 'Modify'"
               :before-close="beforeClose"
               :close-on-click-modal ="false"
               width="65%"
    >
      <el-form class="agency-add-form" :model="base" :rules="rules" ref="ruleForm">
        <template v-for="i of formList">
          <el-form-item :prop="i.prop">
            <template slot="label"><span>{{ i.label }}</span></template>
            <template v-if="i.prop === 'remark'">
              <el-input style="width: 40vw" type="textarea" show-word-limit maxlength="200" v-model="base[i.prop]"></el-input>
            </template>
            <template v-else-if="i.prop === 'agency'">
              <el-input maxlength="50" v-model="base[i.prop]"></el-input>
            </template>
            <template v-else-if="i.prop === 'phone'">
              <el-input @input="checkPhone" maxlength="20" v-model="base[i.prop]"></el-input>
            </template>
            <template v-else-if="i.prop === 'status'">
              <el-select style="width: 100%" v-model="base[i.prop]">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
            <template v-else>
              <el-input :disabled="i.disabled" :placeholder="i.placeholder" v-model="base[i.prop]"></el-input>
            </template>
          </el-form-item>
        </template>
      </el-form>
      <div class="table-content">
        <common-flex justify="center" style="margin-top: 29px">
          <el-button size="small" type="primary" @click="submit">Submit</el-button>
          <el-button size="small" @click="$emit('update:show', false)">Cancel</el-button>
        </common-flex>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addAgency, modifyAgency } from '@/api/agency'

export default {
  name: "agency-add",
  props: {
    show: Boolean,
    type: String,
    item: {}
  },
  data() {
    return {
      base: {
        status: 1,
        agency: '',
        agencyCode: '',
        remark: '',
        phone: ''
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
        agency: [
          { required: true, message: 'Please enter', trigger: 'blur'}
        ]
      },
      formList: [
        {
          label: 'Agency',
          prop: 'agency',
          placeholder: 'Please enter'
        },
        {
          label: 'Agency Code',
          prop: 'agencyCode',
          disabled: true
        },
        {
          label: 'Status',
          prop: 'status',
          placeholder: 'Please select'
        },
        {
          label: 'Phone',
          prop: 'phone',
          placeholder: 'Please enter'
        },
        {
          label: 'Remarks',
          prop: 'remark',
          placeholder: 'Please enter'
        }
      ],
    }
  },
  watch: {
    item: {
      immediate: true,
      handler(v) {
        if (Object.keys(v).length) {
          Object.keys(this.base).forEach(key => {
            this.base[key] = v[key]
          })
        }
      },
    }
  },
  methods: {
    checkPhone() {
      this.base.phone = this.PHONE_REG(this.base.phone)
    },
    beforeClose() {
      this.$emit('update:show', false)
    },
    submit() {
      this.$refs.ruleForm.validate((v) => {
        if (v) {
          let data = {
            agency: this.base.agency,
            remark: this.base.remark,
            status: this.base.status,
            phone: this.base.phone
          }
          if (this.type === 'modify') {
            data.id = this.item.id
            this.modify(data)
          }
          else this.add(data)
        }
      })
    },
    add(data) {
      this.$modal.loading()
      addAgency(data).then(res => {
        if (+res.code === 200) {
          // Add successfully!
          this.$message({
            type: 'success',
            message: 'Succeeded!'
          })
          this.beforeClose()
          this.$emit('refresh')
        }
      }).finally(() => this.$modal.closeLoading())
    },
    modify(data) {
      this.$modal.loading()
      modifyAgency(data).then(res => {
        if (+res.code === 200) {
          // Add successfully!
          this.$message({
            type: 'success',
            message: 'Succeeded!'
          })
          this.beforeClose()
          this.$emit('refresh')
        }
      }).finally(() => this.$modal.closeLoading());
    },
  }
}
</script>

<style lang="scss">
.agency-add {
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
}
</style>
