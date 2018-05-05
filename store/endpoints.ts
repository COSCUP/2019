import {
  ActionContext,
  ActionTree,
  MutationTree,
} from 'vuex'
import {
  RootState,
} from '.'

export const API_ROOT = 'https://coscup.github.io/coscup2018-website-api/'
export const name = 'endpoints'

export enum Apis {
  main = 'main',
  programs = 'programs',
  sponsors = 'sponsors',
  transportation = 'transportation',
  staffs = 'staffs',
}

export const types = {
  UPDATE_API: 'updateApi',
}

export type APIEndpoints = {
  [N in keyof typeof Apis]?: string
}

export type State = APIEndpoints

export const state = (): State => ({})

export interface Actions<S, R> extends ActionTree<S, R> {
  nuxtServerInit(context: ActionContext<S, R>): void
}

export const actions: Actions<State, RootState> = {
  async nuxtServerInit({ commit }) {
    const response = await fetch(API_ROOT)
    const data: APIEndpoints = await response.json()
    const apis: APIEndpoints = Object.entries(data).reduce((collection, [key, val]) => {
      collection[key] = `${API_ROOT}${val}`

      return collection
    }, data)

    commit(types.UPDATE_API, apis)
  }
}

export const mutations: MutationTree<State> = {
  [types.UPDATE_API](state, apis: APIEndpoints) {
    for (let key in Apis) {
      state[key] = apis[key]
    }
  }
}
