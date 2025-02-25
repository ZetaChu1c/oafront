<template>
  <el-pagination
    background
    layout="prev, pager, next"
    :total="props.total"
    v-model:current-page="page"
    :page-size="props.pageSize"
  />
</template>

<script setup name="OAPagination">

let props = defineProps({
  total: {
    type: Number,
    default: 0,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
});

let page = defineModel({ required: true });
</script>

<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
