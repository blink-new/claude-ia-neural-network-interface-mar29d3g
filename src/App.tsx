import { Toaster } from "sonner";
import Header from "./components/Header";
import Chat from "./components/Chat";
import { ThemeProvider } from "./components/ThemeProvider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col pt-16">
          <div className="flex flex-1 overflow-hidden">
            <div className="flex flex-1 flex-col">
              <Chat />
            </div>
          </div>
        </main>
      </div>
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}

export default App;