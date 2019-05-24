export default async ({ store }) => {
  // Run the same vuex init as server init
  await store.dispatch('nuxtServerInit')
}
