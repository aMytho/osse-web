/**
 * A successful auth response.
 */
export interface AuthResponse {
  id: number,
  username: string,
  /**
   * Used to access the reverb server.
   */
  broadcastKey: string
}
