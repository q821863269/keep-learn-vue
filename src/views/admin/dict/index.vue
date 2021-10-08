<template>
  <!-- 必须有一层父元素 -->
  <div class="app-container">
    <el-row :gutter="10">
      <!-- 左侧字典列表 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <dict @dictClick="dictClick" @resetItem="resetItem" ref="dict"/>
      </el-col>
      <!-- 右侧数据项 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <dictItem ref="dictItem"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import Dict from './components/Dict'
import DictItem from './components/DictItem'

export default {
  name: 'DictIndex',
  // import引入的组件需要注入到对象中才能使用
  components: { Dict, DictItem },
  data () {
    return {}
  },
  // 方法集合
  methods: {
    dictClick (row) {
      this.$refs.dictItem.dictClick(row)
    },
    resetItem () {
      this.$refs.dictItem.dictClick()
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
