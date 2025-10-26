export interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  path: string
  children?: FileNode[]
}

export interface RobloxProjectStructure {
  ServerScriptService: FileNode
  ServerStorage: FileNode
  ReplicatedStorage: FileNode
  StarterPlayer: FileNode
  StarterGui: FileNode
  StarterPack: FileNode
  Workspace: FileNode
}

export const DEFAULT_ROBLOX_STRUCTURE: RobloxProjectStructure = {
  ServerScriptService: {
    id: 'server-script-service',
    name: 'ServerScriptService',
    type: 'folder',
    path: 'ServerScriptService',
    children: [],
  },
  ServerStorage: {
    id: 'server-storage',
    name: 'ServerStorage',
    type: 'folder',
    path: 'ServerStorage',
    children: [],
  },
  ReplicatedStorage: {
    id: 'replicated-storage',
    name: 'ReplicatedStorage',
    type: 'folder',
    path: 'ReplicatedStorage',
    children: [
      {
        id: 'knit',
        name: 'Knit',
        type: 'folder',
        path: 'ReplicatedStorage/Knit',
        children: [],
      },
    ],
  },
  StarterPlayer: {
    id: 'starter-player',
    name: 'StarterPlayer',
    type: 'folder',
    path: 'StarterPlayer',
    children: [
      {
        id: 'starter-player-scripts',
        name: 'StarterPlayerScripts',
        type: 'folder',
        path: 'StarterPlayer/StarterPlayerScripts',
        children: [],
      },
      {
        id: 'starter-character-scripts',
        name: 'StarterCharacterScripts',
        type: 'folder',
        path: 'StarterPlayer/StarterCharacterScripts',
        children: [],
      },
    ],
  },
  StarterGui: {
    id: 'starter-gui',
    name: 'StarterGui',
    type: 'folder',
    path: 'StarterGui',
    children: [],
  },
  StarterPack: {
    id: 'starter-pack',
    name: 'StarterPack',
    type: 'folder',
    path: 'StarterPack',
    children: [],
  },
  Workspace: {
    id: 'workspace',
    name: 'Workspace',
    type: 'folder',
    path: 'Workspace',
    children: [],
  },
}

export function createKnitServiceStructure(serviceName: string): FileNode {
  return {
    id: `${serviceName.toLowerCase()}-service`,
    name: serviceName,
    type: 'folder',
    path: `ServerScriptService/${serviceName}`,
    children: [
      {
        id: `${serviceName.toLowerCase()}-init`,
        name: 'init.lua',
        type: 'file',
        path: `ServerScriptService/${serviceName}/init.lua`,
      },
      {
        id: `${serviceName.toLowerCase()}-components`,
        name: 'Components',
        type: 'folder',
        path: `ServerScriptService/${serviceName}/Components`,
        children: [
          {
            id: `${serviceName.toLowerCase()}-get`,
            name: 'Get().lua',
            type: 'file',
            path: `ServerScriptService/${serviceName}/Components/Get().lua`,
          },
          {
            id: `${serviceName.toLowerCase()}-set`,
            name: 'Set().lua',
            type: 'file',
            path: `ServerScriptService/${serviceName}/Components/Set().lua`,
          },
          {
            id: `${serviceName.toLowerCase()}-others`,
            name: 'Others',
            type: 'folder',
            path: `ServerScriptService/${serviceName}/Components/Others`,
            children: [],
          },
        ],
      },
    ],
  }
}
