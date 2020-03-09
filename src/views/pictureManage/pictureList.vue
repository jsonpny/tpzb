<template>
  <div style=" text-align: left;">
    <!--第一行-->
    <div class="sub_title">
      <span>
        切换专题：
      </span>
      <el-popover placement="bottom"
                  width="400"
                  trigger="click"
                  v-model="visible">
        <div class="ztxqtitle">
          <span>当前专题：{{ztname}}</span>
          <el-tag type="info"
                  @click="clickDetail"
                  style="background-color: rgba(173, 173, 172, 1);margin-left:10px; color: #fff;padding: 0 5px;height: 25px;line-height: 25px;">详情</el-tag>
          <el-button size="mini"
                     type="text"
                     @click="changezt"
                     class="fr"
                     style="margin-top: -4px;">X</el-button>
        </div>
        <div class="ztxqcontent">
          <div class="typecontent">
            <span class="typetitle">全部</span>
            <!--<span v-for="item in this.$store.state.projectTypes" class="typetitle" :key="item.code">{{item.name}}</span>-->
            <span v-for="type in typeList"
                  class="typetitle"
                  :key="type.code"
                  @click="serachztname(type.code)">{{type.name}}</span>
            <el-input v-model="inputztmc"
                      placeholder="请输入专题名称"
                      style="margin-bottom: 10px;">
              <el-button slot="prepend"
                         style="background: #fff;"
                         @click="inputsearch"
                         icon="el-icon-search"></el-button>
            </el-input>
            <p v-for="zt in nowztdata.slice(0, 5)"
               class="zttitle"
               :key="zt.id"
               @click="clickztName(zt.name,zt.id)">
              {{zt.name}}
            </p>
          </div>
        </div>
        <el-input v-model="projectId"
                  style="display: none;"></el-input>
        <el-button slot="reference"
                   class="ztname">{{ztname}}<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
      </el-popover>
      <span class="ztstatus">{{status}}</span>
      <!--上传图片-->
      <el-button type="primary"
                 size="small"
                 :class="{show:showBtn,hide:hideBtn}"
                 @click="dialogFormVisible = true">上传图片</el-button>
      <!--                <uploadPic v-bind:childdialogFormVisible ="dialogFormVisible"></uploadPic>-->
      <el-dialog title="上传图片"
                 :visible.sync="dialogFormVisible"
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
                   class="el-upload__tip">只能上传jpg/png文件，最多能上传10张</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="作品描述"
                        :label-width="formLabelWidth">
            <el-input v-model="form.description"
                      autocomplete="off"
                      class="w300"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="resetForm('form')">取 消</el-button>
          <el-button type="primary"
                     @click="newSubmitForm ()">确 定</el-button>
        </div>
      </el-dialog>
      <div class="fr">
        <el-link :underline="false">
          <el-image :src="pichot"
                    class="img_btn"
                    title="根据热度排序"
                    @click="hotList()"></el-image>
        </el-link>
        <el-link :underline="false">
          <el-image :src="picdate"
                    class="img_btn"
                    title="根据时间排序"
                    @click="timeList()"></el-image>
        </el-link>
        <el-link :underline="false">
          <el-image :src="picshare"
                    class="img_btn"
                    title="分享"
                    @click="share(projectId)"></el-image>
        </el-link>
      </div>
    </div>
    <!--第二行-->
    <div class="sub_title">
      <el-select v-model="value"
                 @change="selectChanged"
                 clearable
                 placeholder="全部尺寸"
                 class="sizebtn">
        <el-option v-for="item in options"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <div class="fr">
        <div class="pictext"><img src="../../assets/image/btn6.png">{{picnum}}张</div>
        <div class="pictext"><img src="../../assets/image/btn5.png">{{seenum}}</div>
      </div>
    </div>
    <!--列表-->
    <div class="imageLi"
         v-loading="loading"
         v-for="(image,index) in imageList"
         :key="image.id"
         @mouseover="showIndex = index"
         @mouseout="showIndex = -1">
      <!--@mouseover="overShow" @mouseout="outHide"-->
      <span class="imagetitle">{{ image.title }}</span>
      <div id="hoverBtn"
           :class="{'show':index == showIndex}">
        <!--:class="{show:showText,hide:hideText}"-->
        <p class="cz_btn"
           @click="dianzan(image.id,image.clicks, index)">
          <el-link :underline="false">
            <el-image :src="picurl1"></el-image>{{image.clicks}}
          </el-link>
        </p>

        <form name="downloadform"
              class="cz_btn"
              action="http://view.jingjiribao.cn/piclive/tpictoolsdetail/downloadpicture"
              method="post">
          <input v-show="false"
                 style="visiable:hidden;"
                 type="text"
                 name="fileName"
                 id="fileName"
                 :value="image.fileName">
          <input v-show="false"
                 style="visiable:hidden;"
                 type="text"
                 name="url"
                 :value="image.url">
          <input v-show="false"
                 style="visiable:hidden;"
                 type="text"
                 name="suffix"
                 :value="image.suffix">
          <el-button display="inline-block"
                     class="filter-item xz_btn"
                     icon="el-icon-download"
                     @click="handleDownload(image.url,image.fileName,index)"></el-button>
        </form>

        <!--<el-link target="_blank" :href="image.outUrl" :underline="false" >-->
        <!--<el-image :src="picurl2"></el-image>-->
        <!--</el-link>-->

        <p class="cz_btn"
           @click="delpic(image.id,image.url)">
          <el-link :underline="false">
            <el-image :src="picurl3"></el-image>
          </el-link>
        </p>
        <!--<p class="cz_btn" ><el-image :src="picurl4"></el-image></p>-->
      </div>
      <el-image class="listImg"
                :src="image.outUrlSS"
                fit="cover"
                @click="clickFn(index)"></el-image>
      <!--:preview-src-list="previewlist"-->
      <div class="imgLiback"
           v-if="index < 3 && currentPage ==1">Top{{index+1}}</div>
      <div class="imgLiback1"
           v-else-if="index < 10 && currentPage ==1">Top{{index+1}}</div>
    </div>
    <el-row type="flex"
            justify="center"
            align="bottom"
            style="margin-bottom: 50px;">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="currentPage"
                     :page-sizes="[5, 10, 20, 40]"
                     :page-size="pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="listdata.total">
      </el-pagination>
    </el-row>
    <!--查看大图-->
    <el-dialog title="查看图片"
               :visible.sync="bigPic"
               width="100%"
               style="height: 100%; margin-top: 0;"
               id="picContent">
      <el-carousel :interval="5000"
                   arrow="always"
                   :autoplay="false"
                   :initial-index="picIndex"
                   indicator-position="none">
        <el-carousel-item v-for="(item,index) in imageList"
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
                         @click="handleDownload(item.url,item.fileName,index)">图片下载</el-button>
            </form>
            <el-button class="contentBtn">查看大图{{item.size}}</el-button>
            <el-button @click="dianzan(item.id,item.clicks,index)"
                       class="contentBtn">图片点赞</el-button>
          </div>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
    <!-- <seeBigPic v-bind:visible ="bigPic" :datas="imageList" :bigIndex = "picIndex" @childdianzan="childdianzan"></seeBigPic>-->
  </div>
</template>
<script>
// eslint-disable-next-line
/* eslint-disable */
//	import seeBigPic from '../../components/seeBigpic.vue'
export default {
  data () {
    return {
      loading: true,
      bigPic: false,
      picIndex: '',
      fileList: [],
      previewlist: [],
      rules: {
        title: [{
          required: true,
          message: '请输入作品标题',
          trigger: 'blur'
        },],
        author: [{
          required: true,
          message: '请输入作品标题',
          trigger: 'blur'
        },],
        phone: [{
          required: true,
          message: '请输入手机号码',
          trigger: 'blur'
        },
        {
          min: 11,
          max: 11,
          message: '请如实填写11位手机号码',
          trigger: 'blur'
        },
        {
          required: true,
          pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
          message: '请输入正确的手机号码',
          trigger: 'blur'
        }
        ],
      },
      param: {
        pageNum: 1,
        pageSize: 20,
        data: {
          projectId: '',
          pixelX: 1920,
          pixelY: 1080,
          userId: "adminUser"
        }
      },
      paramList: {
        pageNum: 1,
        pageSize: 20,
        data: {
          projectId: '',
        }
      },
      projectId: '',
      uploadBtnparam: {
        userId: 'adminUser',
        projectId: ''
      },
      ztid: '1',
      ztname: "", //当前专题名称
      status: "", // 专题状态 
      picnum: "", // 图片张数
      seenum: "", //浏览量
      currentPage: 1,
      pagesize: 20,
      visible: false,
      options: [{
        value: '0',
        label: '<=1920x1080'
      }, {
        value: '1',
        label: '>1920x1080'
      }, {
        value: '2',
        label: '>2048x1080'
      }, {
        value: '3',
        label: '>3046x2160'
      }, {
        value: '4',
        label: '>5120x2880'
      }
      ],
      value: '',
      selectX: '',
      selectY: '',
      imageList: [],
      listdata: '',
      changeparam: {
        pageNum: 1,
        pageSize: 10,
        data: {
          projectId: '',
          pixelX: '',
          pixelY: ''
        }
      },
      picurl1: require("../../assets/image/btn7.png"),
      picurl2: require("../../assets/image/btn8.png"),
      picurl3: require("../../assets/image/btn9.png"),
      picurl4: require("../../assets/image/btn10.png"),
      pichot: require("../../assets/image/btn1.png"),
      picdate: require("../../assets/image/btn2.png"),
      picshare: require("../../assets/image/btn4.png"),
      showText: false,
      hideText: true,
      showBtn: false,
      hideBtn: true,
      showIndex: -1,
      inputztmc: '',
      typeList: [],
      dialogFormVisible: false,
      form: {
        title: '',
        phone: '',
        author: '',
        description: ''
      },
      formLabelWidth: '120px',
      downloadform: {
        url: '',
        suffix: '',
        fileName: ''
      },
      ztdata: "",
      nowztdata: "",
      typeListindex: "",
      folderId: "",
      BaseUrl: "http://view.jingjiribao.cn/piclive"
    }
  },
  created () {
    this.$emit("menu", this.$route.name)
    this.getpicList(),    // 图片列表
      this.getuploadBtn(),  // 上传按钮
      this.serachzttype()   // 专题分类 
  },
  mounted () {
  },
  methods: {
    //			//childdianzan
    //			childdianzan(id,clicks,index){
    //				this.dianzan(id,clicks,index)
    //			},
    //点击查看大图
    clickFn (index) {
      console.log(index, "点击查看大图")
      this.picIndex = index;
      this.bigPic = true;
      console.log(this.picIndex, "点击查看大图11")
    },
    // 上传
    beforeUpload (file) {
      console.log(file)
      let fd = new FormData();
      fd.append('file', file);
      fd.append('description', this.form.description);
      //				fd.append('title', this.form.title);
      //				fd.append('author', this.form.author);
      //				fd.append('phone', this.form.phone);
      fd.append('userId', "adminUser");
      fd.append('projectId', this.projectId);
      fd.append('folderId', this.folderId);
      // 开始加载
      const loading = this.$loading({
        lock: true,
        text: '上传中',
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
    // 加载图片列表
    getpicList () {
      this.param.pageNum = this.currentPage;
      this.param.pageSize = this.pagesize;
      console.log(this.param)
      this.$axios.post(this.BaseUrl + '/tpictoolsdetail/picturedetaillist', this.param).then(res => {
        //	            this.$axios.post('/api/tpictoolsdetail/picturedetaillist', this.param).then(res => {
        if (res.data.code === '200') {
          this.loading = false;
          this.listdata = res.data.data;
          this.imageList = res.data.data.list;
          this.ztname = res.data.data.projectName;
          this.paramList.data.projectId = res.data.data.projectId;
          this.projectId = res.data.data.projectId;
          this.changeparam.data.projectId = res.data.data.projectId;
          this.picnum = res.data.data.total;
          this.seenum = res.data.data.views;
          this.status = res.data.data.status;
          this.folderId = res.data.data.folderId;
          let list = [];
          for (let i = 0; i < this.imageList.length; i++) {
            list[i] = this.imageList[i].outUrlSS;
          }
          this.previewlist = list;

          //      	this.paramList.data.projectId = res.data.
        }
      })
    },

    // 尺寸 
    selectChanged (value) {
      if (value == '0') {
        this.selectX = 1919;
        this.selectY = 1079;
      } else if (value == '1') {
        this.selectX = 1920;
        this.selectY = 1080;
      } else if (value == '2') {
        this.selectX = 2048;
        this.selectY = 1080;
      } else if (value == '3') {
        this.selectX = 3046;
        this.selectY = 2160;
      } else if (value == '4') {
        this.selectX = 5120;
        this.selectY = 2880;
      } else {
        this.selectX = "";
        this.selectY = "";
      }
      this.changeparam.data.pixelX = this.selectX;
      this.changeparam.data.pixelY = this.selectY;
      console.log(this.changeparam, "changesize")
      this.$axios.post(this.BaseUrl + '/tpictoolsdetail/picturedetaillist', this.changeparam).then(res => {
        //	            this.$axios.post('/api/tpictoolsdetail/picturedetaillist', this.changeparam).then(res => {
        if (res.data.code === '200') {
          this.$message({
            message: '查询成功',
            type: 'success',
            offset: '300'
          });
          this.listdata = res.data.data;
          this.imageList = res.data.data.list;
          this.ztname = res.data.data.projectName;
          this.paramList.data.projectId = res.data.data.projectId;
          this.projectId = res.data.data.projectId;
          this.changeparam.data.projectId = res.data.data.projectId;
          this.picnum = res.data.data.total;
          this.seenum = res.data.data.views;
          this.status = res.data.data.status;
          this.folderId = res.data.data.folderId;
          let list = [];
          for (let i = 0; i < this.imageList.length; i++) {
            list[i] = this.imageList[i].outUrlSS;
          }
          this.previewlist = list;
        }
      });
    },
    // 点击点赞事件
    dianzan (picid, picClicks, index) {
      let dataParam = {
        clicks: picClicks,
        id: picid
      };
      console.log(index)
      this.$axios.post(this.BaseUrl + '/tpictoolsdetail/picturelike', dataParam).then(res => {
        //	            this.$axios.post('/api/tpictoolsdetail/picturelike', dataParam).then(res => {
        if (res.data.code === '200') {
          //      	this.listdata = res.data.data;
          this.$message({
            message: '点赞成功',
            type: 'success',
            offset: '300'
          });
          this.imageList[index].clicks = res.data.data;
        }
      })
    },
    // 删除事件
    delpic (picid, picUrl) {
      let dataParam = {
        pictureList: [{
          url: picUrl,
          id: picid
        }]
      };
      console.log(dataParam)
      this.$axios.post(this.BaseUrl + '/tpictoolsdetail/deletepicturedetail', dataParam).then(res => {
        //	this.$axios.post('/api/tpictoolsdetail/deletepicturedetail', dataParam).then(res => {
        if (res.data.code === '200') {
          this.$message({
            message: '删除成功',
            type: 'success',
            offset: '300'
          });
          this.getpicList();
          //      	this.listdata = res.data.data;
          //      	this.imageList = res.data.data.list;
        }
      })
    },
    handleDownload (picurl, name, index) {
      let param = {
        fileName: name,
        url: picurl,
        suffix: '.JPG'
      }
      let dataParam = new FormData();
      dataParam.append('fileName', name);
      dataParam.append('url', picurl);
      document.downloadform[index].submit()
    },

    // 搜索专题名称查询图片列表
    inputsearch () {
      let data = {
        name: this.inputztmc

      };
      this.$axios.post(this.BaseUrl + '/tpictoolsdetail/searchprojectname', data).then(res => {
        //	            this.$axios.post('/api/tpictoolsdetail/searchprojectname', data).then(res => {
        if (res.data.code === '200') {
          //						let arr='';
          //						for(let i = 0; i<res.data.data.length; i++){
          //							arr += res.data.data[i].name;
          //						}
          this.nowztdata = res.data.data
          //                       console.log(arr)
        }
      })

    },
    // 查询用户是否有上传权限
    getuploadBtn () {
      this.$axios.post(this.BaseUrl + '/tpictoolsdetail/uploadmenus', this.uploadBtnparam).then(res => {
        //	            this.$axios.post('/api/tpictoolsdetail/uploadmenus', this.uploadBtnparam).then(res => {
        if (res.data.code === '200') {
          if (res.data.data >= 1) {

            this.showBtn = !this.showBtn
            this.hideBtn = !this.hideBtn
          } else {
            this.showBtn = !this.showBtn
            this.hideBtn = !this.hideBtn
          }
        }
      })
    },
    // 图片鼠标hover 显示隐藏
    overShow () {
      this.showText = !this.showText
      this.hideText = !this.hideText
    },
    outHide () {
      this.showText = !this.showText
      this.hideText = !this.hideText
    },
    //根据热度排序列表
    hotList () {
      this.$axios.post(this.BaseUrl + '/tpictoolsdetail/picturelikelist', this.paramList).then(res => {
        //	this.$axios.post('/api/tpictoolsdetail/picturelikelist', this.paramList).then(res => {
        if (res.data.code === '200') {
          this.$message({
            message: '查询成功',
            type: 'success',
            offset: '300'
          });
          this.pichot = require("../../assets/image/btn1_hover.png");
          this.picdate = require("../../assets/image/btn2.png");
          this.listdata = res.data.data;
          this.imageList = res.data.data.list;
        }
      })
    },
    //根据时间排序列表
    timeList () {
      this.$axios.post(this.BaseUrl + '/tpictoolsdetail/picturedatelist', this.paramList).then(res => {
        //	this.$axios.post('/api/tpictoolsdetail/picturedatelist', this.paramList).then(res => {
        if (res.data.code === '200') {
          this.$message({
            message: '查询成功',
            type: 'success',
            offset: '300'
          });
          this.pichot = require("../../assets/image/btn1.png");
          this.picdate = require("../../assets/image/btn2_hover.png");
          this.listdata = res.data.data;
          this.imageList = res.data.data.list;
        }
      })
    },
    //重置
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
    //分享
    share (id) {
      this.$router.push(`/shareList/${id}`);
      //				this.$message({message: '功能正在开发，敬请期待',offset: '300'});
    },
    //点击切换专题
    changezt () {
      this.visible = false;
      this.serachztname();
    },

    // 专题分类查询
    serachzttype () {
      let param = {};
      this.$axios.post(this.BaseUrl + '/tpictools/getprojecttype', param).then(res => {
        //	this.$axios.post('/api/tpictools/getprojecttype', param).then(res => {
        if (res.data.code === '200') this.projectTypes = res.data.data.list
        this.typeList = res.data.data.list;
        this.typeListindex = res.data.data.list[0].code;
        this.serachztname()
      })
    },

    //专题查询
    serachztname (id) {
      let param = {};
      this.$axios.post(this.BaseUrl + '/tpictoolsdetail/getprojectname', param).then(res => {
        //	this.$axios.post('/api/tpictoolsdetail/getprojectname',param).then(res => {
        if (res.data.code === '200') {
          this.ztdata = res.data.data;
          if (id) {
            var i = id;
            console.log(res.data.data[i])
            this.nowztdata = res.data.data[i];
          } else {
            var i = this.typeListindex
            this.nowztdata = res.data.data[this.typeListindex];
            console.log(this.nowztdata, "专题名称列")
          }
        }
      })
    },
    //点击专题名称
    clickztName (ztname, ztid) {
      let data = {
        pageNum: 1,
        pageSize: 10,
        data: {
          projectName: ztname,
          projectId: ztid,
          pixelX: this.selectX,
          pixelY: this.selectY,
        }
      };
      this.$axios.post(this.BaseUrl + '/tpictoolsdetail/selectpicturellist', data).then(res => {
        //					this.$axios.post('/api/tpictoolsdetail/selectpicturellist', data).then(res => {
        if (res.data.code === '200') {
          this.$message({
            message: '查询成功',
            type: 'success',
            offset: '300'
          });
          this.listdata = res.data.data;
          this.imageList = res.data.data.list;
          this.ztname = res.data.data.projectName;
          this.paramList.data.projectId = res.data.data.projectId;
          this.projectId = res.data.data.projectId;
          this.changeparam.data.projectId = res.data.data.projectId;
          this.picnum = res.data.data.total;
          this.seenum = res.data.data.views;
          this.status = res.data.data.status;
          this.folderId = res.data.data.folderId;
          let list = [];
          for (let i = 0; i < this.imageList.length; i++) {
            list[i] = this.imageList[i].outUrlSS;
          }
          this.previewlist = list;
          //      	this.paramList.data.projectId = res.data.
        }
        this.visible = false;
      })
    },
    handleSizeChange (val) {
      this.pagesize = val;
      console.log(this.pagesize);
      this.getpicList()
    },
    handleCurrentChange (val) {
      this.currentPage = val;
      console.log(`当前页: ${val}`);
      this.getpicList()
    },
    //点击详情
    clickDetail () {
      const p = {
        actpoint: 'show',
        instid: this.projectId
      }
      sessionStorage.setItem('toDetail', JSON.stringify(p))
      this.$router.push({
        name: 'specialDetail'
      })
    }

  },
  components: {
    //			seeBigPic
  }
}
</script>
<style>
.imageLi {
  display: inline-block;
  position: relative;
  margin-left: 20px;
  margin-bottom: 20px;
}

.imageLi:first-child {
  margin-left: 0;
}

.w300 {
  width: 300px;
}

.imagetitle {
  position: absolute;
  width: 100%;
  background: url(../../assets/image/title_back.png) no-repeat;
  text-align: left;
  z-index: 9;
  color: #fff;
  height: 50px;
  line-height: 35px;
  padding-left: 6px;
}

.ztname {
  border: none;
  padding-left: 0;
  margin-left: 10px;
  border: none;
  padding-right: 0;
  font-size: 16px;
}

.ztname:focus,
.ztname:hover {
  color: ;
  background-color: #fff;
  border-bottom: 2px #009efb solid;
  border-radius: 0;
}

.sub_title {
  height: 45px;
}

.ztstatus {
  font-size: 14px;
  color: #a0a0a0;
  border: 1px solid #dad9d9;
  border-radius: 4px;
  padding: 3px 5px;
  margin-left: 10px;
  margin-right: 45px;
}

.fr {
  float: right;
  padding-right: 15px;
}

.img_btn {
  width: 20px;
  height: 20px;
  margin-left: 10px;
}

.img_btn :first-child {
  margin-left: 0;
}

.sizebtn {
  width: 110px;
}

.sizebtn .el-input__inner {
  border: none;
}

.pictext {
  display: inline-block;
  margin-left: 15px;
  height: 35px;
  line-height: 35px;
}

.pictext img {
  display: block;
  margin: 7px 5px;
  float: left;
}

.ztxqtitle {
  border-bottom: 1px solid #ddd;
  height: 30px;
  line-height: 30px;
}

.show {
  display: inline-block !important;
}

.hide {
  display: none;
}

#hoverBtn {
  position: absolute;
  bottom: 10px;
  z-index: 9;
  right: 5px;
  display: none;
}

.cz_btn {
  background: rgba(0, 0, 0, 0.4);
  padding: 3px 5px;
  color: #fff;
  height: 24px;
  line-height: 24px;
  float: left;
  margin-left: 10px;
  margin-top: 0;
  margin-bottom: 0;
}

.cz_btn :first-child {
  margin-left: 0;
}

.cz_btn img {
  display: block;
  float: left;
  margin-top: 2px;
}
.cz_btn a {
  color: #fff !important;
}
.cz_btn a:hover,
.cz_btn a:focus {
  color: #fff !important;
}

.typetitle {
  color: #26a6ff;
  padding: 5px;
  margin-right: 40px;
}

.typecontent {
  width: 100%;
  height: 40px;
  line-height: 40px;
}

.ztxqcontent {
  padding-top: 10px;
  height: 230px;
}

.listImg {
  /*width:220px;
	height: ;*/
  width: 230px;
  height: 155px;
}
.zttitle {
  margin: 0;
  line-height: 28px;
}
.xz_btn {
  border: none;
  width: 20px;
  background: none;
  color: #fff;
  height: 100%;
  margin: 0;
  padding: 0;
}

.xz_btn:focus,
.xz_btn:hover {
  border: none;
  background: none;
  color: #fff;
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
.imageLi:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.el-scrollbar__view {
  height: 100%;
}
#picContent .el-dialog {
  margin-top: 0 !important;
  height: 100%;
  background: rgba(1, 1, 1, 0.9);
}
#picContent .el-dialog__title {
  color: #fff;
}
#picContent .el-carousel__container {
  height: 470px;
}
#picContent .el-dialog__body {
  height: 70%;
  text-align: center;
}
.contentBtn {
  background: none;
  color: #fff;
  border: 1px solid #fff;
  margin-left: 15px;
  margin-top: 10px;
}
@media screen and (max-width: 1920px) {
  .listImg {
    width: 232px;
  }
}
@media screen and (max-width: 1680px) {
  .listImg {
    width: 235px;
  }
}
@media screen and (max-width: 1440px) {
  .listImg {
    width: 238px;
  }
}
@media screen and (max-width: 1400px) {
  .listImg {
    width: 230px;
  }
}
</style>