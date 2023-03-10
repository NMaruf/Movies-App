import React, { Component } from 'react'
import { format } from 'date-fns'
import parseISO from 'date-fns/parseISO'
import { Pagination, Space, Spin, Alert } from 'antd'

import './item-list.css'
import Item from '../item'
import MovieService from '../../services/service'
import { GenresConsumer } from '../genres-context'

export default class ItemList extends Component {
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
    this.updateMovies('', 1)
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.query !== prevProps.query) {
      console.log('update query', this.props.query)
      this.setState({ currentPage: 1, loading: true })
      this.updateMovies(this.props.query, 1)
    }
    if (this.state.currentPage !== prevState.currentPage) {
      console.log('update page', this.state.currentPage)
      this.setState({ loading: true })
      this.updateMovies(this.props.query, this.state.currentPage)
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

  updateMovies(query, page) {
    this.movieService.getAllMovies(query, page).then(this.onMoviesLoaded).catch(this.onError)
  }

  render() {
    const { elements, loading, error, err, currentPage } = this.state

    const { sessionId } = this.props

    const results = elements
      // .filter((item, idx) => idx + 1 <= this.state.page * 6 && idx >= this.state.page * 6 - 6)
      .map((movie) => {
        const date = movie.release_date ? format(parseISO(movie.release_date), 'MMMM d, y') : null
        const poster = movie.poster_path
        const genreIds = movie.genre_ids
        const { id, ...itemProps } = movie

        return (
          <GenresConsumer key={id}>
            {(genres) => (
              <Item
                key={id}
                {...itemProps}
                id={id}
                date={date}
                poster={poster}
                genreIds={genreIds}
                sessionId={sessionId}
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
        message="?????????????????????? ???????????? ???? ??????????????"
        description="?????????????????? ???????????????????????? ??????????????"
        type="warning"
        showIcon
      />
    ) : null

    const content = hasData ? (
      <>
        {results}
        <Pagination className="pagination" current={currentPage} pageSize={20} onChange={this.setPage} total={500} />
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
