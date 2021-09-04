<template>
  <!-- 必须有一层父元素 -->
  <div class="app-container">
    <el-row :gutter="10">
      <!-- 部门数据 -->
      <el-col :xs="24" :sm="24" :md="6" :lg="5">
        <div style="margin-bottom: 10px">
          <el-card class="box-card">
            <el-input
              v-model="deptName"
              placeholder="请输入部门名称"
              prefix-icon="el-icon-search"
              size="small"
              clearable
            />
            <el-tree
              ref="tree"
              :data="deptOptions"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              default-expand-all
              @node-click="handleNodeClick"
            />
          </el-card>
        </div>
      </el-col>
      <!-- 用户数据 -->
      <el-col :xs="24" :sm="24" :md="18" :lg="19">
        <div style="margin-bottom: 10px">
          <el-card class="box-card">
            <el-table
              v-loading="loading"
              element-loading-text="数据加载中"
              element-loading-spinner="el-icon-loading"
              border
              :data="pageList"
              @selection-change="handleSelectionChange"
            >
              <el-table-column align="center" type="selection" width="50" />
              <el-table-column
                align="center"
                label="ID"
                prop="id"
              />
              <el-table-column
                align="center"
                label="用户名"
                prop="username"
              />
              <el-table-column
                align="center"
                label="昵称"
                prop="nickname"
              />
              <el-table-column
                align="center"
                label="性别"
                prop="gender"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.gender === 0">女</span>
                  <span v-if="scope.row.gender === 1">男</span>
                  <span v-if="scope.row.gender === 2">未知</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="部门名称"
                prop="deptName"
              />
              <el-table-column
                align="center"
                label="角色名称"
                prop="roleNames"
              />
              <el-table-column
                align="center"
                label="联系方式"
                prop="mobile"
              />
              <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.status"
                    :active-value="1"
                    :inactive-value="0"
                    @change="handleStatusChange(scope.row)"
                  />
                </template>
              </el-table-column>

              <el-table-column align="center" label="操作" width="150">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    circle
                    plain
                    @click.stop="handleUpdate(scope.row)"
                    v-has-permission="['admin:user:edit']"
                  />
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    circle
                    plain
                    @click.stop="handleDelete(scope.row)"
                    v-has-permission="['admin:user:delete']"
                  />
                  <el-button
                    type="info"
                    icon="el-icon-key"
                    size="mini"
                    circle
                    plain
                    @click.stop="handleResetPassword(scope.row)"
                    v-has-permission="['admin:user:reset']"
                  />
                </template>
              </el-table-column>
            </el-table>

            <pagination
              v-show="pagination.total > 0"
              :limit.sync="pagination.limit"
              :page.sync="pagination.page"
              :total="pagination.total"
              @pagination="handleQuery"
            />
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { list } from '@/api/admin/user'
import { select as deptSelectList } from '@/api/admin/dept'
import { list as roleList } from '@/api/admin/role'

export default {
  name: 'User',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    // 这里存放数据
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      queryParams: {
        deptId: undefined,
        username: undefined,
        mobile: undefined
      },
      pagination: {
        page: 1,
        limit: 10,
        total: 0
      },
      pageList: [],
      dialog: {
        title: undefined,
        visible: false
      },
      // 部门名称
      deptName: undefined,
      // 部门树选项
      deptOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {
        roleIds: []
      }
    }
  },
  // 方法集合
  methods: {
    // 加载数据
    async loadData () {
      this.handleQuery()
      await this.loadRoleOptions()
      await this.loadDeptOptions()
    },
    // 处理查询
    handleQuery () {
      this.loading = true
      this.queryParams.pageNum = this.pagination.page
      this.queryParams.pageSize = this.pagination.limit
      list(this.queryParams).then((response) => {
        const { records, total } = response.data
        this.pageList = records
        this.pagination.total = total
        this.loading = false
      })
    },
    // 筛选节点
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 部门节点单击事件
    handleNodeClick (data) {
      this.queryParams.deptId = data.id
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 加载部门选项
    loadDeptOptions () {
      deptSelectList().then((response) => {
        this.deptOptions = response.data
      })
    },
    // 加载角色选项
    loadRoleOptions () {
      roleList().then((response) => {
        this.roleOptions = response.data
      })
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    // 根据名称筛选部门树
    deptName (val) {
      this.$refs.tree.filter(val)
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    this.loadData()
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {},
  // 生命周期 - 创建之前
  beforeCreate () {},
  // 生命周期 - 挂载之前
  beforeMount () {},
  // 生命周期 - 更新之前
  beforeUpdate () {},
  // 生命周期 - 更新之后
  updated () {},
  // 生命周期 - 销毁之前
  beforeDestroy () {},
  // 生命周期 - 销毁完成
  destroyed () {},
  // 如果页面有keep-alive缓存功能，这个函数会触发
  activated () {}
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.box-card {
  min-height: calc(100vh - 124px);

  .el-tree {
    margin-top: 10px;
  }
}

@media only screen and (max-width: 992px) {
  .box-card {
    min-height: 30vh;
  }
}
</style>
