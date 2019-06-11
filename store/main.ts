import {
  ActionContext,
  ActionTree,
  MutationTree,
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

export const name = 'main'

export const types = {
  UPDATE: 'update',
  UPDATE_CACHE: 'update_cache',
}

type Event = {
  start_at: string
  end_at: string
  link: string
}

type Contactable = {
  contect: {
    email: string
  }
}

type COSCUPYears = '2006' | '2007' | '2008' | '2009' |
  '2010' | '2011' | '2012' | '2013' | '2014' | '2015' | '2016'

export type BaseState = {
  description: string
  place: string
  registration: Event
  program:  Contactable & {
    call_for_proposal: Event
  }
  sponsorship: Contactable
  media: Contactable
  social_network: {
    [SocialNetwork: string]: string
  }
  previous_websites: {
    [Year in COSCUPYears]: string
  }
}

export type State = BaseState & {
  __caches: {
    [Lang in keyof typeof Languages]?: BaseState
  }
}

export const state = (): State => ({
  __caches: {},
} as State)

export interface Actions<S, R> extends ActionTree<S, R> {
  nuxtServerInit(context: ActionContext<S, R>): void
  fetchData(context: ActionContext<S, R>): void
}

export const actions: Actions<State, RootState> = {
  async nuxtServerInit({ dispatch }) {
    await dispatch('fetchData')
  },

  async fetchData({ commit, state: { __caches: caches }, rootState }) {
    const locale = rootState.i18n.locale
    let failable = false
    if (caches[locale]) {
      commit(types.UPDATE, caches[locale])
      failable = true
    }

    try {
      const endpoint = rootState[endpointStateName][locale].main
      const response = await fetch(endpoint)
      const datas = await response.json()

      commit(types.UPDATE_CACHE, { locale, datas })
      commit(types.UPDATE, datas)
    } catch (e) {
      if (failable) return;

      throw e
    }
  }
}

export const mutations: MutationTree<State> = {
  [types.UPDATE_CACHE](state, { locale, datas }) {
    state.__caches = {
      ...state.__caches,

      [locale]: datas,
    }
  },

  [types.UPDATE](state, datas) {
    datas.area.images = Object.keys(datas.area.images).reduce((images, floor) => ({
      ...images,
      [floor]: `${API_ROOT}${datas.area.images[floor]}`,
    }), {})
    Object.entries(datas)
      .forEach(([key, value]) => (state[key] = value))
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

