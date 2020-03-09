/* eslint-disable */
<template>
  <div>
    <el-dialog title="上传图片"
               :visible.sync="childdialogFormVisible"
               width="510px">
      <el-form :model="form"
               ref="form"
               :rules="rules">
        <el-form-item label="上传图片"
                      :label-width="formLabelWidth">
          <el-upload class="upload-demo"
                     ref="newupload"
                     action="12345"
                     accept=".jpg,.png,.gif,.bmp"
                     :limit="10"
                     :file-list="fileList"
                     :auto-upload="false"
                     :before-upload="beforeUpload">
            <el-button slot="trigger"
                       size="small"
                       type="primary">选取文件</el-button>
            <div slot="tip"
                 class="el-upload__tip">只能上传jpg/png文件，只能上传10张</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="作品描述"
                      :label-width="formLabelWidth">
          <el-input v-model="form.description"
                    autocomplete="off"
                    class="w300"></el-input>
        </el-form-item>
        <!--  上传-->
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="resetForm('form')">取 消</el-button>
        <el-button type="primary"
                   @click="newSubmitForm ()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// eslint-disable-next-line
/* eslint-disable */
export default {
  data () {
    return {
    }
  },
  props: {
    childdialogFormVisible: false
  },
  created () {

  },
  methods: {
    beforeUpload (file) {
      console.log(file)
      let fd = new FormData();
      fd.append('file', file);
      fd.append('description', this.form.description);
      fd.append('title', this.form.title);
      fd.append('author', this.form.author);
      fd.append('phone', this.form.phone);
      fd.append('userId', "adminUser");
      fd.append('projectId', this.projectId);
      fd.append('folderId', this.folderId);
      // 开始加载
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$axios.post(this.BaseUrl + '/tpictoolsdetail/uploadpicture', fd).then(res => {
        //	            this.$axios.post('/api/tpictoolsdetail/uploadpicture', fd).then(res => {
        if (res.data.code === '200') {
          loading.close();
          console.log(res)
          this.$message({ message: '上传成功', type: 'success', offset: '300' });
          this.getpicList();
          this.dialogFormVisible = false;
        }
      })
      return true
    },
    newSubmitForm () {
      this.$refs.newupload.submit();
      this.resetForm('form');
    },

    //重置
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
  }
}
</script>
<style>
.w300 {
  width: 300px;
}
</style>