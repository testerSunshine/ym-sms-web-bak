<template>
  <div>
<!--    <el-button type="text" @click="jump">问题反馈</el-button>-->
    <question-report-dialog v-model="editDialog" type="recharge" @success="success"></question-report-dialog>
  </div>
</template>

<script>
import questionReportDialog from "./component/QuestionReportDialog";
import {elSuccess} from "@/util/message";

export default {
    name: "QuestionReport",
    components: {questionReportDialog},
    data() {
      return {
        editDialog: false
      }
    },
    methods: {
        jump() {
          this.editDialog = true
        },
        success(msg) {
          elSuccess(msg)
          this.editDialog = false
        },
    },
}
</script>
