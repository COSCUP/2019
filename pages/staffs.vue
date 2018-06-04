<template>
  <main class="staffs">
    <Card class="container" v-for="group in groupedStaffs" :key="group.name">
      <h1>{{ group.name }}</h1>
      <ul>
        <li v-for="staff in group.people" :key="staff.name">
          {{ staff.name }}
        </li>
      </ul>
    </Card>
    <SponsorFooter />
  </main>
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from 'nuxt-property-decorator'
import {
  Action,
  State,
  namespace,
} from 'vuex-class'

import {
  name as staffsStoreName,
  State as staffsState,
} from '~/store/staffs'

import Card from '~/components/Card.vue'
import SponsorFooter from '~/components/SponsorFooter.vue'

const StaffsState = namespace(staffsStoreName, State)

@Component({
  components: {
    Card,
    SponsorFooter,
  },
})
export default class extends Vue {
  @StaffsState('groups') groupedStaffs: staffsState

  mounted() {
    this.$store.dispatch('clientsFirstFetch', this.fetch)
  }

  async fetch({ store: { dispatch } }) {
    await dispatch(`${staffsStoreName}/fetchData`)
  }
}
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
  margin-right: 2.5em;
}
</style>
