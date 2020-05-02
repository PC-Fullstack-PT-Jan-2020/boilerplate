import React from 'react';
import { useExample } from '../hooks'
export default () => {
  const { example, syncaction, asyncaction, reset } = useExample()
  return (
    <div>
      <h2>{example}</h2>
      <button onClick={() => asyncaction()}>asynchronous action</button>
      <button onClick={() => syncaction()}>synchronous action</button>
      <button onClick={() => reset()}>reset example state</button>
    </div>
  )
}