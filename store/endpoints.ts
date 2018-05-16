import {
  ActionContext,
  ActionTree,
  MutationTree,
} from 'vuex'
import {
  RootState,
} from '.'

import {
  Languages,
} from './i18n'

export const API_ROOT = 'http://api2018.coscup.org/'
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
  [L in keyof typeof Languages]: {
    [N in keyof typeof Apis]?: string
  }
}

export type State = APIEndpoints

export const state = (): State => ({
  'zh-TW': {},
  en: {},
  ja: {},
})

export interface Actions<S, R> extends ActionTree<S, R> {
  nuxtServerInit(context: ActionContext<S, R>): void
}

export const actions: Actions<State, RootState> = {
  async nuxtServerInit({ commit }) {
    const response = await fetch(API_ROOT)
    const { index: data = {} } = await response.json()
    const apisWithLangs: APIEndpoints = Object.entries(Languages)
      .reduce((langs, [langCode, apiLang]) => {
        langs[langCode] = Object.entries(data[apiLang] || {})
          .reduce((apis, [name, endpoint]) => {
            apis[name] = `${API_ROOT}${endpoint}`

            return apis
          }, {})

        return langs
      }, {} as APIEndpoints)

    commit(types.UPDATE_API, apisWithLangs)
  }
}

export const mutations: MutationTree<State> = {
  [types.UPDATE_API](state, apis: APIEndpoints) {
    for (let key in apis) {
      state[key] = apis[key]
    }
  }
}
