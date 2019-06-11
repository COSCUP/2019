import {
  ActionContext,
  ActionTree,
  MutationTree,
  GetterTree,
  Plugin,
} from 'vuex'
import {
  RootState,
} from '.'
import {
  name as endpointStateName,
  API_ROOT,
} from './endpoints'
import {
  name as i18nStateName,
  Languages,
} from './i18n'

export const name = 'cohosts'

export const types = {
  UPDATE: 'update'
}

type Level = {
  title: string
}

type Cohost = {
  name: string
  level: string
  intro: string
  image: string
  link: string
}

export type State = {
  levels: {
    [Name: string]: Level
  }
  cohosts: Cohost[]
}

export type CohostsByLevel = (Level & {
  cohosts: Cohost[]
})[]

export const state = (): State => ({
  levels: {},
  cohosts: [],
} as State)

export interface Getters<S, R> extends GetterTree<S, R> {
  byLevel(state: S, getters: any, rootState: R, rootGetters: any): CohostsByLevel
}

export const getters: Getters<State, RootState> = {
  byLevel({ levels, cohosts }) {
    const collection: CohostsByLevel = Object.entries(levels)
      .map(([key, lv]) => ({
        ...lv,

        cohosts: cohosts.filter((cohost) => (cohost.level === key)),
      }))

    return collection
  }
}

export interface Actions<S, R> extends ActionTree<S, R> {
  nuxtServerInit(context: ActionContext<S, R>): void
  fetchData(context: ActionContext<S, R>): void
}

export const actions: Actions<State, RootState> = {
  async nuxtServerInit({ dispatch }) {
    await dispatch('fetchData')
  },

  async fetchData({ commit, rootState }) {
    const locale = rootState.i18n.locale
    const endpoint = rootState[endpointStateName][locale].cohosts
    const response = await fetch(endpoint)
    const datas = await response.json()

    commit(types.UPDATE, datas)
  }
}

export const mutations: MutationTree<State> = {
  [types.UPDATE](state, datas) {
    Object.entries(datas).forEach(([key, value]) => (state[key] = value))
    state.cohosts = state.cohosts.map((cohost) => ({
      ...cohost,

      image: `${API_ROOT}${cohost.image}`,
    }))
  }
}
