<template>
  <div>
    <template v-for="item in options">
      <template v-if="values.includes(item.value)">
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
      default: null,
    },
    value: [Number, String, Array],
  },
  computed: {
    values() {
      if (this.value !== null && typeof this.value !== 'undefined') {
        return Array.isArray(this.value) ? this.value : [+this.value];
      } else {
        return [];
      }
    },
  },

};
</script>
