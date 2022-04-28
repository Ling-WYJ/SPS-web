<template>
  <view-page>
    <!-- 学习内容表单 -->
    <el-form :model="currentTodo" ref="todoEditForm" inline label-width="100px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="个人信息" name="first">
          <el-form-item label="姓名" prop="coun_name" required>
            <el-input v-model="currentTodo.coun_name"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="coun_gender" required>
            <el-input v-model="currentTodo.coun_gender"></el-input>
          </el-form-item>
          <el-form-item label="年龄" prop="coun_age" required>
            <el-input v-model="currentTodo.coun_age"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="coun_identity" required>
            <el-input v-model="currentTodo.coun_identity"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="coun_phone" required>
            <el-input v-model="currentTodo.coun_phone" ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="coun_email" required>
            <el-input v-model="currentTodo.coun_email"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="工作信息" name="second">
          <el-form-item label="用户名" prop="user_name" required>
            <el-input v-model="currentTodo.user_name"></el-input>
          </el-form-item>
          <!--            <el-form-item label="密码" prop="user_password" required>
                        <el-input v-model="currentTodo.user_password"></el-input>
                      </el-form-item>-->
          <el-form-item label="工作单位" prop="coun_company" required>
            <el-input v-model="currentTodo.coun_company"></el-input>
          </el-form-item>
          <el-form-item label="职称" prop="coun_title" required>
            <el-input v-model="currentTodo.coun_title"></el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <el-button type="success" icon="el-icon-check" @click="saveTodo">保存</el-button>
  </view-page>
</template>

<script>
import ViewPage from './ViewPage'

export default{
  components: {
    ViewPage,
  },
  data() {
    return{
      activeName:'first',
      data: [],
      filterType: '',
      currentTodo: {
        coun_name:'',
        coun_gender:'',
        coun_age:'',
        coun_identity:'',
        coun_phone:'',
        coun_email:'',
        user_name:'',
        coun_company:'',
        coun_title:'',
      },
      currentSups: [],
      searchStr: '',
      sup_id: [],
      user_id: sessionStorage.getItem("user_id"),
      user_name: JSON.parse(sessionStorage.getItem("GET_USER_INFO")).userID,
    }
  },
  mounted () {
    this.update()
  },
  methods: {
    update() {
      this.$ajax.get('/auth/getInfo', {params: {user_name: this.user_name}}).then((res) => {
        console.log(res)
        if (res.data) {
          this.data = res.data
          this.currentTodo = res.data
          console.log(this.currentTodo.sup_name)
        }
      }).catch(err => this.$notify({
        type: 'error',
        message: err
      }))
    },
    saveTodo() {
      this.addAjax()
    },
    addAjax () {
      this.$ajax.put('/editUsers/counsellor', this.currentTodo).then((res) => {
        console.log(res)
        if (res.data)
          this.$store.commit('showMessage', {
            type: 'success',
            message: '修改成功！'
          })
        this.update()
      }).catch((err) => {
        this.$store.commit('showMessage', {
          message: '修改失败：' + err.message,
          type: 'error'
        })
      })
    },


  },
}
</script>
