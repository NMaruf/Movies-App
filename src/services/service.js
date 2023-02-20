export default class MovieService {
  _apiBase = 'https://api.themoviedb.org/3'

  _apiKey = '166502d89dc0089a75eb47233177495c'

  _query = 'return'

  async getResorce(url) {
    const res = await fetch(`${this._apiBase}${url}?api_key=${this._apiKey}&query=${this._query}`)

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, receiced ${res.status}`)
    }
    return await res.json()
  }

  async getAllMovies() {
    const res = await this.getResorce('/search/movie')
    return res.results
  }
}
