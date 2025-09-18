import { useState, useEffect } from 'react'
import { supabase, CallData } from '@/lib/supabase'

export const useCalls = () => {
  const [calls, setCalls] = useState<CallData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const { data, error: fetchError } = await supabase
          .from('calls') // Replace 'calls' with your actual table name
          .select('*')
          .order('created_at', { ascending: false })

        if (fetchError) {
          throw fetchError
        }

        setCalls(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch calls')
        console.error('Error fetching calls:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCalls()
  }, [])

  return { calls, loading, error }
}

export const useCallsByManager = (managerName?: string) => {
  const [calls, setCalls] = useState<CallData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        setLoading(true)
        setError(null)
        
        let query = supabase
          .from('calls') // Replace 'calls' with your actual table name
          .select('*')
          .order('created_at', { ascending: false })

        if (managerName && managerName !== 'all') {
          query = query.eq('manager_name', managerName)
        }

        const { data, error: fetchError } = await query

        if (fetchError) {
          throw fetchError
        }

        setCalls(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch calls')
        console.error('Error fetching calls:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCalls()
  }, [managerName])

  return { calls, loading, error }
}
