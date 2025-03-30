import React from 'react';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Quiz from './components/Quiz';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Quiz />
      </div>
    </AuthProvider>
  );
}

export default App;