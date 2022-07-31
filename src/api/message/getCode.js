import {GetApi, PostApi} from "@/api/request"

export const search = new PostApi(`/message/RegionCollect/search`)
export const getCode = new PostApi(`/code/getCode`)