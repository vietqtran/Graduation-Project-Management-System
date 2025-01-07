'use client'

import { persistor, store } from '@/store'

import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const StoreProvider = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}

export default StoreProvider
