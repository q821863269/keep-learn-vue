<template>
  <!-- 必须有一层父元素 -->
  <div class="app-container-left">
    <el-card class="box-card">
      <div slot="header">
        <b>字典列表</b>
      </div>
      <!-- 搜索条件 -->
      <el-form ref="queryForm" :model="queryParams" :inline="true" @submit.native.prevent>
        <el-form-item label="字典名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入字典名称"
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
        <el-col :span="1.5">
          <el-button :disabled="single" type="primary" icon="el-icon-edit" size="mini" @click="handleUpdate">修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button :disabled="multiple" type="danger" icon="el-icon-delete" size="mini" @click="handleDelete">删除</el-button>
        </el-col>
      </el-row>
      <!-- 表格组件 -->
      <el-table
        ref="table"
        v-loading="loading"
        element-loading-text="数据加载中"
        border
        highlight-current-row
        :data="pageList"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="40"/>
        <el-table-column align="center" label="字典名称" prop="name"/>
        <el-table-column align="center" label="字典编码" prop="code"/>
        <el-table-column align="center" label="状态" width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value=false
              :inactive-value=true
              @change="handleStatusChange(scope.row)"
            />
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
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入字典名称"/>
        </el-form-item>
        <el-form-item label="字典编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入字典编码"/>
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
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" maxlength="100" show-word-limit/>
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
import { page, add, update, patch, detail, del } from '@/api/admin/dict'

export default {
  name: 'dict',
  // import引入的组件需要注入到对象中才能使用
  data () {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
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
      // 状态数据字典
      statusOptions: [
        { name: '启用', value: false },
        { name: '禁用', value: true }
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: '请输入字典名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入字典编码', trigger: 'blur' }
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
      }).catch(() => {
        this.pageList = []
        this.pagination.total = 0
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
      this.$emit('resetItem')
    },
    // 列表行点击事件
    handleRowClick (row) {
      this.$emit('dictClick', row)
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 状态修改
    handleStatusChange (row) {
      const text = this.statusOptions.filter(item => item.value === row.status)[0].name
      this.$confirm('是否确认要' + text + '【' + row.name + '】字典吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        patch(row.id, {
          id: row.id,
          status: row.status
        }).then(() => {
          this.$message.success(text + '成功')
        }).catch(() => {
          row.status = !row.status
        })
      }).catch(function () {
        row.status = !row.status
      })
    },
    // 新增按钮操作
    async handleAdd () {
      this.resetDialogForm()
      this.dialog = {
        title: '新增字典',
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
          title: '修改字典',
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
          this.$emit('resetItem')
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
        status: false,
        remark: undefined
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
