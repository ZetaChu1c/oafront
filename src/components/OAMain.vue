<template>
  <el-space direction="vertical" fill :size="20" style="width: 100%">
    <OAPageHeader :content="props.title"></OAPageHeader>

    <slot></slot>
  </el-space>
</template>

<script setup>
import OAPageHeader from "./OAPageHeader.vue";

let props = defineProps({
  title: "",
});
</script>

<style scoped>
.el-space :deep(.el-space__item) {
  width: 100%;
}
</style>
