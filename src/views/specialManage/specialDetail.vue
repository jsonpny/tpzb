<template>
  <div class="special-detail">
    <el-row>

      <div class="title">
        <span>专题基本信息</span>

        <el-button @click="edit"
                   class="el-icon-edit icon-cursor"
                   size="mini"
                   title="编辑"
                   type="primary"
                   v-show="editicon">编辑</el-button>

      </div>

    </el-row>

    <!-- 信息编辑 -->
    <template v-if="editpanel">
      <div class="edit">
        <el-form :model="form"
                 label-width="90px"
                 ref="form">

          <el-form-item label="专题名称"
                        prop="titile">
            <el-input placeholder="请填写单位名称"
                      v-model="form.titile"></el-input>
          </el-form-item>

          <el-form-item>
            <el-select placeholder="专题类型"
                       v-model="form.projectType">
              <el-option :key="item.code"
                         :label="item.name"
                         :value="item.code"
                         v-for="item in projectTypes"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="时间范围">
            <el-col :span="11">
              <el-form-item prop="startTime">
                <el-date-picker type="date"
                                placeholder="选择开始日期"
                                v-model="form.startTime"
                                style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line"
                    :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="endTime">
                <el-date-picker type="date"
                                placeholder="选择结束日期"
                                v-model="form.endTime"
                                style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item label="专题地点"
                        prop="siteWrite">
            <el-input placeholder="请填写单位地址"
                      v-model="form.siteWrite"></el-input>
          </el-form-item>

          <el-form-item label="专题简介"
                        prop="description">
            <el-input :autosize="{ minRows: 5, maxRows: 10}"
                      placeholder="请填写专题简介"
                      type="textarea"
                      v-model="form.description"></el-input>
          </el-form-item>
          <el-form-item label="封面图片"
                        prop="url">
            <el-upload class="avatar-uploader"
                       action="https://jsonplaceholder.typicode.com/posts/"
                       :show-file-list="false"
                       :on-success="handleAvatarSuccess"
                       :before-upload="beforeAvatarUpload">
              <img v-if="form.url"
                   :src="form.url"
                   class="avatar">
              <i v-else
                 class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>

          </el-form-item>

          <el-form-item align="center">
            <el-button @click="formOnSubmit"
                       type="primary">保存</el-button>
            <el-button @click="formOnCancle">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <!-- 信息查看部分 -->
    <template v-else>
      <div class="content-style">
        <el-row>
          <label class="label-style">专题名称:</label>
          <span>{{this.data.titile}}</span>
        </el-row>
        <el-row>
          <label class="label-style">专题类型:</label>
          <span>{{this.data.projectType}}</span>
        </el-row>
        <el-row>
          <label class="label-style">时间范围:</label>
          <span>{{this.data.startTime}}</span>
          <span>{{'-'+this.data.endTime}}</span>
        </el-row>
        <el-row>
          <label class="label-style">专题地点:</label>
          <span>{{this.data.siteWrite}}</span>
        </el-row>
        <el-row>
          <label class="label-style">专题简介:</label>
          <pre>{{this.data.description}}</pre>
        </el-row>
        <el-row>
          <label class="label-style">封面图片:</label>
          <img v-if="data.url"
               :src="data.url"
               class="avatar">
        </el-row>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'special-detail',
  data () {
    return {
      toDetail: {},
      form: { id: '', titile: '', projectType: '', startTime: '', endTime: '', siteWrite: '', description: '', url: '' },
      data: { id: '', titile: '', projectType: '', startTime: '', endTime: '', siteWrite: '', description: '', url: '' },
      editpanel: false,
      editicon: false,
      // 开始时间
      starttime: {
        disabledDate: time => {
          if (this.form.expiretime) {
            return (
              time.getTime() >
              this.$utils.formatteNewDate(this.form.expiretime).getTime()
            )
          }
        }
      },
      // 结束时间
      endTime: {
        disabledDate: time => {
          if (this.form.validdate) {
            return (
              time.getTime() <
              this.$utils.formatteNewDate(this.form.validdate).getTime()
            )
          }
        }
      }

    }
  },
  methods: {
    // 图片上传
    handleAvatarSuccess (res, file) {
      this.form.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 保存 信息
    formOnSubmit () {
      if (this.form.porgname === '无') this.form.porgname = null
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$axios
            .post('/api' + this.$route.path + 'save', this.form)
            .then(res => {
              if (res.data.code === 0) {
                this.data = JSON.parse(JSON.stringify(this.form))
                this.data.uuid = this.form.uuid = res.data.data
                this.$emit('upInstid', res.data.data, this.data.orgname)
                this.editpanel = false
                this.editicon = true
              }
            })
        }
      })
    },
    // 查询某个机构信息
    getOrgBaseinfo () {
      this.$axios
        .post('/api' + this.$route.path + 'baseinfo', { uuid: this.instid })
        .then(res => {
          if (res.data.code === 0) {
            this.data = res.data.data
          }
        })
    },
    // 取消 保存单位信息
    formOnCancle () {
      this.editpanel = false
      this.editicon = true
    },
    // 编辑按钮
    edit () {
      this.editpanel = true
      this.editicon = false
      this.form = JSON.parse(JSON.stringify(this.data)) // clone到form，避免双向绑定
    }
  },
  mounted () {
    this.toDetail = JSON.parse(sessionStorage.getItem('toDetail'))
    // 新增/编辑--编辑按钮展示
    if (this.toDetail.actpoint === 'edit') {
      this.editicon = true
    }
    // 默认为查看状态
    if (!this.toDetail.instid) {
      // 新增--编辑页展示
      this.edit()
    } else {
      // 编辑--查看页展示
      this.getOrgBaseinfo()
    }
  }
}
</script>

<style lang="less" scoped>
.special-detail {
  .title {
    height: 40px;
    line-height: 40px;
    span {
      font-family: Microsoft YaHei;
      font-weight: bold;
      margin-left: 20px;
      float: left;
    }
    .el-icon-edit {
      float: left;
      margin-left: 40px;
      margin-top: 6px;
    }
  }
  .el-form {
    padding: 40px 20% 0 40px;
    .el-select {
      width: 100%;
    }
    .avatar-uploader {
      text-align: left;
      width: 178px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
  .content-style {
    text-align: left;
    padding: 40px 20% 0 40px;
    .el-row {
      margin-bottom: 22px;
      .label-style {
        float: left;
        text-align: right;
        width: 80px;
        margin-right: 10px;
        line-height: 42px;
        height: 100%;
      }
      span {
        width: calc(100% - 92px);
        float: right;
        padding-top: 11px;
      }
    }
  }
}
</style>
