<template>
  <div class="modal" v-if="program">
    <span class="close">×</span>
    <article>
      <header>
        <div class="track" v-if="program.tags.length && program.tags[1]">
          {{ `${program.tags[1].name}` }}
        </div>
        <h4>{{ program.title }}</h4>
        <span class="room">{{ program.room.name }}</span>
        <span class="period">{{ `${getTimeSlug(program.start)} ~ ${getTimeSlug(program.end)}` }}</span>
        <span
          class="language"
          v-if="program.tags.length && program.tags[0]"
        >{{ `${program.tags[0].name}` }}</span>
      </header>
      <p>{{ program.description }}</p>
      <footer>
        <template v-for="(speaker, index) in program.speakers">
          <div class="speaker" :key="`speaker-${index}`">
            <img :src="speaker.avatar" alt="">
            <strong>{{ speaker.name }}</strong>
            <p>{{ speaker.bio }}</p>
          </div>
        </template>
      </footer>
    </article>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator";
import { Program as Session, DateTime } from "~/store/programs";
@Component({
  name: "Program"
})
class Program extends Vue {
  @Prop()
  program: Session

  getTimeSlug = (dateTime: DateTime): string => {
		const hours = this.padStartWithZero(dateTime.hour);
		const minutes = this.padStartWithZero(dateTime.minute);
		return `${hours}:${minutes}`
  }

  padStartWithZero(number) {
		return number < 10 ? `0${number}` : number.toString();
	}
}

export default Program
</script>

<style lang="stylus">
.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, .9);
    z-index: 999;
    padding-top: 3em;
    .close {
        position: absolute;
        right: .2em;
        top: .2em;
        cursor: pointer;
        font-size: 3em;
        font-weight: bolder;
        pointer-events: none;
    }
    article {
        background-color: #ecf5f4;
        margin: 0 auto;
        width: 100%;
        box-sizing: border-box;
        max-width: 1000px;
        padding: 2em;
        border-radius: 5px;
        max-height: calc(100vh - 4em);
        overflow: auto;
    }
    h4 {
        font-size: 2em;
        line-height: 1.3em;
        margin: .3em 0;
    }
    p {
        margin: 2em 0;
    }
    .room, .period, .language {
        font-weight: bold;
    }
    .period {
        margin: 0 .5em;
    }
    .track {
        text-align: right;
        color: #009a79;
    }
}

.speaker {
  margin-bottom: 2em;
  img {
        display: block;
        margin: 0 auto;
        width: 96px;
        height: 96px;
        object-fit: cover;
        border-radius: 50%;
        border: 3px solid #009a79;
        grid-row: 1 / span 2;
        align-self: center;
    }
    strong, p {
        grid-column: 2;
    }
    strong {
        display: block;
        text-align: center;
        grid-row: 1;
        font-size: larger;
        padding: .5em;
    }
    p {
        grid-row: 2;
        padding: 1em;
        margin: 0;
        word-break: break-word;
        background-color: #fff;
        border-radius: .5em;
    }
    &::before, &::after {
        content: ' '
        background-color: #fff;
        grid-column: 2;
        grid-row: 1 / span 3;
    }
    &::before {
        border-radius: .5em;
    }
    &::after {
        width: 16px;
        height: 16px;
        margin-left: -8px;
        transform: rotate(45deg);
        align-self: center;
    }
    @media only screen and (min-width: 720px) {
        display: grid;
        grid-template-columns: 120px 1fr;
        grid-template-rows: auto 1fr;
        img {
            margin: 0;
        }
        strong {
            text-align: left;
            padding: 1em 1em 0;
        }
    }
}
</style>
