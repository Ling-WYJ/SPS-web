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
          <el-button size="mini" type="info" style="padding: 7px" icon="el-icon-date" plain></el-button>
          <el-button size="mini" type="info" style="padding: 7px" icon="el-icon-delete" plain @click="removeSupAjax(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <edit-dialog :show="editShow" title="添加督导" @close="closeEditDialog" @save="saveTodo">
      <!-- 学习内容表单 -->
      <el-form :model="currentTodo" ref="todoEditForm">
        <el-form-item label="姓名" prop="sup_name" required>
          <el-input v-model="currentTodo.sup_name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sup_gender" required>
          <el-input v-model="currentTodo.sup_gender"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="sup_age" required>
          <el-input v-model="currentTodo.sup_age"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="sup_identity" required>
          <el-input v-model="currentTodo.sup_identity"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="sup_phone" required>
          <el-input v-model="currentTodo.sup_phone" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="sup_email" required>
          <el-input v-model="currentTodo.sup_email" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="user_name" required>
          <el-input v-model="currentTodo.user_name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="user_password" required>
          <el-input v-model="currentTodo.user_password"></el-input>
        </el-form-item>
        <el-form-item label="工作单位" prop="sup_company" required>
          <el-input v-model="currentTodo.sup_company"></el-input>
        </el-form-item>
        <el-form-item label="职称" prop="sup_title" required>
          <el-input v-model="currentTodo.sup_title"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role" required>
          <el-input v-model="currentTodo.role"></el-input>
        </el-form-item>
        <el-form-item label="督导资质" prop="sup_qualification" required>
          <el-input v-model="currentTodo.sup_qualification"></el-input>
        </el-form-item>
        <el-form-item label="资质编号" prop="sup_quaNumber" required>
          <el-input v-model="currentTodo.sup_quaNumber"></el-input>
        </el-form-item>
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
      data: [],
      filterType: '',
      editShow: false,
      currentTodo: {},
      currentSups: [],
      searchStr: '',
      sup_id: [],
    }
  },
  mounted () {
    this.update()
  },
  methods: {
    update() {
      this.$ajax.get('/admin/supervisorList', {params: {user_id: '7'}}).then((res) => {
        console.log(res)
        if (res.data) {
          this.data = res.data
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
    },
    addAjax () {
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
          for(var i = 0; i < err.response.data.errors.length; i++) {
            errmsg.push( err.response.data.errors[i].msg)
          }
          // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          console.log(err.response.data.errors)
          console.log(errmsg)
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
        var deleteSup ={ user_id: row.Sup_id,role: 'admin' }
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
