<template>
  <!-- 必须有一层父元素 -->
  <div class="app-container-right">
    <el-card class="box-card">
      <div slot="header">
        <b>{{ menu && menu.label ? "【" + menu.label + "】" : "" }}权限分配</b>
      </div>

      <el-row>
        <el-col :span="18">
          <el-tag v-if="role" type="primary" class="mb5">{{ role.name }}</el-tag>
          <el-tag v-if="!role" type="info" class="ml10 mb5">
            <i class="el-icon-info"></i>请选择角色
          </el-tag>
          <el-tag v-if="menu" type="success" class="ml10">{{ menu.label }}</el-tag>
          <el-tag v-if="!menu" type="info" class="ml10">
            <i class="el-icon-info"></i>请选择菜单
          </el-tag>
        </el-col>
        <el-col :span="6" style="text-align: right">
          <el-button
            type="primary"
            icon="el-icon-check"
            size="mini"
            @click="handleSubmit"
            >提交
          </el-button>
        </el-col>
      </el-row>

      <div v-if="permissionList.length > 0">
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
          class="mt20"
        >全选</el-checkbox>
      </div>
      <div style="text-align: center" v-else>
        <svg-icon icon-class="nodata" style="width: 150px; height: 150px" />
        <el-row>
          <el-link :underline="false" type="info">
            {{ !role ? "请选择角色" : !menu ? "请选择菜单" : "暂无数据，您可在【菜单管理】配置权限数据" }}
          </el-link>
        </el-row>
      </div>

      <el-row v-loading="loading">
        <el-col :span="12" v-for="(permission, index) in permissionList" :key="index" class="mt20" style="text-align: center;">
          <el-tooltip class="item" effect="dark" placement="bottom">
              <div slot="content">
                URL权限：{{ permission.urlPerm }} <br /> 按钮权限：{{ permission.btnPerm }}
              </div>
              <el-checkbox
                border
                v-model="permission.checked"
                :label="permission.id"
                :key="permission.id"
                @change="handleCheckChange"
                size="mini"
              >
                {{ permission.name }}
              </el-checkbox>
            </el-tooltip>
        </el-col>
      </el-row>

    </el-card>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { list as permissionList } from '@/api/admin/permission'
import { rolePermissionList, updateRolePermission } from '@/api/admin/role'

export default {
  name: 'permission',
  // import引入的组件需要注入到对象中才能使用
  data () {
    return {
      loading: false,
      ids: [],
      initialCheckedPermissionIds: [],
      menu: undefined,
      role: undefined,
      isIndeterminate: true,
      checkAll: false,
      permissionList: []
    }
  },
  // 方法集合
  methods: {
    handleQuery () {
      this.loading = true
      const menuId = this.menu.id
      permissionList({
        menuId
      }).then(({ data }) => {
        rolePermissionList(this.role.id, { menuId }).then((response) => {
          this.initialCheckedPermissionIds = response.data
          data.map((item) => {
            if (this.initialCheckedPermissionIds.includes(item.id)) {
              item.checked = true
            }
          })
          this.permissionList = data
          this.loading = false
        })
      })
    },
    menuClick (role, menu) {
      this.role = role
      this.menu = menu
      if (role && menu) {
        this.handleQuery()
      } else {
        this.permissionList = []
        this.initialCheckedPermissionIds = []
      }
    },
    checkedIdsSort (id1, id2) {
      return id1 - id2
    },
    handleSubmit () {
      const checkedPermissionIds = this.permissionList
        .filter((item) => item.checked)
        .map((item) => item.id)
        .sort(this.checkedIdsSort)
      // 判断选中权限是否有变动
      const checkLength = this.initialCheckedPermissionIds.length === checkedPermissionIds.length
      const checkEvery = this.initialCheckedPermissionIds.sort(this.checkedIdsSort).every((v, i) => v === checkedPermissionIds[i])
      if (checkLength && checkEvery) {
        this.$message.warning('数据未变动')
        return
      }
      // 有变动，执行更新
      updateRolePermission(
        this.role.id,
        this.menu.id,
        checkedPermissionIds
      ).then(response => {
        this.$message.success('提交成功')
        this.handleQuery()
      })
    },
    handleCheckAllChange (checked) {
      if (checked) {
        // 全选
        this.permissionList.map((item) => (item.checked = true))
      } else {
        // 全不选
        this.permissionList.map((item) => (item.checked = false))
      }
      this.isIndeterminate = false
    },
    handleCheckChange (item, val) {
      const checkedCount = this.permissionList.filter((item) => item.checked).length
      this.checkAll = checkedCount === this.permissionList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.permissionList.length
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
