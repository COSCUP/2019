import {
  ActionContext,
  ActionTree,
  MutationTree,
  GetterTree,
} from 'vuex'
import {
  RootState,
} from '.'
import {
  name as endpointStateName,
} from './endpoints'

export const name = 'sponsors'

export const types = {
  UPDATE: 'update'
}

type Level = {
  title: string
}

type Sponsor = {
  name: string
  level: string
  image: string
  link: string
}

export type State = {
  levels: {
    [Name: string]: Level
  }
  sponsors: Sponsor[]
}

export type SponsorsByLevel = (Level & {
  sponsors: Sponsor[]
})[]

export const state = (): State => ({} as State)

export interface Getters<S, R> extends GetterTree<S, R> {
  byLevel(state: S, getters: any, rootState: R, rootGetters: any): SponsorsByLevel
}

export const getters: Getters<State, RootState> = {
  byLevel({ levels, sponsors }) {
    const collection: SponsorsByLevel = Object.entries(levels)
      .map(([key, lv]) => ({
        ...lv,

        sponsors: sponsors.filter((sponsor) => (sponsor.level === key))
          .sort(({ name: l }, { name: r }) => (l.localeCompare(r))),
      }))

    return collection
  }
}

export interface Actions<S, R> extends ActionTree<S, R> {
  fetchData(context: ActionContext<S, R>): void
}

export const actions: Actions<State, RootState> = {
  async fetchData({ commit, rootState }) {
    const locale = rootState.i18n.locale
    const endpoint = rootState[endpointStateName][locale].sponsors
    const response = await fetch(endpoint)
    const datas = await response.json()

    commit(types.UPDATE, datas)
  }
}

export const mutations: MutationTree<State> = {
  [types.UPDATE](state, datas) {
    Object.entries(datas).forEach(([key, value]) => (state[key] = value))
  }
}
