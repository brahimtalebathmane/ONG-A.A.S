import { supabase } from '../lib/supabase'

class KeepAliveService {
  private intervalId: NodeJS.Timeout | null = null
  private readonly PING_INTERVAL = 10 * 60 * 1000 // 10 minutes in milliseconds
  private isRunning = false

  /**
   * Start the keep-alive service
   */
  start(): void {
    if (this.isRunning) {
      return
    }

    this.isRunning = true
    
    // Send initial ping
    this.ping()
    
    // Set up recurring pings
    this.intervalId = setInterval(() => {
      this.ping()
    }, this.PING_INTERVAL)

    console.log('🔄 Supabase keep-alive service started (10 minute intervals)')
  }

  /**
   * Stop the keep-alive service
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    
    this.isRunning = false
    console.log('⏹️ Supabase keep-alive service stopped')
  }

  /**
   * Send a ping request to keep Supabase active
   */
  private async ping(): Promise<void> {
    try {
      // Make a simple query to the users table (just count, no data)
      const { error } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .limit(1)

      if (error) {
        console.warn('⚠️ Keep-alive ping failed:', error.message)
      } else {
        console.log('✅ Keep-alive ping successful at', new Date().toLocaleTimeString())
      }
    } catch (error) {
      console.warn('⚠️ Keep-alive ping error:', error)
    }
  }

  /**
   * Get service status
   */
  isActive(): boolean {
    return this.isRunning
  }
}

// Create singleton instance
export const keepAliveService = new KeepAliveService()

// Auto-start the service when the module is imported
if (typeof window !== 'undefined') {
  // Only run in browser environment
  keepAliveService.start()
}