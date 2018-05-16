import {
  ActionTree,
  ActionContext,
  GetterTree,
  mapGetters,
  mapState,
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
} from './main'

export type RootState = {
  [EndpointName]: EndpointState,
  [I18nName]: I18nState,
}

export interface Actions<S, R> extends ActionTree<S, R> {
  nuxtServerInit(context: ActionContext<S, R>): void
}

export const actions: Actions<{}, RootState> = {
  async nuxtServerInit({ dispatch }) {
    await dispatch(`${EndpointName}/nuxtServerInit`, { root: true })
    await dispatch(`${MainName}/nuxtServerInit`, { root: true })
  }
}
