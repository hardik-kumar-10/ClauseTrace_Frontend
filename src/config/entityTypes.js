// Central registry for entity types — add new types here only, no other file changes needed.
export const ENTITY_TYPES = {
  ERROR_CODE: {
    label:   'Error Code',
    icon:    '⚠',
    bgClass: 'bg-red-500/10 border border-red-500/30 text-red-400',
    dotClass:'bg-red-400',
  },
  STACK_TRACE: {
    label:   'Stack Trace',
    icon:    '≡',
    bgClass: 'bg-orange-500/10 border border-orange-500/30 text-orange-400',
    dotClass:'bg-orange-400',
  },
  FILE_PATH: {
    label:   'File Path',
    icon:    '/',
    bgClass: 'bg-blue-500/10 border border-blue-500/30 text-blue-400',
    dotClass:'bg-blue-400',
  },
  API_ENDPOINT: {
    label:   'API Endpoint',
    icon:    '⇒',
    bgClass: 'bg-purple-500/10 border border-purple-500/30 text-purple-400',
    dotClass:'bg-purple-400',
  },
  SERVICE_NAME: {
    label:   'Service',
    icon:    '◈',
    bgClass: 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400',
    dotClass:'bg-emerald-400',
  },
}

export const ENTITY_TYPE_KEYS = Object.keys(ENTITY_TYPES)
