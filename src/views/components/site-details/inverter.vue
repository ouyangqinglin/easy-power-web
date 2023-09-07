<template>
  <common-flex auto class="comp-device-card-content-right">
    <common-flex direction="column" align="center">
      <img class="device-battery" :src="require('./img/device-inverter.svg')" alt=""><br>
      <!--            <span class="status-tips" v-if="+curDevInfo.net === 1">on-line</span>-->
      <!--            <span class="status-tips" v-else>off-line</span>-->
    </common-flex>
    <common-flex direction="column" auto class="comp-device-card-content-right-container">
      <div class="item">
        <div class="item-title">Inverter Basic Info</div>
        <common-flex class="item-body" wrap="wrap">
          <div class="item-body-item charge">
            <div class="item-body-item-key">Serial Number</div>
            <div class="item-body-item-value">{{ inverterInfo.serialNumber }}</div>
          </div>
          <div class="item-body-item charge">
            <div class="item-body-item-key">New installation or not</div>
            <div class="item-body-item-value">{{ ['', 'Yes', 'No'][inverterInfo.installation] || '--' }}</div>
          </div>
          <div class="item-body-item charge">
            <div class="item-body-item-key">Rated Power (kW)</div>
            <div class="item-body-item-value">{{ inverterInfo.nameplateCapacity }}</div>
          </div>
          <div class="item-body-item charge">
            <div class="item-body-item-key">Lifetime</div>
            <div class="item-body-item-value">{{ inverterInfo.lifetime }}</div>
          </div>
        </common-flex>
      </div>
      <div class="item">
        <div class="item-title">Device Current Version</div>
        <common-flex class="item-body" wrap="wrap">
          <div class="item-body-item">
            <div class="item-body-item-key">Software Version</div>
            <div class="item-body-item-value">{{ inverterInfo.version || '--' }}</div>
          </div>
          <div class="item-body-item">
            <div class="item-body-item-key">Hardware Version</div>
            <div class="item-body-item-value">{{ ['', 'Yes', 'No'][inverterInfo.hardVersion] || '--' }}</div>
          </div>
          <div class="item-body-item">
            <div class="item-body-item-key">Upgrade Time</div>
            <div class="item-body-item-value">{{ inverterInfo.upgradeTime || '--' }}</div>
          </div>
        </common-flex>
      </div>
      <div class="table posr">
        <div class="table-before posa">Grid</div>
        <div class="table-export posa" v-if="+base.gridStatus === 1">Export</div>
        <div class="table-export posa" v-if="+base.gridStatus === 2">Import</div>
        <div class="table-title">Real-Time Data</div>
        <el-table :data="inverterInfo.gridList">
          <el-table-column label="" prop="pvNum"></el-table-column>
          <el-table-column label="Voltage(V)" prop="v"></el-table-column>
          <el-table-column label="Current(A)" prop="c"></el-table-column>
          <el-table-column label="Power(kW)" prop="p"></el-table-column>
        </el-table>
      </div>
      <div class="item">
        <div class="item-title">Export Energy</div>
        <common-flex class="item-body" wrap="wrap">
          <div class="item-body-item">
            <div class="item-body-item-key">Today</div>
            <div class="item-body-item-value">{{ inverterInfo.dayGridExportEnergy || '--' }}kWh</div>
          </div>
          <div class="item-body-item">
            <div class="item-body-item-key">This Month</div>
            <div class="item-body-item-value">{{ inverterInfo.monthGridExportEnergy || '--' }}kWh</div>
          </div>
          <div class="item-body-item">
            <div class="item-body-item-key">This Year</div>
            <div class="item-body-item-value">{{ inverterInfo.yearGridExportEnergy || '--' }}kWh</div>
          </div>
          <div class="item-body-item">
            <div class="item-body-item-key">Lifetime</div>
            <div class="item-body-item-value">{{ inverterInfo.allGridExportEnergy || '--' }}kWh</div>
          </div>
        </common-flex>
      </div>
      <div class="item">
        <div class="item-title">Import Energy This Month</div>
        <common-flex class="item-body" wrap="wrap">
          <div class="item-body-item">
            <div class="item-body-item-key">On-Peak</div>
            <div class="item-body-item-value">{{ inverterInfo.gridOnPeak }}kWh</div>
          </div>
          <div class="item-body-item">
            <div class="item-body-item-key">Mid-Peak</div>
            <div class="item-body-item-value">{{ inverterInfo.gridMidPeak }}kWh</div>
          </div>
          <div class="item-body-item">
            <div class="item-body-item-key">Off-Peak</div>
            <div class="item-body-item-value">{{ inverterInfo.gridOffPeak }}kWh</div>
          </div>
        </common-flex>
      </div>
      <div class="table posr">
        <div class="table-before posa">Load</div>
        <div class="table-title">Real-Time Data</div>
        <el-table :data="inverterInfo.loadList">
          <el-table-column label="" prop="pvNum"></el-table-column>
          <el-table-column label="Voltage(V)" prop="v"></el-table-column>
          <el-table-column label="Current(A)" prop="c"></el-table-column>
          <el-table-column label="Power(kW)" prop="p"></el-table-column>
        </el-table>
      </div>
    </common-flex>
  </common-flex>
</template>

<script>
export default {
  name: 'comp-inverter',
  props: {
    base: {
      type: Object,
      default: () => {
        return {}
      }
    },
    curDevInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    inverterInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
}
</script>

<style lang="scss">

</style>
