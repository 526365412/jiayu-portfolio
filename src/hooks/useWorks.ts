import { useState, useEffect } from 'react'
import type { WorksData, Work, Category } from '../types'

export function useWorks() {
  const [data, setData] = useState<WorksData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/data/works.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load works data')
        return res.json()
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const getWorksByCategory = (category: Category): Work[] => {
    if (!data) return []
    return data.works
      .filter(w => w.category === category)
      .sort((a, b) => a.order - b.order)
  }

  return { data, loading, error, getWorksByCategory }
}
