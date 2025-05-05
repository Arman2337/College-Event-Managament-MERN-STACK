import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EventForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      const fetchEvent = async () => {
        try {
          const { data } = await axios.get(`http://localhost:5000/api/events/${id}`);
          setTitle(data.data.title);
          setDescription(data.data.description);
          setEventType(data.data.eventType);
          setDate(new Date(data.data.date).toISOString().split('T')[0]);
          setVenue(data.data.venue);
        } catch (err) {
          setError('Error fetching event details');
        }
      };
      fetchEvent();
    }
  }, [id, isEdit]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('eventType', eventType);
      formData.append('date', date);
      formData.append('venue', venue);
      if (image) {
        formData.append('image', image);
      }

      const user = JSON.parse(localStorage.getItem('user'));
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`
        }
      };

      if (isEdit) {
        await axios.put(`http://localhost:5000/api/events/${id}`, formData, config);
      } else {
        await axios.post('http://localhost:5000/api/events', formData, config);
      }

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
    setLoading(false);
  };

  return (
    <Row className="justify-content-md-center">
      <Col xs={12} md={8}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">
              {isEdit ? 'Edit Event' : 'Create Event'}
            </h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter event title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter event description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Event Type</Form.Label>
                <Form.Select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  required
                >
                  <option value="">Select Event Type</option>
                  <option value="Academic">Academic</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Technical">Technical</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Venue</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter venue"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  accept="image/*"
                  required={!isEdit}
                />
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="w-100"
                disabled={loading}
              >
                {loading ? 'Processing...' : isEdit ? 'Update Event' : 'Create Event'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default EventForm; 