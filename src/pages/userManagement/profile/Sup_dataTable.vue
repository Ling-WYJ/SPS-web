<template>
  <view-page>
      <!-- 学习内容表单 -->
      <el-form :model="currentTodo" ref="todoEditForm" inline label-width="100px" :rules="rules">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="个人信息" name="first">
            <el-form-item label="姓名" prop="sup_name" >
              <el-input v-model="currentTodo.sup_name"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sup_gender" >
              <el-select v-model="currentTodo.sup_gender">
                <el-option label="男" value="Male"></el-option>
                <el-option label="女" value="Female"></el-option>
                <el-option label="其他" value="Other"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="年龄" prop="sup_age" >
              <el-input v-model="currentTodo.sup_age"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="sup_identity" >
              <el-input v-model="currentTodo.sup_identity"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="sup_phone" >
              <el-input v-model="currentTodo.sup_phone" ></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="sup_email" >
              <el-input v-model="currentTodo.sup_email"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="工作信息" name="second">
            <el-form-item label="用户名" prop="user_name" >
              <el-input v-model="currentTodo.user_name"></el-input>
            </el-form-item>
            <el-form-item label="工作单位" prop="sup_company" >
              <el-input v-model="currentTodo.sup_company"></el-input>
            </el-form-item>
            <el-form-item label="职称" prop="sup_title" >
              <el-input v-model="currentTodo.sup_title"></el-input>
            </el-form-item>
            <el-form-item label="督导资质" prop="sup_qualification" >
              <el-input v-model="currentTodo.sup_qualification"></el-input>
            </el-form-item>
            <el-form-item label="资质编号" prop="sup_quaNumber" >
              <el-input v-model="currentTodo.sup_quaNumber"></el-input>
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
      data: [],
      activeName:'first',
      filterType: '',
      currentTodo: {
        sup_name:'',
        sup_gender:'',
        sup_age:'',
        sup_identity:'',
        sup_phone:'',
        sup_email:'',
        user_name:'',
        sup_company:'',
        sup_title:'',
        sup_qualification:'',
        sup_quaNumber:'',
      },
      currentSups: [],
      searchStr: '',
      sup_id: [],
      user_id: sessionStorage.getItem("user_id"),
      user_name: JSON.parse(sessionStorage.getItem("GET_USER_INFO")).userID,
      rules: {
        sup_name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        sup_gender: [
          { required: true, message: '请选择性别',trigger: 'blur' }
        ],
        sup_age: [
          { required: true, message: '请输入年龄', trigger: 'blur' }
        ],
        sup_identity: [
          { required: true, message: '请输入身份证号', trigger: 'blur' }
        ],
        sup_phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { len:11, message: '手机号长度应为11位', trigger: 'blur' }
        ],
        sup_email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        user_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        sup_company: [
          { required: true, message: '请输入工作单位', trigger: 'blur' }
        ],
        sup_title: [
          { required: true, message: '请输入职称', trigger: 'blur' }
        ],
        sup_qualification: [
          { required: true, message: '请输入督导资质', trigger: 'blur' }
        ],
        sup_quaNumber: [
          { required: true, message: '请输入资质编号', trigger: 'blur' }
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
      this.$ajax.put('/editUsers/supervisor', this.currentTodo).then((res) => {
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
