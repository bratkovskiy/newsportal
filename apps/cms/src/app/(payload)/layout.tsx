import { default as configPromise } from '../../payload.config'
import '@payloadcms/next/css'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './admin/importMap'

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout
      config={configPromise}
      importMap={importMap}
      serverFunction={async (args) => {
        'use server'
        return handleServerFunctions({
          ...args,
          config: configPromise,
          importMap,
        })
      }}
    >
      {children}
    </RootLayout>
  )
}
