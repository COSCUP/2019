export default interface Language {
  pages: {
    about: string
    programs: string
    floorplan: string
    venue: string
    cohosts: string
    sponsors: string
    staffs: string
    blog: string
  }

  register: string

  about: {
    welcome: string
    register_now: string
  }

  programs: {
    tracks: string
    talks: string

    track: string
    speakers: string
  }

  venue: {
    openInGoogleMaps: string
  }
}
