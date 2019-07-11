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
    coc: string
  }

  register: string
  individual_sponsor: string
  osc_tickets_application: string
  call_for_proposal: string
  call_for_volunteers: string
  lpi_certifications: string
  about: {
    welcome: string
    register_now: string
    show_live_cast: string
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

  sponsorship: {
    call_for_sponsorship: string
    contact: string
  }
}
