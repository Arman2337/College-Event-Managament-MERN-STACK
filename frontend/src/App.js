import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventForm from './pages/EventForm';
import EventDetails from './pages/EventDetails';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Header />
      <Container className="py-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route
            path="/create-event"
            element={
              <PrivateRoute>
                <EventForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-event/:id"
            element={
              <PrivateRoute>
                <EventForm />
              </PrivateRoute>
            }
          />
        </Routes>
      </Container>
    </Router>
  );
}

export default App; 