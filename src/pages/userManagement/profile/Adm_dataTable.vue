<template>
  <view-page>
    <!-- 学习内容表单 -->
    <el-form :model="currentTodo" ref="todoEditForm" inline label-width="100px" :rules="rules">
          <el-form-item label="姓名" prop="admin_name" >
            <el-input v-model="currentTodo.admin_name"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="admin_gender" >
            <el-select v-model="currentTodo.admin_gender">
              <el-option label="男" value="Male"></el-option>
              <el-option label="女" value="Female"></el-option>
              <el-option label="其他" value="Other"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号" prop="admin_phone" >
            <el-input v-model="currentTodo.admin_phone"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="user_name" >
            <el-input v-model="currentTodo.user_name"></el-input>
          </el-form-item>
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
      data: [],
      filterType: '',
      currentTodo: {
        admin_name:'',
        user_name:'',
        admin_gender:'',
        admin_phone:'',
      },
      currentSups: [],
      searchStr: '',
      user_id: sessionStorage.getItem("user_id"),
      user_name: JSON.parse(sessionStorage.getItem("GET_USER_INFO")).userID,
      rules: {
        admin_name: [
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        admin_gender: [
          {required: true, message: '请选择性别', trigger: 'blur'}
        ],
        admin_phone: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {len: 11, message: '手机号长度应为11位', trigger: 'blur'}
        ],
        user_name: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
      }
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
          this.currentTodo = res.data
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
      this.$ajax.put('/editUsers/admin', this.currentTodo).then((res) => {
        console.log(res)
        if (res.data)
          this.$store.commit('showMessage', {
            type: 'success',
            message: '修改成功！'
          })
        this.update()
      }).catch((err) => {
        console.log(err.response.data.msg)
        var errmsg = []
        if (err.response) {
          if(err.response.data.msg)
            errmsg.push( err.response.data.msg)
          else
            for(var i = 0; i < err.response.data.errors.length; i++) {
              errmsg.push( err.response.data.errors[i].msg)
            }
          this.$store.commit('showMessage', {
            message: '修改失败：' + errmsg,
            type: 'error'
          })
        }
        else
          this.$store.commit('showMessage', {
            message: '修改失败：' + err.message,
            type: 'error'
          })
      })
    },


  },
}
</script>
