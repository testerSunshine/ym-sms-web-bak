import {GetApi, PostApi} from "@/api/request"

export const search = new PostApi(`messageReport/search`)

export const add = new PostApi(`messageReport/add`)

export const update = new PostApi(`messageReport/update`)

export const del = new PostApi(`messageReport/del`)
