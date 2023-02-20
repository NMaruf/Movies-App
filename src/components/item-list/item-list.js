import React, { Component } from 'react'
import { format } from 'date-fns'
import parseISO from 'date-fns/parseISO'

import './item-list.css'
import Item from '../item'
import MovieService from '../../services/service'

export default class ItemList extends Component {
  movieService = new MovieService()

  constructor() {
    super()
    this.state = { elements: [] }
    this.updateMovies()
  }

  onMoviesLoaded = (movies) => {
    this.setState({ elements: movies })
  }

  updateMovies() {
    this.movieService.getAllMovies().then(this.onMoviesLoaded)
  }

  render() {
    const { elements } = this.state

    const results = elements.map((movie) => {
      const date = movie.release_date ? format(parseISO(movie.release_date), 'MMMM d, y') : null
      const poster = movie.poster_path
      const { id, ...itemProps } = movie

      return <Item key={id} {...itemProps} id={id} date={date} poster={poster} />
    })

    return <ul className="movies">{results}</ul>
  }
}
