<template>
  <main class="staffs">
    <section class="department" v-for="department in departments" :key="department.name">
      <h1>{{ department.name }}</h1>
      <ul>
        <li v-for="staff in department.staffs" :key="staff.name">
          {{ staff.name }}
        </li>
      </ul>
    </section>
  </main>
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from 'nuxt-property-decorator'

interface Department {
  name: String,
  staffs: [Staff]
}

interface Staff {
  name: String
}

@Component
export default class extends Vue {
  dummyData : [Department] = [
    {
      name: 'Foo',
      staffs: [
        { name: 'StaffA' }
      ]
    }
  ]

  get departments() {
    return this.dummyData
  }
}
</script>
