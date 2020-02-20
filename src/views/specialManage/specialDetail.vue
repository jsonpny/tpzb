<template>
  <div class="special-detail">
    <!-- <el-row>
      <div class="title">
        <span>专题基本信息</span>
        <el-button @click="edit"
                   class="el-icon-edit icon-cursor"
                   size="mini"
                   title="编辑"
                   type="primary"
                   v-show="editicon">编辑</el-button>
      </div>
    </el-row> -->

    <!-- 信息编辑 -->
    <template v-if="editpanel">
      <div class="edit">
        <el-form :model="form"
                 label-width="90px"
                 ref="form">

          <el-form-item label="专题名称"
                        prop="titile">
            <el-input placeholder="请填写单位名称"
                      v-model="form.title"></el-input>
          </el-form-item>

          <el-form-item label="专题类型">
            <el-select placeholder="专题类型"
                       v-model="form.projectType">
              <el-option :key="item.code"
                         :label="item.name"
                         :value="item.code"
                         v-for="item in this.$store.state.projectTypes"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="时间范围">
            <el-col :span="11">
              <el-form-item prop="startTime">
                <el-date-picker type="date"
                                value-format="yyyy-MM-dd"
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
                                value-format="yyyy-MM-dd"
                                placeholder="选择结束日期"
                                v-model="form.endTime"
                                style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item label="活动地点"
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
            <el-upload ref="upload"
                       class="upload"
                       list-type="picture-card"
                       action="/api/tpictools/uploadprojectmanage"
                       :file-list="imgFilesList"
                       :on-success="handleUploadrSuccess"
                       :on-change="maxUploadNum"
                       :on-remove="removeImg"
                       :limit="1"
                       accept=".jpg,.jpeg,.png,.bmp,.gif">
              <i class="el-icon-plus"></i>
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
          <span>{{this.data.title}}</span>
        </el-row>
        <el-row>
          <label class="label-style">专题类型:</label>
          <span>{{this.data.projectType}}</span>
        </el-row>
        <el-row>
          <label class="label-style">时间范围:</label>
          <span>{{this.data.startTime +'至'+this.data.endTime}}</span>
        </el-row>
        <el-row>
          <label class="label-style">活动地点:</label>
          <span>{{this.data.siteWrite}}</span>
        </el-row>
        <el-row>
          <label class="label-style">专题简介:</label>
          <span>{{this.data.description}}</span>
        </el-row>
        <el-row>
          <label class="label-style">封面图片:</label>
          <img v-if="data.url"
               :src="data.url"
               class="avatar">
        </el-row>
        <el-row class="goback">
          <el-button type="primary"
                     @click="formOnCancle">返回</el-button>
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
      searchParam: { pageNum: 1, pageSize: 10, data: { startTime: '', endTime: '', projectType: '', flag: '', title: '', id: '' } },
      form: { id: '', title: '', projectType: '', startTime: '', endTime: '', siteWrite: '', description: '', pictureName: '', url: '' },
      data: { id: '', title: '', projectType: '', startTime: '', endTime: '', siteWrite: '', description: '', pictureName: '', url: '' },
      editpanel: false,
      editicon: false,
      imgFilesList: []
    }
  },
  methods: {
    maxUploadNum (file, fileList) {
      const imgLength = fileList.length
      const uploadBtn = document.getElementsByClassName('el-upload')[0]
      if (imgLength >= 1) {
        uploadBtn.style.display = 'none'
      }
    },
    removeImg (file, fileList) {
      const uploadBtn = document.getElementsByClassName('el-upload')[0]
      uploadBtn.style.display = 'block'
    },

    handleUploadrSuccess (res, file, fileList) {
      if (res.code === '200') {
        const { pictureName: name, url } = res.data
        this.form.url = url
        this.form.pictureName = name
        // this.imgFilesList = [{ name, url }]
      }
    },
    // 保存 信息
    formOnSubmit () {
      if (this.form.id) {
        // 编辑
        this.$axios
          .post('/api/tpictools/updateprojectmanage', this.form)
          .then(res => {
            if (res.data.code === '200') {
              this.$message({
                message: '编辑成功',
                type: 'success'
              })
              this.$router.push({
                name: 'SpecialList'
              })
            }
          })
      } else {
        // 新增
        delete this.form.id
        this.$axios
          .post('/api/tpictools/addprojectmanage', this.form)
          .then(res => {
            if (res.data.code === '200') {
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.$router.push({
                name: 'SpecialList'
              })
            }
          })
      }
    },
    // 查询某个机构信息
    getBaseinfo () {
      this.$axios.post('/api/tpictools/projectmanagelist', this.searchParam).then(res => {
        if (res.data.code === '200') {
          const { id, title, projectType, startTime, endTime, siteWrite, description, pictureName, url } = res.data.data.list[0]
          this.data = { id, title, projectType, startTime, endTime, siteWrite, description, pictureName }
          // 时间回显
          this.data.startTime = this.$moment(this.data.startTime).format('YYYY-MM-DD')
          this.data.endTime = this.$moment(this.data.endTime).format('YYYY-MM-DD')
          // 图片回显
          this.data.url = 'api' + url

          // 修改
          if (this.toDetail.actpoint === 'edit') {
            this.edit()
          }
        }
      })
    },
    // 取消 编辑信息
    formOnCancle () {
      this.$router.push({
        name: 'SpecialList'
      })
    },
    // 编辑页展示
    edit () {
      this.editpanel = true
      this.form = JSON.parse(JSON.stringify(this.data)) // clone到form，避免双向绑定
      // 图片回显
      if (this.form.url) {
        const obj = { name: '', url: '' }
        obj.name = this.form.pictureName
        obj.url = this.form.url
        this.imgFilesList.push(obj)
        const uploadBtn = document.getElementsByClassName('el-upload')[0]
        uploadBtn.style.display = 'none'
      }
    }
  },
  mounted () {
    this.toDetail = JSON.parse(sessionStorage.getItem('toDetail'))

    // 新增/编辑--编辑按钮展示
    // if (this.toDetail.actpoint === 'edit') {
    //   this.editicon = true
    // }

    if (this.toDetail.actpoint === 'edit' && !this.toDetail.instid) {
      // 新增
      this.edit()
    } else if (this.toDetail.actpoint === 'show' && this.toDetail.instid) {
      // 查看
      this.searchParam.data.id = this.toDetail.instid
      this.getBaseinfo()
    } else if (this.toDetail.actpoint === 'edit' && this.toDetail.instid) {
      // 修改
      this.searchParam.data.id = this.toDetail.instid
      this.getBaseinfo()
    }
  },
  updated () {
    if (this.form.url) {
      const uploadBtn = document.getElementsByClassName('el-upload')[0]
      uploadBtn.style.display = 'none'
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
    padding: 20px 20% 0 40px;
    .el-select {
      width: 100%;
    }
    .upload {
      text-align: left;
    }
  }
  .content-style {
    text-align: left;
    padding: 20px 20% 0 40px;
    .el-row {
      margin-bottom: 22px;
      &.goback {
        text-align: center;
      }
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
      img {
        width: 178px;
        height: 178px;
      }
    }
  }
}
</style>
