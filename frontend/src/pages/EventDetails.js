import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(data.data);
      } catch (err) {
        setError('Error fetching event details');
      }
    };

    fetchEvent();
  }, [id]);

  const deleteHandler = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        navigate('/');
      } catch (err) {
        setError('Error deleting event');
      }
    }
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <Row className="justify-content-md-center">
      <Col xs={12} md={8}>
        <Card>
          <Card.Img
            variant="top"
            src={`http://localhost:5000/uploads/${event.image}`}
            alt={event.title}
          />
          <Card.Body>
            <Card.Title className="h2">{event.title}</Card.Title>
            <Card.Text className="text-muted">
              Type: {event.eventType}
            </Card.Text>
            <Card.Text className="text-muted">
              Date: {new Date(event.date).toLocaleDateString()}
            </Card.Text>
            <Card.Text className="text-muted">
              Venue: {event.venue}
            </Card.Text>
            <Card.Text>{event.description}</Card.Text>
            {event.createdBy === user?._id && (
              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="warning"
                  onClick={() => navigate(`/edit-event/${event._id}`)}
                >
                  Edit
                </Button>
                <Button variant="danger" onClick={deleteHandler}>
                  Delete
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default EventDetails; 