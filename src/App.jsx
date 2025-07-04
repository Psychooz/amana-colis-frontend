import { BrowserRouter as Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LoggedInRoute from './Routes/LoggedInRoute'
import Dashboard from './components/Dashboard'

function App() {

  return (
    <>
    <Route>
      <AuthProvider>
        <div className="App">
          <LoggedInRoute>
            <Dashboard />
          </LoggedInRoute>
        </div>
      </AuthProvider>
    </Route>
    </>
  )
}

export default App
