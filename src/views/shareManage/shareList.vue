<template>
  <div style="height: 100%;">
    <el-row class="back1 hidden-md-and-down"
            justify="space-around"
            type="flex">
      <el-col :md="18"
              :lg="20"
              :xl="20"
              :span='20'
              class="ztcontent">
        <h3 class="title">{{xqData.title}}</h3>
        <p style="margin: 0;"><span id="datetime">开始时间：{{xqData.startTime}}-{{xqData.endTime}}| 地点：{{xqData.siteArea}}</span><span id="ztxq"
                @click="openZtxq">详情</span></p>
        <p style="margin-top: 0;"><span id="ztstatus">{{xqData.status}}</span>
          <span id="ztpicnum"><img :src="picurl1"
                 class="mr5">{{xqData.countPic}}张</span>
          <span id="ztpicsee"><img :src="picurl2"
                 class="mr5">{{xqData.views}}</span>
        </p>
      </el-col>
      <el-col :md="3"
              :lg="3"
              :xl="3"
              :span='3'
              style="padding-right: 2%;">
        <div class="rwm">
          <img :src="picurl3">
          <p class="text-center">微信扫码看直播</p>
        </div>
      </el-col>
    </el-row>
    <!--移动端-->
    <el-row class="back2 hidden-sm-and-up"
            style="background: #000;">
      <el-col :span="24">
        <el-image :src="bannersrc"
                  fit="contain"></el-image>
      </el-col>
      <el-col :span="24">
        <h3 class="mobtitle">{{xqData.title}}</h3>
      </el-col>
      <el-col :span="24"
              style="text-align: left; padding-bottom: 5px;">
        <span id="ztpicnum"><img :src="picurl1"
               class="mr5">{{xqData.countPic}}张</span>
        <span id="ztpicsee"><img :src="picurl2"
               class="mr5">{{xqData.views}}</span>
        <span id="mobMessage"
              @click="openZtxq">详情</span>
      </el-col>
    </el-row>
    <sharepicList></sharepicList>
  </div>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
import sharepicList from '../../components/sharepicList.vue'
export default {
  data () {
    return {
      datetime: '', //专题开始结束时间
      // img 路径
      picurl1: require("../../assets/image/share_btn2.png"),
      picurl2: require("../../assets/image/share_btn3.png"),
      picurl3: "",
      bannersrc: require("../../assets/image/mob_banner.jpg"),
      param: { projectId: '' }, //获取详情信息参数
      xqData: '',  //专题详情结果
      BaseUrl: "http://view.jingjiribao.cn/piclive"
    }
  },
  created () {
    this.param.projectId = this.$route.params.id;
    //          this.param.projectId = "290ddf7519d34896ba78d2442bbd48ae";
    console.log(this.$route.params.id);
    this.getPorject()
    this.getEwmpic()
  },
  mounted () {

  },

  methods: {
    //获取详情信息
    getPorject () {
      //				this.$axios.post('/api/tpictoolsshare/projectdetail', this.param).then(res => {
      this.$axios.post(this.BaseUrl + '/tpictoolsshare/projectdetail', this.param).then(res => {
        if (res.data.code === '200') {
          console.log(res.data.data)
          this.xqData = res.data.data;
        }
      })
    },

    //点击详情打开详情弹出窗
    openZtxq () {
      this.$alert('<p>专题标题：' + this.xqData.title + '</br>作者：' + this.xqData.author + ' </br>描述：' +
        this.xqData.description + '</br>图片数量：' + this.xqData.countPic + '</br>图片数量：' + this.xqData.views + '</br> 开始时间：' + this.xqData.startTime + '</br>结束时间：' + this.xqData.endTime + '</p>', '专题详情', {
        dangerouslyUseHTMLString: true
      });

    },
    getEwmpic () {
      let ewmParam = new FormData();
      ewmParam.append("projectId", this.param.projectId)
      console.log(this.param.projectId)
      //				this.$axios.post('/api/tpictoolsshare/dimensionalcode', ewmParam).then(res => {
      this.$axios.post(this.BaseUrl + '/tpictoolsshare/dimensionalcode', ewmParam).then(res => {
        if (res.data.code === '200') {
          console.log(res.data.data)
          this.picurl3 = res.data.data;

        }
      })
    }
  },
  components: {
    sharepicList
  }
}
</script>
<style>
#app .header {
  display: none;
}

.el-aside {
  display: none;
}

#app .container-box .el-main {
  padding: 0;
}

#app .container-box .el-main .default-scrollbar .default-scrollbar__wrap {
  padding: 0;
}

.back1 {
  background: url(../../assets/image/share_headback.png) no-repeat;
  background-size: cover;
  height: 264px;
}

#datetime {
  color: #fff;
}

.title {
  color: #fff;
  margin-bottom: 0;
}

.ztcontent {
  text-align: left;
  padding-left: 25px;
  padding-top: 2%;
}

#ztxq {
  background: url(../../assets/image/share_btn1.png) no-repeat;
  width: 90px;
  height: 45px;
  display: inline-block;
  line-height: 47px;
  padding-left: 43px;
  margin-left: 15px;
  color: #fff;
}

#ztstatus {
  border: 1px solid #fff;
  border-radius: 15px;
  color: #fff;
  padding: 5px 12px;
}

#ztpicnum {
  color: #fff;
  margin-left: 15px;
  display: inline-block;
}

#ztpicnum img {
  float: left;
}

#ztpicsee {
  color: #fff;
  margin-left: 15px;
  display: inline-block;
}

#ztpicsee img {
  float: left;
}

.mr5 {
  margin-right: 5px;
}

.text-center {
  text-align: center;
}

.colorf {
  color: #fff;
}

.rwm {
  width: 100%;
  height: 85%;
  background: #fff;
  border-radius: 5px;
  margin-top: 9%;
}

.rwm img {
  width: 80%;
  padding-top: 10px;
}

.rwm p {
  margin: 0;
}
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
}
.mobtitle {
  color: #fff;
  text-align: left;
  padding-left: 10px;
  margin: 10px 0;
}
#mobMessage {
  color: #fff;
  border: 1px solid #fff;
  border-radius: 3px;
  padding: 3px 15px;
  float: right;
  margin-right: 15px;
}
/* 大屏幕（大桌面显示器，小于等于 1680px） */

@media screen and (max-width: 1680px) {
  .back1 {
    height: 230px;
  }
}

@media screen and (max-width: 1600px) {
  .back1 {
    height: 220px;
  }
}

@media screen and (max-width: 1440px) {
  .back1 {
    height: 198px;
  }
  #datetime {
    color: #fff;
  }
}

@media screen and (max-width: 1400px) {
  .back1 {
    height: 188px;
  }
  #datetime {
    color: #fff;
  }
}

@media screen and (max-width: 1280px) {
  .back1 {
    height: 176px;
  }
}

@media screen and (max-width: 1200px) {
  .back1 {
    height: 165px;
  }
}
@media screen and (max-width: 768px) {
  .el-message-box {
    width: 90%;
  }
}
</style>