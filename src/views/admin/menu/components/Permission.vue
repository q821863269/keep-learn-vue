<template>
  <!-- 必须有一层父元素 -->
  <div class="app-container-right">
    <el-card class="box-card">
      <div slot="header">
        <b><svg-icon icon-class="route"/>{{ menuName }}权限列表</b>
      </div>
      <!-- 搜索条件 -->
      <el-form ref="queryForm" :model="queryParams" :inline="true" @submit.native.prevent>
        <el-form-item prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入权限名称"
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
        v-loading="loading"
        element-loading-text="数据加载中"
        border
        :data="pageList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="35" />
        <el-table-column align="center" label="权限名称" prop="name" />
        <el-table-column align="center" label="URL权限标识" prop="urlPerm" min-width="150"/>
        <el-table-column align="center" label="按钮权限标识" prop="btnPerm" min-width="140"/>
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
              plain
              @click="handleEdit(scope.row)"/>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              plain
              @click="handleDelete(scope.row)"/>
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
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入权限名称"/>
        </el-form-item>
        <el-form-item label="URL权限" prop="urlPerm">
          <el-select v-model="urlPerm.serviceName" placeholder="Service" clearable>
            <el-option v-for="item in microServiceList" :key="item.value" :value="item.value" :label="item.name"/>
          </el-select>
          <el-select v-model="urlPerm.requestMethod" placeholder="Method" clearable>
            <el-option v-for="item in requestMethodList" :key="item.value" :value="item.value" :label="item.name"/>
          </el-select>
          <el-input placeholder="例：GET:/admin/users" v-model="urlPerm.requestPath"/>
          <el-link type="primary" v-show="urlPerm.requestMethod">
            {{ urlPerm.requestMethod }}:/{{ urlPerm.serviceName }}{{ urlPerm.requestPath }}
          </el-link>
        </el-form-item>
        <el-form-item label="按钮权限" prop="btnPerm">
          <el-input v-model="form.btnPerm" placeholder="admin:users:add"/>
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
import { page, add, update, detail, del } from '@/api/admin/permission'

export default {
  name: 'permission',
  // import引入的组件需要注入到对象中才能使用
  data () {
    return {
      loading: false,
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
      form: {
        name: undefined,
        urlPerm: undefined,
        btnPerm: undefined
      },
      rules: {
        name: [
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ],
        perm: [
          { required: true, message: '请输入权限标识', trigger: 'blur' }
        ],
        method: [
          { required: true, message: '请选择请求方式', trigger: 'blur' }
        ]
      },
      disabled: true,
      menu: {},
      menuName: undefined,
      urlPerm: {
        requestMethod: undefined,
        serviceName: undefined,
        requestPath: undefined
      },
      microServiceList: [],
      requestMethodList: []
    }
  },
  // 方法集合
  methods: {
    // 加载列表数据
    getPage () {
      this.loading = true
      this.queryParams.pageNum = this.pagination.page
      this.queryParams.pageSize = this.pagination.limit
      this.queryParams.menuId = this.menu.id
      page(this.queryParams).then((response) => {
        const { records, total } = response.data
        this.pageList = records
        this.pagination.total = total
        this.loading = false
      })
    },
    loadMicroServices () {
      this.microServiceList = [
        {
          name: '系统服务',
          value: 'admin'
        }
      ]
    },
    loadRequestMethods () {
      this.requestMethodList = [
        {
          name: '不限',
          value: '*'
        },
        {
          name: 'GET',
          value: 'GET'
        },
        {
          name: 'POST',
          value: 'POST'
        },
        {
          name: 'PUT',
          value: 'PUT'
        },
        {
          name: 'PATCH',
          value: 'PATCH'
        },
        {
          name: 'DELETE',
          value: 'DELETE'
        }
      ]
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
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 新增
    async handleAdd () {
      if (this.menuName === undefined) {
        this.$message.warning('请先选择菜单后，再新增权限')
        return
      }
      await this.loadMicroServices()
      await this.loadRequestMethods()
      this.resetDialogForm()
      this.form = {
        menuId: this.menu.id
      }
      this.dialog = {
        title: this.menuName + '新增权限',
        visible: true
      }
    },
    // 修改
    async handleEdit (row) {
      await this.loadMicroServices()
      await this.loadRequestMethods()
      this.resetDialogForm()
      this.dialog = {
        title: this.menuName + '修改权限',
        visible: true
      }
      const id = row.id
      detail(id).then(response => {
        const data = response.data
        // 处理URL权限
        const urlPerm = data.urlPerm
        this.form = data
        if (urlPerm) {
          // GET:/admin/users/*
          const permArr = urlPerm.split(':')
          const requestMethod = permArr[0]
          const serviceName = permArr[1].substring(1, permArr[1].substr(1).indexOf('/') + 1)
          const requestPath = permArr[1].substring(permArr[1].substr(1).indexOf('/') + 1)
          this.urlPerm = {
            requestMethod: requestMethod,
            serviceName: serviceName,
            requestPath: requestPath
          }
        }
      })
    },
    // 删除
    handleDelete (row) {
      const ids = row.id || this.ids.join(',')
      this.$confirm('是否确认删除选中的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return del(ids)
      }).then(() => {
        this.$message.success('删除成功')
        this.handleQuery()
      })
    },
    // 确定 新增或修改
    handleSubmit () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // 两个权限必选一个
          if (!(this.urlPerm.requestPath || this.form.btnPerm)) {
            this.$message.warning('请至少填写一种权限')
            return false
          }

          if (this.urlPerm.requestPath) {
            if (!this.urlPerm.requestMethod) {
              this.$message.warning('URL权限的请求方式不能为空')
              return false
            }
            if (!this.urlPerm.serviceName) {
              this.$message.warning('URL权限的所属服务不能为空')
              return false
            }
            this.form.urlPerm = this.urlPerm.requestMethod + ':/' + this.urlPerm.serviceName + this.urlPerm.requestPath
          }

          this.form.menuId = this.menu.id
          if (this.form.id === undefined) {
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
      this.urlPerm = {}
      this.resetForm('form')
    },
    menuClick (row) {
      this.disabled = false
      this.menu = row
      this.menuName = '【' + this.menu.name + '】'
      this.handleQuery()
    },
    resetPermission () {
      this.disabled = true
      this.menu = {}
      this.menuName = undefined
      this.pageList = []
      this.queryParams.menuId = undefined
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {},
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
