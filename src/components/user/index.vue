<template>
  <div class="container">
    <div id="wrapper" >
      <login />
      <qr-code-list/>
    </div>
    <div class="bg"></div>
  </div>
</template>

<script>
import Login from '@/components/user/login'
import QrCodeList from '@/components/qr-code-list'

export default {
  name:'LoginIndex',
  title: 'TIMSDK DEMO',
  components: {
    Login,
    QrCodeList,
  },
}
</script>

<style lang="stylus">
body {
  overflow: hidden;
  margin: 0;
  font-family: 'Microsoft YaHei', '微软雅黑', 'MicrosoftJhengHei', 'Lantinghei SC', 'Open Sans', Arial, 'Hiragino Sans GB', 'STHeiti', 'WenQuanYi Micro Hei', SimSun, sans-serif;
  // font-family  "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif
  // text-shadow: $regular 0 0 0.05em
  background-color: $bg;
  -ms-scroll-chaining: chained;
  -ms-overflow-style: none;
  -ms-content-zooming: zoom;
  -ms-scroll-rails: none;
  -ms-content-zoom-limit-min: 100%;
  -ms-content-zoom-limit-max: 500%;
  -ms-scroll-snap-type: proximity;
  -ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);
  -ms-overflow-style: none;
  overflow: auto;

  div {
    box-sizing: border-box;

    &::before, &::after {
      box-sizing: border-box;
    }
  }
}

#wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-top: 60px;
}

.container
  position relative
  height 100vh
.container
  position relative
  height 100vh
// TODO filter mac chrome 会有问题，下次修改可以去掉
.bg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: -1;
  background: url('~@/./assets/image/bg.jpg') no-repeat 0 0;
  background-size: cover;
  // filter blur(67px)
}

.loading {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
}

.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-wrapper {
  margin-top: 8vh;
  width: $width;
  height: $height;
  max-width: 1280px;
  box-shadow: 0 11px 20px 0 rgba(0, 0, 0, 0.3);

  .official-link {
    display: flex;
    text-decoration: none;
    color: #38c9ff;
    width: fit-content;
    float: right;
    height: 45px;
    align-items: center;
  }
}

/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}

/* 滚动槽 */
::-webkit-scrollbar-track {
  border-radius: 10px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
}
/deep/ .el-popover {
  width 800px
  position fixed
  left 0
  right 0
  margin auto
}
</style>
