<template>
  <el-container>

      <el-row>
        <el-col :span="8">
          <slot name="right-field"></slot>
        </el-col>
      </el-row>

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
