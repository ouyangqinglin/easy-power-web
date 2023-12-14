<template>
  <div>
    <template v-for="item in options">
      <template v-if="item.value === +value">
        <span :key="item.value">{{ item.label }}</span>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: "DictTag",
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    value: [Number, String],
  },
};
</script>
<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
