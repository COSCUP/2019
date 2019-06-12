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

export type Speaker = {
  id: string,
  avatar: string,
  name: string,
  bio: string,
}

export type Room = {
  id: string,
  name: string,
}

export type Tag = {
  id: string,
  name: string,
}

export type Type = {
  id: string,
  name: string,
}

export type DateTime = {
  year: number,
  month: number,
  date: number,
  hour: number,
  minute: number,
  second: number,
  timezoneOffset: number,
  timestamp: number,
}

export type Program = {
  id: string,
  type: Type,
  room: Room,
  broadcast: string,
  start: DateTime,
  end: DateTime,
  qa_link: string,
  slide_link: string,
  live_link: string,
  record_link: string,
  title: string,
  description: string,
  speakers: Speaker[],
  tags: Tag[],
}

type APIResSession = {
  id: string,
  type: string,
  room: string,
  broadcast: string,
  start: string,
  end: string,
  qa: string,
  slide: string,
  live: string,
  record: string,
  zh: {
    title: string,
    description: string,
  },
  en: {
    title: string,
    description: string,
  },
  speakers: string[],
  tags: string[],
}

type APIResSpeaker = {
  id: string,
  avatar: string,
  zh: {
    name: string,
    bio: string,
  },
  en: {
    name: string,
    bio: string,
  }
}

type APIResType = {
  id: string,
  zh: {
    name: string
  },
  en: {
    name: string
  },
}

type APIResRoom = {
  id: string,
  zh: {
    name: string
  },
  en: {
    name: string
  },
}

type APIResTag = {
  id: string,
  zh: {
    name: string
  },
  en: {
    name: string
  },
}

type APIResponse = {
  sessions: APIResSession[],
  rooms: APIResRoom[],
  tags: APIResTag[],
  session_types: APIResType[],
  speakers: APIResSpeaker[]
}

export type State = {
  programs: Program[],
  rooms: Room[],
  tags: Tag[],
  sessionTypes: Type[],
  speakers: Speaker[],
  eventDay: DateTime[],
}

export const state = (): State => ({
  programs: [],
  rooms: [],
  tags: [],
  sessionTypes: [],
  speakers: [],
  eventDay: [],
} as State)

export interface Actions<S, R> extends ActionTree<S, R> {
  fetchData(context: ActionContext<S, R>): void
}

export const actions: Actions<State, RootState> = {
  async fetchData({ commit, rootState }) {
    const locale = rootState.i18n.locale
    const endpoint = `${API_ROOT}/programs.json`
    const response = await fetch(endpoint)
    const data = await response.json() as APIResponse

    const localeKey = locale.substr(0, 2)
    const sessionTypes = data.session_types.map((resType: APIResType) :Type => ({
      id: resType.id,
      name: (resType[localeKey] && resType[localeKey].name) || resType.en.name,
    }))
    const rooms = data.rooms.map((resRoom: APIResRoom) :Room => ({
      id: resRoom.id,
      name: (resRoom[localeKey] && resRoom[localeKey].name) || resRoom.en.name,
    }))
    const tagList = data.tags.map((resTag: APIResTag) :Tag => ({
      id: resTag.id,
      name: (resTag[localeKey] && resTag[localeKey].name) || resTag.en.name,
    }))
    const speakerList = data.speakers.map(({id, avatar, ...profile}: APIResSpeaker) :Speaker => ({
      id: id,
      avatar: avatar,
      name: (profile[localeKey] && profile[localeKey].name) || profile.en.name,
      bio: (profile[localeKey] && profile[localeKey].bio) || profile.en.bio,
    }))

    const createDateTime = (timeString: string): DateTime => {
      const dateObject = new Date(Date.parse(timeString))
      return {
        year: dateObject.getFullYear(),
        month: dateObject.getMonth() + 1,
        date: dateObject.getDate(),
        hour: dateObject.getHours(),
        minute: dateObject.getMinutes(),
        second: dateObject.getSeconds(),
        timezoneOffset: dateObject.getTimezoneOffset(),
        timestamp: dateObject.getTime(),
      }
    }

    const getProgramPeriod = (start: string, end: string): number => {
      if (!start || !end) return 0
      const s = Date.parse(start)
      const e = Date.parse(end)
      return (e - s) / 1000 / 60
    }

    const programs = data.sessions.map(({
      id, type, room, broadcast, start, end, qa, slide, live, record, zh, en, speakers, tags
    }) => ({
      id,
      type: sessionTypes.find((candidate: Type) => candidate.id === type) || null,
      room: rooms.find((candidate: Room) => candidate.id === room) || null,
      broadcast,
      start: start && createDateTime(start) || null,
      end: end && createDateTime(end) || null,
      period: getProgramPeriod(start, end),
      qa_link: qa,
      slide_link: slide,
      live_link: live,
      record_link: record,
      title: localeKey === 'zh' ? zh.title : en.title,
      description: localeKey === 'zh' ? zh.description: en.description,
      speakers: speakers.map((speakersKey) => speakerList.find((candidate) => speakersKey === candidate.id)),
      tags: tags.map((tagKey) => tagList.find((candidate) => tagKey === candidate.id)),
    }));

    commit(types.UPDATE, {
      programs: programs,
      rooms: rooms,
      tags: tagList,
      sessionTypes: sessionTypes,
      speakers: speakerList,
      eventDay: programs.map((program) => program.start)
                        .filter((current: DateTime, index: number, arr: Array<DateTime>) => current !== null
                            && arr.findIndex((exists: DateTime) =>
                              exists !== null && (exists.year === current.year && exists.month === current.month && exists.date === current.date)) === index
                          )
                        .sort((a: DateTime, b: DateTime) => a.timestamp - b.timestamp)
                        .map(({ year, month, date}: DateTime) => ({
                          year: year,
                          month: month,
                          date: date
                        }))
    })
  }
}

export const mutations: MutationTree<State> = {
  [types.UPDATE](state, datas) {
    Object.entries(datas).forEach(([key, value]) => (state[key] = value))
  }
}
