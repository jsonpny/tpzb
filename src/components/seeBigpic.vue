<template>
  <div>
    <el-dialog title="查看图片"
               :visible.sync="visible"
               width="100%"
               style="height: 100%; margin-top: 0;">
      <el-carousel :interval="5000"
                   arrow="always"
                   :autoplay="false"
                   :initial-index="bigIndex"
                   indicator-position="none">
        <el-carousel-item v-for="(item,index) in datas"
                          :key="index">
          <el-image style="width:80%; height: 80%;"
                    :src="item.outUrlS"
                    fit="contain"></el-image>
          <div style="margin-top: 30px; text-align: center;">
            <form name="downloadform"
                  action="http://view.jingjiribao.cn/piclive/tpictoolsdetail/downloadpicture"
                  method="post"
                  style="display: inline-block; ">
              <input v-show="false"
                     style="visiable:hidden;"
                     type="text"
                     name="fileName"
                     id="fileName"
                     :value="item.fileName">
              <input v-show="false"
                     style="visiable:hidden;"
                     type="text"
                     name="url"
                     :value="item.url">
              <input v-show="false"
                     style="visiable:hidden;"
                     type="text"
                     name="suffix"
                     :value="item.suffix">
              <el-button display="inline-block"
                         class="filter-item contentBtn"
                         icon="el-icon-download"
                         @click="childhandleDownload(item.url,item.fileName,index)">图片下载</el-button>
            </form>
            <el-button class="contentBtn">查看大图{{item.size}}Kb</el-button>
            <el-button @click="childdianzan(item.id,item.clicks,index)"
                       class="contentBtn">图片点赞</el-button>
          </div>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */

export default {

  name: 'seeBigPic',
  props: {
    visible: false,
    datas: '',
    bigIndex: ''
  },
  data () {
    return {

    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    childdianzan (id, clicks, index) {
      this.$emit("childdianzan", id, clicks, index)
    }


  },
  components: {

  }

}
</script>

<style >
.el-scrollbar__view {
  height: 100%;
}
.el-dialog {
  margin-top: 0 !important;
  height: 100%;
  background: rgba(1, 1, 1, 0.9);
}
.el-dialog__title {
  color: #fff;
}
.el-carousel__container {
  height: 470px;
}
.el-dialog__body {
  height: 70%;
  text-align: center;
}
</style>