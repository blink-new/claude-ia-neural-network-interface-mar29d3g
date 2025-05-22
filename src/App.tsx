import { Toaster } from 'sonner'
import Header from './components/Header'
import Chat from './components/Chat'
import { ThemeProvider } from './components/ThemeProvider'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="claude-theme">
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
          <Chat />
        </main>
        <footer className="py-4 text-center text-sm text-muted-foreground">
          <div className="container mx-auto">
            Claude AI Interface &copy; {new Date().getFullYear()}
          </div>
        </footer>
        <Toaster />
      </div>
    </ThemeProvider>
  )
}

export default App