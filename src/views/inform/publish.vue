<template>
  <OAMain title="发布通知">
    <el-card>
      <el-form :model="informForm" :rules="rules" ref="formRef">
        <el-form-item label="标题" :label-width="formLabelWidth" prop="title">
          <el-input v-model="informForm.title" autocomplete="off" />
        </el-form-item>

        <el-form-item
          label="部门可见"
          :label-width="formLabelWidth"
          prop="department_ids"
        >
          <el-select multiple v-model="informForm.department_ids">
            <el-option :value="0" label="所有部门"></el-option>
            <el-option
              v-for="department in departmens"
              :label="department.name"
              :value="department.id"
              :key="department.name"
            />
          </el-select>
        </el-form-item>
        <!-- 此处验证不生效后续修改 -->
        <!-- 当点击编辑框后，会自动生成一个br换行符，致使elementplus的数据认证认为此处有数据，不再进行验证 -->
        <el-form-item label="内容" :label-width="formLabelWidth" prop="content">
          <div style="border: 1px solid #ccc; flex: 1">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
              :mode="mode"
            />
            <Editor
              v-model="informForm.content"
              style="height: 300px; overflow-y: hidden"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="handleCreated"
            />
          </div>
        </el-form-item>
        <el-form-item>
          <div style="text-align: right; flex: 1">
            <el-button type="primary" @click="onsubmit">提交</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </OAMain>
</template>

<script setup name="publishinform">
import OAMain from "@/components/OAMain.vue";
import {
  ref,
  reactive,
  onMounted,
  computed,
  watch,
  shallowRef,
  onBeforeUnmount,
} from "vue";
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import staffHttp from "@/api/staffHttp";
import { ElMessage } from "element-plus";
import { useAuthStore } from "@/stores/auth";
import informHttp from "@/api/informHttp";
import router from "@/router";

const informForm = reactive({
  title: "",
  content: "",
  department_ids: [],
});

let formRef = ref();
let formLabelWidth = "100px";
let mode = "default";
let departmens = ref([]);
let authStore = useAuthStore();

let rules = reactive({
  title: [
    {
      required: true,
      message: "请输入标题",
      trigger: "blur",
    },
  ],
  content: [
    {
      required: true,
      message: "请输入内容",
      trigger: "blur",
    },
  ],
  department_ids: [
    {
      required: true,
      message: "请选择部门",
      trigger: "change",
    },
  ],
});

/////////// 以下是wangEditor相关配置 ///////////
import { Boot } from "@wangeditor/editor";

const editorRef = shallowRef();

const toolbarConfig = {};
// 此处如果使用火狐135.0.1（已测试）版本，会出现在编辑区输入中文，报DOMException: Node.removeChild错误
// 推测为火狐不支持的API，换其他浏览器测试
// https://github.com/wangeditor-next/wangEditor-next/issues/535
const editorConfig = {
  placeholder: "请输入内容",
  MENU_CONF: {
    uploadImage: {
      // http://localhost:5173/image/upload
      server: import.meta.env.VITE_BASE_URL + "/image/upload",
      fieldName: "image",
      maxFileSize: 0.5 * 1024 * 1024,
      maxNumberOfFiles: 10,
      allowedFileTypes: ["image/*"],
      headers: {
        Authorization: "JWT " + authStore.token,
      },
      timeout: 6 * 1000,
      customInsert(res, insertFn) {
        if (res.errno == 0) {
          let data = res.data;
          let url = import.meta.env.VITE_BASE_URL + data.url;
          let href = import.meta.env.VITE_BASE_URL + data.href;
          let alt = data.alt;
          insertFn(url, alt, href);
        } else {
          ElMessage.error(res.message);
        }
      },
      // 单个文件上传失败
      onFailed(file, res) {
        console.log(`${file.name} 上传失败`, res);
      },

      // 上传错误，或者触发 timeout 超时
      onError(file, err, res) {
        if (file.size > 0.5 * 1024 * 1024) {
          ElMessage.error("文件大小不能超过0.5M");
        } else {
          ElMessage.error("图片格式不正确");
        }
      },
    },
  },
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

// 重写 getHtml 方法，当编辑器内容为空时，返回空字符串
function withEmptyHtml(editor) {
  const { getHtml } = editor;
  const newEditor = editor;

  newEditor.getHtml = () => {
    if (newEditor.isEmpty()) {
      return "";
    }
    return getHtml();
  };

  return newEditor;
}

// 注册插件
Boot.registerPlugin(withEmptyHtml);

/////////// 以上是wangEditor相关配置 ///////////

onMounted(async () => {
  try {
    let data = await staffHttp.getAllDepartment();
    departmens.value = data.results;
  } catch (detail) {
    ElMessage.error(detail);
  }
});

const onsubmit = () => {
  formRef.value.validate(async (valid, fields) => {
    if (valid) {
      console.log(informForm);
      try {
        await informHttp.publishInform(informForm);
        ElMessage.success("通知发布成功");
        // 通知发布后，直接跳转到通知列表页
        router.push("list");
      } catch (detail) {
        ElMessage.error(detail);
      }
    }
  });
};
</script>

<style scoped></style>
