<template>
  <!-- 必须有一层父元素 -->
  <div class="app-container-left">
    <el-card class="box-card">
      <div slot="header">
        <b>菜单列表</b>
      </div>
      <!-- 搜索条件 -->
      <el-form ref="queryForm" :model="queryParams" :inline="true" @submit.native.prevent>
        <el-form-item label="菜单名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入菜单名称"
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
          <el-button type="danger" :icon="expandOptions.icon" size="mini" @click="handleExpand">{{ expandOptions.value }}</el-button>
        </el-col>
      </el-row>
      <!-- 表格组件 -->
      <el-table
        v-if="expandOptions.refreshTable"
        v-loading="loading"
        element-loading-text="数据加载中"
        border
        highlight-current-row
        @row-click="handleRowClick"
        :data="tableList"
        row-key="id"
        :default-expand-all="expandOptions.expands"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column label="菜单名称">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon ? scope.row.icon : 'build'"/>
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="排序" align="center" prop="sort" width="50"/> -->
        <el-table-column label="操作" align="center" width="130">
          <template slot-scope="scope">
            <el-button
              type="success"
              icon="el-icon-plus"
              size="mini"
              circle
              plain
              @click.stop="handleAdd(scope.row)"
            />
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

    <!-- 新增或修改对话框 -->
    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" :close-on-click-modal="false" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入菜单名称"/>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentId">
          <tree-select
            v-model="form.parentId"
            :options="menuOptions"
            placeholder="选择上级菜单"
            @select="handleMenuSelect"
            :defaultExpandLevel="2"
          />
        </el-form-item>
        <el-form-item label="路由名称" prop="routeName">
          <el-input v-model="form.routeName" placeholder="请输入路由名称"/>
        </el-form-item>
        <el-form-item label="路由Path" prop="routePath">
          <el-input v-model="form.routePath" style="width: 92%"
                    :placeholder="form.parentId==0?'/admin':'user'"/>
          <el-tooltip effect="dark"
                      content="vue-router编程式路由跳转方式之一，例：this.$router.push({path:'/admin/user',query:{id:1}})"
                      placement="right">
            <i class="el-icon-info" style="margin-left: 5px;color:darkseagreen"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input v-model="form.component"
                    :readonly="form.parentId === 0 ? true : false"
                    placeholder="admin/user/index">
            <template v-if="form.parentId!=0" slot="prepend">src/views/</template>
            <template v-if="form.parentId!=0" slot="append">.vue</template>
          </el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-popover
            placement="bottom-start"
            width="460"
            trigger="click"
            @show="$refs['iconSelect'].reset()">
            <IconSelect ref="iconSelect" @selected="handleIconSelected"/>
            <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标">
              <svg-icon
                v-if="form.icon"
                slot="prefix"
                :icon-class="form.icon"
                class="el-input__icon"
                style="height: 35px;width: 20px; "/>
              <i v-else slot="prefix" class="el-icon-search el-input__icon"/>
            </el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label="状态" prop="visible">
          <el-radio-group v-model="form.visible">
            <el-radio
              v-for="dict in visibleOptions"
              :key="dict.value"
              :label="dict.value"
            >{{dict.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" style="width: 100px" :min="0"/>
        </el-form-item>
        <el-form-item label="跳转路径" prop="redirect">
          <el-input v-model="form.redirect" placeholder="请输入跳转路径" maxlength="50"/>
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
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import TreeSelect from '@riophae/vue-treeselect'
import IconSelect from '@/components/IconSelect'
import { select as menuTree, table, add, update, detail, del } from '@/api/admin/menu'

export default {
  name: 'menus',
  // import引入的组件需要注入到对象中才能使用
  components: { TreeSelect, IconSelect },
  data () {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      queryParams: {
        name: undefined
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
      // 状态数据字典
      visibleOptions: [
        { name: '显示', value: false },
        { name: '隐藏', value: true }
      ],
      form: {},
      rules: {
        parentId: [
          { required: true, message: '请选择顶级菜单', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ]
      },
      menuOptions: [],
      currentRow: undefined
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
      }).catch(() => {
        this.tableList = []
        this.loading = false
      })
    },
    // 加载菜单选项
    loadMenuOptions () {
      menuTree({ addTop: true }).then(response => {
        this.menuOptions = response.data
      })
    },
    // 加载数据
    async loadData () {
      this.handleQuery()
      await this.loadMenuOptions()
    },
    // 搜索
    handleQuery () {
      this.getTable()
    },
    // 重置
    resetQuery () {
      this.resetForm('queryForm')
      this.handleQuery()
      this.loadMenuOptions()
      this.$emit('resetPermission')
    },
    // 表格行点击事件
    handleRowClick (row) {
      const currentRow = JSON.parse(JSON.stringify(row))
      this.currentRow = currentRow
      this.$emit('menuClick', row)
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
    async handleAdd (row) {
      this.resetDialogForm()
      this.dialog = {
        title: '新增菜单',
        visible: true
      }
      if (row.id) { // 行点击新增
        this.form.parentId = row.id
        this.form.component = undefined
      } else { // 工具栏点击新增
        if (this.currentRow) {
          this.form.parentId = this.currentRow.id
          this.form.component = undefined
        } else {
          this.form.parentId = 0
          this.form.component = 'Layout'
        }
      }
      this.title = '新增菜单'
    },
    // 修改按钮操作
    async handleUpdate (row) {
      this.resetDialogForm()
      const id = row.id || this.ids
      detail(id).then(response => {
        this.form = response.data
        this.dialog = {
          title: '修改菜单',
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
          this.loadData()
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
        name: undefined,
        parentId: 0,
        routeName: undefined,
        routePath: undefined,
        component: 'Layout',
        redirect: undefined,
        icon: undefined,
        sort: 1,
        visible: false
      }
      this.resetForm('form')
    },
    // 图标选中事件
    handleIconSelected (name) {
      this.form.icon = name
      this.$forceUpdate()
    },
    // 菜单选中事件
    handleMenuSelect (node) {
      if (node.id === 0) {
        this.form.component = 'Layout'
      } else {
        this.form.component = undefined
      }
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
