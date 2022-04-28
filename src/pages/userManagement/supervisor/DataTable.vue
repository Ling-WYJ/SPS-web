<template>
  <view-page>
    <!-- 搜索框 -->
    <template slot="search-field">
      <el-input v-model="searchStr" suffix-icon="el-icon-search" placeholder="请输入搜索内容" ></el-input>
    </template>
    <!-- 右按钮区 -->
    <template slot="right-field">
      <el-button type="danger" icon="el-icon-circle-plus-outline" @click="addTodo">添加督导</el-button>
    </template>
    <!-- 表格区 -->
    <el-table :data="filtedData">
      <el-table-column label="id" prop="id">
        <template slot-scope="scope">
          {{scope.row.sup_id}}
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name">
        <template slot-scope="scope">
          {{scope.row.sup_name}}
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          {{scope.row.sup_gender}}
        </template>
      </el-table-column>
      <el-table-column label="总督导次数">
        <template slot-scope="scope">
          {{scope.row.total_num}}
        </template>
      </el-table-column>
      <el-table-column label="督导总时长">
        <template slot-scope="scope">
          {{scope.row.total_time}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="info" icon="el-icon-delete" style="padding: 7px" plain @click="removeSupAjax(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <edit-dialog :show="editShow" title="添加督导" @close="closeEditDialog" @save="saveTodo">
      <!-- 学习内容表单 -->
      <el-form :model="currentTodo" ref="todoEditForm" inline label-width="100px" :rules="rules">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="个人信息" name="first">
            <el-form-item label="姓名" prop="sup_name" >
          <el-input v-model="currentTodo.sup_name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sup_gender" placeholder="请选择性别" >
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
        <el-form-item label="密码" prop="user_password" >
          <el-input v-model="currentTodo.user_password"></el-input>
        </el-form-item>
        <el-form-item label="工作单位" prop="sup_company" >
          <el-input v-model="currentTodo.sup_company"></el-input>
        </el-form-item>
        <el-form-item label="职称" prop="sup_title">
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
    </edit-dialog>
  </view-page>
</template>

<script>
import ViewPage from './ViewPage'
import EditDialog from './EditDialog'

export default{
  components: {
    ViewPage,
    EditDialog,
  },
  data() {
    return{
      activeName:'first',
      data: [],
      filterType: '',
      editShow: false,
      currentTodo: {},
      currentSups: [],
      searchStr: '',
      sup_id: [],
      user_id:sessionStorage.getItem('user_id'),
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
        user_password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' }
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
      this.$ajax.get('/admin/supervisorList', {params: {user_id: this.user_id}}).then((res) => {
        console.log(res.data)
        if (res.data) {
          this.data = res.data
          for(var i = 0;i <this.data.length ; i++) {

            //处理时分秒转换
            var hour = parseInt(this.data[i].total_time / 3600) < 10 ? '0' + parseInt(this.data[i].total_time / 3600) : parseInt(this.data[i].total_time / 3600)
            var min = parseInt(this.data[i].total_time % 3600 / 60) < 10 ? '0' + parseInt(this.data[i].total_time % 3600 / 60) : parseInt(this.data[i].total_time % 3600 / 60)
            var sec = parseInt(this.data[i].total_time % 3600 % 60) < 10 ? '0' + parseInt(this.data[i].total_time % 3600 % 60) : parseInt(this.data[i].total_time % 3600 % 60)
            this.data[i].total_time = hour + ':' + min + ':' + sec

            if(this.data[i].sup_gender == 'Male')
            {
              this.data[i].sup_gender = '男'
            }
            else if(this.data[i].sup_gender == 'Female')
                this.data[i].sup_gender = '女'
            else
              this.data[i].sup_gender = '其他'
          }
        }
      }).catch(err => this.$notify({
        type: 'error',
        message: err
      }))
    },
    addTodo() {
      this.editShow = true
    },
    saveTodo() {
      this.addAjax()
      //this.closeEditDialog()
    },
    closeEditDialog() {
      this.editShow = false
      this.activeName='first'
    },
    addAjax () {
      this.currentTodo['role'] = 'supervisor'
      this.$ajax.post('/users/supervisor', this.currentTodo).then((res) => {
        console.log(res)

        if (res.data) this.data.push(res.data)
         this.$store.commit('showMessage', {
          type: 'success',
          message: '添加成功！'
        })
        this.closeEditDialog()

        this.update()
      }).catch((err) => {
        var errmsg = []
        if (err.response) {
          if(err.response.data.msg)
            errmsg.push( err.response.data.msg)
          else
          for(var i = 0; i < err.response.data.errors.length; i++) {
            errmsg.push( err.response.data.errors[i].msg)
          }
          // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          //console.log(err.response.data.errors)
          //console.log(errmsg)
          this.$store.commit('showMessage', {
            message: '添加失败：' + errmsg,
            type: 'error'
          })
        }
        else
          this.$store.commit('showMessage', {
            message: '添加失败：' + err.message,
            type: 'error'
          })
      })
    },

    addSup() {
      this.currentSups.push(this.currentSup)
      this.currentSup = ''
      // this.currentBind = this.currentBind.push(this.currentSups)
    },
    removeSup(tag) {
      this.currentSups.splice(this.currentSups.indexOf(tag), 1)
    },
    removeSupAjax(row) {
      this.$confirm('确定要删除?').then(() => {
        //获取不到user_id
        var deleteSup ={ user_id: row.sup_id,role: 'admin' }
        console.log(deleteSup)
        this.$ajax.delete('/editUsers/supervisor',{data:deleteSup}).then((res) => {
          if (res.data) {
            this.$store.commit('showMessage', {
              type: 'success',
              message: '删除成功'
            })
          }
          this.update()
        })
      }).catch((err) => {
        this.$store.commit('showMessage', {
          message: '删除失败：' + err.message,
          type: 'error'
        })
      })
    },
  },
  computed: {
    filtedData() {
      return this.data.filter((item) => {
        var reg = new RegExp(this.searchStr, 'i')
        return !this.searchStr || reg.test(item.sup_name) || reg.test(item.sup_gender)
      })
    }
  }

}
</script>
