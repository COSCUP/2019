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
  API_ROOT,
} from './endpoints'

export const name = 'programs'

export const types = {
  UPDATE: 'update',
}

type Community = {
  id: string
  name: string
  intro: string
  link: string
  image: string
}

type Track = {
  id: string
  room: string
  communities: Community[]
  title: string
  group: string
}

type Speaker = {
  id: string
  name: string
  intro: string
  link: string
  avatar: string
}

type Talk = {
  id: string
  track: Track
  speakers: Speaker[]
  begin: Date
  end: Date
  title: string
  intro: string
  addition: string
  language: string
  difficulty: string
  audience: string
}

type APIResponse = {
  communities: {
    [Id: string]: {
      community: string
      name: string
      intro: string
      link: string
      image: string
    }
  }
  tracks: {
    [Id: string]: {
      track: string
      room: string
      communities: string[]
      title: string
      group: string
    }
  }
  speakers: {
    [Id: string]: {
      speaker: string
      name: string
      intro: string
      link: string
      avatar: string
    }
  }
  talks: {
    [Id: string]: {
      talk: string
      track: string
      speakers: string[]
      begin: string
      end: string
      title: string
      intro: string
      addition: string
      language: string
      difficulty: string
      audience: string
    }
  }
}

export type State = {
  talks: Talk[]
  tracks: Track[]
}

export const state = (): State => ({
  talks: [],
  tracks: [],
} as State)

export interface Actions<S, R> extends ActionTree<S, R> {
  fetchData(context: ActionContext<S, R>): void
}

export const actions: Actions<State, RootState> = {
  async fetchData({ commit, rootState }) {
    const locale = rootState.i18n.locale
    const endpoint = rootState[endpointStateName][locale].programs
    const response = await fetch(endpoint)
    const datas = await response.json() as APIResponse

    const tracks = Object.entries(datas.tracks).reduce((collection, [id, { communities, track: _id, ...track }]) => {
      collection[id] = {
        id,
        ...track,

        communities: communities.map((community) => (datas.communities[community]))
          .filter((community) => (community))
          .map(({ image, community: id, ...community }) => ({
            id,
            ...community,

            image: image ? `${API_ROOT}${image}` : null,
          })),
      }

      return collection
    }, {})
    const talks = Object.entries(datas.talks)
      .filter(([id, _talk]) => (id))
      .map(([id, { track, speakers, begin, end, talk: _id, ...talk }]) => ({
        id,
        ...talk,

        track: tracks[track],
        speakers: speakers.map((speaker) => (datas.speakers[speaker]))
          .filter((speaker) => (speaker))
          .map(({ avatar, speaker: id, ...speaker }) => ({
            id,
            ...speaker,

            avatar: avatar ? `${API_ROOT}${avatar}` : null,
          })),
        start: begin,
        end,
        startAt: Date.parse(begin),
        endAt: Date.parse(end),
      }))

      commit(types.UPDATE, {
        tracks: Object.values(tracks),
        talks,
      })
  }
}

export const mutations: MutationTree<State> = {
  [types.UPDATE](state, datas) {
    Object.entries(datas).forEach(([key, value]) => (state[key] = value))
  }
}
