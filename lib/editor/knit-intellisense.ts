/**
 * Knit Framework IntelliSense Support
 * Provides autocomplete and type hints for Roblox Knit services
 */

import type * as Monaco from 'monaco-editor'

export interface KnitMethod {
  name: string
  signature: string
  description: string
  returnType?: string
  params?: Array<{
    name: string
    type: string
    description?: string
  }>
}

export interface KnitService {
  name: string
  methods: KnitMethod[]
  description?: string
}

/**
 * Standard Knit Framework API definitions
 */
export const KNIT_CORE_API: KnitMethod[] = [
  {
    name: 'CreateService',
    signature: 'Knit.CreateService(serviceDefinition: table): Service',
    description: 'Creates a new Knit service',
    returnType: 'Service',
    params: [
      {
        name: 'serviceDefinition',
        type: 'table',
        description: 'Table containing Name, Client, and other service properties'
      }
    ]
  },
  {
    name: 'CreateController',
    signature: 'Knit.CreateController(controllerDefinition: table): Controller',
    description: 'Creates a new Knit controller (client-side)',
    returnType: 'Controller',
    params: [
      {
        name: 'controllerDefinition',
        type: 'table',
        description: 'Table containing Name and other controller properties'
      }
    ]
  },
  {
    name: 'GetService',
    signature: 'Knit.GetService(serviceName: string): Service',
    description: 'Gets a Knit service by name',
    returnType: 'Service',
    params: [
      {
        name: 'serviceName',
        type: 'string',
        description: 'The name of the service to retrieve'
      }
    ]
  },
  {
    name: 'Start',
    signature: 'Knit.Start(): Promise',
    description: 'Starts all Knit services and controllers',
    returnType: 'Promise',
  },
  {
    name: 'OnStart',
    signature: 'Knit.OnStart(): Promise',
    description: 'Returns a promise that resolves when Knit has started',
    returnType: 'Promise',
  }
]

/**
 * Generate Monaco editor autocomplete suggestions for Knit
 */
export function generateKnitCompletions(
  monaco: typeof Monaco,
  services: KnitService[] = []
): Monaco.languages.CompletionItem[] {
  const completions: Monaco.languages.CompletionItem[] = []

  // Add core Knit API completions
  KNIT_CORE_API.forEach((method, index) => {
    completions.push({
      label: method.name,
      kind: monaco.languages.CompletionItemKind.Method,
      documentation: method.description,
      detail: method.signature,
      insertText: `${method.name}($1)`,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: undefined as any, // Will be provided by Monaco
      sortText: `0${index}`, // Sort core API first,
    })
  })

  // Add project-specific service completions
  services.forEach((service, serviceIndex) => {
    // Service name completion
    completions.push({
      label: service.name,
      kind: monaco.languages.CompletionItemKind.Class,
      documentation: service.description || `Knit service: ${service.name}`,
      detail: `Service`,
      insertText: service.name,
      range: undefined as any,
      sortText: `1${serviceIndex}`,
    })

    // Service methods
    service.methods.forEach((method, methodIndex) => {
      completions.push({
        label: `${service.name}.${method.name}`,
        kind: monaco.languages.CompletionItemKind.Method,
        documentation: method.description,
        detail: method.signature,
        insertText: `${service.name}.${method.name}($1)`,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: undefined as any,
        sortText: `2${serviceIndex}${methodIndex}`,
      })
    })
  })

  return completions
}

/**
 * Register Knit IntelliSense for Monaco editor
 */
export function registerKnitIntelliSense(
  monaco: typeof Monaco,
  services: KnitService[] = []
) {
  // Register completion provider for Lua
  monaco.languages.registerCompletionItemProvider('lua', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }

      const suggestions = generateKnitCompletions(monaco, services).map(item => ({
        ...item,
        range,
      }))

      return { suggestions }
    },
  })

  // Register hover provider for documentation
  monaco.languages.registerHoverProvider('lua', {
    provideHover: (model, position) => {
      const word = model.getWordAtPosition(position)
      if (!word) return null

      // Find matching method in core API
      const coreMethod = KNIT_CORE_API.find(m => m.name === word.word)
      if (coreMethod) {
        return {
          range: new monaco.Range(
            position.lineNumber,
            word.startColumn,
            position.lineNumber,
            word.endColumn
          ),
          contents: [
            { value: `**${coreMethod.signature}**` },
            { value: coreMethod.description },
            ...(coreMethod.params?.map(p => ({
              value: `- \`${p.name}\` (${p.type}): ${p.description || ''}`
            })) || [])
          ]
        }
      }

      // Find matching service/method
      for (const service of services) {
        if (service.name === word.word) {
          return {
            range: new monaco.Range(
              position.lineNumber,
              word.startColumn,
              position.lineNumber,
              word.endColumn
            ),
            contents: [
              { value: `**Service: ${service.name}**` },
              { value: service.description || '' }
            ]
          }
        }

        const method = service.methods.find(m => m.name === word.word)
        if (method) {
          return {
            range: new monaco.Range(
              position.lineNumber,
              word.startColumn,
              position.lineNumber,
              word.endColumn
            ),
            contents: [
              { value: `**${method.signature}**` },
              { value: method.description }
            ]
          }
        }
      }

      return null
    }
  })

  // Add Lua language configuration
  monaco.languages.setLanguageConfiguration('lua', {
    comments: {
      lineComment: '--',
      blockComment: ['--[[', ']]']
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')']
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ],
    folding: {
      markers: {
        start: new RegExp('^\\s*--\\s*#?region\\b'),
        end: new RegExp('^\\s*--\\s*#?endregion\\b')
      }
    }
  })
}

/**
 * Extract services from project for IntelliSense
 */
export function extractServicesFromProject(files: Array<{ path: string; content: string }>): KnitService[] {
  const services: KnitService[] = []

  files.forEach(file => {
    // Check if this is a service init file
    if (file.path.endsWith('/init.lua') && file.path.includes('ServerScriptService/')) {
      const serviceName = file.path.split('/').slice(-2, -1)[0]
      
      // Extract methods from the file content
      const methods: KnitMethod[] = []
      
      // Simple regex to find function definitions
      const functionPattern = /function\s+\w+[:.](\w+)\s*\((.*?)\)/g
      let match
      
      while ((match = functionPattern.exec(file.content)) !== null) {
        methods.push({
          name: match[1],
          signature: `${serviceName}.${match[1]}(${match[2]})`,
          description: `Method of ${serviceName}`,
        })
      }

      services.push({
        name: serviceName,
        methods,
        description: `Knit service: ${serviceName}`
      })
    }
  })

  return services
}
