<template>
  <div class="app-container pages-analysis-fault">
    <common-flex justify="flex-end" class="time-zone">Statistical basis time zone: {{ utc }}</common-flex>
    <el-card class="echarts-card">
      <p>Alarm Quantity</p>
      <el-row>
        <el-col :span="6">
          <div class="num" style="color: #FF6464">{{ total.open }}</div>
          <div class="date">Currently Open</div>
        </el-col>
        <el-col :span="6">
          <div class="num">{{ total.day }}</div>
          <div class="date">Today</div>
        </el-col>
        <el-col :span="6">
          <div class="num">{{ total.month }}</div>
          <div class="date">This Month</div>
        </el-col>
        <el-col :span="6">
          <div class="num">{{ total.year }}</div>
          <div class="date">This Year</div>
        </el-col>
      </el-row>
    </el-card>
    <el-row :gutter="16">
      <el-col :span="14">
        <el-card class="echarts-card">
          <AlarmStatistics />
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card class="echarts-card">
          <AlarmDistribute />
        </el-card>
      </el-col>
    </el-row>
    <el-card>
      <AlarmRank />
    </el-card>
  </div>
</template>

<script>
import AlarmStatistics from "@/views/components/analysis/fault/alarmStatistics.vue";
import AlarmDistribute from "@/views/components/analysis/fault/alarmDistribute.vue";
import AlarmRank from "@/views/components/analysis/fault/alarmRank.vue";
import { getTotalNum } from '@/api/fault'
import {mapState} from "vuex";
export default {
  name: "analysis-fault",
  components: {
    AlarmStatistics,
    AlarmDistribute,
    AlarmRank
  },
  computed: {
    ...mapState({
      'utc': state => state.user.utc,
    })
  },
  data() {
    return {
      total: {}
    }
  },
  mounted() {
    getTotalNum().then(res => {
      this.total = res.data
    })
  }
}
</script>

<style lang="scss">
.pages-analysis-fault {
  .time-zone {
    margin-bottom: 8px;
    @include nFont(12 #909399)
  }
  .echarts-card {
    margin-bottom: 20px;
    p {
      font-weight: 700;
    }
    .num {
      @include nFont(24 700 35);
      text-align: center;
    }
    .date {
      @include nFont(14 35);
      text-align: center;
    }
    .el-card__body {
      padding-top: 0;
    }
  }
}
</style>
