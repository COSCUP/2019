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
  speakers: APIResSpeaker[],
  tag: APIResTag[],
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

type APIResTag = {
  id: string,
  name_zh: string,
  name_en: string,
}

type APIResRoom = {
  id: string,
  name_zh: string,
  name_en: string,
}

type APIResType = {
  id: string,
  name_zh: string,
  name_en: string,
}

type APIResponse = {
  sessions: APIResSession[],
  rooms: APIResRoom[],
  tags: APIResTag[],
  types: APIResType[],
}

export type State = {
  programs: Program[],
  rooms: Room[],
  tags: Tag[],
  types: Type[],
  eventDay: DateTime[],
}

export const state = (): State => ({
  programs: [],
  rooms: [],
  tags: [],
  types: [],
  eventDay: [],
} as State)

export interface Actions<S, R> extends ActionTree<S, R> {
  fetchData(context: ActionContext<S, R>): void
}

export const actions: Actions<State, RootState> = {
  async fetchData({ commit, rootState }) {
    const locale = rootState.i18n.locale
    const endpoint = rootState[endpointStateName][locale].programs
    const response = await fetch(endpoint)
    const data = await response.json() as APIResponse

    const localeKey = locale.substr(0, 2)

    const pTypes = data.types.map((resType) => ({
      id: resType.id,
      name: resType['name_' + localeKey] || resType.name_en,
    }))
    const rooms = data.rooms.map((resRoom) => ({
      id: resRoom.id,
      name: resRoom['name_' + localeKey] || resRoom.name_en,
    }))
    const tags = data.tags.map((resTag) => ({
      id: resTag.id,
      name: resTag['name_' + localeKey] || resTag.name_en,
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

    const createSpeaker = (speaker: APIResSpeaker): Speaker => ({
      id: speaker.id,
      avatar: speaker.avatar,
      name: (speaker[localeKey] && speaker[localeKey].name) || speaker.en.name,
      bio: (speaker[localeKey] && speaker[localeKey].bio) || speaker.en.bio,
    })

    const getProgramPeriod = (start: string, end: string): number => {
      if (!start || !end) return 0
      const s = Date.parse(start)
      const e = Date.parse(end)
      return (e - s) / 1000 / 60
    }

    const programs = data.sessions.map(({
      id, type, room, broadcast, start, end, qa, slide, live, record, zh, en, speakers, tag
    }) => ({
      id,
      type: pTypes.find((candidate: Type) => candidate.id === type) || null,
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
      description: localeKey === 'zh' ? zh.description: en.title,
      speakers: speakers.map(createSpeaker),
      tags: tag.map(
        (resTag :APIResTag) => (
          tags.find((candidate) => candidate.id === resTag.id)
        )).filter(tag => tag !== undefined),
    }));

    commit(types.UPDATE, {
      programs: programs,
      rooms: rooms,
      tags: tags,
      types: pTypes,
      eventDay: programs.map((program) => program.start)
                        .filter((current: DateTime, index: number, arr: Array<DateTime>) => 
                          {
                            return current &&
                            arr.findIndex((exists: DateTime) => (exists.year === current.year && exists.month === current.month && exists.date === current.date)) === index
                          }
                        ).sort((a: DateTime, b: DateTime) => a.timestamp - b.timestamp)
    })
  }
}

export const mutations: MutationTree<State> = {
  [types.UPDATE](state, datas) {
    Object.entries(datas).forEach(([key, value]) => (state[key] = value))
  }
}
