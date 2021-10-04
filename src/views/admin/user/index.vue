<template>
  <!-- 必须有一层父元素 -->
  <div class="app-container">
    <el-row :gutter="10">
      <!-- 左侧部门树 -->
      <el-col :xs="24" :sm="24" :md="6" :lg="5">
        <div class="app-container-left">
          <el-card class="box-card-tree">
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
            >
            </el-tree>
          </el-card>
        </div>
      </el-col>
      <!-- 右侧列表 -->
      <el-col :xs="24" :sm="24" :md="18" :lg="19">
        <div class="app-container-right">
          <!-- 搜索条件 -->
          <el-card class="box-card-search" v-show="showSearch">
            <el-form ref="queryForm" :model="queryParams" :inline="true">
              <el-form-item label="昵称" prop="nickname">
                <el-input
                  v-model="queryParams.nickname"
                  placeholder="请输入昵称"
                  @keyup.enter.native="handleQuery"
                  clearable
                  size="small"
                />
              </el-form-item>
              <el-form-item label="手机号码" prop="mobile">
                <el-input
                  v-model="queryParams.mobile"
                  placeholder="请输入手机号码"
                  @keyup.enter.native="handleQuery"
                  clearable
                  size="small"
                />
              </el-form-item>
              <el-form-item label="开始时间" prop="startTime">
                <el-date-picker
                  v-model="queryParams.startTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择开始时间"
                  default-time="00:00:00"
                  clearable
                  size="small"
                />
              </el-form-item>
              <el-form-item label="结束时间" prop="endTime">
                <el-date-picker
                  v-model="queryParams.endTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择结束时间"
                  default-time="23:59:59"
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
          </el-card>
          <!-- 列表 -->
          <el-card class="box-card-table">
            <el-row class="mb10">
              <el-col :span="1.5" v-has-permission="['admin:users:add']">
                <el-button type="success" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
              </el-col>
              <el-col :span="1.5" v-has-permission="['admin:users:edit']">
                <el-button :disabled="single" type="primary" icon="el-icon-edit" size="mini" @click="handleUpdate">修改</el-button>
              </el-col>
              <el-col :span="1.5" v-has-permission="['admin:users:delete']">
                <el-button :disabled="multiple" type="danger" icon="el-icon-delete" size="mini" @click="handleDelete">删除</el-button>
              </el-col>
              <el-col :span="1.5" v-has-permission="['admin:users:import']">
                <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport">导入</el-button>
              </el-col>
              <el-col :span="1.5" v-has-permission="['admin:users:export']">
                <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
              </el-col>
              <right-toolbar
                :show-search.sync="showSearch"
                @queryTable="handleQuery"
              />
            </el-row>
            <!-- 表格组件 -->
            <el-table
              v-loading="loading"
              element-loading-text="数据加载中"
              border
              :data="pageList"
              @selection-change="handleSelectionChange"
            >
              <el-table-column align="center" type="selection" width="40" />
              <el-table-column align="center" label="用户名" prop="username"/>
              <el-table-column align="center" label="昵称" prop="nickname"/>
              <el-table-column align="center" label="性别" prop="gender" width="60">
                <template slot-scope="scope">
                  <span>{{ showDictValue(scope.row.gender, genderOptions) }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="部门名称" prop="deptName"/>
              <el-table-column align="center" label="角色名称" prop="roleNames"/>
              <el-table-column align="center" label="手机号码" prop="mobile" min-width="110"/>
              <el-table-column align="center" label="邮箱" prop="email" min-width="110"/>
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
              <el-table-column align="center" label="更新时间" prop="updateTime" min-width="95"/>
              <el-table-column align="center" label="操作" width="150">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    circle
                    plain
                    @click.stop="handleUpdate(scope.row)"
                    v-has-permission="['admin:users:edit']"
                  />
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    circle
                    plain
                    @click.stop="handleDelete(scope.row)"
                    v-has-permission="['admin:users:delete']"
                  />
                  <el-button
                    type="info"
                    icon="el-icon-key"
                    size="mini"
                    circle
                    plain
                    @click.stop="handleResetPassword(scope.row)"
                    v-has-permission="['admin:users:reset']"
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
        </div>
      </el-col>
    </el-row>

    <!-- 新增或修改对话框 -->
    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" :close-on-click-modal="false" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" :disabled="form.id !== undefined" placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入用户昵称"/>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" placeholder="请选择性别" clearable>
            <el-option
              v-for="dict in genderOptions"
              :key="dict.value"
              :label="dict.name"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <tree-select v-model="form.deptId" :options="deptOptions" placeholder="请选择所属部门" :defaultExpandLevel="1" />
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="form.roleIds" multiple placeholder="请选择角色" clearable>
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="form.mobile" maxlength="11" placeholder="请输入手机号码"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" maxlength="30" placeholder="请输入邮箱"/>
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

    <!-- 导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.visible" :close-on-click-modal="false" width="600px">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xls, .xlsx"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :on-error="handleFileError"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div slot="tip" class="el-upload__tip" style="color:red;font-size:14px">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
        <!-- <div slot="tip" class="el-upload__tip">
          <el-checkbox v-model="upload.updateSupport" />&nbsp;是否更新已经存在的用户数据
        </div> -->
        <div slot="tip" class="el-upload__tip">
          <el-link type="info" style="color:blue;font-size:14px" @click="downloadTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="upload.visible=false">取 消</el-button>
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { page, add, update, patch, detail, del, excelImport, excelTemplate, excelExport } from '@/api/admin/user'
import { select as deptTree } from '@/api/admin/dept'
import { list as roleList } from '@/api/admin/role'
import { getToken } from '@/utils/auth'

export default {
  name: 'User',
  // import引入的组件需要注入到对象中才能使用
  components: { TreeSelect },
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
      // 显示搜索条件
      showSearch: true,
      queryParams: {
        deptId: undefined,
        username: undefined,
        mobile: undefined,
        startTime: undefined,
        endTime: undefined
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
      // 性别选项
      genderOptions: [
        { name: '男', value: 1 },
        { name: '女', value: 0 },
        { name: '未知', value: 2 }
      ],
      // 状态数据字典
      statusOptions: [
        { name: '启用', value: false },
        { name: '禁用', value: true }
      ],
      // 表单参数
      form: {},
      // 用户导入参数
      upload: {
        title: undefined,
        visible: false,
        isUploading: false,
        updateSupport: 0,
        headers: { Authorization: getToken() },
        url: excelImport
      },
      // 表单校验
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '归属部门不能为空', trigger: 'blur' }
        ],
        roleIds: [
          { required: true, message: '角色不能为空', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: this.formValidate.telphone, trigger: 'blur' }
        ],
        email: [
          { validator: this.formValidate.email, trigger: 'blur' }
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
    // 加载部门选项
    loadDeptOptions () {
      deptTree().then((response) => {
        this.deptOptions = response.data
      })
    },
    // 加载角色选项
    loadRoleOptions () {
      roleList().then((response) => {
        this.roleOptions = response.data
      })
    },
    // 加载数据
    async loadData () {
      this.handleQuery()
      await this.loadDeptOptions()
      await this.loadRoleOptions()
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
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 用户状态修改
    handleStatusChange (row) {
      const text = this.statusOptions.filter(item => item.value === row.status)[0].name
      this.$confirm('是否确认要' + text + '【' + row.username + '】用户吗?', '警告', {
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
        title: '新增用户',
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
          title: '修改用户',
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
      }).then(function () {
        return del(ids)
      }).then(() => {
        this.$message.success('删除成功')
        this.handleQuery()
      })
      // .catch(() =>
      //   this.$message.info('已取消删除')
      // )
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
    // 导入按钮操作
    handleImport () {
      this.upload.title = '导入'
      this.upload.visible = true
    },
    // 导出按钮操作
    handleExport () {
      excelExport('用户信息', this.queryParams)
    },
    // 下载模板操作
    downloadTemplate () {
      excelTemplate('用户信息模板')
    },
    // 提交上传文件
    submitFileForm () {
      if (this.$refs.upload.uploadFiles.length > 0) {
        this.$refs.upload.submit()
      } else {
        this.$message.warning('请添加要导入的Excel文件~')
      }
    },
    // 文件上传中处理
    handleFileUploadProgress (event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess (response, file, fileList) {
      this.upload.isUploading = false
      // 清除文件
      this.$refs.upload.clearFiles()
      if (response.code === 0) {
        this.$message.success('导入成功')
        this.upload.visible = false
        this.handleQuery()
      } else {
        this.$alert(response.msg, '导入结果', { dangerouslyUseHTMLString: true })
      }
    },
    // 文件上传错误处理
    handleFileError (err, file, fileList) {
      console.log(err)
      this.upload.isUploading = false
      this.$message.error('导入错误')
    },
    // 重置密码
    handleResetPassword (row) {
      this.$prompt('请输入' + row.username + '"的新密码', '重置密码', {
        inputType: 'password',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: (value) => {
          if (!value || value.trim().length < 1) {
            return '请输入新密码'
          }
        }
      }).then(({ value }) => {
        patch(row.id, {
          id: row.id,
          password: value
        }).then(() => {
          this.$message.success('修改成功，新密码是：' + value)
        })
      })
    },
    // 表单重置
    resetDialogForm () {
      this.form = {
        id: undefined,
        username: undefined,
        nickname: undefined,
        gender: undefined,
        deptId: undefined,
        roleIds: [],
        mobile: undefined,
        email: undefined,
        status: false
      }
      this.resetForm('form')
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
</style>
