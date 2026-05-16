import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Dialog, { DialogButton } from './Dialog'
import TextInput from './TextInput'
import { tw } from '../theme'
import { addI18nNamespace } from '../lib/i18n'

const I18N_NS = 'prompt'

addI18nNamespace(I18N_NS, {
  'en-US': {
    confirm: 'Confirm',
    cancel: 'Cancel',
  },
  'zh-CN': {
    confirm: '确定',
    cancel: '取消',
  },
})

export interface PromptOptions {
  title: string
  message?: string
  defaultValue?: string
  placeholder?: string
  confirmText?: string
  cancelText?: string
  inputType?: 'text' | 'password'
}

let showPromptFn: ((options: PromptOptions) => Promise<string | null>) | null =
  null

export function prompt(options: PromptOptions): Promise<string | null> {
  if (showPromptFn) {
    return showPromptFn(options)
  }
  return Promise.reject(new Error('Prompt provider not mounted'))
}

interface PromptProviderProps {
  children: React.ReactNode
}

export function PromptProvider({ children }: PromptProviderProps) {
  const { t } = useTranslation(I18N_NS)
  const [promptState, setPromptState] = useState<PromptOptions | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [resolver, setResolver] = useState<
    ((value: string | null) => void) | null
  >(null)

  showPromptFn = (options: PromptOptions) => {
    return new Promise<string | null>((resolve) => {
      setPromptState(options)
      setInputValue(options.defaultValue || '')
      setResolver(() => resolve)
    })
  }

  const handleConfirm = () => {
    if (resolver) {
      resolver(inputValue.trim() || null)
    }
    setPromptState(null)
    setInputValue('')
    setResolver(null)
  }

  const handleCancel = () => {
    if (resolver) {
      resolver(null)
    }
    setPromptState(null)
    setInputValue('')
    setResolver(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleConfirm()
    }
  }

  return (
    <>
      {children}
      {promptState && (
        <Dialog open={true} onClose={handleCancel} title={promptState.title}>
          {promptState.message && (
            <p className={`text-sm ${tw.text.secondary} mb-3`}>
              {promptState.message}
            </p>
          )}
          <TextInput
            type={promptState.inputType || 'text'}
            className="mb-6"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={promptState.placeholder}
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <DialogButton variant="text" onClick={handleCancel}>
              {promptState.cancelText || t('cancel')}
            </DialogButton>
            <DialogButton onClick={handleConfirm} disabled={!inputValue.trim()}>
              {promptState.confirmText || t('confirm')}
            </DialogButton>
          </div>
        </Dialog>
      )}
    </>
  )
}
