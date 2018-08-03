<template>
  <no-ssr>
    <Timeline style="transform: translateZ(0);"
      :items="items"
      :groups="groups"
      :options="tlOptions"
      :events="['click']"
      @click="onClick"
    />
  </no-ssr>
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from 'nuxt-property-decorator'
import {
  Timeline,
} from 'vue2vis'

@Component({
  components: {
    Timeline,
  },
  inheritAttrs: false,
  props: {
    talks: {
      type: Array,
      required: true,
    },
    tracks: {
      type: Array,
      required: true,
    },
    responsibleHeight: {
      type: Boolean,
      default: false,
    },
  },
})
export default class extends Vue {
  onClick(ev) {
    const item = this.items.filter(({ id }) => (id === ev.item))[0]

    if (ev.what === 'item') {
      this.$emit('click-talk', item)
    }
  }

  getTime(v) {
    return v.replace(/\d{4}-\d{2}-\d{2}T(\d+:\d+):00\+08:00/, (_, time) => time)
  }

  get groups() {
    return Object.values(this.$props.tracks.reduce((collection, { room }) => {
      if (!collection[room]) {
        collection[room] = {
          id: room,
          content: room,
        }
      }

      return collection
    }, {}))
  }

  get trackItems() {
    return this.$props.tracks
      .map(({ id, room, title }) => {
        const talks = this.$props.talks
          .filter(({ track: { id: trackId } }) => (trackId === id))
          .sort(({ startAt: lStart, endAt: lEnd }, { startAt: rStart, endAt: rEnd }) => {
            const cmpStart = lStart - rStart

            return cmpStart !== 0 ? cmpStart : lEnd - rEnd
          })

        return talks.length == 0 ? {} : {
          id,
          title,
          group: room,
          start: talks[0].start,
          end: talks[talks.length - 1].end,
          type: 'background',
          className: 'timetable-track',

          isTrack: true,
        }
      }).filter(({ start, end }) => (
        start && end
      ))
  }

  get talkItems() {
    return this.$props.talks
      .filter(({ start, end }) => (start && end))
      .map((talk) => ({
        ...talk,

        group: talk.track.room,
      }))
  }

  get startAt() {
    return this.talkItems
        .map(({ startAt }) => (startAt))
        .reduce((value, next) => value < next ? value : next)
  }

  get endAt() {
    return this.talkItems
      .map(({ endAt }) => (endAt))
      .reduce((value, next) => value > next ? value : next)
  }

  get defaultViewRange() {
    const boxSize = 3 * 60 * 60 * 1000 // 3 hrs
    const halfBoxSize = Math.floor(boxSize / 2)

    const nowAt = Date.now()
    const preferedStartAt = nowAt - halfBoxSize

    const startAt = preferedStartAt < this.startAt ? this.startAt : preferedStartAt
    const preferedEndAt = startAt + halfBoxSize
    const endAt = this.endAt < preferedEndAt ? this.endAt : preferedEndAt

    return {
      start: startAt,
      end: endAt,
    }
  }

  get breakDuringTwoDays() {
    const allDays = Object.values(this.talkItems.reduce((collection, { startAt, endAt }) => {
      const talkStartDatetime = new Date(startAt)
      const talkStartDayUtc = talkStartDatetime.getUTCDate()
      const talkStartHourUtc = talkStartDatetime.getUTCHours()
      const hourInTaiwan = talkStartHourUtc + 8
      const dayInTaiwan = talkStartDayUtc + (hourInTaiwan >= 24 ? 1 : 0)

      if (!collection[dayInTaiwan]) {
        collection[dayInTaiwan] = {
          startAt,
          endAt,
        }
      }

      if (collection[dayInTaiwan].startAt > startAt) {
        collection[dayInTaiwan].startAt = startAt
      }

      if (collection[dayInTaiwan].endAt < endAt) {
        collection[dayInTaiwan].endAt = endAt
      }

      return collection
    }, {})).sort(({ startAt: l }, { startAt: r }) => (l - r))

    return allDays.length === 2 ? {
      start: new Date(allDays[0]['endAt']).toISOString(),
      end: new Date(allDays[1]['startAt']).toISOString(),
    } : {}
  }

  get dayTwoBackground() {
    return ((this.breakDuringTwoDays.end) ?
      [
        {
          start: this.breakDuringTwoDays.end,
          end: new Date(this.endAt).toISOString(),
          type: 'background',
          className: 'day-two',

          isBackground: true,
        }
      ] : [])
  }

  get items() {
    return [
      ...this.talkItems,
      ...this.trackItems,
      ...this.dayTwoBackground,
    ]
  }

  get tlOptions() {
    return {
      ...this.defaultViewRange,
      min: new Date(this.startAt).toISOString(),
      max: new Date(this.endAt).toISOString(),
      hiddenDates: this.breakDuringTwoDays,
      ...(this.$props.responsibleHeight ? {} : {
        height: '100%',
      }),
      stack: false,
      // verticalScroll: true,
      selectable: false,
      // zoomKey: 'ctrlKey',
      zoomMin: 5 * 60 * 1000,
      template: (item, element, data) => {
        const { start, end, title } = item
        return item.isBackground ? '' : item.isTrack ? (`
          <h1>${title}</h1>
        `) : (`
          <small>${this.getTime(start)} - ${this.getTime(end)}</small>
          <h1>${title}</h1>
        `)
      },
      margin: {
        item: {
          horizontal: 20,
          vertical: 40,
        },
      },
      groupOrder: ({ id: lId }, { id: rId }) => (
        lId.localeCompare(rId)
      ),
    }
  }
}
</script>

<style>
:root {
  --accent: rgb(59, 156, 96);
  --secondary: rgb(219, 238, 224);
}

.vis-timeline {
  font-size: 14px;
  border-left: 0px;
  border-right: 0px;
}

.vis-foreground .vis-item {
  margin-top: .6em;
  cursor: pointer;
}

.vis-item {
  border-color: var(--accent);
  background-color: var(--secondary);
}

.vis-item.vis-background {
  background-color: color(var(--secondary) a(40%));
}

.vis-item.vis-background.day-two {
  background-color: rgba(255, 255, 239, 0.4);
}

.vis-item.community h1 {
  margin: 0;
}

.vis-item-content {
  line-height: 1em;
}

.vis-item h1 {
  margin-top: 5px;
  font-size: 1em;
  font-weight: normal;
  line-height: 1.2em;
  text-overflow: ellipsis;
  overflow: hidden;
}
.vis-item.timetable-track h1 {
  margin-top: 0;
}

.vis-item h4 {
  font-size: 1em;
  font-weight: normal;
  line-height: 1em;
  margin: 4px 0;
}

.vis-time-axis .vis-text {
  padding-top: 0;
  padding-bottom: 0;
  line-height: 2em;
}
</style>
