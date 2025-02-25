<template>
  <OADialog v-model="dialogVisible" title="提示" @submit="onDeleteInform">
    <span>您确定要删除这篇通知吗</span>
  </OADialog>
  <OAMain title="通知列表">
    <el-card>
      <el-table :data="informs" style="width: 100%">
        <el-table-column label="标题">
          <template #default="scope">
            <el-badge v-if="scope.row.reads.length == 0" is-dot>
              <RouterLink
                :to="{ name: 'inform_detail', params: { pk: scope.row.id } }"
                id="inform-title"
              >
                {{ scope.row.title }}
              </RouterLink>
            </el-badge>
            <RouterLink
              v-else
              :to="{ name: 'inform_detail', params: { pk: scope.row.id } }"
              id="inform-title"
            >
              {{ scope.row.title }}
            </RouterLink>
          </template>
        </el-table-column>
        <el-table-column label="发布者">
          <template #default="scope">
            {{
              scope.row.author.department.name + " " + scope.row.author.realname
            }}
          </template>
        </el-table-column>
        <el-table-column label="发布时间">
          <template #default="scope">
            <!-- 这里使用的是后端informs中models的created_time，不是absent中models的create_time -->
            {{ timeFormatter.stringFromDateTime(scope.row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column label="部门可见">
          <template #default="scope">
            <el-tag v-if="scope.row.public" type="success">公开</el-tag>
            <el-tag
              v-else
              v-for="department in scope.row.departments"
              type="info"
              :key="department.name"
              >{{ department.name }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
              v-if="scope.row.author.uid == authStore.user.uid"
              type="danger"
              icon="Delete"
              @click="onShowDialog(scope.$index)"
            />
            <el-button v-else disabled type="default">无</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <OAPagination
          v-model="pagination.page"
          :total="pagination.total"
        ></OAPagination>
      </template>
    </el-card>
  </OAMain>
</template>

<script setup name="informlist">
import OAMain from "@/components/OAMain.vue";
import { ref, reactive, onMounted, watch } from "vue";
import OADialog from "@/components/OADialog.vue";
import OAPagination from "@/components/OAPagination.vue";
import timeFormatter from "@/utils/timeFormatter";
import { useAuthStore } from "@/stores/auth";
import informHttp from "@/api/informHttp";
import { ElMessage } from "element-plus";

const authStore = useAuthStore();

const onShowDialog = (index) => {
  handleIndex = index;
  dialogVisible.value = true;
};

const onDeleteInform = async () => {
  try {
    let inform = informs.value[handleIndex];
    await informHttp.deleteInform(inform.id);
    informs.value.splice(handleIndex, 1);
    ElMessage.success("删除成功");
  } catch (detail) {
    ElMessage.error(detail);
  }
};

let informs = ref([]);
let dialogVisible = ref(false);
let handleIndex = 0;
let pagination = reactive({
  page: 1,
  total: 0,
});

// 此处的分页逻辑与absent/my.vue中的分页逻辑相同，可参考absent/my.vue中的注释
// 注意OAPagination.vue中的pageSize要与后端settings.py中的PAGE_SIZE一致
// 否则会出现分页不正确的问题
// 具体为在通知列表里多分出一页，但是无法访问
const fetchInformList = async (page) => {
  try {
    let data = await informHttp.getInformList(page);
    pagination.total = data.count;
    pagination.page = page;
    informs.value = data.results;
    // console.log(pagination.total);
    // console.log(pagination.page);
    // console.log(informs.value);
  } catch (detail) {
    ElMessage.error(detail);
  }
};

watch(
  () => pagination.page,
  (value) => {
    fetchInformList(value);
  }
);

onMounted(async () => {
  try {
    fetchInformList(1);
  } catch (detail) {
    ElMessage.error(detail);
  }
});
</script>

<style scoped>
/* 美观程度后续修改 */
.el-tag {
  margin-right: 10px;
}
.el-badge {
  margin-right: 4px;
  margin-top: 4px;
}
#inform-title {
  color: #337ab7;
}
</style>
