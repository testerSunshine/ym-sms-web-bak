import {GetApi, PostApi} from "@/api/request"

export const list = new PostApi(`/smsCollect/list`)
export const search = new PostApi(`/smsCollect/search`)
export const updateSelective = new PostApi(`/smsCollect/updateSelective`)