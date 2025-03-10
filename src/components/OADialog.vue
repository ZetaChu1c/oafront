<!-- @submit="onSubmitAbsent"下面应该有一个@close -->

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="props.title"
    :width="props.width"
  >
    <slot></slot>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onSubmitt"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>

// 定义model：v-model
let dialogVisible = defineModel({ required: true });

// 定义属性
let props = defineProps({
  title: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "500px",
  },
});

// 定义事件
const emits = defineEmits(["submit", "cancel"]);

const onCancel = () => {
  dialogVisible.value = false;
  emits("cancel");
};

const onSubmitt = () => {
  dialogVisible.value = false;
  emits("submit");
};
</script>

<style scoped></style>
