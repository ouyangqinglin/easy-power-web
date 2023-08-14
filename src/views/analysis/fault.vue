<template>
  <div class="app-container pages-analysis-fault">
    <el-card class="card">
      <p>Alarm Quantity</p>
      <el-row>
        <el-col :span="6">
          <div class="num">22</div>
          <div class="date">today</div>
        </el-col>
        <el-col :span="6">
          <div class="num">22</div>
          <div class="date">This Month</div>
        </el-col>
        <el-col :span="6">
          <div class="num">22</div>
          <div class="date">This Year</div>
        </el-col>
        <el-col :span="6">
          <div class="num">22</div>
          <div class="date">Currently Open</div>
        </el-col>
      </el-row>
    </el-card>
    <el-row :gutter="16">
      <el-col :span="14">
        <el-card>
          <AlarmStatistics />
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card>
          <AlarmDistribute />
        </el-card>
      </el-col>
    </el-row>
    <el-card style="margin-top: 20px">
      <AlarmRank />
    </el-card>
  </div>
</template>

<script>
import AlarmStatistics from "@/views/components/analysis/fault/alarmStatistics.vue";
import AlarmDistribute from "@/views/components/analysis/fault/alarmDistribute.vue";
import AlarmRank from "@/views/components/analysis/fault/alarmRank.vue";
export default {
  name: "analysis-fault",
  components: {
    AlarmStatistics,
    AlarmDistribute,
    AlarmRank
  }
}
</script>

<style lang="scss">
.pages-analysis-fault {
  .card {
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
  }
}
</style>
