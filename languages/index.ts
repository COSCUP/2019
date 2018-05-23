export default interface Language {
  pages: {
    about: string
    schedules: string
    venue: string
    sponsors: string
    staffs: string
    blog: string
  }

  register: string

  sponsors: {
    sortBy: string
  }

  venue: {
    openInGoogleMaps: string
  }
}
