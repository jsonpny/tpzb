<template>
  <div id="app">
    <el-header class="header">
      <img src="./assets/logo.png"
           alt="">
    </el-header>
    <el-container class="container-box">
      <el-aside width="100px">
        <el-scrollbar class="default-scrollbar"
                      wrap-class="default-scrollbar__wrap"
                      view-class="default-scrollbar__view">
          <el-menu default-active="1"
                   class="el-menu-vertical-demo"
                   @select="handleSelect"
                   background-color="#273238"
                   text-color="#fff"
                   active-text-color="#009fff">

            <el-menu-item index="1">
              <i class="el-icon-document"></i>
              <span slot="title">专题管理</span>
            </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-picture"></i>
              <span slot="title">图片管理</span>
            </el-menu-item>
          </el-menu>
        </el-scrollbar>

      </el-aside>
      <el-main>
        <el-scrollbar class="default-scrollbar"
                      wrap-class="default-scrollbar__wrap"
                      view-class="default-scrollbar__view">
          <router-view />
        </el-scrollbar>

      </el-main>
    </el-container>

  </div>
</template>
<script>
export default {
  methods: {
    handleSelect (key) {
      if (key === '1') this.$router.push({ name: 'SpecialList' })
      if (key === '2') this.$router.push({ name: 'picturesList' })
    }
  }
}
</script>

<style lang="less">
#app {
  height: 100%;
  text-align: center;
  .header {
    background-color: #0092c7;
    text-align: left;
    padding-left: 0;
  }
  .container-box {
    height: calc(100% - 60px);
    .default-scrollbar {
      height: 100%;
      width: 100%;
      background-color: #273238;
      .default-scrollbar__wrap {
        overflow-x: hidden;
        .el-menu-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 80px;
          line-height: 40px;
          i {
            color: #fff;
          }
          &.is-active i {
            color: #009fff;
          }
        }
      }
    }
    .el-main {
      background-color: #eaeff2;
      padding: 10px;
      .default-scrollbar {
        background-color: #fff;
        .default-scrollbar__wrap {
          padding: 10px;
        }
      }
    }
  }
}
</style>
