<template>
  <div class="modal" v-if="program">
    <nuxt-link to="/programs"><span class="close">×</span></nuxt-link>
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
import { Program as Session, DateTime, name as ProgramStoreName } from "~/store/programs";
@Component({
  name: 'Program',
  async asyncData({ store: { dispatch, state : { programs } }, params}): Promise<{program: Session} | never> {
    return dispatch(`${ProgramStoreName}/fetchData`).then(() => {
      const program = programs.programs.find((program) => program.id === params.id)
      return {
        program: program
      }
    });
  }
})
class Program extends Vue {
  program: Session

  get title() {
    const speakerNames = this.program.speakers.map(speaker => speaker.name).join('/')

    return `${this.program.title} by ${speakerNames} | COSCUP 2019`
  }

  head() {
    return {
      title: this.title,
      meta: [
        { hid: `og:description`, name: 'og:description', content: this.program.description },
        { hid: `og:title`, property: 'og:title', content: this.title },
        { hid: `og:type`, property: 'og:type', content: 'article' },
        { hid: `og:url`, property: 'og:url', content: `https://coscup.org/2019${this.$route.path}`},
      ],
    }
  }

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
  background-color: #fff;
    strong {
        display: block;
        text-align: center;
        font-size: larger;
        padding: .5em;
    }
    p {
        padding: 1em;
        margin: 0;
        word-break: break-word;
        border-radius: .5em;
    }
    @media only screen and (min-width: 720px) {
        strong {
            text-align: left;
            padding: 1em 1em 0;
        }
    }
}
</style>
