<template>
  <OADialog title="处理考勤" v-model="dialogVisible" @submit="onSubmitAbsent">
    <el-form
      :model="absentForm"
      :rules="rules"
      ref="absentFormRef"
      label-width="100px"
    >
      <el-form-item label="结果" prop="status">
        <el-radio-group v-model="absentForm.status">
          <el-radio :value="2">通过</el-radio>
          <el-radio :value="3">拒绝</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 此处同样会出现关闭后，提示不消失的BUG，后续解决 -->
      <el-form-item label="理由" prop="response_content">
        <el-input
          autocomplete="off"
          type="textarea"
          v-model="absentForm.response_content"
        />
      </el-form-item>
    </el-form>
  </OADialog>
  <OAMain title="下属考勤">
    <el-card>
      <el-table :data="absents" style="width: 100%; text-align: center">
        <el-table-column prop="title" label="标题" width="120" />
        <el-table-column label="发起者" width="120">
          <template #default="scope">
            {{
              scope.row.requester.department.name +
              " " +
              scope.row.requester.realname
            }}
          </template>
        </el-table-column>
        <el-table-column prop="absent_type.name" label="类型" width="60" />
        <el-table-column prop="request_content" label="原因" />
        <el-table-column label="发起时间" width="150">
          <template #default="scope">
            {{ timeFormatter.stringFromDateTime(scope.row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="start_date" label="开始日期" width="150" />
        <el-table-column prop="end_date" label="结束日期" width="150" />
        <el-table-column label="审核人" width="70" prop="responder.realname" />
        <el-table-column prop="response_content" label="反馈意见" />
        <el-table-column label="审核状态">
          <template #default="scope">
            <el-tag type="info" v-if="scope.row.status == 1">审核中</el-tag>
            <el-tag type="success" v-else-if="scope.row.status == 2"
              >已通过</el-tag
            >
            <el-tag type="danger" v-else="scope.row.status == 3">已拒绝</el-tag>
          </template>
        </el-table-column>
        <!-- 此处审核状态和处理状态两个标签距离不美观，后续处理 -->
        <el-table-column label="处理状态" width="100">
          <template #default="scope">
            <el-button
              v-if="scope.row.status == 1"
              type="primary"
              icon="EditPen"
              @click="onShowDialog(scope.$index)"
            />
            <el-button v-else disabled type="default">已处理</el-button>
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

<script setup name="subabsent">
import timeFormatter from "@/utils/timeFormatter";
import absentHttp from "@/api/absentHttp";
import { ref, reactive, onMounted, watch } from "vue";
import { ElMessage } from "element-plus";
import OAMain from "@/components/OAMain.vue";
import OAPagination from "@/components/OAPagination.vue";
import OADialog from "@/components/OADialog.vue";

let absents = ref([]);
let pagination = reactive({
  total: 0,
  page: 1,
});
let dialogVisible = ref(false);
let absentForm = reactive({
  status: 2,
  response_content: "",
});
let rules = reactive({
  status: [{ required: true, message: "请选择处理结果", trigger: "change" }],
  response_content: [
    { required: true, message: "请输入理由", trigger: "blur" },
  ],
});
let absentFormRef = ref();
let handleIndex = null;

const onShowDialog = (index) => {
  dialogVisible.value = true;
  absentForm.status = 2;
  absentForm.response_content = "";
  handleIndex = index;
};

const onSubmitAbsent = () => {
  absentFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        dialogVisible.value = false;
        const absent = absents.value[handleIndex];
        const data = await absentHttp.handelSubAbsent(
          absent.id,
          absentForm.status,
          absentForm.response_content
        );
        absents.value.splice(handleIndex, 1, data);
        ElMessage.success("下属考勤处理完成");
      } catch (detail) {
        ElMessage.error(detail);
      }
    }
  });
};

// 这里需要添加一个可以和个人考勤处一样的可以在数据超出指定的时候自动换页
const fetchSubList = async (page) => {
  try {
    let data = await absentHttp.getSubAbsents(page);
    pagination.total = data.count;
    pagination.page = page;
    absents.value = data.results;
  } catch (detail) {
    console.log(pagination.total);
    console.log(pagination.page);
    console.log(informs.value);
    ElMessage.error(detail);
  }
};

watch(
  () => pagination.page,
  (value) => {
    fetchSubList(value);
  }
);

onMounted(async () => {
  try {
    fetchSubList(1);
  } catch (detail) {
    ElMessage.error(detail);
  }
});
</script>

<style scoped>
.el-pagination {
  justify-content: center;
}
.el-table * {
  text-align: center;
}
</style>
