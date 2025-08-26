import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Tasks from './components/Tasks';
import Conference from './components/Conference';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Tasks />} />
            <Route path="/video-room/:id" element={<Conference />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;