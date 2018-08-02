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
  intro: string
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
    if (!levels || !sponsors) return []

    const collection: SponsorsByLevel = Object.entries(levels)
      .map(([key, lv]) => ({
        ...lv,

        sponsors: sponsors.filter((sponsor) => (sponsor.level === key)),
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
    const endpoint = rootState[endpointStateName][locale].sponsors
    const response = await fetch(endpoint)
    const datas = await response.json()

    commit(types.UPDATE, datas)
  }
}

export const mutations: MutationTree<State> = {
  [types.UPDATE](state, datas) {
    Object.entries(datas).forEach(([key, value]) => (state[key] = value))
    state.sponsors = state.sponsors.map((sponsor) => ({
      ...sponsor,

      image: `${API_ROOT}${sponsor.image}`,
    }))
  }
}

export const pluginHook: Plugin<any> = (store) => {
  store.subscribe(({ type, payload }, rootState) => {
    if (type !== `${i18nStateName}/I18N_SET_LOCALE`) return;

    // Skip if endpoint is not loaded,
    // this could happened while nuxt-i18n module just loaded.
    // Don't be scared, after nuxt is completely loaded,
    // nuxtServerInit will do the same thing.
    const { __loaded: endpointLoaded } = rootState[endpointStateName]
    if (!endpointLoaded) return;

    const locale = payload
    store.dispatch(`${name}/fetchData`, { locale })
  })
}
