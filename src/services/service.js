export default class MovieService {
  _apiBase = 'https://api.themoviedb.org/3'

  _apiKey = '166502d89dc0089a75eb47233177495c'

  _auth = '/authentication/guest_session/new'

  async getResource(url, query, page) {
    const res = await fetch(`${this._apiBase}${url}?api_key=${this._apiKey}&query=${query}&page=${page}`)

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, receiced ${res.status}`)
    }
    return await res.json()
  }

  async getAllMovies(query, page) {
    const res = await this.getResource('/search/movie', query, page)
    return res.results
  }

  async getGuestSession() {
    const res = await fetch(`${this._apiBase}${this._auth}?api_key=${this._apiKey}`)

    if (!res.ok) {
      throw new Error(`Could not fetch AUTH, receiced ${res.status}`)
    }
    return await res.json()
  }

  async getGenres() {
    const res = await fetch(`${this._apiBase}/genre/movie/list?api_key=${this._apiKey}`)

    if (!res.ok) {
      throw new Error(`Could not fetch Genres, receiced ${res.status}`)
    }
    const jsonRes = await res.json()
    return jsonRes.genres
  }

  async getRatedMovies(sessionId, page) {
    const url = `${this._apiBase}/guest_session/${sessionId}/rated/movies?api_key=${this._apiKey}&page=${page}`
    const res = await fetch(url)

    if (!res.ok) {
      throw new Error(`Could not fetch AUTH, receiced ${res.status}`)
    }

    const jsonRes = await res.json()
    return jsonRes.results
  }

  async rateMovie(id, rating, sessionId) {
    const obj = { value: rating }

    const res = await fetch(
      `${this._apiBase}/movie/${id}/rating?api_key=${this._apiKey}&guest_session_id=${sessionId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(obj),
      }
    )

    if (!res.ok) {
      throw new Error(`Could not fetch rate a movie, receiced ${res.status}`)
    }
    return await res.json()
  }
}
