<template>
  <view-page>
    <!-- 搜索框 -->
    <template slot="search-field">
      <el-input v-model="searchStr" suffix-icon="el-icon-search" placeholder="请输入搜索内容" ></el-input>
    </template>
    <!-- 右按钮区 -->
    <template slot="right-field">
      <el-button type="danger" icon="el-icon-circle-plus-outline" @click="addTodo">添加咨询师</el-button>
    </template>
    <!-- 表格区 -->
    <el-table :data="filtedData">
      <el-table-column label="id" prop="id">
        <template slot-scope="scope">
          {{scope.row.coun_id}}
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name">
        <template slot-scope="scope">
          {{scope.row.coun_name}}
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          {{scope.row.coun_gender}}
        </template>
      </el-table-column>
      <el-table-column label="评分">
        <template slot-scope="scope">
          <el-rate
              v-model="scope.row.score"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
          >
          </el-rate>
        </template>
      </el-table-column>
      <el-table-column label="咨询总时长">
        <template slot-scope="scope">
          {{scope.row.total_time}}
        </template>
      </el-table-column>
      <el-table-column label="总咨询次数">
        <template slot-scope="scope">
          {{scope.row.total_num}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="info" style="padding: 7px" icon="el-icon-s-custom"  @click="addBind(scope.row)" plain></el-button>
          <el-button size="mini" type="info" style="padding: 7px"  icon="el-icon-delete" plain @click="removeCounAjax(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <edit-dialog :show="editShow" title="添加咨询师" @close="closeEditDialog" @save="saveTodo" width="800px" >
      <!-- 学习内容表单 -->
      <el-form :model="currentTodo" ref="todoEditForm" inline label-width="100px" :rules="rules">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="个人信息" name="first">
            <el-form-item label="姓名" prop="coun_name" >
          <el-input v-model="currentTodo.coun_name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="coun_gender" placeholder="请选择性别" >
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
          <el-input v-model="currentTodo.coun_email" ></el-input>
        </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="工作信息" name="second">
                    <el-form-item label="用户名" prop="user_name" >
          <el-input v-model="currentTodo.user_name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="user_password" >
          <el-input v-model="currentTodo.user_password" show-password class="pwd-input"></el-input>
        </el-form-item>
        <el-form-item label="工作单位" prop="coun_company" >
          <el-input v-model="currentTodo.coun_company"></el-input>
        </el-form-item>
        <el-form-item label="职称" prop="coun_title" >
          <el-input v-model="currentTodo.coun_title"></el-input>
        </el-form-item>
          </el-tab-pane>
        </el-tabs>

      </el-form>
    </edit-dialog>
    <bind-dialog :show="bindShow" title="绑定督导" @close="closeBindDialog" @save="saveBind">
      <el-form :model="currentBind" ref="todoBindForm">
        <el-form-item label="咨询师id" prop="coun_id" required>
          <el-input v-model="currentBind.coun_id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="督导" prop="sup_id">
          <el-tag v-for="sup_id in currentSups" :key="sup_id" closable @close="removeSup(sup_id)">{{sup_id}}</el-tag>
          <span @keyup.enter="addSup"><el-input v-model="currentSup"></el-input></span>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="addSup">添加督导</el-button>
        </el-form-item>
      </el-form>
    </bind-dialog>
  </view-page>
</template>

<script>
import ViewPage from './ViewPage'
import EditDialog from './EditDialog'
import BindDialog from './BindDialog'
export default{
  components: {
    ViewPage,
    EditDialog,
    BindDialog
  },
  data() {
    return{
      activeName:'first',
      data: [],
      filterType: '',
      filterDates: null,
      searchStr: '',
      editShow: false,
      bindShow: false,
      currentTodo: {},
      currentBind: {},
      currentSups: [],
      sup_id: [],
      currentSup: '',
      currentSupPair:[],
      user_id:sessionStorage.getItem('user_id'),
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
        user_password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' }
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
      this.$ajax.get('/admin/counsellorList', {params: {user_id: this.user_id}}).then((res) => {
        console.log(res)
        if (res.data) {
          this.data = res.data
          for(var i = 0;i <this.data.length ; i++) {

            //处理时分秒转换
            var hour = parseInt(this.data[i].total_time / 3600) < 10 ? '0' + parseInt(this.data[i].total_time / 3600) : parseInt(this.data[i].total_time / 3600)
            var min = parseInt(this.data[i].total_time % 3600 / 60) < 10 ? '0' + parseInt(this.data[i].total_time % 3600 / 60) : parseInt(this.data[i].total_time % 3600 / 60)
            var sec = parseInt(this.data[i].total_time % 3600 % 60) < 10 ? '0' + parseInt(this.data[i].total_time % 3600 % 60) : parseInt(this.data[i].total_time % 3600 % 60)
            this.data[i].total_time = hour + ':' + min + ':' + sec
            //性别转换
            if(this.data[i].coun_gender == 'Male')
            {
              this.data[i].coun_gender = '男'
            }
            else if (this.data[i].coun_gender == 'Female')
                this.data[i].coun_gender = '女'
            else
              this.data[i].coun_gender = '其他'
            //评分转换
            let result = 0;
            let score = Math.floor(this.data[i].score * 2) / 2;
            let hasDecimal = score % 1 !== 0;
            let integer = Math.floor(score);
            for (let i = 0; i < integer; i++) {
              result++;
            }
            if (hasDecimal) {
              result = result + 0.5;
            }
            this.data[i].score = result
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
      this.currentTodo['role'] = 'counsellor'
      this.$ajax.post('/users/counsellor', this.currentTodo).then((res) => {
        console.log(res)
        if (res.data) this.data.push(res.data)
        this.closeEditDialog()
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
    addBind(row) {
      var id ={ coun_id: `${row.coun_id}` }
      this.currentBind = JSON.parse(JSON.stringify(id))
      //有点问题
      this.$ajax.get('/counsellor/bindSupervisorList', {params: {user_id: `${row.coun_id}`}}).then((res) => {
        console.log(res)
        if (res.data) {
          //sups
             for(var i = 0; i < res.data.length; i++) {
               console.log(res.data[i].sup_id)
               this.currentSup = res.data[i].sup_id
               this.currentSups.push(this.currentSup)
             }
        }
      }).catch(err => this.$notify({
        type: 'error',
        message: err
      }))
      //this.currentSups = []
      this.bindShow = true
    },
    saveBind() {
      this.$refs.todoBindForm.validate((valid) => {
        if (valid) {
          const bindObject = JSON.parse(JSON.stringify(this.currentBind))
          bindObject.sup_id = this.currentSups
          this.currentBind = bindObject
          // console.log("~~~~~", this.currentBind)
          this.addBindAjax()
        }
      })
    },
    addBindAjax() {
      //curentBind = {coun_id:id,sup:id_array}
      this.$ajax.put('/counsellor/bind', this.currentBind).then((res) => {
        if (res.data) this.data.push(res.data)
        this.$store.commit('showMessage', {
          type: 'success',
          message: '绑定成功！'
        })
        this.closeBindDialog()
      }).catch((err) => {
        this.$store.commit('showMessage', {
          message: '绑定失败：' + err.message,
          type: 'error'
        })
      })
    },
    closeBindDialog() {
      this.currentBind = {}
      this.currentSups = []
      this.currentSup = ''
      this.$refs.todoBindForm.resetFields()
      this.bindShow = false
      this.update()
    },
    addSup() {
      this.currentSups.push(this.currentSup)
      this.currentSup = ''
      // this.currentBind = this.currentBind.push(this.currentSups)
    },
    removeSup(tag) {
      this.currentSups.splice(this.currentSups.indexOf(tag), 1)
    },
    removeCounAjax(row) {
      this.$confirm('确定要删除?').then(() => {
        //获取不到user_id
        var deleteCoun ={ user_id: row.coun_id,role: 'admin' }
        console.log(deleteCoun)
        this.$ajax.delete('/editUsers/counsellor',{data:deleteCoun}).then((res) => {
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
        return !this.searchStr || reg.test(item.coun_name) || reg.test(item.coun_gender) || reg.test(item.score)
      })
    }
  }

}
</script>

<style>
.pwd-input .el-input--suffix .el-input__inner {
  padding-right: 15px!important;
}
</style>
