<template>
  <OAMain title="通知详情">
    <el-card>
      <template #header>
        <div style="text-align: center">
          <h2 style="padding-bottom: 20px">{{ inform.title }}</h2>
          <div>
            <span style="margin-right: 25px"
              >作者：{{ inform.author.realname }}</span
            >
            <span>{{
              timeFormatter.stringFromDateTime(inform.create_time)
            }}</span>
          </div>
        </div>
      </template>
      <template #default>
        <div v-html="inform.content" class="content"></div>
      </template>
      <template #footer> 阅读量: {{ inform.read_count }} </template>
    </el-card>
  </OAMain>
</template>

<script setup name="informdetail">
import timeFormatter from "@/utils/timeFormatter";
import informHttp from "@/api/informHttp";
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import OAMain from "@/components/OAMain.vue";
import OAPagination from "@/components/OAPagination.vue";
import OADialog from "@/components/OADialog.vue";
import { useRoute } from "vue-router";

const route = useRoute();

let inform = reactive({
  title: "",
  content: "",
  create_time: "",
  author: {
    realname: "",
    department: {
      name: "",
    },
  },
});

onMounted(async () => {
  try {
    const pk = route.params.pk;
    let data = await informHttp.getInformDetail(pk);
    Object.assign(inform, data);

    // 发送请求，用于阅读通知
    await informHttp.readInform(pk);
  } catch (detail) {
    ElMessage.error("您查看的通知已被删除");
  }
});
</script>

<style scoped>
.content :deep(img) {
  max-width: 100%;
}
</style>
