import {BrowserRouter as Router, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from "./pages/Home";



function App() {
  return (
    <Router>
      <>
      <Navbar />
      <Route exact path='/' render={() => <Home />} />
      </>
    </Router>
  )
}

export default App;
