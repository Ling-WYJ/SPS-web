import axios from './axios'

// 新增排班
export const addScheduleDailyApi=(data)=>{
  return axios.request({
      url:'/schedule/daily',
      method:'POST',
      data
  })
}
// 获取当天排班的督导列表
export const getScheduleSupervisorApi=(params)=>{
  return axios.request({
      url:'/schedule/supervisorList',
      method:'GET',
      params
  })
}

// 获取当天排班的咨询师列表
export const getScheduleCounsellorListApi=(params)=>{
  return axios.request({
    url:'/schedule/counsellorList',
    method:'GET',
    params
  })
}

// 获取当天排班咨询师认数
export const getCounNum=(params)=>{
  return axios.request({
    url:'/admin/TodayCounOnDuty',
    method:'GET',
    params
  })
}

// 获取当天排班督导数
export const getSupNum=(params)=>{
  return axios.request({
    url:'/admin/TodaySupOnDuty',
    method:'GET',
    params
  })
}
