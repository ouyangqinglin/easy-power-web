<template>
  <div class="pages-fault-toRepair">
    <el-card class="pages-fault-toRepair-card">
      <div class="pages-fault-toRepair-card-title">Info</div>
      <el-form class="pages-fault-toRepair-card-form" :model="base" :rules="rule" ref="ruleForm">
        <el-form-item prop="title" label="Fault Title">
          <el-input maxlength="50" v-model="base.title" type="text" />
        </el-form-item>
        <el-form-item prop="remark" label="Fault Description">
          <el-input maxlength="200" v-model="base.remark" type="textarea" />
        </el-form-item>
        <common-flex justify="space-between">
          <el-form-item prop="type" label="Task Type">
            <el-input v-model="['Repair', 'Installation'][0]" disabled type="text" />
          </el-form-item>
          <el-form-item prop="taskCode" label="Task Code">
            <el-input v-model="base.taskCode" disabled type="text" />
          </el-form-item>
          <el-form-item prop="siteName" label="Site">
            <el-input v-model="base.siteName" disabled type="text" />
          </el-form-item>
        </common-flex>
        <common-flex justify="space-between">
          <el-form-item prop="agentName" label="Agency" style="margin-right: 90px">
            <el-input v-model="base.agentName" disabled type="text" />
          </el-form-item>
          <el-form-item prop="appointTime" label="Time of Appointment" style="margin-right: 90px">
            <el-date-picker style="width: 100%" type="datetime" format="M/d/yyyy HH:mm"
                            v-model="base.appointTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            size="medium" />
          </el-form-item>
          <el-form-item prop="customer" label="Customer" style="margin-right: 90px">
            <el-input v-model="base.customer" disabled type="text" />
          </el-form-item>
        </common-flex>
        <common-flex>
          <el-form-item prop="phone" label="Phone" style="margin-right: 90px">
            <el-input v-model="base.phone" type="text" />
          </el-form-item>
        </common-flex>
        <el-form-item prop="address" label="Address">
          <el-input v-model="base.address" maxlength="50" type="text" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="pages-fault-toRepair-card">
      <div class="pages-fault-toRepair-card-title">Repairman</div>
      <el-form class="pages-fault-toRepair-card-form" :model="repairmanInfo" :rules="manRule" ref="installForm">
        <common-flex>
          <el-form-item label="RepairMan" class="my-item" prop="userName">
            <template slot="label"><span>Repairman</span></template>
            <div class="posr">
              <el-input @focus="openMan" style="width: 100%" readonly v-model="repairmanInfo.userName"></el-input>
              <i @click="openMan" class="el-icon-search posa right-search"></i>
            </div>
          </el-form-item>
        </common-flex>
      </el-form>
    </el-card>
    <el-card class="pages-fault-toRepair-footer">
      <common-flex justify="center">
        <el-button @click="submit('ruleForm')" type="primary">Submit</el-button>
        <el-button @click="cancel">Cancel</el-button>
      </common-flex>
    </el-card>
    <AddDialog :show.sync="show" :type="2" @change="getRepairman" header="Please select a Repairman" />
  </div>
</template>

<script>
import { getTaskInfo, createTask } from '@/api/task'
import AddDialog from "@/views/components/add-dialog"


export default {
  name: "pages-fault-toRepair",
  dicts: ['fault_status'],
  components: { AddDialog },
  data() {
    return {
      base: {},
      id: '',
      show: false,
      repairmanInfo: {
        userName: '',
        id: ''
      },
      manRule: {
        userName: [
          { required: true, message: 'Please select a installer', trigger: 'change'}
        ]
      },
      submit1: false,
      submit2: false,
      rule: {
        title: [
          { required: true, message: 'Please enter', trigger: 'blur'}
        ],
        remark: [
          { required: true, message: 'Please enter', trigger: 'blur'}
        ],
        appointTime: [
          { type: 'string', required: true, message: 'Please enter', trigger: 'blur' }
        ],
        customer: [
          { required: true, message: 'Please enter', trigger: 'blur'}
        ],
        phone: [
          { required: true, message: 'Please enter', trigger: 'blur'}
        ],
        address: [
          { required: true, message: 'Please enter', trigger: 'blur'}
        ],
        repairMan: [
          { required: true, message: 'Please enter', trigger: 'blur'}
        ]
      },
    }
  },
  created() {
    this.id = this.$route.params?.id
    getTaskInfo(this.id).then(res => {
      this.base = res.data
    })
  },
  methods: {
    getRepairman(i) {
      this.repairmanInfo = i
    },
    beforeClose() {
      this.show = false
    },
    submit(formName) {
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
          type: 1,
          address: this.base.address,
          uid: this.base.id,
          installUid: this.repairmanInfo.id,
          remark: this.base.remark,
          appointTime: this.DATE_FORMAT('yyyy-MM-dd hh:mm:ss', new Date(this.base.appointTime)),
          phone: this.base.phone,
          title: this.base.title,
          id: this.id,
          siteCode: this.base.siteCode,
          agencyId: this.base.agencyId
        }
        createTask(data).then(res => {
          if (+res.code === 200) {
            this.$message({
              type: 'success',
              message: 'Succeeded!'
            })
            setTimeout(() => {
              this.$router.push('/task/faultRepair')
            }, 500)
          }
        })
      }
    },
    cancel() {
      history.go(-1)
    },
    openMan() {
      this.show = true
    },
  }
}
</script>

<style lang="scss">
.pages-fault-toRepair {
  padding: 24px;
  &-card {
    margin-bottom: 24px;
    padding-bottom: 20px;
    &-title {
      margin-bottom: 12px;
      font-weight: 700;
    }
    &-form {
      padding: 0 50px;
      .el-form-item {
        min-width: calc(100% / 3 - 60px);
      }
      .require-prop {
        color: #FF0000;
      }
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
  .el-radio__label {
    display: none;
  }
}
</style>
