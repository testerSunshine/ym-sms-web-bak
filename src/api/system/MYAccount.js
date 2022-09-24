import {GetApi, PostApi} from "@/api/request"

export const search = new PostApi(`/MYAccount/search`)

export const add = new PostApi(`/MYAccount/add`)

export const update = new PostApi(`/MYAccount/update`)

export const del = new PostApi(`/MYAccount/del`)
