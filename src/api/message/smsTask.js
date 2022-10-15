import {GetApi, PostApi} from "@/api/request"

export const getTask = new PostApi(`/smsTask/getTask`)

export const getTaskRole = new PostApi(`/taskRole/getRole`)

export const updateTask = new PostApi(`/smsTask/updateSelective`)



