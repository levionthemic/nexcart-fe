import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'

import './globals.css'
import PersistProvider from '@/components/providers/persist-provider'
import { SocketProvider } from '@/components/providers/socket-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { LoadingProvider } from '@/contexts/loading-context'

const roboto = Roboto({
  variable: '--roboto',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'NexCart',
  description: 'Powerful e-commerce platform for modern businesses',
  icons: {
    icon: '/webicon.svg'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning className='custom-scrollbar p-0'>
      <body className={roboto.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <PersistProvider>
            <SocketProvider>
              <LoadingProvider>{children}</LoadingProvider>
            </SocketProvider>
          </PersistProvider>
          <Toaster richColors={true} />
        </ThemeProvider>
      </body>
    </html>
  )
}
