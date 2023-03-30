<template>
  <div class="pages-task-add">
    <el-card class="pages-task-add-card">
      <div class="pages-task-add-card-title">Task Info</div>
      <el-form class="pages-task-add-card-form" :model="base" :rules="rules" ref="ruleForm">
        <el-form-item v-for="(i, index) of formList" :key="i.prop" :prop="i.prop">
          <template slot="label"><span>{{ i.label }}</span></template>
          <template v-if="i.prop === 'remark'">
            <el-input maxlength="200" style="width: 60vw" type="textarea" v-model="base[i.prop]"></el-input>
          </template>
          <template v-else-if="i.prop === 'appointTime'">
            <el-date-picker style="width: 100%" type="datetime" format="M/d/yyyy HH:mm"
                            v-model="base.appointTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            size="medium"
            />
          </template>
          <template v-else-if="i.prop === 'type'">
            <el-input disabled v-model="['', 'Repair', 'Installation'][2]"></el-input>
          </template>
          <template v-else-if="i.prop === 'status'">
            <el-input disabled v-model="['', 'Pending', 'Processing', 'Complete'][base[i.prop]]"></el-input>
          </template>
          <template v-else>
            <el-input :disabled="!(index > 5)" v-model="base[i.prop]"></el-input>
          </template>
        </el-form-item>
      </el-form>

    </el-card>
    <el-card class="pages-task-add-card">
      <div class="pages-task-add-card-title">Installer</div>
      <el-form class="pages-task-add-card-form" :model="installerInfo" :rules="installRule" ref="installForm">
        <el-form-item label="Installer" class="my-item" prop="userName">
          <template slot="label"><span>Installer</span></template>
          <div class="posr">
            <el-input @focus="openAdd" style="width: 100%" readonly v-model="installerInfo.userName"></el-input>
            <i @click="openAdd" class="el-icon-search posa right-search"></i>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="pages-task-add-footer">
      <common-flex justify="center">
        <el-button type="primary" @click="submitForm('ruleForm')">Submit</el-button>
        <el-button @click="cancel">Cancel</el-button>
      </common-flex>
    </el-card>
    <AddDialog :show.sync="showModel" :type="2" @change="getInstaller" header="Please select a installer" />
  </div>
</template>

<script>
import { getAtiUser } from '@/api/user'
import { createTask } from '@/api/task'
import AddDialog from "@/views/components/add-dialog"

export default {
  name: "pages-task-add",
  components: { AddDialog },
  data() {
    return {
      baseInfo: {
        type: 'Installation',
        address: '',
        code: 'System generation',
        appointTime: '',
        uid: '',
        installUid: '',
        phone: '',
        remarke: '',
        status: '--',
      },
      installerInfo: {
        userName: '',
        id: ''
      },
      base: {},
      showModel: false,
      id: '',
      installRule: {
        userName: [
          { required: true, message: 'Please select a installer', trigger: 'change'}
        ]
      },
      rules: {
        phone: [
          { required: true, message: 'Please enter phone', trigger: 'blur'}
        ],
        appointTime: [
          { type: 'string', required: true, message: 'Please enter appointTime', trigger: 'blur'}
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
          prop: 'code'
        },
        {
          label: 'Task Status',
          prop: 'status'
        },
        {
          label: 'Customer',
          prop: 'userName'
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
    getAtiUser(this.id).then(res => {
      this.base = {...this.baseInfo, ...res.data}
    })
  },
  methods: {
    cancel() {
      history.go(-1)
    },
    getInstaller(data) {
      this.installerInfo = data
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
          appointTime: this.base.appointTime,
          phone: this.base.phone,
          agencyId: this.base.agencyId
        }
        createTask(data).then(res => {
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
        })
      }
    },
  }
}
</script>

<style lang="scss">
.pages-task-add {
  padding: 24px;
  &-card {
    margin-bottom: 24px;
    padding-bottom: 20px;
    &-title {
      font-weight: 700;
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
