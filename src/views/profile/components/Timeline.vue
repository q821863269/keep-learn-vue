<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.timestamp" placement="top">
        <el-card>
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  data () {
    return {
      timeline: [
        {
          timestamp: '2021-05-01',
          title: '5月标题',
          content: '我是内容。。。'
        },
        {
          timestamp: '2021-04-01',
          title: '4月标题',
          content: '我是内容。。。'
        },
        {
          timestamp: '2021-03-01',
          title: '3月标题',
          content: '我是内容。。。'
        },
        {
          timestamp: '2021-02-01',
          title: '2月标题',
          content: '我是内容。。。'
        },
        {
          timestamp: '2021-01-01',
          title: '1月标题',
          content: '我是内容。。。'
        }
      ]
    }
  }
}
</script>
