import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Dialog, { DialogButton } from './Dialog'
import { tw } from '../theme'
import { addI18nNamespace } from '../lib/i18n'

const I18N_NS = 'alert'

addI18nNamespace(I18N_NS, {
  'en-US': {
    confirm: 'Confirm',
  },
  'zh-CN': {
    confirm: '确定',
  },
})

export interface AlertOptions {
  title: string
  message?: string
  confirmText?: string
}

let showAlertFn: ((options: AlertOptions) => Promise<void>) | null = null

export function alert(options: AlertOptions): Promise<void> {
  if (showAlertFn) {
    return showAlertFn(options)
  }
  return Promise.reject(new Error('Alert provider not mounted'))
}

interface AlertProviderProps {
  children: React.ReactNode
}

export function AlertProvider({ children }: AlertProviderProps) {
  const { t } = useTranslation(I18N_NS)
  const [alertState, setAlertState] = useState<AlertOptions | null>(null)
  const [resolver, setResolver] = useState<(() => void) | null>(null)

  showAlertFn = (options: AlertOptions) => {
    return new Promise<void>((resolve) => {
      setAlertState(options)
      setResolver(() => resolve)
    })
  }

  const handleClose = () => {
    if (resolver) {
      resolver()
    }
    setAlertState(null)
    setResolver(null)
  }

  return (
    <>
      {children}
      {alertState && (
        <Dialog open={true} onClose={handleClose} title={alertState.title}>
          {alertState.message && (
            <p className={`text-sm ${tw.text.secondary} mb-6`}>
              {alertState.message}
            </p>
          )}
          <div className="flex justify-end">
            <DialogButton onClick={handleClose}>
              {alertState.confirmText || t('confirm')}
            </DialogButton>
          </div>
        </Dialog>
      )}
    </>
  )
}
