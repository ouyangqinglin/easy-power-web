<template>
  <div class="pages-task-repair-modify">
    <el-card class="pages-task-repair-modify-card">
      <div class="pages-task-repair-modify-card-title">Process</div>
      <div style="padding: 0 80px">
        <el-steps class="custom-step" :active="active" finish-status="success">
          <el-step title="Task Created">
            <template slot="description">
              <div>{{ base.createBy }}</div>
            </template>
            <template slot="description">
              <div v-if="base.createTime">{{ DATE_FORMAT('M/d/yyyy hh:mm:ss', new Date(base.createTime)) }}</div>
              <div v-else>--</div>
            </template>
          </el-step>
          <el-step title="Task Received">
            <template v-if="+active > 1">
              <template slot="description">
                <div>{{ base.installer }}</div>
              </template>
              <template slot="description">
                <div v-if="base.startTime">{{ DATE_FORMAT('M/d/yyyy hh:mm:ss', new Date(base.startTime)) }}</div>
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
                <div v-if="base.endTime">{{ DATE_FORMAT('M/d/yyyy hh:mm:ss', new Date(base.endTime)) }}</div>
                <div v-else>--</div>
              </template>
            </template>
          </el-step>
        </el-steps>
      </div>
    </el-card>
    <el-card class="pages-task-repair-modify-card">
      <div class="pages-task-repair-modify-card-title">Info</div>
      <el-form class="pages-task-repair-modify-card-form" :model="base" :rules="rule" ref="ruleForm">
        <el-form-item prop="title" label="Fault Title">
          <el-input v-model="base.title" type="text" />
        </el-form-item>
        <el-form-item prop="remark" label="Fault Description">
          <el-input maxlength="200" v-model="base.remark" type="textarea" />
        </el-form-item>
        <common-flex>
          <el-form-item prop="type" label="Task Type" style="margin-right: 90px">
            <el-input v-model="['', 'Repair', 'Installation'][1]" disabled type="text" />
          </el-form-item>
          <el-form-item prop="taskCode" label="Task Code">
            <el-input v-model="base.taskCode" placeholder="System generation" disabled type="text" />
          </el-form-item>
        </common-flex>
        <common-flex justify="space-between">
          <el-form-item prop="siteName" label="Site" style="margin-right: 90px">
            <el-input v-model="base.siteName" disabled type="text" />
          </el-form-item>
          <el-form-item prop="agentName" label="Agency" style="margin-right: 90px">
            <el-input v-model="base.agentName" disabled type="text" />
          </el-form-item>
          <el-form-item prop="appointTime" label="Time of Appointment" style="margin-right: 90px">
            <el-date-picker style="width: 100%" type="datetime" format="M/d/yyyy HH:mm"
                            v-model="base.appointTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            size="medium" />
          </el-form-item>
        </common-flex>
        <common-flex>
          <el-form-item prop="uid" label="Customer" style="margin-right: 90px">
            <el-select style="width: 100%" v-model="base.uid" placeholder="Please select" :disabled="customerOption.length === 1">
              <el-option v-for="(i, k) of customerOption" :key="k" :label="i.userName" :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="phone" label="Phone" style="margin-right: 90px">
            <el-input v-model="base.phone" type="text" />
          </el-form-item>
        </common-flex>
        <el-form-item prop="address" label="Address">
          <el-input v-model="base.address" max-length="200" type="text" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="pages-task-repair-modify-card">
      <div class="pages-task-repair-modify-card-title">Repairman</div>
      <el-form class="pages-task-repair-modify-card-form" :model="base" :rules="manRule" ref="installForm">
        <common-flex>
          <el-form-item label="RepairMan" class="my-item" prop="installer">
            <template slot="label"><span>Repairman</span></template>
            <div class="posr">
              <el-input @focus="openMan" style="width: 100%" readonly v-model="base.installer"></el-input>
              <i @click="openMan" class="el-icon-search posa right-search"></i>
            </div>
          </el-form-item>
        </common-flex>
      </el-form>
    </el-card>
    <el-card class="pages-task-repair-modify-footer">
      <common-flex justify="center">
        <el-button @click="submit('ruleForm')" type="primary">Submit</el-button>
        <el-button @click="cancel">Cancel</el-button>
      </common-flex>
    </el-card>
    <AddDialog :show.sync="show" :type="2" @change="getRepairman" header="Please select a Repairman" />
  </div>
</template>

<script>
import { getTaskInfo, modifyTask } from '@/api/task'
import { getReCustomer } from '@/api/user'

import AddDialog from "@/views/components/add-dialog"


export default {
  name: "pages-repair-modify",
  dicts: ['fault_status'],
  components: { AddDialog },
  data() {
    return {
      active: 1,
      show: false,
      base: {},
      id: '',
      repairmanInfo: {
        userName: '',
        id: ''
      },
      customerOption: [],
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
        uid: [
          { required: true, message: 'Please select', trigger: ['blur', 'change']}
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
      this.repairmanInfo.id = res.data.installUid
      this.getReCustomer(this.base.siteCode)
    })
  },
  methods: {
    getReCustomer(code) {
      let data = {
        pageNum: 1,
        pageSize: 50,
        siteCode: code
      }
      getReCustomer(data).then(res => {
        this.customerOption = res.rows
        if (this.customerOption.length === 1) this.base.uid = this.customerOption[0].id
      })
    },
    getRepairman(i) {
      this.repairmanInfo = i
      this.base.installer = i.userName
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
          uid: this.base.uid,
          installUid: this.repairmanInfo.id,
          remark: this.base.remark,
          appointTime: this.DATE_FORMAT('yyyy-MM-dd hh:mm:ss', new Date(this.base.appointTime)),
          phone: this.base.phone,
          title: this.base.title,
          siteCode: this.base.siteCode,
          id: this.id,
          agencyId: this.base.agencyId
        }
        modifyTask(data).then(res => {
          if (+res.code === 200) {
            this.$message({
              type: 'success',
              message: 'Succeeded!'
            })
            setTimeout(() => {
              this.$router.push('/task/repair')
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
.pages-task-repair-modify {
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
        color: #FFB968;
        border-color: #FFB968;
        .el-step__icon {
          background-color: #FFB968;
          border-color: #FFB968;
        }
      }
      .el-step__line {
        top: 9px;
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
