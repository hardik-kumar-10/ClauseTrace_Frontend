export const SOCKET_EVENTS = {
  // Inbound — server → client
  TRANSCRIPT_SEGMENT: 'transcript:segment',
  ENTITY_EXTRACTED:   'entity:extracted',
  MATCH_HISTORICAL:   'match:historical',
  INCIDENT_STATE:     'incident:state',

  // Outbound — client → server
  JOIN_INCIDENT:  'incident:join',
  LEAVE_INCIDENT: 'incident:leave',

  // Connection lifecycle
  CONNECT:          'connect',
  DISCONNECT:       'disconnect',
  RECONNECT:        'reconnect',
  RECONNECT_ATTEMPT:'reconnect_attempt',
  CONNECT_ERROR:    'connect_error',
}
