import React, { useState } from 'react'
import { Offline, Online } from 'react-detect-offline'
import { Tabs, AutoComplete, Alert } from 'antd'

import ItemList from '../item-list'

import './app.css'

function App() {
  const [options, setOptions] = useState([])

  // eslint-disable-next-line class-methods-use-this
  const onChange = () => {}

  const handleSearch = (value) => {
    let res = []
    if (!value || value.indexOf('@') >= 0) {
      res = []
    } else {
      res = ['gmail.com', '163.com', 'qq.com'].map((domain) => ({
        value,
        label: `${value}@${domain}`,
      }))
    }
    setOptions(res)
  }

  const search = (
    <>
      <AutoComplete
        className="autoComplete"
        onSearch={handleSearch}
        placeholder="Type to search..."
        options={options}
      />
      <ItemList />
    </>
  )

  const items = [
    { key: '1', label: 'Search', children: search },
    { key: '2', label: 'Rated', children: 'Rated' },
  ]

  return (
    <>
      <Online>
        <div className="container">
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>
      </Online>
      <Offline>
        <Alert message="You are offline right now. Check your connection." type="error" showIcon />
      </Offline>
    </>
  )
}

export default App
