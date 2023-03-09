<template>
  <common-flex class="comp-no-data" direction="column" justify="center" align="center">
    <img :src="require('@/components/common/img/noData.svg')" alt="">
    <span>No Data</span>
  </common-flex>
</template>

<script>
export default {
  name: "comp-no-data"
}
</script>

<style lang="scss">
.comp-no-data {
  height: 100%;
  img {
    @include wh(140 100)
  }
  span {
    margin-top: 10px;
    font-size: 12px;
  }
}
</style>
