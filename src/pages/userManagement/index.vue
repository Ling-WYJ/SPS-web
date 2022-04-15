<template>
    <div class="user">
        <div class="left">
          <div class="sidebar-logo-container">
          社会心理服务平台
          </div>
          <div :class="{cur:item.path==url}" v-for="(item, index) in list" :key="index" @click="handleClick(item)" class="sidebar-style">{{item.meta.title}}</div>
       
        </div>
        <div class="right">
          <div class="nav-bar"> 
            <Navbar />
            </div>
         
          <div class="app-mian">
            <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script >
import { mapState } from 'vuex'
import Navbar from '@/components/Navbar.vue'
export default {
    name: 'userManagement',
    data() {
        return {
          isTitle:''
        }
    },
    components: {Navbar},
    computed: {
        ...mapState({
        userRole: state => state.user.role,
      }),
       url() {
      return this.$route.path
    },
        list() {
            let role = ''
            if(this.userRole) {
                role = this.userRole
            }else{
                role = JSON.parse(sessionStorage.getItem('GET_USER_INFO')).role
            }
           return this.$router.options.routes[1].children.filter( e => e.role.includes(role) || e.role == 'all')
        }
    },
    created() {
  console.log(this.url,'ppppp')
    },
    methods: {
        handleClick(data) {
         
            this.$router.push(data.path)
        },
      logout() {
          this.$store.dispatch('logout')
          window.sessionStorage.clear()
          window.localStorage.clear()
          this.$router.push('/login')
      }
    }
}
</script>

<style   scoped>
.user{
  display: flex;
}
.left {
  -webkit-transition: width .28s;
    transition: width .28s;
    width: 200px!important;
    background-color: #304156;
    height: 100%;
    position: fixed;
  
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
    -webkit-box-shadow: 2px 0 6px rgb(0 21 41 / 35%);
    box-shadow: 2px 0 6px rgb(0 21 41 / 35%);
    line-height: 50px;
   color:#fff;
}
 .sidebar-style{
     color:rgb(191, 203, 217);
     text-align: center;
       z-index: 1002;
       font-size:14px;
       cursor: pointer;
    }
.right {
  display: inline-block;
 width: 100%;
 
  margin-left: 200px;
}
.app-mian{
  padding: 20px;
}
.nav-bar{

}
.sidebar-logo-container{
  position: relative;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #2b2f3a;
    text-align: center;
    overflow: hidden;
}
.cur{
  color: rgb(64, 158, 255);}
</style>
