import React, { Component } from 'react'
import { Button, Space, Typography, Image, Spin, Rate, Alert } from 'antd'

import MovieService from '../../services/service'

import './item.css'

const { Title, Paragraph, Text } = Typography
const cn = require('classnames')

export default class Item extends Component {
  movieService = new MovieService()

  // eslint-disable-next-line react/state-in-constructor
  state = { loaded: false, rating: 0, error: false, err: null }

  rateMovie = (value) => {
    this.movieService
      .rateMovie(this.props.id, value, this.props.sessionId)
      .then((res) => {
        this.setState({ rating: value })
        localStorage.setItem(this.props.id, value)
        console.log('Rate movie', value, 'status', res.success)
      })
      .catch(this.onError)
  }

  onError = (err) => {
    this.setState({
      error: true,
      err,
    })
  }

  render() {
    const { loaded, rating, error, err } = this.state

    const { id, title, date, overview, poster, tab, genreIds, genres } = this.props
    const _img = 'https://image.tmdb.org/t/p/original'

    const source = poster === null ? '../images/default.avif' : `${_img}${poster}`

    let value
    if (this.props.rating && tab === '2') {
      value = this.props.rating
    } else {
      value = rating !== 0 ? rating : Number(localStorage.getItem(id))
    }

    const classNames = cn('circle', {
      red: value > 0 && value < 3,
      orange: value >= 3 && value < 5,
      yellow: value >= 5 && value < 7,
      green: value >= 7,
    })

    const genre = []

    for (let i = 0; i < genreIds.length; i++) {
      for (let j = 0; j < genres.length; j++) {
        if (genreIds[i] === genres[j].id) {
          genre.push(genres[j].name)
        }
      }
    }
    let uniqKey = 100

    const genreBtn = genre.map((el) => {
      uniqKey += 1
      return (
        <Button className="btn" key={uniqKey}>
          {el}
        </Button>
      )
    })

    const errorMessage = error ? (
      <Alert className="alert" message={err.name} description={err.message} type="error" showIcon />
    ) : null

    return (
      <li className="movie" id={id}>
        <Title level={4} className="title">
          {title}
        </Title>
        <div className={classNames}>{value}</div>
        <Text className="date">{date}</Text>
        <Space className="buttons" wrap>
          {genreBtn}
        </Space>
        <Paragraph
          className="overview"
          ellipsis={{
            expandable: true,
            rows: 6,
            symbol: 'Показать всё',
          }}
        >
          {overview}
        </Paragraph>
        {errorMessage}
        <Rate className="rate" allowHalf value={value} count={10} onChange={this.rateMovie} />
        {!loaded && <Spin size="middle" className="spin" />}
        <Image src={source} alt="IMG" className="img" onLoad={() => this.setState({ loaded: true })} />
      </li>
    )
  }
}
