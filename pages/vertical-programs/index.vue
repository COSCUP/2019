<template>
  <div class="container">
    <div id="timetable" :style="`--table: ${gridTemplateRows}; --roomCount: ${locations.length}`">
      <ul id="locations">
        <template v-for="(location, index) in locations">
          <li :key="index">Room <strong>{{ location }}</strong></li>
        </template>
      </ul>
      <ul id="programs">
        <template v-for="(timeSlot, index) in programStarts.filter((v, i, a) => a.indexOf(v) === i)">
          <li
            class="time"
            :key="`time-${index}`"
            :style="`grid-row-start: t${getTimeSlug(timeSlot)}`"
          >{{ getTimeSlug(timeSlot, true) }}</li>
        </template>
        <template v-for="(program, index) in programs">
          <Program :program="program" :key="`program-${index}`"/>
        </template>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
// packages
import { Component, Vue, Prop } from "nuxt-property-decorator";
import { Action, State, Getter, namespace } from "vuex-class";

//stores
import { name as programsStoreName } from "~/store/programs";

import Program from "./_program.vue";

const ProgramsState = namespace(programsStoreName).State;

@Component({
  name: "Programs",
  components: {
    Program
  }
})
export default class extends Vue {
  @ProgramsState talks;
  @ProgramsState tracks;
  get gridTemplateRows() {
    return this.programTimeSlots
      .filter((v, i, a) => a.indexOf(v) === i)
      .map(start => {
        return `[t${this.getTimeSlug(start)}] minmax(1em, auto)`;
      }).join(" ");
  }

  get eventDates() {
    return this.talks
      .map(talk => talk.start)
      .filter((v, i, a) => {
        if (i === 0) return true
        const previous = new Date(a[i - 1])
        const current = new Date(v)
        return previous.getFullYear() !== current.getFullYear()
          || previous.getMonth() !== current.getMonth()
          || previous.getDate() !== current.getDate()
      })
  }

  get defaultShowDate() {
    const today = new Date()
    return this.eventDates.find(date => {
      const eventDate = new Date(date)
      return today.getFullYear() !== eventDate.getFullYear()
          || today.getMonth() !== eventDate.getMonth()
          || today.getDate() !== eventDate.getDate()
    }) || (this.eventDates && this.eventDates[0])
  }

  get programStarts() {
    const todayTalks = this.talks
      .filter(talk => {
          const talkDate = new Date(talk.start)
          const showDate = new Date(this.defaultShowDate)
          return talkDate.getFullYear() === showDate.getFullYear()
            && talkDate.getMonth() === showDate.getMonth()
            && talkDate.getDate() === showDate.getDate()
        })
    return todayTalks
      .map(talk => talk.start)
      .sort()
  }

  get programTimeSlots() {
    const todayTalks = this.talks
      .filter(talk => {
          const talkDate = new Date(talk.start)
          const showDate = new Date(this.defaultShowDate)
          return talkDate.getFullYear() === showDate.getFullYear()
            && talkDate.getMonth() === showDate.getMonth()
            && talkDate.getDate() === showDate.getDate()
        })
    return todayTalks
      .reduce((timeSlots, talk) => timeSlots.concat(talk.start, talk.end), [])
      .sort()
  }

  get locations() {
    return this.talks
      .filter(talk => {
        const talkDate = new Date(talk.start)
        const showDate = new Date(this.defaultShowDate)
        return talkDate.getFullYear() === showDate.getFullYear()
          && talkDate.getMonth() === showDate.getMonth()
          && talkDate.getDate() === showDate.getDate()
      })
      .map(talk => talk.track)
      .map(track => track.room)
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort()
  }

  get programs() {
    return this.talks
      .filter(talk => {
          const talkDate = new Date(talk.start)
          const showDate = new Date(this.defaultShowDate)
          return talkDate.getFullYear() === showDate.getFullYear()
            && talkDate.getMonth() === showDate.getMonth()
            && talkDate.getDate() === showDate.getDate()
        })
      .sort((a, b) => a.startAt - b.startAt)
  }

  mounted() {
    this.$store.dispatch("clientsFirstFetch", this.$options["fetch"]);
  }

  async fetch({ store: { dispatch } }) {
    await dispatch(`${programsStoreName}/fetchData`);
  }

  getTimeSlug(datetime, withColon = false) {
    const time = datetime instanceof Date ? datetime : new Date(datetime);
    return `${this.padStartWithZero(time.getHours())}${withColon? ':' : ''}${this.padStartWithZero(
      time.getMinutes()
    )}`;
  }

  padStartWithZero(number) {
    return number < 10 ? `0${number}` : number.toString();
  }
}
</script>

<style lang="stylus">
#timetable
  max-width: 1200px

#programs
  list-style: none
  display: grid
  li
    a
      display: block
      height: 100%
      contain: layout

    @media only screen and (min-width: 1000px)
      position: relative
      article
        position: sticky
        position: -webkit-sticky;
        top: 130px;

  @media only screen and (min-width: 1000px)
    grid-template-rows: var(--table)
    grid-template-areas: 'roomIB101 roomIB201 roomIB202 roomIB301 roomIB302 roomIB304 roomIB305 roomIB306 roomIB307 roomIB308 roomIB401 roomIB501 roomIB502 roomIB503'
    grid-column: var(--room)
    grid-gap: 0 0.5em
    grid-template-columns: repeat(var(--roomCount), calc(((100% - 7 * 0.5em) / 8)));
    margin: 0 -32px

.time
  font-size: 20px
  color: #009a79
  background-color: #ecf5f4
  padding: .5em

  @supports(position: -webkit-sticky)
    position: -webkit-sticky
    top: 69px
    z-index: 9

  @media only screen and (min-width: 1000px)
    display: none

#locations
  display: none
  list-style: none
  text-align: center
  position: sticky
  position: -webkit-sticky
  top: 65px
  contain: layout
  background-color: rgba(255, 255, 255, .8)
  z-index: 9
  margin: 0 -32px
  
  li
    flex: 1 0 calc(((100% - 7 * 0.5em) / 8))
    font-size: smaller 
    color: rgba(0, 0, 0, .4)

    &:not(first-child)
      margin-left: 0.5em

  strong
    display: block
    font-size: 2em
    margin: -.3em 0 .5em
    color: rgba(0, 0, 0, .7)

  @media only screen and (min-width: 1000px)
    display: flex
</style>
