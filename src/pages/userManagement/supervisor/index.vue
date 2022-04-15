<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header class="head" height="100px">
      <h2>社会心理服务平台</h2>
      <h4>督导列表</h4>
    </el-header>
    <!-- 主区域 -->
    <el-main>
      <data-table></data-table>
    </el-main>
  </el-container>
</template>

<script >
import DataTable from './DataTable'
export default {
    name: 'counsellor',
    data() {
        return {}
    },
    components: {
      DataTable
    },
    created() {
        console.warn('counsellor')
    },
    methods: {}
}
</script>

<style >
.head{
  color: #222;
}
</style>
