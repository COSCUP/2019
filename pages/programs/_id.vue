<template>
  <div class="modal" v-if="program" @click="$router.push(closeUrl)">
    <nuxt-link @click.stop :to="closeUrl"><span class="close">×</span></nuxt-link>
    <article @click.stop>
      <header>
        <div class="track" v-if="program.tags.length && program.tags[1]">
          {{ `${program.tags[1].name}` }}
        </div>
        <div
          class="difficult"
          v-if="program.tags.length && program.tags[2]"
        >{{ `${program.tags[2].name}` }}</div>
        <h4>{{ program.title }}</h4>
        <span class="room">{{ program.room.name }}</span>
        <span class="period">{{ `${getTimeSlug(program.start)} ~ ${getTimeSlug(program.end)}` }} {{ new Date().getTimezoneOffset() === -480 ? '' : ' (UTC + 8)' }}</span>
        <span
          class="language"
          v-if="program.tags.length && program.tags[0]"
        >{{ `${program.tags[0].name}` }}</span>
      </header>
      <span class="record" v-if="program.record_link"><a :href="program.record_link" target="_blank"><Icon icon="video" /> {{ $t('programs.record') }}</a></span>
        <span class="slide" v-if="program.slide_link"><a :href="program.slide_link" target="_blank"><Icon :icon="['fab', 'slideshare']" /> {{ $t('programs.slide') }}</a></span>
      <markdown
        :value="program.description"
      />
      <footer>
        <template v-for="(speaker, index) in program.speakers">
          <div class="speaker" :key="`speaker-${index}`">
            <strong>{{ speaker.name }}</strong>
            <markdown
              :value="speaker.bio"
            />
          </div>
        </template>
      </footer>
    </article>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator";
import { State, namespace } from 'vuex-class'
import { Program as Session, DateTime, name as ProgramStoreName } from "~/store/programs"
import Markdown from '~/components/Markdown.vue'

const ProgramsState = namespace(ProgramStoreName, State)

@Component({
  name: 'Program',
  components: {
    Markdown
  }
})
class Program extends Vue {
  @ProgramsState programs

  @Prop({ default: 1 })
  programDay: number

  mounted() {
    this.$store.dispatch('clientsFirstFetch', this.$options['fetch'])
  }

  async fetch({ store: { dispatch, state }, params, error}) {
    await dispatch(`${ProgramStoreName}/fetchData`);
    if (/^day[12]$/.test(params.id)) return
    const program = state[ProgramStoreName].programs.find((program) => program.id === params.id)
    if (!program) {
      error({ statusCode: 404, message: 'Page not found.'})
    }
  }

  get program() {
    return this.programs.find((program) => program.id === this.$route.params.id)
  }

  get title() {
    const speakerNames = this.program.speakers.map(speaker => speaker.name).join('/')

    return `${this.program.title} by ${speakerNames} | COSCUP 2019 | Conference for Open Source Coders, Users, and Promoters`
  }

  get closeUrl() {
    const langPrefix = this.$i18n.locale !== 'zh-TW' ? '/' + this.$i18n.locale : ''
    return `${langPrefix}/programs/day${this.programDay}`;
  }

  head() {
    return {
      title: this.title,
      meta: [
        { hid: `og:description`, property: 'og:description', content: this.program.description },
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
    .room, .period, .language {
        font-weight: bold;
    }
    .period {
        margin: 0 .5em;
    }
    .difficult {
      font-weight: bold;
      text-align: right;
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

.record, .slide {
  a {
    text-decoration: underline;
  }
  svg {
    margin: 0 5px;
  }
}
</style>
