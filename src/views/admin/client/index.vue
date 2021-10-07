<template>
  <!-- 必须有一层父元素 -->
  <div class="app-container">
    <div class="app-container-right">
      <!-- 搜索条件 -->
      <el-card class="box-card-search" v-show="showSearch">
        <el-form ref="queryForm" :model="queryParams" :inline="true" @submit.native.prevent>
          <el-form-item label="客户端ID" prop="clientId">
            <el-input
              v-model="queryParams.clientId"
              placeholder="请输入客户端ID"
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
      </el-card>
      <!-- 列表 -->
      <el-card class="box-card-table">
        <el-row class="mb10">
          <el-col :span="1.5">
            <el-button type="success" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button :disabled="single" type="primary" icon="el-icon-edit" size="mini" @click="handleUpdate">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button :disabled="multiple" type="danger" icon="el-icon-delete" size="mini" @click="handleDelete">删除</el-button>
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
          <el-table-column align="center" type="selection" width="40"/>
          <el-table-column align="center" label="客户端ID" prop="clientId"/>
          <el-table-column align="center" label="客户端密钥" prop="clientSecret"/>
          <el-table-column align="center" label="域" prop="scope" min-width="50"/>
          <el-table-column align="center" label="自动放行" prop="autoApprove" min-width="50">
            <template slot-scope="scope">
              <span>{{ showDictValue(scope.row.autoApprove, autoApproveOptions) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="授权方式" prop="authorizedGrantTypes" :formatter="authorizedGrantTypesFormat" min-width="100"/>
          <el-table-column align="center" label="认证令牌时效(单位：秒)" prop="accessTokenValidity" min-width="80"/>
          <el-table-column align="center" label="刷新令牌时效(单位：秒)" prop="refreshTokenValidity" min-width="80"/>
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
    </div>

    <!-- 新增或修改对话框 -->
    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" :close-on-click-modal="false" top="5vh" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="客户端ID" prop="clientId">
          <el-input v-model="form.clientId" placeholder="请输入客户端ID"/>
        </el-form-item>
        <el-form-item label="客户端密钥" prop="clientSecret">
          <el-input v-model="form.clientSecret" placeholder="请输入客户端密钥"/>
        </el-form-item>
        <el-form-item label="域" prop="scope">
          <el-input v-model="form.scope" placeholder="请输入域"/>
        </el-form-item>
        <el-form-item label="自动放行" prop="autoApprove">
          <el-radio-group v-model="form.autoApprove">
            <el-radio
                v-for="dict in autoApproveOptions"
                :key="dict.value"
                :label="dict.value"
              >{{dict.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="授权方式" prop="authorizedGrantTypes">
          <el-checkbox-group v-model="form.authorizedGrantTypes">
            <el-checkbox v-for="(item,index) in authorizedGrantTypesOptions" :key="index" :label="item.value">
              {{ item.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="认证令牌时效" prop="accessTokenValidity">
          <el-input-number v-model="form.accessTokenValidity" controls-position="right" style="width: 150px" :min="60" :step="60"/>
        </el-form-item>
        <el-form-item label="刷新令牌时效" prop="refreshTokenValidity">
          <el-input-number v-model="form.refreshTokenValidity" controls-position="right" style="width: 150px" :min="60" :step="60"/>
        </el-form-item>
        <el-form-item label="回调地址" prop="webServerRedirectUri">
          <el-input v-model="form.webServerRedirectUri" placeholder="请输入回调地址"/>
        </el-form-item>
        <el-form-item label="权限" prop="authorities">
          <el-input v-model="form.authorities" placeholder="请输入权限"/>
        </el-form-item>
        <el-form-item label="扩展信息" prop="additionalInformation">
          <el-input v-model="form.additionalInformation" type="textarea" placeholder="JSON格式"/>
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
import { page, add, update, detail, del } from '@/api/admin/client'

export default {
  name: 'Client',
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
        clientId: undefined
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
      // 自动放行
      autoApproveOptions: [
        {
          name: '是',
          value: true
        },
        {
          name: '否',
          value: false
        }
      ],
      // 授权方式
      authorizedGrantTypesOptions: [
        {
          name: '密码模式',
          value: 'password'
        },
        {
          name: '授权码模式',
          value: 'authorization_code'
        },
        {
          name: '客户端模式',
          value: 'client_credentials'
        },
        {
          name: '刷新模式',
          value: 'refresh_token'
        },
        {
          name: '简化模式',
          value: 'implicit'
        },
        {
          name: '短信',
          value: 'sms'
        }
      ],
      // 表单参数
      form: {},
      rules: {
        clientId: [
          { required: true, message: '客户端ID不能为空', trigger: 'blur' }
        ],
        clientSecret: [
          { required: true, message: '客户端密钥不能为空', trigger: 'blur' }
        ],
        scope: [
          { required: true, message: '域不能为空', trigger: 'blur' }
        ],
        authorizedGrantTypes: [
          { required: true, message: '请选择授权方式', trigger: 'blur' }
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
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 新增按钮操作
    async handleAdd () {
      this.resetDialogForm()
      this.dialog = {
        title: '新增客户端',
        visible: true
      }
    },
    // 修改按钮操作
    async handleUpdate (row) {
      this.resetDialogForm()
      const id = row.id || this.ids
      detail(id).then(response => {
        const data = response.data
        this.form = response.data
        if (data.authorizedGrantTypes) {
          this.form.authorizedGrantTypes = data.authorizedGrantTypes.split(',')
        }
        this.dialog = {
          title: '修改客户端',
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
          this.form.authorizedGrantTypes = this.form.authorizedGrantTypes.join(',')
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
    // 授权方式字典翻译
    authorizedGrantTypesFormat (row) {
      const grantTypes = row.authorizedGrantTypes
      if (!grantTypes) return
      let temp = []
      grantTypes.split(',').forEach(type => {
        const types = this.authorizedGrantTypesOptions.filter(item => item.value === type)
        if (types && types.length > 0) {
          temp.push(types[0].name)
        }
      })
      return temp.join(' | ')
    },
    // 表单重置
    resetDialogForm () {
      this.form = {
        clientId: undefined,
        clientSecret: undefined,
        scope: undefined,
        autoApprove: true,
        authorizedGrantTypes: [],
        accessTokenValidity: 60,
        refreshTokenValidity: 60,
        webServerRedirectUri: undefined,
        authorities: undefined,
        additionalInformation: undefined
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
