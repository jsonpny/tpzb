<template>
  <div class="special-list">
    <el-form :inline="true"
             size="small"
             :model="searchParam"
             class="special-list-form">
      <el-form-item>
        <el-input v-model="searchParam.name"
                  placeholder="请输入专题名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="dateRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   size="mini"
                   @click="getOrgList">查询</el-button>
      </el-form-item>
    </el-form>
    <el-button-group>
      <el-button @click="add"
                 icon="el-icon-plus"
                 plain
                 size="small"
                 type="primary">新建</el-button>
      <el-button @click="edit"
                 icon="el-icon-edit"
                 plain
                 type="primary"
                 size="small">修改</el-button>
      <el-button @click="del"
                 icon="el-icon-delete"
                 plain
                 type="primary"
                 size="small">删除</el-button>
      <el-button icon="el-icon-user-solid"
                 plain
                 type="primary"
                 size="small">授权</el-button>
      <el-button @click="closeSpecial"
                 icon="el-icon-turn-off"
                 plain
                 type="primary"
                 size="small">关闭</el-button>
      <el-button @click="openSpecial"
                 icon="el-icon-open"
                 plain
                 type="primary"
                 size="small">开放</el-button>
    </el-button-group>

    <div>
      <el-table :data="page.records"
                :header-cell-style="{'text-align' : 'center','background-color' : 'whitesmoke'}"
                @selection-change="handleSelectionChange"
                border
                highlight-current-row
                ref="table"
                stripe
                style="width: 100%">
        <el-table-column :width="40"
                         align="center"
                         show-overflow-tooltip
                         type="selection"></el-table-column>
        <el-table-column :width="60"
                         align="center"
                         label="序号"
                         show-overflow-tooltip
                         type="index"></el-table-column>
        <el-table-column align="center"
                         label="专题"
                         prop="orgcode"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="center"
                         label="类型"
                         :width="200"
                         prop="orgcode"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="center"
                         label="图片数量"
                         :width="200"
                         prop="shortname"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="center"
                         label="创建人"
                         :width="200"
                         prop="orgname"
                         show-overflow-tooltip></el-table-column>

        <el-table-column align="center"
                         :width="200"
                         filter-placement="bottom-end"
                         label="开放/关闭"
                         prop="isused"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isused"
                       @change="handleOpenOrClosed(scope.$index, scope.row)">
            </el-switch>

          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="page.current"
                     :page-size="page.size"
                     :page-sizes="[10, 50, 100]"
                     :total="page.total"
                     hide-on-single-page="false"
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
      searchParam: { name: '', current: 1, size: 10 },
      page: { current: 1, size: 10, total: 0, records: [] },
      dateRange: '',
      multipleSelection: [],
      filterText: '',
      defaultProps: { children: 'children', label: 'label' }
    }
  },
  created () {
    this.getOrgList()
  },
  methods: {
    // 加载机构列表
    getOrgList () {
      this.$axios.post('/api' + this.$route.path, this.searchParam).then(res => {
        this.page = res.data.data
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
      // if (this.multipleSelection.length !== 1) {
      //   this.$message.info('请选择一条记录进行编辑操作！')
      //   return false
      // }
      const p = {
        actpoint: 'edit',
        instid: '1'
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
      const uuidsArr = this.multipleSelection.map(item => item.uuid)
      const namesArr = this.multipleSelection.map(item => item.temname)
      const obj = { uuid: uuidsArr.join(), name: namesArr.join() }
      this.$http.post('/api' + this.$route.path + 'del', obj).then(res => {
        if (res.data.code === 0) {
          this.getData()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
      })
    },
    // 启用/禁用
    handleOpenOrClosed (index, row) {
      let { uuid, isused: isUsed } = row
      isUsed = isUsed === '0' ? '1' : '0'
      const objData = { uuid, isUsed }
      this.$axios
        .post('/api' + this.$route.path + 'enableordisable', objData)
        .then(res => {
          if (res.data.code === 0) {
            this.getOrgList()
            this.getOrgTree()
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          }
        })
    },
    // 关闭
    closeSpecial () {
      if (this.multipleSelection.length !== 1) {
        this.$message.info('请选择一条记录进行编辑操作！')
        return false
      }
      this.$axios
        .post('/api' + this.$route.path + 'closeSpecial', {
          uuid: this.multipleSelection[0].uuid
        })
        .then(res => {
          if (res.data.code === 0) {
            this.getOrgList()
            this.getOrgTree()
            this.$message({
              message: '上移成功',
              type: 'success'
            })
          }
        })
    },
    // 开放
    openSpecial () {
      if (this.multipleSelection.length !== 1) {
        this.$message.info('请选择一条记录进行编辑操作！')
        return false
      }
      this.$axios
        .post('/api' + this.$route.path + 'openSpecial', {
          uuid: this.multipleSelection[0].uuid
        })
        .then(res => {
          if (res.data.code === 0) {
            this.getOrgList()
            this.getOrgTree()
            this.$message({
              message: '下移成功',
              type: 'success'
            })
          }
        })
    },

    // 分页处理函数
    handleSizeChange (val) {
      this.searchParam.size = val
      this.getOrgList()
    },
    handleCurrentChange (val) {
      this.searchParam.current = val
      this.getOrgList()
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
    .el-form-item {
      margin-bottom: 10px;
    }
  }
  .el-button-group {
    display: block;
  }
}
</style>
