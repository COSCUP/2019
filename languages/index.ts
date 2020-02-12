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
	press_release: string
    coc: string
  }

  register: string
  individual_sponsor: string
  osc_tickets_application: string
  call_for_proposal: string
  call_for_volunteers: string
  lpi_certifications: string,
  guidebook: string,
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

    slide: string
    record: string
  }

  venue: {
    openInGoogleMaps: string
  }

  sponsorship: {
    call_for_sponsorship: string
    contact: string
  }
}
