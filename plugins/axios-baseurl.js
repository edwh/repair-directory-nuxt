/**
 * This sets up the client to talk to the same API whether or not the code is client or server side.
 *
 * @param $axios
 */
export default function ({ $axios }) {
  $axios.defaults.baseURL = process.env.API
}
