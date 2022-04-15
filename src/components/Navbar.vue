<template>
 <div class="navbar">
   <span class="title">{{title}}</span>

    <div class="right-menu">
      

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img src="http://vue.ruoyi.vip/static/img/profile.473f5971.jpg" class="user-avatar">
          <!-- <i class="el-icon-user"></i> -->
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>


export default {
  components: {},
  computed: {
  
     title() {
      return this.$route.meta.title
    },
 
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$store.dispatch('logout')
          window.sessionStorage.clear()
          window.localStorage.clear()
          this.$router.push('/login')
        })
        .catch(() => {})
    },
  },
}
</script>

<style  scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
.hamburger-container {
  line-height: 46px;
  height: 100%;
  float: left;
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;
}
.hamburger-container:hover {
  background: rgba(0, 0, 0, 0.025);
}
.breadcrumb-container {
  float: left;
}

.topmenu-container {
  position: absolute;
  left: 50px;
}

.errLog-container {
  display: inline-block;
  vertical-align: top;
}
.right-menu-item {
  display: inline-block;
  padding: 0 8px;
  height: 100%;
  font-size: 18px;
  color: #5a5e66;
  vertical-align: text-bottom;
}
.right-menu-item .hover-effect {
  cursor: pointer;
  transition: background 0.3s;
}
.right-menu-item .hover-effect:hover {
  background: rgba(0, 0, 0, 0.025);
}
.el-icon-caret-bottom {
  cursor: pointer;
  position: absolute;
  right: -20px;
  top: 20px;
  font-size: 12px;
}
.user-avatar {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 10px;
}
.avatar-wrapper {
  margin-top: 5px;
  position: relative;
}
.avatar-container {
  margin-right: 30px;
}
.right-menu {
  float: right;
  height: 100%;
  line-height: 50px;
}
.right-menu:focus {
  outline: none;
}
.title{
    display: inline-block;
    line-height: 50px;
    color:#999;
    padding-left: 10px;
}
</style>
