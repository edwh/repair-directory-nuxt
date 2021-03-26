// This file is just a placeholder of region-specific configuration until we introduce a proper concept of regions
// into the server.

export const REGION_LONDON = 'London'
export const REGION_WALES = 'Wales'

export const SEARCH_HINT_LONDON = 'London, UK'
export const SEARCH_HINT_WALES = 'Wales, UK'

// The bounds control which businesses we want to show.  At the moment we only support London and Wales, which
// are sufficiently far apart that we can distinguish between them using a box rather than a polygon.
export const BOUNDS_LONDON = {
  sw: {
    lat: 51.2,
    lng: -0.78,
  },
  ne: {
    lat: 51.8,
    lng: 0.6,
  },
}

export const BOUNDS_WALES = {
  sw: {
    lat: 51.32990102458417,
    lng: -5.371793182658548,
  },
  ne: {
    lat: 53.46775372527346,
    lng: -2.6032384951585485,
  },
}

export function showSubmitBusiness(region) {
  return region === REGION_LONDON
}
