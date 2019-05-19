<template>
  <li class="program" :style="{
    '--room': room,
    '--start': start,
    '--end': end,
  }">
    <article>
      <footer>
        <span class="period">{{ period }}</span>
        <span class="track">{{ program.track.title }}</span>
      </footer>
      <header>
        <h4>{{ program.title }}</h4>
      </header>
      <span class="location">{{ program.track.room }}</span>
      <span class="length">{{ length }}</span>
      <span class="language">{{ program.language }}</span>
    </article>
  </li>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator";
import { Action, State, Getter, namespace } from "vuex-class";

@Component({
  name: "Program"
})
export default class extends Vue {
  @Prop(Object)
  program: any;

  get start() {
    return `t${this.getTimeSlug(this.program.start)}`;
  }

  get end() {
    return `t${this.getTimeSlug(this.program.end)}`;
  }

  get room() {
    return `room${this.program.track.room}`;
  }

  get period() {
    return `${this.getTimeSlug(this.program.start, true)} ~ ${this.getTimeSlug(
      this.program.end,
      true
    )}`;
  }

  get length() {
    const start =
      this.program.start instanceof Date
        ? this.program.start
        : new Date(this.program.start);
    const end =
      this.program.end instanceof Date
        ? this.program.end
        : new Date(this.program.end);

    return `${(end.getTime() - start.getTime()) / 1000 / 60} mins`;
  }

  getTimeSlug(datetime, colon = false) {
    const time = datetime instanceof Date ? datetime : new Date(datetime);
    return `${this.padStartWithZero(time.getHours())}${
      colon ? ":" : ""
    }${this.padStartWithZero(time.getMinutes())}`;
  }

  padStartWithZero(number) {
    return number < 10 ? `0${number}` : number.toString();
  }
}
</script>

<style lang="stylus">
.program {
  padding: 0.5em;

  h4 {
    font-weight: normal;
    margin: 0;
    word-break: break-word;
    font-size: 16px;
  }

  .track {
    color: #009a79;
  }

  footer {
    position: relative;
  }

  .period {
    opacity: 0.8;
    display: none;
  }

  .length {
    &::before, &::after {
      content: ' - ';
    }
  }

  @media only screen and (max-width: 719px) {
    border-bottom: 1px solid #e9e9e9;
    padding: 1em;
  }

  @media only screen and (min-width: 720px) {
    grid-column: 2;
    margin-bottom: 1em;

    h4 {
      font-size: 24px;
    }
  }

  @media only screen and (min-width: 1000px) {
    grid-column: var(--room);
    grid-row-start: var(--start);
    grid-row-end: var(--end);
    border: 1px dashed rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    margin-bottom: 0;

    h4 {
      font-size: large;
    }

    .period {
      display: block;
    }

    .track {
      font-size: smaller;
    }

    .length, .location, .language {
      display: none;
    }
  }
}
</style>
