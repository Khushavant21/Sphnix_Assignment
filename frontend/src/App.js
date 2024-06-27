// src/App.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';
import Cube3D from './Cube3D';
import './App.css';

const CubeList = () => {
  const [cubes, setCubes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5252/cubes')
      .then(response => setCubes(response.data))
      .catch(error => console.error('There was an error fetching the cubes!', error));
  }, []);

  return (
    <div className="container">
      <h1>Cube List</h1>
      <Link to="/add-cube" className="link">Add New Cube</Link>
      <ul>
        {cubes.map(cube => (
          <li key={cube.id}>
            <Link to={`/cube/${cube.id}`} className="link">Cube ID: {cube.id}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CubeDetail = () => {
  const { id } = useParams();
  const [cube, setCube] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5252/cube/${id}`)
      .then(response => setCube(response.data))
      .catch(error => console.error('There was an error fetching the cube!', error));
  }, [id]);

  const handleDelete = () => {
    axios.delete(`http://localhost:5252/cube/${id}`)
      .then(() => navigate('/'))
      .catch(error => console.error('There was an error deleting the cube!', error));
  };

  if (!cube) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>Cube Detail</h1>
      <p>ID: {cube.id}</p>
      <p>Width: {cube.width}</p>
      <p>Height: {cube.height}</p>
      <p>Length: {cube.length}</p>
      <p>Weight: {cube.weight}</p>
      <Cube3D width={cube.width} height={cube.height} length={cube.length} />
      <Link to={`/edit-cube/${cube.id}`} className="link">Edit</Link>
      <button onClick={handleDelete} className="button">Delete</button>
      <Link to="/" className="link">Back to List</Link>
    </div>
  );
};

const CubeForm = () => {
  const { id } = useParams();
  const [cube, setCube] = useState({ width: '', height: '', length: '', weight: '' });
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      axios.get(`http://localhost:5252/cube/${id}`)
        .then(response => setCube(response.data))
        .catch(error => console.error('There was an error fetching the cube!', error));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCube(prevCube => ({ ...prevCube, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const request = isEdit
      ? axios.put(`http://localhost:5252/cube/${id}`, cube)
      : axios.post('http://localhost:5252/cube', cube);

    request
      .then(() => navigate('/'))
      .catch(error => console.error('There was an error saving the cube!', error));
  };

  return (
    <div className="container">
      <h1>{isEdit ? 'Edit Cube' : 'Add Cube'}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Width:
          <input type="number" name="width" value={cube.width} onChange={handleChange} required />
        </label>
        <label>
          Height:
          <input type="number" name="height" value={cube.height} onChange={handleChange} required />
        </label>
        <label>
          Length:
          <input type="number" name="length" value={cube.length} onChange={handleChange} required />
        </label>
        <label>
          Weight:
          <input type="number" name="weight" value={cube.weight} onChange={handleChange} required />
        </label>
        <button type="submit" className="button">{isEdit ? 'Save Changes' : 'Add Cube'}</button>
        <Link to="/" className="link">Back to List</Link>
      </form>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<CubeList />} />
          <Route path="/cube/:id" element={<CubeDetail />} />
          <Route path="/add-cube" element={<CubeForm />} />
          <Route path="/edit-cube/:id" element={<CubeForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
