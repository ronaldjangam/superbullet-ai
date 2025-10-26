"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Component {
  name: string
  description: string
}

interface KnitScaffoldDialogProps {
  projectId: string
  onServiceCreated?: () => void
}

export function KnitScaffoldDialog({ projectId, onServiceCreated }: KnitScaffoldDialogProps) {
  const [open, setOpen] = useState(false)
  const [serviceName, setServiceName] = useState('')
  const [getComponents, setGetComponents] = useState<Component[]>([{ name: '', description: '' }])
  const [setComponents, setSetComponents] = useState<Component[]>([{ name: '', description: '' }])
  const [otherComponents, setOtherComponents] = useState<Component[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const addComponent = (type: 'get' | 'set' | 'other') => {
    const newComponent = { name: '', description: '' }
    if (type === 'get') setGetComponents([...getComponents, newComponent])
    if (type === 'set') setSetComponents([...setComponents, newComponent])
    if (type === 'other') setOtherComponents([...otherComponents, newComponent])
  }

  const removeComponent = (type: 'get' | 'set' | 'other', index: number) => {
    if (type === 'get') setGetComponents(getComponents.filter((_, i) => i !== index))
    if (type === 'set') setSetComponents(setComponents.filter((_, i) => i !== index))
    if (type === 'other') setOtherComponents(otherComponents.filter((_, i) => i !== index))
  }

  const updateComponent = (
    type: 'get' | 'set' | 'other',
    index: number,
    field: 'name' | 'description',
    value: string
  ) => {
    if (type === 'get') {
      const updated = [...getComponents]
      updated[index][field] = value
      setGetComponents(updated)
    }
    if (type === 'set') {
      const updated = [...setComponents]
      updated[index][field] = value
      setSetComponents(updated)
    }
    if (type === 'other') {
      const updated = [...otherComponents]
      updated[index][field] = value
      setOtherComponents(updated)
    }
  }

  const handleScaffold = async () => {
    console.log('[Knit Scaffold] Starting scaffold process...')
    console.log('[Knit Scaffold] Service name:', serviceName)
    
    if (!serviceName.trim()) {
      console.log('[Knit Scaffold] Service name is empty')
      toast({
        title: 'Service name required',
        description: 'Please enter a service name',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const payload = {
        projectId,
        serviceName,
        components: {
          get: getComponents.filter(c => c.name.trim()),
          set: setComponents.filter(c => c.name.trim()),
          others: otherComponents.filter(c => c.name.trim()),
        },
      }
      
      console.log('[Knit Scaffold] Sending request with payload:', payload)
      
      const response = await fetch('/api/knit/scaffold-service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      console.log('[Knit Scaffold] Response status:', response.status)
      
      const data = await response.json()
      console.log('[Knit Scaffold] Response data:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to scaffold service')
      }

      // Calculate total components
      const totalComponents = 
        getComponents.filter(c => c.name.trim()).length +
        setComponents.filter(c => c.name.trim()).length +
        otherComponents.filter(c => c.name.trim()).length

      toast({
        title: '✅ Service Created Successfully!',
        description: `${serviceName} with ${totalComponents} components (${data.files?.length || 0} files generated)`,
      })

      setOpen(false)
      setServiceName('')
      setGetComponents([{ name: '', description: '' }])
      setSetComponents([{ name: '', description: '' }])
      setOtherComponents([])
      
      console.log('[Knit Scaffold] Calling onServiceCreated callback')
      onServiceCreated?.()
    } catch (error) {
      console.error('[Knit Scaffold] Error:', error)
      toast({
        title: '❌ Error Creating Service',
        description: error instanceof Error ? error.message : 'Failed to create service',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Generate Knit Service
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Scaffold Knit Service</DialogTitle>
          <DialogDescription>
            Auto-generate a Knit service with Get/Set/Others component structure
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Name */}
          <div>
            <Label>Service Name</Label>
            <Input
              placeholder="PlayerService"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            />
          </div>

          {/* Get Components */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Get Components (Read Operations)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addComponent('get')}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {getComponents.map((component, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="GetPlayerData"
                    value={component.name}
                    onChange={(e) => updateComponent('get', index, 'name', e.target.value)}
                  />
                  <Input
                    placeholder="Description (optional)"
                    value={component.description}
                    onChange={(e) => updateComponent('get', index, 'description', e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeComponent('get', index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Set Components */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Set Components (Write Operations)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addComponent('set')}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {setComponents.map((component, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="SetPlayerLevel"
                    value={component.name}
                    onChange={(e) => updateComponent('set', index, 'name', e.target.value)}
                  />
                  <Input
                    placeholder="Description (optional)"
                    value={component.description}
                    onChange={(e) => updateComponent('set', index, 'description', e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeComponent('set', index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Other Components */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Other Components (Specialized)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addComponent('other')}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {otherComponents.map((component, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="DataValidator"
                    value={component.name}
                    onChange={(e) => updateComponent('other', index, 'name', e.target.value)}
                  />
                  <Input
                    placeholder="Description (optional)"
                    value={component.description}
                    onChange={(e) => updateComponent('other', index, 'description', e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeComponent('other', index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScaffold} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Service'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
