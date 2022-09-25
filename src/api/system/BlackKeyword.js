import {GetApi, PostApi} from "@/api/request"

export const search = new PostApi(`/blackKeyword/search`)

export const add = new PostApi(`/blackKeyword/add`)

export const update = new PostApi(`/blackKeyword/update`)

export const del = new PostApi(`/blackKeyword/del`)
