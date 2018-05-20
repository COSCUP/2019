import {
  ActionContext,
  ActionTree,
  MutationTree,
} from 'vuex'
import {
  RootState,
} from '.'
import {
  name as endpointStateName,
} from './endpoints'

export const name = 'about'

export const types = {
  UPDATE: 'update',
}

export type State = {
  article: string
}

export const state = (): State => ({} as State)

export interface Actions<S, R> extends ActionTree<S, R> {
  fetchData(context: ActionContext<S, R>): void
}

export const actions: Actions<State, RootState> = {
  async fetchData({ commit, rootState }) {
    const locale = rootState.i18n.locale
    const endpoint = rootState[endpointStateName][locale].about
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
