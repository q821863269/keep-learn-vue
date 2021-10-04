<template>
  <!-- 必须有一层父元素 -->
  <div class="app-container-right">
    <el-card class="box-card">
      <div slot="header">
        <b>菜单分配</b>
      </div>

      <el-row>
        <el-col :span="18">
          <el-tag v-if="role && role.name" type="primary">{{
            role.name
          }}</el-tag>
          <el-tag v-else type="info"
            ><i class="el-icon-info"></i> 请选择角色</el-tag
          >
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

      <el-row class="mt10">
        <el-tree
          ref="menu"
          v-loading="loading"
          :default-expanded-keys="expandedKeys"
          :data="menuOptions"
          show-checkbox
          node-key="id"
          empty-text="加载中，请稍后"
          :check-strictly="checkStrictly"
          highlight-current
          @node-click="handleMenuNodeClick"
        />
      </el-row>
    </el-card>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { select as menuTree } from '@/api/admin/menu'
import { roleMenuList, updateRoleMenu } from '@/api/admin/role'

export default {
  name: 'menus',
  // import引入的组件需要注入到对象中才能使用
  data () {
    return {
      loading: false,
      menuOptions: [],
      expandedKeys: [],
      role: {},
      initialCheckedMenuIds: [],
      checkStrictly: false
    }
  },
  // 方法集合
  methods: {
    loadData () {
      this.loading = true
      menuTree().then(response => {
        this.menuOptions = response.data
        this.expandedKeys = this.menuOptions.map(node => node.id)
        this.loading = false
      })
    },
    handleMenuNodeClick (data) {
      this.$emit('menuClick', data)
    },
    checkedIdsSort (id1, id2) {
      return id1 - id2
    },
    handleSubmit () {
      const checkedMenuIds = this.$refs.menu.getCheckedNodes(false, true).map(node => node.id).sort(this.checkedIdsSort)
      // 判断选中菜单是否变动
      const checkLength = this.initialCheckedMenuIds.length === checkedMenuIds.length
      const checkEvery = this.initialCheckedMenuIds.sort(this.checkedIdsSort).every((v, i) => v === checkedMenuIds[i])
      if (checkLength && checkEvery) {
        this.$message.warning('数据未变动')
        return
      }
      // 有变动，执行更新
      updateRoleMenu(this.role.id, checkedMenuIds).then(() => {
        this.$message.success('提交成功')
        this.roleClick(this.role)
      })
    },
    roleClick (role) {
      this.role = role
      this.$refs.menu.setCurrentKey(null) // 取消菜单高亮
      if (role === undefined) {
        this.$refs.menu.setCheckedKeys([])
      } else {
        this.loading = true
        this.checkStrictly = true
        roleMenuList(role.id).then(response => {
          this.initialCheckedMenuIds = response.data
          this.$refs.menu.setCheckedKeys(this.initialCheckedMenuIds)
          this.checkStrictly = false
          this.loading = false
        })
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
