<template>
  <el-container>
    <el-header>
      <el-row>
        <!-- 左按钮区 -->
        <el-col :span="16">
          <slot name="search-field"></slot>
        </el-col>
        <!-- 搜索框 -->
        <el-col :span="8">
          <slot name="right-field"></slot>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <!-- 表格区 -->
      <slot></slot>
    </el-main>
  </el-container>
</template>

<script>
export default{}
</script>

<style></style>
