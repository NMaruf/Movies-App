import React, { Component } from 'react'
import { format } from 'date-fns'
import parseISO from 'date-fns/parseISO'
import { Pagination, Space, Spin, Alert } from 'antd'

import './item-list.css'
import Item from '../item'
import MovieService from '../../services/service'

export default class ItemList extends Component {
  movieService = new MovieService()

  constructor() {
    super()
    this.state = {
      elements: [],
      loading: true,
      error: false,
      errorName: null,
      errorMessage: null,
      page: 1,
    }
    this.updateMovies()
  }

  onMoviesLoaded = (movies) => {
    this.setState({
      elements: movies,
      loading: false,
    })
  }

  onError = (err) => {
    console.log(err.name)
    this.setState({
      error: true,
      errorName: err.name,
      errorMessage: err.message,
      loading: false,
    })
  }

  setPage = () => {
    this.setState(({ page }) => {
      let res
      if (page === 4) {
        res = page - 1
      } else {
        res = page + 1
      }

      return { page: res }
    })
  }

  updateMovies() {
    this.movieService.getAllMovies().then(this.onMoviesLoaded).catch(this.onError)
  }

  render() {
    const { elements, loading, error } = this.state

    const results = elements
      .filter((item, idx) => idx + 1 <= this.state.page * 6 && idx >= this.state.page * 6 - 6)
      .map((movie) => {
        const date = movie.release_date ? format(parseISO(movie.release_date), 'MMMM d, y') : null
        const poster = movie.poster_path
        const { id, ...itemProps } = movie

        return <Item key={id} {...itemProps} id={id} date={date} poster={poster} />
      })

    const errorMessage = error ? (
      <Alert
        className="alert"
        message={this.state.errorName}
        description={this.state.errorMessage}
        type="error"
        showIcon
      />
    ) : null

    const spinner = loading ? (
      <Space size="middle" className="spinner">
        <Spin size="large" />
      </Space>
    ) : null

    const hasData = !(loading || error)
    const content = hasData ? (
      <>
        {results}
        <Pagination
          className="pagination"
          current={this.state.page}
          onChange={this.setPage}
          total={elements.length}
          pageSize={6}
        />
      </>
    ) : null

    return (
      <ul className="movies">
        {spinner}
        {errorMessage}
        {content}
      </ul>
    )
  }
}
