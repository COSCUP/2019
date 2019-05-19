<template>
  <div>
    <div class="days">
      <ul>
        <template v-for="(day, index) in eventDates">
          <li :key="index">{{ `Day ${index}` }} {{ getDateString(day) }}</li>
        </template>
      </ul>
    </div>
    <div id="timetable" :style="`--table: ${gridTemplateRows}; --roomCount: ${locations.length}`">
      <ul id="locations">
        <template v-for="(location, index) in locations">
          <li :key="index">
            Room
            <strong>{{ location }}</strong>
          </li>
        </template>
      </ul>
      <ul id="programs">
        <template
          v-for="(timeSlot, index) in programStarts.filter((v, i, a) => a.indexOf(v) === i)"
        >
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
      })
      .join(" ");
  }

  get eventDates() {
    return this.talks
      .map(talk => talk.start)
      .filter((v, i, a) => {
        const previous = a.slice(0, i).map(p => new Date(p).getDate());
        const current = new Date(v).getDate();
        return previous.indexOf(current) === -1;
      })
      .sort();
  }

  get defaultShowDate() {
    const today = new Date();
    return (
      this.eventDates.find(date => {
        const eventDate = new Date(date);
        return (
          today.getFullYear() === eventDate.getFullYear() &&
          today.getMonth() === eventDate.getMonth() &&
          today.getDate() === eventDate.getDate()
        );
      }) ||
      (this.eventDates && this.eventDates[0])
    );
  }

  get programStarts() {
    const todayTalks = this.talks.filter(talk => {
      const talkDate = new Date(talk.start);
      const showDate = new Date(this.defaultShowDate);
      return (
        talkDate.getFullYear() === showDate.getFullYear() &&
        talkDate.getMonth() === showDate.getMonth() &&
        talkDate.getDate() === showDate.getDate()
      );
    });
    return todayTalks.map(talk => talk.start).sort();
  }

  get programTimeSlots() {
    const todayTalks = this.talks.filter(talk => {
      const talkDate = new Date(talk.start);
      const showDate = new Date(this.defaultShowDate);
      return (
        talkDate.getFullYear() === showDate.getFullYear() &&
        talkDate.getMonth() === showDate.getMonth() &&
        talkDate.getDate() === showDate.getDate()
      );
    });
    return todayTalks
      .reduce((timeSlots, talk) => timeSlots.concat(talk.start, talk.end), [])
      .sort();
  }

  get locations() {
    return this.talks
      .filter(talk => {
        const talkDate = new Date(talk.start);
        const showDate = new Date(this.defaultShowDate);
        return (
          talkDate.getFullYear() === showDate.getFullYear() &&
          talkDate.getMonth() === showDate.getMonth() &&
          talkDate.getDate() === showDate.getDate()
        );
      })
      .map(talk => talk.track)
      .map(track => track.room)
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort();
  }

  get programs() {
    return this.talks
      .filter(talk => {
        const talkDate = new Date(talk.start);
        const showDate = new Date(this.defaultShowDate);
        return (
          talkDate.getFullYear() === showDate.getFullYear() &&
          talkDate.getMonth() === showDate.getMonth() &&
          talkDate.getDate() === showDate.getDate()
        );
      })
      .sort((a, b) => a.startAt - b.startAt);
  }

  mounted() {
    this.$store.dispatch("clientsFirstFetch", this.$options["fetch"]);
  }

  async fetch({ store: { dispatch } }) {
    await dispatch(`${programsStoreName}/fetchData`);
  }

  getTimeSlug(datetime, withColon = false) {
    const time = datetime instanceof Date ? datetime : new Date(datetime);
    return `${this.padStartWithZero(time.getHours())}${
      withColon ? ":" : ""
    }${this.padStartWithZero(time.getMinutes())}`;
  }

  padStartWithZero(number) {
    return number < 10 ? `0${number}` : number.toString();
  }

  getDateString(date) {
    const dateObj = new Date(date);

    return `${dateObj.getFullYear()}/${dateObj.getMonth()}/${dateObj.getDate()}`;
  }
}
</script>

<style lang="stylus">
#timetable {
  position: relative;

  @media only screen and (min-width: 1000px) {
    // overflow-x: auto;
    // max-width: 1200px;
  }
}

#locations {
  display: none;
  list-style: none;
  text-align: center;
  position: sticky;
  position: -webkit-sticky;
  top: 65px;
  contain: layout;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9;
  margin: 0;

  li {
    flex: 1 0 calc(((100% - 7 * 0.5em) / 8));
    font-size: smaller;
    color: rgba(0, 0, 0, 0.4);

    &:not(:first-child) {
      margin-left: 0.5em;
    }
  }

  strong {
    display: block;
    font-size: 2em;
    margin: -0.3em 0 0.5em;
    color: rgba(0, 0, 0, 0.7);
  }

  @media only screen and (min-width: 1000px) {
    display: flex;
  }
}

.time {
  font-size: 20px;
  color: #009a79;
  background-color: #ecf5f4;
  padding: 0.5em;

  @supports (position: -webkit-sticky) {
    position: -webkit-sticky;
    top: 69px;
    z-index: 9;
  }

  @media only screen and (min-width: 720px) {
    position: sticky;
    margin: 0 -96px;
    padding: 0.5em 64px;
    border-top: 1px solid #b8d2cf;
    grid-column: 1 / span 2;
    top: 64px;
  }

  @media only screen and (min-width: 1000px) {
    display: none;
  }
}

#programs {
  list-style: none;
  display: grid;
  grid-template-rows: var(--list);

  li {
    a {
      display: block;
      height: 100%;
      contain: layout;
      color: inherit;
    }

    @media only screen and (min-width: 1000px) {
      position: relative;

      article {
        position: sticky;
        position: -webkit-sticky;
        top: 130px;
      }
    }
  }

  @media only screen and (max-width: 719px) {
    margin-top: -56px;
  }

  @media only screen and (min-width: 720px) {
    grid-template-columns: 120px auto;
    grid-column: 2;
  }

  @media only screen and (min-width: 1000px) {
    grid-template-rows: var(--table);
    grid-template-areas: 'roomIB101 roomIB201 roomIB202 roomIB301 roomIB302 roomIB304 roomIB305 roomIB306 roomIB307 roomIB308 roomIB401 roomIB501 roomIB502 roomIB503';
    grid-column: var(--room);
    grid-gap: 0 0.5em;
    grid-template-columns: repeat(var(--roomCount), calc(((100% - 7 * 0.5em) / 8)));
    margin: 0;
  }
}
</style>
