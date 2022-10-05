import {GetApi, PostApi} from "@/api/request"

export const getFourBlock = new GetApi(`/statistic/getFourBlock`)

export const getDailyProfitStat = new GetApi(`/statistic/getDailyProfitStat`)

export const getDailyFinishOrder = new GetApi(`/statistic/getDailyFinishOrder`)

export const getTotalProfitGoods = new GetApi(`/statistic/getTotalProfitGoods`)

export const getOneWeekData = new GetApi(`/statistic/getOneWeekData`)

export const getPersona = new PostApi(`/statistic/getPersona`)

export const getUserInfo = new PostApi(`/statistic/getUserInfo`)

