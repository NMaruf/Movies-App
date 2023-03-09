import React, { Component } from 'react'
import { debounce } from 'lodash'
import { Offline, Online } from 'react-detect-offline'
import { Tabs, Alert } from 'antd'

import RatedMovieList from '../rated-movie-list/rated-movie-list'
import ItemList from '../item-list'
import MovieService from '../../services/service'
import { GenresProvider } from '../genres-context'

import './app.css'

export default class App extends Component {
  movieService = new MovieService()

  constructor() {
    super()
    this.state = { query: '', sessionId: null, tab: '1', genres: null, error: false, err: null }
    this.inputRef = React.createRef()
  }

  componentDidMount() {
    this.inputRef.current.focus()
    this.onGuestSession()
    this.onGetGenres()
  }

  onLabelChange = debounce((event) => this.setState({ query: event.target.value }), 500)

  onChange = (key) => {
    console.log('Tab: ', key)

    this.setState({ tab: key })
  }

  onSessionId = (session) => this.setState({ sessionId: session.guest_session_id })

  onGuestSession() {
    this.movieService.getGuestSession().then(this.onSessionId).catch(this.onError)
  }

  onGenres = (genres) => {
    this.setState({ genres })
  }

  onGetGenres() {
    this.movieService.getGenres().then(this.onGenres).catch(this.onError)
  }

  onError = (err) => {
    this.setState({
      error: true,
      err,
    })
  }

  render() {
    const { query, error, err, sessionId, tab, genres } = this.state

    const errorMessage = error ? (
      <Alert className="alert" message={err.name} description={err.message} type="error" showIcon />
    ) : null

    const search = (
      <>
        <input className="search" placeholder="Type to search..." onChange={this.onLabelChange} ref={this.inputRef} />
        {errorMessage}
        <ItemList query={query} sessionId={sessionId} />
      </>
    )

    const rated = (
      <>
        {errorMessage}
        <RatedMovieList sessionId={sessionId} tab={tab} />
      </>
    )

    const items = [
      { key: '1', label: 'Search', children: search },
      { key: '2', label: 'Rated', children: rated },
    ]

    return (
      <GenresProvider value={genres}>
        <Online>
          <div className="container">
            <Tabs defaultActiveKey="1" items={items} onChange={(key) => this.onChange(key)} />
          </div>
        </Online>
        <Offline>
          <Alert message="You are offline right now. Check your connection." type="error" showIcon />
        </Offline>
      </GenresProvider>
    )
  }
}
