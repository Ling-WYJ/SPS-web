import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)


const routes = [
	{
		path: '/',
		redirect: '/login',
		component:()=>import('@/index'),
		children:[
			{
				path: '/login',
				name: 'LoginIndex',
				component: ()=>import('@/components/user/index'),
				meta: {
					type: 'login'  // 是否需要判断是否登录,这里是需要判断
				},
			},
			// {
			// 	//聊天室
			// 	path: '/chat',
			// 	name: 'chat',
			// 	component: ()=>import('@/pages/chat/chat'),
			// 	meta: {
			// 		type: 'chat'
			// 	},
			// },
		]
	},
	{
		path: '/userManagement',
		name: 'userManagement',
		//redirect: '/userManagement/Adm_index',
		component: ()=>import('@/pages/userManagement/index'),
		children:[
			{
				//首页
				path: '/userManagement/Adm_index',
				name: 'userManagementIndex',
				role:'admin',
				component: ()=>import('@/pages/userManagement/index/Adm_index'),
				meta: {
					type: 'index',
					title:'首页'
				},
			},
			{
				//首页
				path: '/userManagement/Con_index',
				name: 'userManagementIndex',
				role:'counsellor',
				component: ()=>import('@/pages/userManagement/index/Con_index'),
				meta: {
					type: 'index',
					title:'首页'
				},
			},
			{
				//首页
				path: '/userManagement/sup_index',
				name: 'userManagementIndex',
				role:'supervisor',
				component: ()=>import('@/pages/userManagement/index/Sup_index'),
				meta: {
					type: 'index',
					title:'首页'
				},
			},
			{
				//聊天室
				path: '/chat',
				name: 'chat',
				role:'counsellor,supervisor',
				component: ()=>import('@/pages/chat/chat'),
				meta: {
					type: 'chat',
					title: '咨询会话'
				},
			},
			{
				//咨询师管理
				path: '/userManagement/counsellor',
				name: 'counsellor',
				role:'admin',
				component: ()=>import('@/pages/userManagement/counsellor/index'),
				meta: {
					type: 'counsellor',
					title:'咨询师管理'
				},
			},
			{
				//访客管理
				path: '/userManagement/visitor',
				name: 'visitor',
				role:'admin',
				component: ()=>import('@/pages/userManagement/visitor/index'),
				meta: {
					type: 'visitor',
					title:'访客管理'
				},
			},
			{
				//督导管理
				path: '/userManagement/supervisor',
				name: 'supervisor',
				role:'admin',
				component: ()=>import('@/pages/userManagement/supervisor/index'),
				meta: {
					type: 'supervisor',
					title:'督导管理'
				},
			},
			// {
			// 	//个人信息
			// 	path: '/userManagement/profile',
			// 	name: 'profile',
			// 	role:'all',
			// 	component: ()=>import('@/pages/userManagement/profile/index'),
			// 	meta: {
			// 		type: 'profile',
			// 		title:'个人信息'
			// 	},
			// },
			{
				//排班表
				path: '/userManagement/schedule',
				name: 'schedule',
				role:'admin',
				component: ()=>import('@/pages/userManagement/schedule/index'),
				meta: {
					type: 'schedule',
					title:'排班表'
				},
			},
			{
				//咨询记录
				path: '/userManagement/record',
				name: 'record',
				role:'all',
				component: ()=>import('@/pages/userManagement/record/index'),
				meta: {
					type: 'record',
					title:'咨询记录'
				},
			},
			// {
			// 	//会话列表
			// 	path: '/userManagement/conversation',
			// 	name: 'conversation',
			// 	role:'counsellor,supervisor',
			// 	component: ()=>import('@/pages/userManagement/conversation/index'),
			// 	meta: {
			// 		type: 'conversation',
			// 		title:'会话列表'
			// 	},
			// },
		]
	}
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to,form,next)=>{
	if(to.path !== '/login') {
		let user_info = JSON.parse(sessionStorage.getItem('GET_USER_INFO'))
		if(user_info && user_info.role) {
		  next()
		}else{
		  next({path:'/login'})
		}
	}else{
		next()
	}
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}


export default router
