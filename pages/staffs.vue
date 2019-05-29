<template>
  <main class="staffs">
    <Card v-for="team in teams" :key="team.key" class="container">
      <h1>{{ team.title }}</h1>
      <ul>
        <li
          v-for="member in team.members"
          :key="member.name"
          :title="member.name"
        >
          <img :src="member.image" alt="" />
          <div class="name">{{ member.name }}</div>
        </li>
      </ul>
    </Card>
    <SponsorFooter />
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { State, namespace } from 'vuex-class'

import { name as staffsStoreName } from '~/store/staffs'

import Card from '~/components/Card.vue'
import SponsorFooter from '~/components/SponsorFooter.vue'

const StaffsState = namespace(staffsStoreName, State)

@Component({
  components: {
    Card,
    SponsorFooter
  }
})
class staffs extends Vue {
  @StaffsState('teams') teams

  mounted() {
    this.$store.dispatch('clientsFirstFetch', this.$options.fetch)
  }

  async fetch({ store: { dispatch } }) {
    await dispatch(`${staffsStoreName}/fetchData`)
  }
}
export default staffs
</script>

<style scoped>
main.staffs {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2em;
}

main.staffs ul {
  display: flex;
  flex-wrap: wrap;
  padding: 0;
}

main.staffs li {
  margin: 1em 1em 0 0;
  position: relative;
  max-width: 100px;
  max-height: 100px;

  line-height: 0;
}

main.staffs li .name {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding-bottom: 0.8em;

  display: flex;
  filter: opacity(0);
  opacity: 0;

  color: #fff;
  background: rgba(128, 128, 128, 0.6);
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.6));
  font-size: 0.8em;
  text-align: center;
  line-height: 1em;
  justify-content: center;
  align-items: flex-end;

  transition: filter 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

main.staffs li:hover .name {
  filter: opacity(1);
  opacity: 1;
}

main.staffs li img {
  max-width: 100%;
}
</style>
