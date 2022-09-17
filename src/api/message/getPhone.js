import {GetApi, PostApi} from "@/api/request"

export const getPhone = new PostApi(`/phone/getPhone`)

export const addPhone = new PostApi(`/phoneCollect/add`)