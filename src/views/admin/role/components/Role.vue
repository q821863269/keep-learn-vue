<template>
  <!-- 必须有一层父元素 -->
  <div class="app-container-left">
    <el-card class="box-card">
      <div slot="header">
        <b>角色列表</b>
      </div>
      <!-- 搜索条件 -->
      <el-form ref="queryForm" :model="queryParams" :inline="true" @submit.native.prevent>
        <el-form-item label="角色名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入角色名称"
            @keyup.enter.native="handleQuery"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button
            type="primary"
            plain
            icon="el-icon-refresh"
            size="mini"
            @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-row class="mt5 mb10">
        <el-col :span="1.5">
          <el-button type="success" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
        </el-col>
      </el-row>
      <!-- 表格组件 -->
      <el-table
        ref="roleTable"
        v-loading="loading"
        element-loading-text="数据加载中"
        border
        highlight-current-row
        :data="pageList"
        @row-click="handleRowClick"
      >
        <el-table-column align="center" label="角色名称" prop="name"/>
        <el-table-column align="center" label="角色编码" prop="code"/>
        <el-table-column align="center" label="数据权限" prop="dataScope">
          <template slot-scope="scope">
            <span>{{ showDictValue(scope.row.dataScope, dataScopeOptions) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="显示顺序" prop="sort" min-width="50" />
        <el-table-column align="center" label="状态" min-width="80">
          <template slot-scope="scope">
            <el-tag
              v-if="showDictValue(scope.row.status, statusOptions) === '启用'"
              type="success"
              >{{ showDictValue(scope.row.status, statusOptions) }}</el-tag
            >
            <el-tag v-else type="danger">{{
              showDictValue(scope.row.status, statusOptions)
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
              plain
              @click.stop="handleUpdate(scope.row)"
            />
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              plain
              @click.stop="handleDelete(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <pagination
        v-show="pagination.total > 0"
        :limit.sync="pagination.limit"
        :page.sync="pagination.page"
        :total="pagination.total"
        @pagination="getPage"
      />
    </el-card>

    <!-- 新增或修改对话框 -->
    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" :close-on-click-modal="false" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称"/>
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入角色编码"/>
        </el-form-item>
        <el-form-item label="数据权限" prop="dataScope">
          <el-select v-model="form.dataScope" placeholder="请选择数据权限" clearable>
            <el-option
              v-for="dataScope in dataScopeOptions"
              :key="dataScope.value"
              :label="dataScope.name"
              :value="dataScope.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="显示顺序" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" style="width: 100px" :min="0"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.value"
              :label="dict.value"
            >{{dict.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible=false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { page, add, update, detail, del } from '@/api/admin/role'

export default {
  name: 'role',
  // import引入的组件需要注入到对象中才能使用
  data () {
    return {
      checkedRoleId: undefined,
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      queryParams: {
        name: undefined
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
      // 数据权限字段
      dataScopeOptions: [
        { name: '全部', value: 0 },
        { name: '自定义数据', value: 1 },
        { name: '部门数据', value: 2 },
        { name: '部门及以下', value: 3 },
        { name: '仅本人数据', value: 4 }
      ],
      // 状态数据字典
      statusOptions: [
        { name: '启用', value: false },
        { name: '禁用', value: true }
      ],
      form: {},
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '角色编码不能为空', trigger: 'blur' }
        ],
        dataScope: [
          { required: true, message: '数据权限不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  // 方法集合
  methods: {
    // 加载列表数据
    getPage () {
      this.loading = true
      this.queryParams.pageNum = this.pagination.page
      this.queryParams.pageSize = this.pagination.limit
      page(this.queryParams).then((response) => {
        const { records, total } = response.data
        this.pageList = records
        this.pagination.total = total
        this.loading = false
      })
    },
    // 加载数据
    async loadData () {
      this.handleQuery()
    },
    // 搜索
    handleQuery () {
      this.pagination.page = 1
      this.getPage()
    },
    // 重置
    resetQuery () {
      this.resetForm('queryForm')
      this.handleQuery()
      this.handleRowClick(undefined)
    },
    // 列表行点击事件
    handleRowClick (row) {
      if (row === undefined) {
        if (this.checkedRoleId !== undefined) {
          this.checkedRoleId = undefined
          this.$emit('roleClick', undefined)
        }
      } else {
        this.checkedRoleId = row.id
        const currentRow = JSON.parse(JSON.stringify(row))
        this.$emit('roleClick', currentRow)
      }
    },
    // 新增按钮操作
    async handleAdd (row) {
      this.resetDialogForm()
      this.dialog = {
        title: '新增角色',
        visible: true
      }
    },
    // 修改按钮操作
    async handleUpdate (row) {
      this.resetDialogForm()
      const id = row.id || this.ids
      detail(id).then(response => {
        this.form = response.data
        this.dialog = {
          title: '修改角色',
          visible: true
        }
      })
    },
    // 删除按钮操作
    handleDelete (row) {
      const ids = row.id || this.ids.join(',')
      this.$confirm('是否确认删除选中的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(ids).then(() => {
          this.$message.success('删除成功')
          this.handleQuery()
        })
      })
    },
    // 确定 新增或修改
    handleSubmit () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const id = this.form.id
          if (id === undefined) {
            add(this.form).then(() => {
              this.$message.success('新增成功')
              this.dialog.visible = false
              this.handleQuery()
            })
          } else {
            update(this.form.id, this.form).then(() => {
              this.$message.success('修改成功')
              this.dialog.visible = false
              this.handleQuery()
            })
          }
        }
      })
    },
    // 表单重置
    resetDialogForm () {
      this.form = {
        name: undefined,
        code: undefined,
        dataScope: undefined,
        sort: 1,
        status: false
      }
      this.resetForm('form')
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
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
</style>
