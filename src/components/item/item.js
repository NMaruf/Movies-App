import React, { Component } from 'react'
import { Button, Space, Typography, Image } from 'antd'
import './item.css'

const { Title, Paragraph, Text } = Typography

export default class Item extends Component {
  render() {
    const { id, title, date, overview, poster } = this.props
    const _img = 'https://image.tmdb.org/t/p/original'

    return (
      <li className="movie" id={id}>
        <Title level={4} className="title">
          {title}
        </Title>
        <Text className="date">{date}</Text>
        <Space className="buttons" wrap>
          <Button className="btn">Action</Button>
          <Button className="btn">Drama</Button>
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
        <Image src={`${_img}${poster}`} alt="IMG" className="img" />
      </li>
    )
  }
}