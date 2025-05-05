import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventType, setEventType] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/events');
        setEvents(data.data);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = eventType === '' || event.eventType === eventType;
    return matchesSearch && matchesType;
  });

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        await axios.delete(`http://localhost:5000/api/events/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setEvents(events.filter((event) => event._id !== id));
      } catch (err) {
        console.error('Error deleting event:', err);
      }
    }
  };

  return (
    <>
      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={6}>
          <Form.Select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            <option value="">All Event Types</option>
            <option value="Academic">Academic</option>
            <option value="Cultural">Cultural</option>
            <option value="Sports">Sports</option>
            <option value="Technical">Technical</option>
            <option value="Other">Other</option>
          </Form.Select>
        </Col>
      </Row>

      <Row>
        {filteredEvents.map((event) => (
          <Col key={event._id} sm={12} md={6} lg={4} xl={3} className="mb-4">
            <Card>
              <Card.Img
                variant="top"
                src={`http://localhost:5000/uploads/${event.image}`}
                alt={event.title}
              />
              <Card.Body>
                <Card.Title>{event.title}</Card.Title>
                <Card.Text>
                  {event.description.substring(0, 100)}...
                </Card.Text>
                <Card.Text>
                  <small className="text-muted">
                    Type: {event.eventType}
                  </small>
                </Card.Text>
                <Card.Text>
                  <small className="text-muted">
                    Date: {new Date(event.date).toLocaleDateString()}
                  </small>
                </Card.Text>
                <div className="d-flex justify-content-between">
                  <Link to={`/event/${event._id}`}>
                    <Button variant="primary" size="sm">
                      View Details
                    </Button>
                  </Link>
                  {event.createdBy === JSON.parse(localStorage.getItem('user'))?._id && (
                    <>
                      <Link to={`/edit-event/${event._id}`}>
                        <Button variant="warning" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteHandler(event._id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Home; 