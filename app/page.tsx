'use client'

import { useState } from 'react'

export default function Home() {
  const [messages, setMessages] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [conversationID] = useState(new Uint32Array(Float64Array.of(Math.random()).buffer)[0].toString())

  const sendMessage = async () => {
    setMessages([...messages, message])
    setMessage('')
    const response = await fetch('/api/sendMessage', {
      method: 'POST',
      body: JSON.stringify({ message, conversationID }),
    })
    await readStream(response.body, text => setMessages([...messages, message, text]))
  }

  return (
    <main className='flex flex-col h-screen gap-4 p-4 overflow-y-auto max-w-prose'>
      {messages.map((message, index) => <div key={index}>{index % 2 ? 'Assistant' : 'You'}: {message}</div>)}
      <input className='p-2 rounded' value={message} onChange={event => setMessage(event.target.value)} />
      <button className='p-2 text-white bg-blue-500 rounded' onClick={sendMessage}>Send Message</button>
    </main>
  )
}

const readStream = async (stream: ReadableStream<Uint8Array> | null, callback: (text: string) => void) => {
  const reader = stream?.getReader()
  const decoder = new TextDecoder()
  let result, text = ''
  while (reader && !result?.done) {
    result = await reader.read()
    callback(text += decoder.decode(result.value))
  }
}
