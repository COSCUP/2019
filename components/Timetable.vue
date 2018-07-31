<template>
  <no-ssr>
    <Timeline
      :items="items"
      :groups="groups"
      :options="tlOptions"
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
    return v.replace(/\d{4}-\d{2}-\d{2}T(\d+:\d+):00\+0800/, (_, time) => time)
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
          .sort(({ begin: lBegin, end: lEnd }, { begin: rBegin, end: rEnd }) => {
            const cmpBegin = Date.parse(lBegin) - Date.parse(rBegin)

            return cmpBegin !== 0 ? cmpBegin : Date.parse(lEnd) - Date.parse(rEnd)
          })

        return talks.length == 0 ? {} : {
          id,
          title,
          group: room,
          start: talks[0].begin,
          end: talks[talks.length - 1].end,
          type: 'background',
          className: 'timetable-track',

          isTrack: true,
        }
      }).filter(({ start, end }) => (
        start && end
      )).sort(({ start: lStart, end: lEnd }, { start: rStart, end: rEnd }) => {
        const cmpBegin = Date.parse(lStart) - Date.parse(rStart)

        return cmpBegin !== 0 ? cmpBegin : Date.parse(lEnd) - Date.parse(rEnd)
      })
  }

  get talkItems() {
    return this.$props.talks
      .filter(({ begin, end }) => (begin && end))
      .map(({ begin, end, ...talk }) => ({
        ...talk,

        group: talk.track.room,
        start: begin,
        end: end,
      }))
  }

  get items() {
    return [
      ...this.talkItems,
      ...this.trackItems,
    ]
  }

  get tlOptions() {
    return {
      start: this.trackItems[0].start,
      end: this.trackItems[this.trackItems.length - 1].end,
      min: this.trackItems[0].start,
      max: this.trackItems[this.trackItems.length - 1].end,
      hiddenDates: {
        start: '2018-08-11T17:10:00+08:00',
        end: '2018-08-12T09:00:00+08:00'
      },
      height: this.$props.responsibleHeight ? null : '100%',
      stack: false,
      verticalScroll: true,
      selectable: false,
      zoomKey: 'ctrlKey',
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
.vis-timeline {
  font-size: 14px;
}
.vis-foreground .vis-item {
  margin-top: .6em;
  cursor: pointer;
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
</style>
