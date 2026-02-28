import { sileo } from "sileo"

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'action' | 'login'

interface ToastOptions {
  title: string
  icon?: string
  type?: ToastType
  description?: string
  button?: {title: string, onClick: () => void}
  style?: {fill: string, title: string, description: string, badge: string, button: string}
}

export function useToast() {
  const toast = {
    success: (options: ToastOptions) => {
      sileo.success({
        title: options.title,
        description: options.description,
        icon: options.icon
      })
    },
    
    error: (options: ToastOptions) => {
      sileo.error({
        title: options.title,
        description: options.description,
        icon: options.icon
      })
    },
    
    warning: (options: ToastOptions) => {
      sileo.warning({
        title: options.title,
        icon: options.icon,
        description: options.description,
      })
    },
    
    info: (options: ToastOptions) => {
      sileo.info({
        title: options.title,
        description: options.description , 
        icon: options.icon
      })
    },

    action: (options: ToastOptions) => {
      sileo.action({
        title: options.title,
        description: options.description,
        button: options.button || {title: 'Action', onClick: () => {}},
        styles: options.style || {},
        fill: options.style?.fill || '',
        icon: options.icon
      })
    },

    promise: (promise: Promise<any>, options: ToastOptions) => {
      sileo.promise(promise, {
        loading: {title: options.title},
        success: {title: options.title},
        error: {title: options.title},
      })
    },
  }

  return { toast }
}

// Helper functions for quick access
export const toast = {
  success: (title: string, description?: string, icon?: string) => 
    sileo.success({ title, description, icon }),
  
  error: (title: string, description?: string, icon?: string) => 
    sileo.error({ title, description, icon }),
  
  warning: (title: string, description?: string, icon?: string) => 
    sileo.warning({ title, description, icon }),
  
  info: (title: string, description?: string, icon?: string) => 
    sileo.info({ title, description, icon }),

  action: (title: string, description?: string, button?: {title?: string, onClick?: () => void}, options?: ToastOptions, icon?: string) => 
    sileo.action({ 
      title, description,
      fill: options?.style?.fill || '',
      button:{title: button?.title || 'Action', onClick: button?.onClick || (() => {})}, 
      styles: options?.style || {},
      icon: icon
    }),

  promise: (promise: Promise<any>, messages?: {loading?: string, success?: string, error?: string}) => {
    sileo.promise(promise, {
      loading: {title: messages?.loading || "Cargando..."},
      success: {title: messages?.success || "Completado"},
      error: {title: messages?.error || "Error"},
    })
  },

  dismiss: (id:string) => sileo.dismiss(id),
  clear: (position: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right") => sileo.clear(position),
}