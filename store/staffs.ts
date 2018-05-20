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

export const name = 'staffs'

export const types = {
  UPDATE: 'update'
}

type APIPeople = {
  name: string
  groups: string[]
}

type APIData = APIPeople[]

type Group = {
  name: string
}

type People = {
  name: string
}

export type State = {
  groups: (Group & {
    people: People[]
  })[]
}

export const state = (): State => ({} as State)

export interface Actions<S, R> extends ActionTree<S, R> {
  fetchData(context: ActionContext<S, R>): void
}

export const actions: Actions<State, RootState> = {
  async fetchData({ commit, rootState }) {
    const locale = rootState.i18n.locale
    const endpoint = rootState[endpointStateName][locale].staffs
    const response = await fetch(endpoint)
    const datas : APIData = await response.json()

    commit(types.UPDATE, datas)
  }
}

export const mutations: MutationTree<State> = {
  [types.UPDATE](state, datas : APIData) {
    state.groups = [
      ...datas.reduce((collection, { groups }) => {
        groups.forEach((groupName) => collection.add(groupName))

        return collection
      }, new Set<string>())
    ].map((name) => ({
      name,
      people: datas.filter(({ groups: belongedGroups }) => (belongedGroups.includes(name)))
        .map(({ name }) => ({ name })),
    }))
  }
}
