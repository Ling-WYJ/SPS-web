<template>
  <div></div>
</template>

<script>

export default {
  name: 'qr-code-list',
  mounted() {
  },
  methods: {

  }
}
</script>

<style scoped>
/* .qr-code-list-wrapper {
  width: 400px;
} */
.header {
  color: #fff;
  margin: 16px 0;
}
.link {
  color: #38c9ff;
  text-decoration: none;
}
.qr-code-wrapper {
  display: flex;
  justify-content: space-between;
}
.qr-code-item {
 margin-right: 20px;
}

.qr-code-item .text {
  font-size: 15px;
  text-align: center;
  color: #fff;
}
.qr-code-item img {
  width: 120px;
  height: 120px;
  border-radius: 5px;
}
</style>
