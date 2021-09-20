<template>
  <!-- 必须有一层父元素 -->
  <div class="app-container">
    <div class="app-container-right">
      <!-- 搜索条件 -->
      <el-card class="box-card-search" v-show="showSearch">
        <el-form ref="queryForm" :model="queryParams" :inline="true">
          <el-form-item label="部门名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入部门名称"
              @keyup.enter.native="handleQuery"
              clearable
              size="small"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择状态" clearable filterable size="small">
              <el-option
                v-for="dict in statusOptions"
                :key="dict.value"
                :label="dict.name"
                :value="dict.value"
              />
            </el-select>
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
          <el-col :span="1.5">
            <el-button type="success" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" :icon="expandOptions.icon" size="mini" @click="handleExpand">{{ expandOptions.value }}</el-button>
          </el-col>
          <right-toolbar
            :show-search.sync="showSearch"
            @queryTable="handleQuery"
          />
        </el-row>
        <!-- 表格组件 -->
        <el-table
          v-if="expandOptions.refreshTable"
          v-loading="loading"
          element-loading-text="数据加载中"
          border
          :data="tableList"
          row-key="id"
          :default-expand-all="expandOptions.expands"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column
            align="left"
            label="部门名称"
            prop="name"
            min-width="160"
          />
          <el-table-column align="center" label="显示顺序" prop="sort" />
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
          <el-table-column
            align="center"
            label="更新时间"
            prop="updateTime"
            min-width="95"
          />
          <el-table-column align="center" label="操作" width="150">
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
      </el-card>
    </div>

    <!-- 新增或修改对话框 -->
    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" :close-on-click-modal="false" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上级部门" prop="parentId">
          <tree-select
            v-model="form.parentId"
            :options="deptOptions"
            placeholder="选择上级部门"
            :defaultExpandLevel="1"
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入部门名称"/>
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
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { select as deptTree, table, add, update, detail, del } from '@/api/admin/dept'

export default {
  name: 'Dept',
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
        name: undefined,
        status: undefined
      },
      expandOptions: {
        refreshTable: true,
        expands: true,
        icon: 'el-icon-arrow-up',
        value: '收起'
      },
      tableList: [],
      dialog: {
        title: undefined,
        visible: false
      },
      // 部门树选项
      deptOptions: [],
      // 状态数据字典
      statusOptions: [
        { name: '启用', value: false },
        { name: '禁用', value: true }
      ],
      // 表单参数
      form: {},
      rules: {
        parentId: [
          { required: true, message: '上级部门不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  // 方法集合
  methods: {
    // 加载列表数据
    getTable () {
      this.loading = true
      table(this.queryParams).then((response) => {
        this.tableList = response.data
        this.loading = false
      })
    },
    // 加载部门选项
    loadDeptOptions () {
      deptTree({ addTop: true }).then((response) => {
        this.deptOptions = response.data
      })
    },
    // 加载数据
    async loadData () {
      this.handleQuery()
      await this.loadDeptOptions()
    },
    // 搜索
    handleQuery () {
      this.getTable()
    },
    // 重置
    resetQuery () {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 表格开合
    async handleExpand () {
      this.expandOptions.refreshTable = false
      if (this.expandOptions.expands) {
        this.expandOptions.expands = false
        this.expandOptions.icon = 'el-icon-arrow-down'
        this.expandOptions.value = '展开'
      } else {
        this.expandOptions.expands = true
        this.expandOptions.icon = 'el-icon-arrow-up'
        this.expandOptions.value = '收起'
      }
      this.$nextTick(() => {
        this.expandOptions.refreshTable = true
      })
    },
    // 新增按钮操作
    async handleAdd () {
      this.resetDialogForm()
      this.dialog = {
        title: '新增部门',
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
          title: '修改部门',
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
        this.loadData()
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
              this.loadData()
            })
          } else {
            update(this.form.id, this.form).then(() => {
              this.$message.success('修改成功')
              this.dialog.visible = false
              this.loadData()
            })
          }
        }
      })
    },
    // 表单重置
    resetDialogForm () {
      this.form = {
        parentId: undefined,
        name: undefined,
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
