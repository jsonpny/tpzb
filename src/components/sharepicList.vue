<template>
  <div style="height: 100%;">
    <el-row type="flex"
            class="row-bg search_btn"
            justify="space-around">
      <el-col :span="11"
              style="text-align: left; padding: 15px 0 5px 0;">
        <!--<span>全部</span> <span @click="timeList" :class="{active:activeText}" id="timeBtn">时间线</span>-->
        <el-link :underline="false"
                 @click="allList"
                 :class="{allActive:allActive}">全部</el-link>
        <el-link @click="timeList"
                 :class="{active:activeText}"
                 id="timeBtn"
                 :underline="false">时间线</el-link>
      </el-col>
      <el-col :span="11"
              style="text-align: right; padding: 15px 0 5px 0;">
        <!--<span @click="hotList">热度</span><span></span>-->
        <el-link :underline="false"
                 @click="hotList"
                 style="margin-right: 15px;"
                 :class="{hotActive:hotActive}">
          <el-image style="width: 23px; height: 23px; float: left; margin-right: 5px;"
                    :src="picurl1"></el-image> 热度
        </el-link>
        <el-link :underline="false"
                 :class="{pxActive:pxActive}"
                 @click="pxFn">
          <el-image style="width: 23px; height: 23px; float: left; margin-right: 5px;"
                    :src="picurl2"></el-image> {{shunxun}}
        </el-link>
      </el-col>
    </el-row>

    <vue-waterfall-easy ref="waterfall"
                        :imgsArr="imgsArr"
                        @scrollReachBottom="initImgsArr"
                        @click="clickFn">
      <!--<div class="imgLiback" v-if="index < 3">Top{</div><div class="imgLiback1" v-else-if="index < 10 ">Top</div>-->
    </vue-waterfall-easy>
    <el-dialog title="查看图片"
               :visible.sync="dialogVisible"
               width="100%"
               style="height: 100%; margin-top: 0;">
      <el-carousel :interval="5000"
                   arrow="always"
                   :autoplay="false"
                   :initial-index="picIndex"
                   indicator-position="none">
        <el-carousel-item v-for="(item,index) in picdata"
                          :key="index">
          <el-image style="width:80%; height: 80%;"
                    :src="item.outUrlS"
                    fit="contain"></el-image>
          <div style="margin-top: 30px;">
            <form name="downloadform"
                  style="display:inline-block;"
                  action="http://view.jingjiribao.cn/piclive/tpictoolsshare/watermarkpicture"
                  method="post">
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
                         @click="shareDownload(item.url,item.fileName)">图片下载</el-button>
            </form>
            <el-button class="contentBtn">查看大图{{item.size}}</el-button>
            <el-button @click="piclike(item.clicks,item.id)"
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
import vueWaterfallEasy from 'vue-waterfall-easy'
export default {

  name: 'sharepicList',
  data () {
    return {
      // 初始化列表参数
      param: {
        pageNum: 1,
        pageSize: 20,
        data: {
          projectId: "3991e6900b694a4090f6c417a943abe6",
          orderString: "asc"
        }
      },
      //  按热度排序参数
      hotParam: {
        pageNum: 1,
        pageSize: 20,
        data: {
          projectId: ""
        }
      },
      imgsArr: [], //存放所有已加载图片的数组
      flag: "1",
      dialogVisible: false, //弹出框
      picurl: '', // 查看大图url
      picdata: [], // 列表上所有的图片信息
      bigPic: [], // 查看大图的图片信息
      likeParam: { // 点赞参数
        clicks: '',
        id: ''
      },
      activeText: false,
      allActive: false,
      hotActive: false,
      pxActive: false,
      picurl1: require("../assets/image/share_btn4.png"),
      picurl2: require("../assets/image/share_btn5.png"),
      shunxun: "正序",
      picIndex: '',
      BaseUrl: "http://view.jingjiribao.cn/piclive"
    }
  },
  created () {
    this.initImgsArr() //初始化图片列表
  },
  mounted () {
    this.param.data.projectId = this.$route.params.id;
    this.hotParam.data.projectId = this.$route.params.id;
  },
  methods: {
    // 获取图片列表   
    initImgsArr () {
      console.log(this.param)
      var arr = [];
      var list = [];
      if (this.flag == "1") {
        //					this.$axios.post('/api/tpictoolsshare/picturesharellist', this.param).then(res => {
        this.$axios.post(this.BaseUrl + '/tpictoolsshare/picturesharellist', this.param).then(res => {
          if (res.data.code === '200') {
            console.log(res.data.data)
            list = res.data.data.list;
            this.param.pageNum++;
            if (list.length == 0) {
              this.$refs.waterfall.waterfallOver()
              return
            } else {
              let piclist = "";
              piclist = res.data.data.list;
              for (let i = 0; i < res.data.data.list.length; i++) {
                arr.push({
                  src: piclist[i].outUrlSSS,
                  link: piclist[i].outUrlSS,
                  //										big: piclist[i].outUrl,
                  //										size: piclist[i].size,
                });
              }
              console.log(list)
              this.imgsArr = this.imgsArr.concat(arr)
              this.picdata = this.picdata.concat(list)
            }
          }
        })
      } else if (this.flag == "2") { // 热度
        //					this.$axios.post('/api/tpictoolsshare/sharelikelist', this.param).then(res => {
        this.$axios.post(this.BaseUrl + '/tpictoolsshare/sharelikelist', this.param).then(res => {
          if (res.data.code === '200') {
            console.log(res.data.data)
            this.param.pageNum++;
            if (list.length == 0) {
              this.$refs.waterfall.waterfallOver()
              return
            } else {
              let piclist = "";
              piclist = res.data.data.list;
              for (let i = 0; i < res.data.data.list.length; i++) {
                arr.push({
                  src: piclist[i].outUrlSSS,
                  link: piclist[i].outUrlSS
                });
              }
              this.imgsArr = this.imgsArr.concat(arr)
            }
          }
        })
      } else if (this.flag == "3") { // 时间
        //					this.$axios.post('/api/tpictoolsshare/picturedatelist', this.hotParam).then(res => {
        this.$axios.post(this.BaseUrl + '/tpictoolsshare/picturedatelist', this.hotParam).then(res => {
          if (res.data.code === '200') {
            console.log(res.data.data)
            this.param.pageNum++;
            if (list.length == 0) {
              this.$refs.waterfall.waterfallOver()
              return
            } else {
              let piclist = "";
              piclist = res.data.data.list;
              for (let i = 0; i < res.data.data.list.length; i++) {
                arr.push({
                  src: piclist[i].outUrlSSS,
                  link: piclist[i].outUrlSS
                });
              }
              this.imgsArr = this.imgsArr.concat(arr)
            }
          }
        })
      }
    },

    //按热度排序
    hotList () {
      this.flag = "2";
      this.initImgsArr();
      this.hotActive = !this.hotActive;
      this.picurl1 = require("../assets/image/share_btn4hover.png");
      if (this.activeText == true) {
        this.activeText = !this.activeText;
      } else if (this.allActive == true) {
        this.allActive = !this.allActive;
      } else if (this.pxActive == true) {
        this.pxActive = !this.pxActive;
      }
    },

    // 按时间
    timeList () {
      this.flag = "3";
      this.activeText = !this.activeText;
      if (this.allActive == true) {
        this.allActive = !this.allActive;
      } else if (this.hotActive == true) {
        this.hotActive = !this.hotActive;
        this.picurl1 = require("../assets/image/share_btn4.png");
      } else if (this.pxActive == true) {
        this.pxActive = !this.pxActive;
      }
      this.initImgsArr();
    },

    // 全部
    allList () {
      this.flag = "1";
      this.initImgsArr();
      this.allActive = !this.allActive;
      if (this.activeText == true) {
        this.activeText = !this.activeText;
      } else if (this.hotActive == true) {
        this.hotActive = !this.hotActive;
        this.picurl1 = require("../assets/image/share_btn4.png");
      } else if (this.pxActive == true) {
        this.pxActive = !this.pxActive;
      }
    },

    //排序
    pxFn () {
      if (this.shunxun == "正序") {
        this.shunxun = "倒序";
        this.picurl2 = require("../assets/image/share_btn6.png");
        this.param.data.orderString = "desc";
        this.initImgsArr();
      } else {
        this.shunxun = "正序";
        this.picurl2 = require("../assets/image/share_btn5.png");
        this.param.data.orderString = "asc";
        this.initImgsArr();
      }
    },
    // 查看大图
    clickFn (event, {
      index,
      value
    }) {
      this.dialogVisible = true;
      // 阻止a标签跳转
      event.preventDefault()
      // 只有当点击到图片时才进行操作
      if (event.target.tagName.toLowerCase() == 'img') {
        console.log('img clicked', index, value)
        console.log(this.picdata[index])
        this.picurl = this.picdata[index].outUrlSS;
        this.bigPic = this.picdata[index];
        this.picIndex = parseInt(index);
        console.log(this.picIndex)
        console.log(this.bigPic.url)
      }
    },

    //点击有水印下载 
    shareDownload (picurl, name) {
      document.downloadform.submit()
      //				this.$message({
      //					message: '下载成功',
      //					type: 'success'
      //				});
    },

    //点击无水印下载 
    shareDownload1 (picurl, name) {

      document.downloadform1.submit()
      //				this.$message({
      //					message: '下载成功',
      //					type: 'success'
      //				});
    },

    //点击点赞
    piclike (clicks, id) {
      this.likeParam.clicks = clicks;
      this.likeParam.id = id;
      this.$axios.post('/api/tpictoolsshare/clicklike', this.likeParam).then(res => {
        //					this.$axios.post(this.BaseUrl + '/tpictoolsshare/clicklike', this.likeParam).then(res => {

        if (res.data.code === '200') {
          console.log(res.data.data)
          this.$message({
            message: '点赞成功',
            type: 'success'
          });
        }
      })
    }
  },
  components: {
    vueWaterfallEasy
  }

}
</script>

<style scoped lang="less">
.search_btn {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding-bottom: 10px;
}
.active {
  color: #0092c7;
}
.allActive {
  color: #0092c7;
}
.hotActive {
  color: #0092c7;
}
.pxActive {
  color: #0092c7;
}
#timeBtn {
  margin-left: 15px;
}
.el-dialog {
  margin-top: 0 !important;
  height: 100%;
}
.mr15 {
  margin-right: 15px;
}
.contentBtn {
  background: none;
  color: #fff;
  border: 1px solid #fff;
  margin-left: 15px;
  margin-top: 10px;
}
.vue-waterfall-easy-container .vue-waterfall-easy a.img-inner-box:hover {
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.5);
}
.imgLiback {
  width: 60px;
  height: 26px;
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 0 0 0 10px;
  z-index: 9;
  background: #ff5f5f;
  color: #fff;
  text-align: center;
}
.imgLiback1 {
  width: 60px;
  height: 26px;
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 0 0 0 10px;
  z-index: 9;
  color: #fff;
  text-align: center;
  background: #cfa972;
}
</style>