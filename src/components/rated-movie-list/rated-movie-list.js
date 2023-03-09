import React, { Component } from 'react'
import { format } from 'date-fns'
import parseISO from 'date-fns/parseISO'
import { Pagination, Space, Spin, Alert } from 'antd'

import Item from '../item'
import MovieService from '../../services/service'
import { GenresConsumer } from '../genres-context'
import './rated-movie-list.css'

export default class RatedMovieList extends Component {
  movieService = new MovieService()

  // eslint-disable-next-line react/state-in-constructor
  state = {
    elements: [],
    loading: true,
    error: false,
    err: null,
    currentPage: 1,
  }

  componentDidMount() {
    this.updateMovies(this.props.sessionId, this.state.currentPage)
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.tab === '2' && this.props.tab !== prevProps.tab) {
      console.log('update rated movies', this.props.tab)
      this.updateMovies(this.props.sessionId, 1)
    }

    if (this.state.currentPage !== prevState.currentPage) {
      console.log('update page in rated movies', this.state.currentPage)
      this.setState({ loading: true })
      this.updateMovies(this.props.sessionId, this.state.currentPage)
    }
  }

  onMoviesLoaded = (movies) => {
    this.setState({
      elements: movies,
      loading: false,
    })
  }

  onError = (err) => {
    this.setState({
      error: true,
      err,
      loading: false,
    })
  }

  setPage = (page) => {
    this.setState({ currentPage: page })
  }

  updateMovies(sessionId, page) {
    this.movieService.getRatedMovies(sessionId, page).then(this.onMoviesLoaded).catch(this.onError)
  }

  render() {
    const { elements, loading, error, err, currentPage } = this.state
    const { sessionId, tab } = this.props

    const results = elements
      // .filter((item, idx) => idx + 1 <= this.state.page * 6 && idx >= this.state.page * 6 - 6)
      .map((movie) => {
        const date = movie.release_date ? format(parseISO(movie.release_date), 'MMMM d, y') : null
        const genreIds = movie.genre_ids
        const poster = movie.poster_path
        const { id, ...itemProps } = movie

        return (
          <GenresConsumer key={id}>
            {(genres) => (
              <Item
                key={id}
                {...itemProps}
                id={id}
                date={date}
                genreIds={genreIds}
                poster={poster}
                sessionId={sessionId}
                tab={tab}
                genres={genres}
              />
            )}
          </GenresConsumer>
        )
      })

    const errorMessage = error ? (
      <Alert className="alert" message={err.name} description={err.message} type="error" showIcon />
    ) : null

    const spinner = loading ? (
      <Space size="middle" className="spinner">
        <Spin size="large" />
      </Space>
    ) : null

    const res = results.length === 0
    const hasData = !(loading || error) && !res

    const notData = res ? (
      <Alert
        className="alert"
        message="Отсутствуют данные по запросу"
        description="Проверьте корректность запроса"
        type="warning"
        showIcon
      />
    ) : null

    const content = hasData ? (
      <>
        {results}
        <Pagination className="pagination" current={currentPage} pageSize={30} onChange={this.setPage} total={500} />
      </>
    ) : null

    return (
      <ul className="movies">
        {spinner}
        {notData}
        {errorMessage}
        {content}
      </ul>
    )
  }
}
