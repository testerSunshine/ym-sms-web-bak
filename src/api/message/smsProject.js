import {GetApi, PostApi} from "@/api/request"

export const list = new PostApi(`/smsProject/list`)
export const selectProjectByProjectIdList = new PostApi(`/smsProject/selectProjectByProjectIdList`)