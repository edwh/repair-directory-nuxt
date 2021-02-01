export const REGION_LONDON = 'London'
export const REGION_WALES = 'Wales'

export const TAGLINE_GENERIC = 'Find a business to repair your broken devices.'
export const TAGLINE_LONDON =
  'Find a London business to repair your broken devices.'
export const TAGLINE_WALES =
  'Find a Welsh business to repair your broken devices.'

// The bounds control which businesses we want to show.  At the moment we only support London and Wales, which
// are sufficiently far apart that we can distinguish between them using a box rather than a polygon.
export const BOUNDS_LONDON = {
  sw: {
    lat: 51.378795,
    lng: -0.302531,
  },
  ne: {
    lat: 51.674441,
    lng: 0.266182,
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
