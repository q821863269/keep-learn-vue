<template>
  <!-- 必须有一层父元素 -->
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="10" :lg="12">
        <role ref="role" @roleClick="roleClick" />
      </el-col>
      <el-col :xs="24" :sm="24" :md="7" :lg="6">
        <menus ref="menu" @menuClick="menuClick" />
      </el-col>
      <el-col :xs="24" :sm="24" :md="7" :lg="6">
        <permission ref="permission" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import Role from './components/Role'
import Menus from './components/Menu'
import Permission from './components/Permission'

export default {
  name: 'RoleIndex',
  // import引入的组件需要注入到对象中才能使用
  components: { Role, Menus, Permission },
  data () {
    return {
      role: undefined,
      menu: undefined
    }
  },
  // 方法集合
  methods: {
    roleClick (role) {
      this.role = role
      this.menu = undefined
      this.$refs.menu.roleClick(role)
      this.$refs.permission.menuClick(this.role, this.menu)
    },
    menuClick (menu) {
      if (!this.role) {
        this.$message.warning('请选择角色')
        return
      }
      this.menu = menu
      this.$refs.permission.menuClick(this.role, this.menu)
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
