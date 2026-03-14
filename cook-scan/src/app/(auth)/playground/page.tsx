import { Metadata } from 'next'
import { PlaygroundClient } from './playground-client'

export const metadata: Metadata = {
  title: 'API Playground',
}

export default function PlaygroundPage() {
  return <PlaygroundClient />
}
