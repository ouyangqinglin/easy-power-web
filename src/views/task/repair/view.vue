<template>
  <div class="pages-task-repair-view">
    <el-card class="pages-task-repair-view-card">
      <div class="pages-task-repair-view-card-title">Process</div>
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
    <el-card class="pages-task-repair-view-card">
      <div class="pages-task-repair-view-card-title">Info</div>
      <el-form class="pages-task-repair-view-card-form" :model="base" :rules="rule" ref="ruleForm">
        <el-form-item prop="title" label="Fault Title">
          <el-input disabled v-model="base.title" type="text" />
        </el-form-item>
        <el-form-item prop="remark" label="Fault Description">
          <el-input disabled v-model="base.remark" type="textarea" />
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
                            value-format="yyyy-MM-dd HH:mm"
                            disabled
                            size="medium" />
          </el-form-item>
        </common-flex>
        <common-flex>
          <el-form-item prop="customer" label="Customer" style="margin-right: 90px">
            <el-input v-model="base.customer" disabled type="text" />
          </el-form-item>
          <el-form-item prop="phone" label="Phone" style="margin-right: 90px">
            <el-input disabled v-model="base.phone" type="text" />
          </el-form-item>
        </common-flex>
        <el-form-item prop="address" label="Address">
          <el-input disabled v-model="base.address" type="text" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="pages-task-repair-view-card">
      <div class="pages-task-repair-view-card-title">Repaired Info</div>
      <el-form class="pages-task-repair-view-card-form" :model="base">
        <el-form-item label="Repair Description">
          <el-input type="textarea" disabled v-model="base.finishDesc"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="pages-task-repair-view-card">
      <div class="pages-task-repair-view-card-title">Repairman</div>
      <el-form class="pages-task-repair-view-card-form" :model="repairmanInfo" :rules="manRule" ref="installForm">
        <common-flex>
          <el-form-item label="RepairMan" class="my-item" prop="userName">
            <template slot="label"><span>Repairman</span></template>
            <div class="posr">
              <el-input disabled @focus="openMan" style="width: 100%" readonly v-model="repairmanInfo.userName"></el-input>
              <i @click="openMan" class="el-icon-search posa right-search"></i>
            </div>
          </el-form-item>
        </common-flex>
      </el-form>
    </el-card>
    <el-card class="pages-task-repair-view-footer">
      <common-flex justify="center">
        <el-button @click="cancel">Cancel</el-button>
      </common-flex>
    </el-card>
  </div>
</template>

<script>
import { getTaskInfo } from '@/api/task'

export default {
  name: "pages-repair-view",
  dicts: ['fault_status'],
  data() {
    return {
      active: 1,
      base: {
        type: 1
      },
      id: '',
      repairmanInfo: {
        userName: '',
        id: ''
      },
      manRule: {
        userName: [
          { required: true, message: 'Please select a installer', trigger: 'change'}
        ]
      },
      rule: {
        title: [
          { required: true, message: 'Please enter', trigger: 'blur'}
        ],
        remark: [
          { required: true, message: 'Please enter', trigger: 'blur'}
        ],
        appointTime: [
          { required: true, message: 'Please enter', trigger: 'blur' }
        ],
        customer: [
          { required: true, message: 'Please enter', trigger: 'blur'}
        ],
        phone: [
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
      if (res.data.appointTime) res.data.appointTime = this.DATE_FORMAT('M/d/yyyy hh:mm', +res.data.appointTime * 1000)
      this.base = res.data
      this.repairmanInfo.userName = this.base.installer
      this.repairmanInfo.id = this.base.installUid
      this.active = +this.base.status
    })
  },
  methods: {
    getRepairman(i) {
      this.repairmanInfo = i
    },
    beforeClose() {
      this.show = false
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
.pages-task-repair-view {
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
      cursor: not-allowed;
      z-index: 2;
    }
  }
  .el-radio__label {
    display: none;
  }
}
</style>
