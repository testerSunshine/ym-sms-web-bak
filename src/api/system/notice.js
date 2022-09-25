import {GetApi, PostApi} from "@/api/request"

export const search = new PostApi(`/notice/search`)

export const add = new PostApi(`/notice/add`)

export const update = new PostApi(`/notice/update`)

export const del = new PostApi(`/notice/del`)

export const getLastOne = new PostApi(`/notice/getLastOne`)

