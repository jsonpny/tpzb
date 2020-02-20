<template>
  <div class="special-list">
    <el-row :gutter="10">
      <el-col :span="9">
        <el-button-group>
          <el-button @click="add"
                     icon="el-icon-plus"
                     plain
                     size="mini"
                     type="primary">新建</el-button>
          <el-button @click="edit"
                     icon="el-icon-edit"
                     plain
                     type="primary"
                     size="mini">修改</el-button>
          <el-button @click="del"
                     icon="el-icon-delete"
                     plain
                     type="primary"
                     size="mini">删除</el-button>
          <el-button icon="el-icon-user-solid"
                     plain
                     type="primary"
                     size="mini">授权</el-button>
          <el-button @click="closeSpecial"
                     icon="el-icon-turn-off"
                     plain
                     type="primary"
                     size="mini">关闭</el-button>
          <el-button @click="openSpecial"
                     icon="el-icon-open"
                     plain
                     type="primary"
                     size="mini">开放</el-button>
        </el-button-group>

      </el-col>
      <el-col :span="15">
        <el-form :inline="true"
                 size="mini"
                 :model="searchParam.data"
                 class="special-list-form">
          <el-form-item>
            <el-input v-model="searchParam.data.title"
                      placeholder="请输入专题名称"
                      clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="dateRange"
                            value-format="yyyy-MM-dd"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            class="dateRange"
                            clearable>
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-select placeholder="请选择专题类型"
                       v-model="searchParam.data.projectType"
                       clearable>
              <el-option :key="item.code"
                         :label="item.name"
                         :value="item.code"
                         v-for="item in projectTypes"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select placeholder="请选择状态"
                       v-model="searchParam.data.flag"
                       clearable>
              <el-option label="关闭"
                         value="0"></el-option>
              <el-option label="开放"
                         value="1"
                         clearable></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       size="mini"
                       @click="getList"><i class="el-icon-search"></i></el-button>
          </el-form-item>

        </el-form>

      </el-col>
    </el-row>

    <div>
      <el-table :data="page.list"
                :header-cell-style="{'text-align' : 'center','background-color' : 'whitesmoke'}"
                @selection-change="handleSelectionChange"
                border
                highlight-current-row
                ref="table"
                size="mini">
        <el-table-column :width="40"
                         align="center"
                         show-overflow-tooltip
                         type="selection"></el-table-column>
        <el-table-column :width="60"
                         align="center"
                         label="序号"
                         show-overflow-tooltip
                         type="index"></el-table-column>
        <el-table-column label="专题"
                         prop="title"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <span :class="{'001':'huiyi','002':'caifang','003':'huodong','004':'jiangzuo'}[scope.row.projectType]">{{scope.row.projectType|getTypeNameBycode(projectTypes) }}</span>
            <el-button @click="show(scope.row)"
                       type="text">{{scope.row.title}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="图片数量"
                         :width="250"
                         prop="countPic"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="center"
                         label="创建人"
                         :width="250"
                         prop="author"
                         show-overflow-tooltip></el-table-column>

        <el-table-column align="center"
                         :width="250"
                         filter-placement="bottom-end"
                         label="关闭/开放"
                         prop="flag"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <el-switch v-model="scope.row.flag"
                       @change="handleOpenOrClosed(scope.$index, scope.row)">
            </el-switch>

          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="page.pageNum"
                     :page-size="page.pageSize"
                     :page-sizes="[10, 50, 100]"
                     :total="page.total"
                     :hide-on-single-page="false"
                     @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     layout="total, sizes, prev, pager, next, jumper"
                     style="margin-top: 5px;"></el-pagination>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SpecialList',
  data () {
    return {
      searchParam: { pageNum: 1, pageSize: 10, data: { startTime: '', endTime: '', projectType: '', flag: '', title: '', id: '' } },
      page: { pageNum: 1, pageSize: 10, total: 0, list: [] },
      dateRange: '',
      projectTypes: [],
      multipleSelection: [],
      filterText: '',
      defaultProps: { children: 'children', label: 'label' }
    }
  },
  created () {
    this.getprojecttypes()
    this.getList()
  },
  methods: {
    // 获取专题类型
    getprojecttypes () {
      this.$axios.post('/api/tpictools/getprojecttype', this.searchParam).then(res => {
        if (res.data.code === '200') this.projectTypes = res.data.data.list
        this.$store.commit('setProjectTypes', this.projectTypes)
      })
    },
    // 加载机构列表
    getList () {
      if (this.dateRange) {
        this.searchParam.data.startTime = this.dateRange[0]
        this.searchParam.data.endTime = this.dateRange[1]
      } else {
        this.searchParam.data.startTime = this.searchParam.data.endTime = ''
      }
      this.$axios.post('/api/tpictools/projectmanagelist', this.searchParam).then(res => {
        if (res.data.code === '200') {
          const PageMid = res.data.data
          PageMid.list.forEach(item => {
            if (item.flag === '1') {
              item.flag = true
            } else {
              item.flag = false
            }
          })
          this.page = PageMid
        }
      })
    },

    // 增加
    add () {
      const p = {
        actpoint: 'edit'
      }
      sessionStorage.setItem('toDetail', JSON.stringify(p))
      this.$router.push({
        name: 'specialDetail'
      })
    },
    // 修改
    edit () {
      if (this.multipleSelection.length !== 1) {
        this.$message.info('请选择一条记录进行编辑操作！')
        return false
      }
      const p = {
        actpoint: 'edit',
        instid: this.multipleSelection[0].id
      }
      sessionStorage.setItem('toDetail', JSON.stringify(p))
      this.$router.push({
        name: 'specialDetail'
      })
    },
    show (row) {
      const p = {
        actpoint: 'show',
        instid: row.id
      }
      sessionStorage.setItem('toDetail', JSON.stringify(p))
      this.$router.push({
        name: 'specialDetail'
      })
    },
    // 删除
    del () {
      if (this.multipleSelection.length < 1) {
        this.$message.info('请至少选择一条记录进行操作！')
        return false
      }
      const arr = this.multipleSelection.map(item => {
        const obj = {}
        obj.id = item.id
        return obj
      })
      const obj = { projectManageList: arr }
      this.$axios.post('/api/tpictools/deleteprojectmanage', obj).then(res => {
        if (res.data.code === '200') {
          this.getList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
      })
    },
    // 点击本专题 开放/关闭
    handleOpenOrClosed (index, row) {
      let { id, flag } = row
      flag = flag - 0
      const objData = { id, flag }
      this.$axios
        .post('/api/tpictools/projectmanageshow', objData)
        .then(res => {
          if (res.data.code === '200') {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          }
        })
    },
    // 关闭
    closeSpecial () {
      if (this.multipleSelection.length !== 1 && this.multipleSelection[0].flag === true) {
        this.$message.info('请选择一条开放的记录进行操作！')
        return false
      }
      this.$axios
        .post('/api/tpictools/projectmanageshow', {
          id: this.multipleSelection[0].id,
          flag: !this.multipleSelection[0].flag - 0
        })
        .then(res => {
          if (res.data.code === '200') {
            this.getList()
            this.$message({
              message: '关闭成功',
              type: 'success'
            })
          }
        })
    },
    // 开放
    openSpecial () {
      if (this.multipleSelection.length !== 1 && this.multipleSelection[0].flag === false) {
        this.$message.info('请选择一条关闭的记录进行操作！')
        return false
      }
      this.$axios
        .post('/api/tpictools/projectmanageshow', {
          id: this.multipleSelection[0].id,
          flag: !this.multipleSelection[0].flag - 0
        })
        .then(res => {
          if (res.data.code === '200') {
            this.getList()
            this.$message({
              message: '开放成功',
              type: 'success'
            })
          }
        })
    },

    // 分页处理函数
    handleSizeChange (val) {
      this.searchParam.size = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.searchParam.current = val
      this.getList()
    },
    // 列表选项数据
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }

}
</script>
<style lang="less">
.special-list {
  text-align: left;
  .special-list-form {
    margin-bottom: 10px;
    text-align: right;
    .el-form-item {
      margin-bottom: 10px;
      .dateRange {
        max-width: 210px;
      }
      .el-select {
        max-width: 130px;
      }
    }
  }
  .el-button-group {
    display: block;
  }
  .huiyi {
    background-color: #f54646;
    color: #fff;
    font-size: 12px;
    padding: 2px;
    margin-right: 8px;
    border-radius: 3px;
  }
  .caifang {
    background-color: #f54646;
    color: #fff;
    font-size: 12px;
    padding: 2px;
    margin-right: 8px;
    border-radius: 3px;
  }
  .huodong {
    background-color: #99d5f9;
    color: #fff;
    font-size: 12px;
    padding: 2px;
    margin-right: 8px;
    border-radius: 3px;
  }

  .jiangzuo {
    background-color: #f29c9f;
    color: #fff;
    font-size: 12px;
    padding: 2px;
    margin-right: 8px;
    border-radius: 3px;
  }
}
</style>
