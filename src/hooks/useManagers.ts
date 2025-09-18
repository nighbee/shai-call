import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export const useManagers = () => {
  const [managers, setManagers] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const { data, error: fetchError } = await supabase
          .from('calls') // Replace 'calls' with your actual table name
          .select('manager_name')
          .not('manager_name', 'is', null)

        if (fetchError) {
          throw fetchError
        }

        // Extract unique manager names
        const uniqueManagers = Array.from(
          new Set(data?.map(item => item.manager_name) || [])
        )
        
        setManagers(uniqueManagers)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch managers')
        console.error('Error fetching managers:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchManagers()
  }, [])

  return { managers, loading, error }
}
