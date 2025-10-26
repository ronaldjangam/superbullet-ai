export function useToast() {
  return {
    toast: (props: {
      title?: string
      description?: string
      variant?: 'default' | 'destructive'
    }) => {
      // Simple alert implementation for now
      // TODO: Replace with proper toast library in future
      const message = `${props.title}${props.description ? '\n' + props.description : ''}`
      if (props.variant === 'destructive') {
        alert('Error: ' + message)
      } else {
        alert(message)
      }
    },
  }
}
