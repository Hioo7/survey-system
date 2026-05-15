import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const isDev = process.env.NODE_ENV === 'development'

export function usePWAInstall() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches
  )
  const [isInstalling, setIsInstalling] = useState(false)

  useEffect(() => {
    if (isDev) return

    const onPrompt = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
    }

    const onInstalled = () => {
      setIsInstalled(true)
      setPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const install = async (): Promise<boolean> => {
    if (isDev) {
      setIsInstalling(true)
      await new Promise((r) => setTimeout(r, 900))
      setIsInstalling(false)
      setIsInstalled(true)
      return true
    }
    if (!prompt) return false
    setIsInstalling(true)
    try {
      await prompt.prompt()
      const { outcome } = await prompt.userChoice
      if (outcome === 'accepted') {
        setPrompt(null)
        return true
      }
      return false
    } finally {
      setIsInstalling(false)
    }
  }

  return {
    canInstall: isDev ? !isInstalled : !!prompt && !isInstalled,
    isInstalled,
    isInstalling,
    install,
  }
}
