import React, { useContext, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Alert from '../Common/Alert/Alert';
import UserContext from '../Auth/UserContext';
import Elimibug from '../../api/api';

function BugForm() {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    project: '',
    bugName: '',
    description: '',
  });
  const [selectedClient, setSelectedClient] = useState('low');

  const [formErrors, setFormErrors] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();

    let data = {
      ...formData,
      user_id: currentUser.id,
      priority: selectedClient,
    };

    let result = await Elimibug.newBug(data);
    console.log(result);
    if (result.id) {
      navigate('/bugs');
    } else {
      setFormErrors(result.e);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  }

  function handleSelectChange(e) {
    setSelectedClient(e.target.value);
  }

  return (
    <div className="NewBugForm">
      <Container className="col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h2 className="mb-3">New Bug</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicProject">
            <Form.Control
              name="project"
              type="text"
              placeholder="Project"
              value={formData.project}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicBugName">
            <Form.Control
              type="text"
              placeholder="Bug Name"
              name="bugName"
              value={formData.bugName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicDescription">
            <Form.Control
              as="textarea"
              rows={3}
              type="textarea"
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPriority">
            <Form.Label>Priority</Form.Label>
            <Form.Select
              onChange={handleSelectChange}
              value={selectedClient}
              aria-label="Priority"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Form.Select>
          </Form.Group>

          {formErrors.length ? (
            <Alert type="danger" messages={formErrors} />
          ) : null}

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
    </div>
  );
}

export default BugForm;
