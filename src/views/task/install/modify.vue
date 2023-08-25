<template>
  <div class="pages-task-modify">
    <el-card class="pages-task-modify-card">
      <div class="pages-task-modify-card-title">Process</div>
      <div style="padding: 0 80px">
        <el-steps class="custom-step" :active="active" finish-status="success">
          <el-step title="Task Created">
            <template slot="description">
              <div>{{ base.createBy }}</div>
            </template>
            <template slot="description">
              <div v-if="base.createTime">{{ DATE_FORMAT('M/d/yyyy hh:mm:ss', +base.createTime * 1000) }}</div>
              <div v-else>--</div>
            </template>
          </el-step>
          <el-step title="Task Received">
            <template v-if="+active > 1">
              <template slot="description">
                <div>{{ base.installer }}</div>
              </template>
              <template slot="description">
                <div v-if="base.startTime">{{ DATE_FORMAT('M/d/yyyy hh:mm:ss', +base.startTime * 1000) }}</div>
                <div v-else>--</div>
              </template>
            </template>
          </el-step>
          <el-step title="Completed">
            <template v-if="+active > 2">
              <template slot="description">
                <div>{{ base.installer }}</div>
              </template>
              <template slot="description">
                <div v-if="base.endTime">{{ DATE_FORMAT('M/d/yyyy hh:mm:ss', +base.endTime * 1000) }}</div>
                <div v-else>--</div>
              </template>
            </template>
          </el-step>
        </el-steps>
      </div>
    </el-card>
    <el-card class="pages-task-modify-card">
      <div class="pages-task-modify-card-title">Task Info</div>
      <el-form class="pages-task-modify-card-form" :model="base" :rules="rules" ref="ruleForm">
        <el-form-item v-for="(i, index) of formList" :key="i.prop" :prop="i.prop">
          <template slot="label"><span>{{ i.label }}</span></template>
          <template v-if="['remark', 'address'].includes(i.prop)">
            <el-input show-word-limit maxlength="200" style="width: 60vw" type="textarea" v-model="base[i.prop]"></el-input>
          </template>
          <template v-else-if="i.prop === 'appointTime'">
            <el-date-picker style="width: 100%" type="datetime" format="M/d/yyyy HH:mm"
                            v-model="base.appointTime"
                            size="medium"
            >
            </el-date-picker>
          </template>
          <template v-else-if="i.prop === 'type'">
            <el-input disabled v-model="['', 'Repair', 'Installation'][base[i.prop]]"></el-input>
          </template>
          <template v-else-if="i.prop === 'status'">
            <el-input disabled v-model="['', 'Pending', 'Processing', 'Complete'][base[i.prop]]"></el-input>
          </template>
          <template v-else-if="i.prop === 'phone'">
            <el-input @input="checkPhone" v-model="base[i.prop]" type="text" maxlength="20"></el-input>
          </template>
          <template v-else>
            <el-input :disabled="!(index > 5)" v-model="base[i.prop]"></el-input>
          </template>
        </el-form-item>
      </el-form>

    </el-card>
    <el-card class="pages-task-modify-card">
      <div class="pages-task-modify-card-title">Installer</div>
      <el-form class="pages-task-modify-card-form" :model="base" :rules="installRule" ref="installForm">
        <el-form-item label="Installer" class="my-item" prop="userName">
          <template slot="label"><span>Installer</span></template>
          <div class="posr">
            <el-input readonly style="width: 100%" v-model="base.installer" @focus="openAdd"></el-input>
            <i @click="openAdd" class="el-icon-search posa right-search"></i>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="pages-task-modify-footer">
      <common-flex justify="center">
        <el-button type="primary" @click="submitForm('ruleForm')">Submit</el-button>
        <el-button @click="cancel">Cancel</el-button>
      </common-flex>
    </el-card>
    <AddDialog :show.sync="showModel" :type="2" @change="getInstaller" :haveSelect="base.installUid" header="Please select a installer" />
  </div>
</template>

<script>
import { getTaskInfo, modifyTask } from '@/api/task'
import AddDialog from "@/views/components/add-dialog"

export default {
  name: "pages-task-modify",
  components: { AddDialog },
  data() {
    return {
      active: 1,
      installerInfo: {
        userName: '',
        id: ''
      },
      base: {},
      showModel: false,
      id: '',
      installRule: {
        installer: [
          { required: true, message: 'Please select a installer', trigger: 'change'}
        ]
      },
      rules: {
        phone: [
          { required: true, message: 'Please enter phone', trigger: 'blur'}
        ],
        appointTime: [
          { required: true, message: 'Please enter appoint time', trigger: 'change'}
        ],
        address: [
          { required: true, message: 'Please enter address', trigger: 'blur'}
        ],
      },
      formList: [
        {
          label: 'Task Type',
          prop: 'type'
        },
        {
          label: 'Task Code',
          prop: 'taskCode'
        },
        {
          label: 'Task Status',
          prop: 'status'
        },
        {
          label: 'Customer',
          prop: 'customer'
        },
        {
          label: 'Agency',
          prop: 'agentName'
        },
        {
          label: 'Mail',
          prop: 'email'
        },
        {
          label: 'Phone',
          prop: 'phone'
        },
        {
          label: 'Time of Appointment',
          prop: 'appointTime'
        },
        {
          label: 'Address',
          prop: 'address'
        },
        {
          label: 'Remarks',
          prop: 'remark'
        },
      ],
      submit1: false,
      submit2: false,
    }
  },
  created() {
    this.id = this.$route.params?.id
    this.base.uid = this.id
    getTaskInfo(this.id).then(res => {
      if (res.data.appointTime) res.data.appointTime = this.DATE_FORMAT('M/d/yyyy hh:mm', +res.data.appointTime * 1000)
      this.base = res.data
      this.installerInfo.id = res.data.installUid
      this.active = +this.base.status
    })
  },
  methods: {
    checkPhone() {
      this.base.phone = this.PHONE_REG(this.base.phone)
    },
    cancel() {
      history.go(-1)
    },
    getInstaller(data) {
      this.installerInfo = data
      this.base.installer = data.userName
      this.base.installUid = data.id
    },
    // 打开add弹窗
    openAdd() {
      this.showModel = true
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) this.submit1 = true
        else this.submit1 = false
      })
      this.$refs.installForm.validate((valid) => {
        if (valid) this.submit2 = true
        else this.submit2 = false
      })

      if (this.submit1 && this.submit2) {
        let data = {
          type: 2,
          address: this.base.address,
          uid: this.base.id,
          installUid: this.installerInfo.id,
          remark: this.base.remark,
          appointTime: new Date(this.base.appointTime).getTime() / 1000,
          phone: this.base.phone,
          id: this.id
        }
        this.$modal.loading()
        modifyTask(data).then(res => {
          if (+res.code === 200) {
            // Add successfully!
            this.$message({
              type: 'success',
              message: 'Succeeded!'
            })
            setTimeout(() => {
              this.$router.push('/task/install')
            }, 500)
          }
        }).finally(() => this.$modal.closeLoading())
      }
    },
  }
}
</script>

<style lang="scss">
.pages-task-modify {
  padding: 24px;
  &-card {
    margin-bottom: 24px;
    padding-bottom: 20px;
    &-title {
      font-weight: 700;
    }
    .custom-step {
      .is-process {
        color: #909399;
        font-weight: 400;
      }
      .el-step__main {
        margin-top: 15px;
      }
      .el-step__icon {
        position: absolute;
        top: 6px;
        left: 0;
        @include wh(8);
        border-color: #E1E1E1;
        background-color: #E1E1E1;
      }
      .el-step__icon-inner {
        display: none;
      }
      .is-success {
        color: #3EBCD4;
        border-color: #3EBCD4;
        .el-step__icon {
          background-color: #3EBCD4;
          border-color: #3EBCD4;
        }
      }
      .el-step__line {
        top: 9px;
      }
    }
    &-form {
      padding: 0 50px;
      display: flex;
      //justify-content: space-between;
      flex-wrap: wrap;
      .el-form-item {
        margin-right: 60px;
        min-width: calc(100% / 3 - 80px);
      }
      >:nth-child(3n) {
        margin-right: 0;
      }
      .require-prop {
        color: #FF0000;
      }
    }
    .my-item {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      .el-form-item__label {
        text-align: left;
      }
      .right-search {
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 20px;
        color: #898989;
        cursor: pointer;
        z-index: 2;
      }
    }
  }
  .el-radio__label {
    display: none;
  }
}
</style>
