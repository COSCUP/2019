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

type Team = {
  name: string
}

type Member = {
  teams: string[],
  name: string,
  image: string,
}

type APIData = {
  teams: {
    [K: string]: Team,
  },
  members: Member[],
}

export type State = {
  teams: (Team & {
    members: Member[],
  })[],
}

export const state = (): State => ({
  teams: [],
} as State)

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
    state.teams = Object.entries(datas.teams).map(([key, team]) => ({
      ...team,
      key,

      members: datas.members.filter(({ teams }) => (teams.includes(key)))
    }))
  }
}
