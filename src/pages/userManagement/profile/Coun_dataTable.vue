<template>
  <view-page>
    <!-- 学习内容表单 -->
    <el-form :model="currentTodo" ref="todoEditForm" inline label-width="100px" :rules="rules">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="个人信息" name="first">
          <el-form-item label="姓名" prop="coun_name" >
            <el-input v-model="currentTodo.coun_name"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="coun_gender" >
            <el-select v-model="currentTodo.coun_gender">
              <el-option label="男" value="Male"></el-option>
              <el-option label="女" value="Female"></el-option>
              <el-option label="其他" value="Other"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄" prop="coun_age" >
            <el-input v-model="currentTodo.coun_age"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="coun_identity" >
            <el-input v-model="currentTodo.coun_identity"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="coun_phone" >
            <el-input v-model="currentTodo.coun_phone" ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="coun_email" >
            <el-input v-model="currentTodo.coun_email"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="工作信息" name="second">
          <el-form-item label="用户名" prop="user_name" >
            <el-input v-model="currentTodo.user_name"></el-input>
          </el-form-item>
          <el-form-item label="工作单位" prop="coun_company" >
            <el-input v-model="currentTodo.coun_company"></el-input>
          </el-form-item>
          <el-form-item label="职称" prop="coun_title">
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
      rules: {
        coun_name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        coun_gender: [
          { required: true, message: '请选择性别',trigger: 'blur' }
        ],
        coun_age: [
          { required: true, message: '请输入年龄', trigger: 'blur' }
        ],
        coun_identity: [
          { required: true, message: '请输入身份证号', trigger: 'blur' }
        ],
        coun_phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { len:11, message: '手机号长度应为11位', trigger: 'blur' }
        ],
        coun_email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        user_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        coun_company: [
          { required: true, message: '请输入工作单位', trigger: 'blur' }
        ],
        coun_title: [
          { required: true, message: '请输入职称', trigger: 'blur' }
        ]

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
        console.log(err.response.data.msg)
        var errmsg = []
        if (err.response) {
          if(err.response.data.msg)
            errmsg.push( err.response.data.msg)
          else
            for(var i = 0; i < err.response.data.errors.length; i++) {
              errmsg.push( err.response.data.errors[i].msg)
            }
          // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          //console.log(err.response)
          //console.log(err.response.data.errors)
          //console.log(errmsg)
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
