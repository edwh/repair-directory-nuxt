export const REGION_LONDON = 'London'
export const REGION_WALES = 'Wales'

export const SEARCH_HINT_LONDON = 'London, UK'
export const SEARCH_HINT_WALES = 'Wales, UK'

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
    lat: 51.377245316489926,
    lng: -5.460205078125,
  },
  ne: {
    lat: 53.49325419747006,
    lng: -2.647705078125,
  },
}

// The distances are manually chosen.
export const DISTANCES_LONDON = [
  {
    value: 1,
    text: '1 mile',
  },
  {
    value: 2,
    text: '2 miles',
  },
  {
    value: 5,
    text: '5 miles',
  },
  {
    value: 10,
    text: '10 miles',
  },
  {
    value: 18,
    text: 'All London',
  },
]

export const DISTANCES_WALES = [
  {
    value: 3,
    text: '3 miles',
  },
  {
    value: 5,
    text: '5 miles',
  },
  {
    value: 10,
    text: '10 miles',
  },
  {
    value: 20,
    text: '20 miles',
  },
  {
    value: 30,
    text: '30 miles',
  },
  {
    value: 200,
    text: 'All Wales',
  },
]