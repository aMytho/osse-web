/**
 * A successful auth response.
 */
export interface AuthResponse {
  /**
   * User ID
   */
  id: number,
  username: string,
  /**
   * Auth for reverb server.
   */
  broadcastKey: string
  /**
   * Used to access the reverb server.
  */
  broadcastHost: string;
  /**
   * Used to access the reverb server.
  */
  broadcastPort: string;
}
