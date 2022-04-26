<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header className="head" height="100px">
      <h2>社会心理服务平台</h2>
      <h4>咨询记录</h4>
    </el-header>
    <!-- 主区域 -->
    <el-main>
      <data-table></data-table>
      <data-table2></data-table2>
      <data-table3></data-table3>
    </el-main>
  </el-container>
</template>

<script>
import DataTable from './Adm_dataTable'
import DataTable2 from './Con_dataTable'
import DataTable3 from './Sup_dataTable'
export default {
  name: 'record',
  data() {
    return {}
  },
  components: {
    DataTable,
    DataTable2,
    DataTable3
  },
  created() {
    console.warn('record')
  },
  methods: {}
}
</script>

<style>
.head {
  color: #222;
}
</style>
