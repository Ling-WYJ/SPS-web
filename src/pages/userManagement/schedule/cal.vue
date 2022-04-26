<template>
    <div class="calendar_box">
        <el-row :gutter="20">
            <el-col :span="18">
                <full-calendar ref="fullCalendar" style="height: 100%" :options="calendarOptions"></full-calendar>
            </el-col>
            <el-col :span="6" class="detail_box">
                <div class="addbtn">
                    <el-button type="primary" @click="addPaiban" size="small">添加排班</el-button>
                </div>
                <el-alert title="排班信息" type="success" :closable="false"> </el-alert>
                <el-form :model="form" label-width="100px">
                    <el-form-item label="排班标题：" >
                        {{form.title}}
                    </el-form-item>
                    <el-form-item label="科室：" >
                        {{form.ksName}}
                    </el-form-item>
                    <el-form-item label="咨询师/督导：" >
                        {{form.doctorName}}
                    </el-form-item>
                    <el-form-item label="联系电话：" >
                        {{form.phone}}
                    </el-form-item>
                    <el-form-item label="值班时间：" >
                        {{form.ctime}}
                    </el-form-item>
                    <div class="addbtn" style="text-align: right;margin-right: 20px;">
                        <el-button type="primary" @click="editPaiban" size="small" v-show="isShowBtn">修改</el-button>
                        <el-button type="danger" @click="delData" size="small" v-show="isShowBtn">删除</el-button>
                    </div>
                </el-form>
            </el-col>
        </el-row>  
        
        <!-- 添加或修改 -->
        <el-dialog title="进行排班" :visible.sync="dialogFormVisible">
            <el-form :model="form" label-width="80px">
                <el-form-item label="排班情况" >
                    <el-input v-model="form.title"  placeholder="请输入排班情况" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="咨询师/督导" >
                     <el-select v-model="form.doctorId" placeholder="请选择咨询师/督导">
                        <el-option
                            v-for="item in doctorList"
                            :key="item.doctorId"
                            :label="item.doctorName"
                            :value="item.doctorId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排班时间" >
                    <el-date-picker
                        v-model="form.ctime"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        type="date"
                        placeholder="选择排班日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button  @click="dialogFormVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="save" size="small">保 存</el-button>
            </div>
        </el-dialog>

   </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import axios from 'axios'
 export default {
    name:'FindPaiban',
    components:{FullCalendar},
    data() {
        return {
            isShowBtn: false,
            dialogFormVisible:false,
            form:{
                id:'',
                title:'',
                doctorId:'',
                ctime:'',
                doctorName:'',
                phone:'',
                ksName:''
            },
            formLabelWidth:120,
            calendarOptions: {
                    //   timeGridPlugin  可显示每日时间段
                    height: 700,
                    plugins: [dayGridPlugin, interactionPlugin],
                    headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek,dayGrid',
                    // right: 'agendaWeek,dayGridWeek,dayGrid'
                },
                buttonText: {
                    // 设置按钮
                    today: '今天',
                    month: '月',
                    week: '周',
                    dayGrid: '天',
                },
                // allDaySlot: false,
                editable: true,
                selectable: true,
                navLinks: true,
                // displayEventEnd: true,//所有视图显示结束时间
                initialView: 'dayGridMonth', // 设置默认显示月，可选周、日
                dateClick: this.handleDateClick,
                eventClick: this.handleEventClick,
                eventsSet: this.handleEvents,
                select: this.handleDateSelect,
                // timezone
                // 设置日程
                events: [],
                //events格式如下
                 // {
		          // 	id: 1,
		          // 	title: '09:30~11:30 小破孩',
		          // 	start: '2020-12-11',
		          // 	end: '2020-12-13',
		          // 	color: '#f08f00',
		          // },
		          // {
		          // 	id: 2,
		          // 	title: '9:30~14:30 项目会议',
		          // 	start: '2020-12-14',
		          // 	end: '2020-12-14',
		          // 	color: '#6bb377',

                eventColor: '#ddd', // 修改日程背景色
                locale: 'zh-cn', // 设置语言
                weekNumberCalculation: 'ISO', // 周数
                customButtons: {}
            },
            doctorList:[]
        }
    },
    mounted() {
        this.getPaiban()
        this.getAllDoctor()
    },
    methods: {
        //获取排班
        getPaiban() {
            console.log(this)
            //this.calendarOptions.events = this.paibanList;
            this.ajax.request({
                url:'/paiban/findall.action'
            }).then((res)=>{
                if (!res.data.errorcode) {
                    console.log(res.data)
                    res.data.result.paiban.forEach(d => {
                        d.start = d.pbDate?d.pbDate.substring(0,10) :''
                        d.color = '#ddd'
                        d.background = '#ddd'
                        d.title = d.title
                        d.doctorName = d.doctorName
                        d.ksName = d.ksName
                        d.phone = d.phone
                    })
                    this.calendarOptions.events = res.data.result.paiban
                }
            })
        },
        //获取所有咨询师，督导
        getAllDoctor() {
            this.ajax.request({
                url: '/doctor/findall.action'
            }).then((res) => {
                if (!res.data.errorcode) {
                    console.log(res.data)
                    this.doctorList = res.data.result.doctor
                }
            })
        },
        //保存
        save() {
            var params = new URLSearchParams()
            params.append('title',this.form.title)
            params.append('pbDate',this.form.ctime)
            params.append('doctorId',this.form.doctorId)
            var url = '/paiban/add.action'
            if(this.form.id != '') {
                params.append('pId',this.form.id)
                url = '/paiban/mod.action'
            }
            console.log(params)
            
            this.ajax.request({
                url: url,
                data: params,
                method:'post'
            }).then((res)=>{
                this.$message.success('保存成功！')
                this.getPaiban()
                this.dialogFormVisible = false
                this.form = {
                    title:'',
                    ctime:'',
                    doctorId:'',
                    id:'',
                    doctorName:'',
                    phone:'',
                    ksName:''
                }
            })
        },
        //点击排班事件
        handleEventClick(calEvent) {
            this.isShowBtn = true
            var data = calEvent.event
            console.log(calEvent)
            this.form.id = data._def.extendedProps.pId,
            this.form.doctorId = data._def.extendedProps.doctorId,
            this.form.title = data.title,
            this.form.ctime = data._def.extendedProps.pbDate?data._def.extendedProps.pbDate.substring(0,10):'',
            this.form.doctorName = data._def.extendedProps.doctorName,
            this.form.ksName = data._def.extendedProps.ksName,
            this.form.phone = data._def.extendedProps.phone
            //this.dialogFormVisible = true;
            console.log(this.dateToString(calEvent.event.start))
        },
        //添加
        addPaiban() {
            this.dialogFormVisible = true
            this.form = {
                title:'',
                ctime:'',
                doctorId:'',
                id:'',
                doctorName:'',
                phone:'',
                ksName:''
            }
            this.isShowBtn = false
        },
        //修改
        editPaiban() {
            this.dialogFormVisible = true
        },
        //删除
        delData() {
            console.log(this.form)
            this.$confirm('确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var params = new URLSearchParams()
                params.append('pId',this.form.id)
                this.ajax.request({
                    url:'/paiban/del.action',
                    data:params,
                    method:'post'
                }).then((res)=>{
                    if(!res.data.errorcode) {
                        console.log(res.data)
                        this.$message.success('删除成功')
                        this.getPaiban()
                        this.dialogFormVisible = false
                    }
                })
                this.dialogFormVisible = false
            })
        },
        dateToString(now) {
            var year = now.getFullYear()
            var month =(now.getMonth() + 1).toString()
            var day = (now.getDate()).toString()
            if (month.length == 1) {
                month = '0' + month
            }
            if (day.length == 1) {
                day = '0' + day
            }
            var dateTime = year + '-' + month + '-' + day
            return dateTime
        },
        denglu(li) {
            let fd = new FormData (document.getElementById('loginform')) 
            this.ajax.request({
                url:'/yonghu/login.action',
                data:fd,
                method:'post'
            }).then((res)=>{
                if(!res.data.errorcode) {

                }
            }).catch(() => {
        
            })
        }
    }
}
</script>

<style scoped>

.addbtn{
    margin-top:15px;
    text-align: left;
    margin-bottom:15px;
}
.calendar_box>>>.el-dialog{
    width: 450px;
}
.calendar_box>>>.el-date-editor.el-input{
    width: 330px;
}
.el-select{
    width: 100%;
}
.detail_box>>>.el-form{
    border:1px solid #ddd;
}
.detail_box>>>.el-form-item__content{
    text-align: left;
    color: rgb(225, 211, 211);
}
</style>

