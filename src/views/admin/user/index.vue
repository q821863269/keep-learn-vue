<template>
  <!-- 必须有一层父元素 -->
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 部门数据 -->
      <el-col :span="4" :xs="24">
        <div style="margin-bottom: 10px">
          <el-card class="box-card" shadow="always">
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
            />
          </el-card>
        </div>
      </el-col>
      <!-- 用户数据 -->
      <el-col :span="20" :xs="24">
        <div style="margin-bottom: 10px">
          <el-card class="box-card" shadow="always">
            <h1>用户列表</h1>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';

export default {
  name: 'User',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    // 这里存放数据
    return {
      // 部门名称
      deptName: undefined,
      // 部门树选项
      deptOptions: undefined
    }
  },
  // 方法集合
  methods: {
    // 加载数据
    loadData () {},
    // 处理查询
    handleQuery () {},
    // 筛选节点
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 部门节点单击事件
    handleNodeClick (data) {
      this.queryParams.deptId = data.id
      this.handleQuery()
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
.box-card {
  min-height: calc(100vh - 134px);
}
</style>
