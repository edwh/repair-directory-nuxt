export const REGION_LONDON = 'London'
export const REGION_WALES = 'Wales'

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
    lat: 51.377245316489926,
    lng: -5.460205078125,
  },
  ne: {
    lat: 53.49325419747006,
    lng: -2.647705078125,
  },
}
