'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { QrCodeIcon, ClipboardDocumentIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  amount: number
  participant: string
}

export function PaymentModal({ isOpen, onClose, onSuccess, amount, participant }: PaymentModalProps) {
  const [copied, setCopied] = useState(false)
  
  // Em uma aplicação real, esses dados viriam da configuração do torneio
  const pixData = {
    key: '123.456.789-00',
    name: 'Arena Beach Tennis',
    city: 'São Paulo',
    // Em produção, esse QR code seria gerado dinamicamente com os dados do pagamento
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020126580014BR.GOV.BCB.PIX0136123456789-001234567893333015Arena%20Beach%20Tennis5204000053039865802BR5913John%20Doe6008Sao%20Paulo62070503***6304E2CA'
  }

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixData.key)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Fechar</span>
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                    <QrCodeIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Pagamento via PIX
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Valor a pagar: <span className="font-semibold">R$ {amount.toFixed(2)}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Participante: <span className="font-semibold">{participant}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col items-center">
                  <img 
                    src={pixData.qrCodeUrl} 
                    alt="QR Code PIX" 
                    className="w-48 h-48 border border-gray-200 rounded-lg"
                  />
                  
                  <div className="mt-4 w-full">
                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Chave PIX</p>
                          <p className="text-sm text-gray-500">{pixData.key}</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyPix}
                          className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          {copied ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <ClipboardDocumentIcon className="h-5 w-5 text-gray-400" />
                          )}
                          <span className="ml-2">{copied ? 'Copiado!' : 'Copiar'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Nome:</span> {pixData.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Cidade:</span> {pixData.city}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500 text-center mb-4">
                    Após o pagamento, envie o comprovante para o organizador do torneio.
                  </p>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mr-2"
                      onClick={onClose}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
                      onClick={() => {
                        onSuccess();
                        onClose();
                      }}
                    >
                      Confirmar Pagamento
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
