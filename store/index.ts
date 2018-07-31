import {
  ActionTree,
  ActionContext,
  MutationTree,
} from 'vuex';
import {
  name as EndpointName,
  State as EndpointState,
} from './endpoints'
import {
  name as I18nName,
  State as I18nState,
} from './i18n'
import {
  name as MainName,
  State as MainState,
  pluginHook as MainHook,
} from './main'
import {
  name as AboutName,
  State as AboutState,
} from './about'
import {
  name as CohostsName,
  State as CohostsState,
} from './cohosts'
import {
  name as ProgramsName,
  State as ProgramsState,
} from './programs'
import {
  name as SponsorsName,
  State as SponsorsState,
  pluginHook as SponsorsHook,
} from './sponsors'
import {
  name as StaffsName,
  State as StaffsState,
} from './staffs'
import {
  name as TransportName,
  State as TransportState,
} from './transportation'

export const types = {
  CLIENT_FETCHED: 'client_fetched',
}

export type State = {
  clientFetched: Boolean
}

export type RootState = State & {
  [EndpointName]: EndpointState
  [I18nName]: I18nState
  [MainName]: MainState
  [AboutName]: AboutState
  [CohostsName]: CohostsState
  [ProgramsName]: ProgramsState
  [SponsorsName]: SponsorsState
  [StaffsName]: StaffsState
  [TransportName]: TransportState
}

export const state = (): State => ({
  clientFetched: false,
} as State)

export interface Actions<S, R> extends ActionTree<S, R> {
  nuxtServerInit(context: ActionContext<S, R>): void
  clientsFirstFetch(context: ActionContext<S, R>, fetchFn: Function): void
}

export const actions: Actions<State, RootState> = {
  async nuxtServerInit({ dispatch }) {
    // We should init Endpoints and Main datas first
    await dispatch(`${EndpointName}/nuxtServerInit`, { root: true })
    await dispatch(`${MainName}/nuxtServerInit`, { root: true })
    await dispatch(`${SponsorsName}/nuxtServerInit`, { root: true })
  },

  clientsFirstFetch(store, fetchFn) {
    if (store.state.clientFetched) return;

    store.commit(types.CLIENT_FETCHED)
    fetchFn({ store })
  }
}

export const mutations: MutationTree<State> = {
  [types.CLIENT_FETCHED](state) {
    state.clientFetched = true
  }
}

export const plugins = [
  MainHook,
  SponsorsHook,
]
