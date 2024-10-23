import React, { Fragment, useEffect, useState } from 'react';
//import empdata from './Data';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CrudApp() {
  const [name, setName] = useState();
  const [age, setAge] = useState();
  const [active, setIsActive] = useState(0);

  const [editId, setEditId] = useState();
  const [editName, setEditName] = useState();
  const [editAge, setEditAge] = useState();
  const [editActive, setEditIsActive] = useState(0);

  const [show, setShow] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleEdit = (id) => {
    handleShow();
    axios
      .get(`https://localhost:7087/api/Employee/${id}`)
      .then((result) => {
        setEditName(result.data.name);
        setEditAge(result.data.age);
        //console.log(result.data.isActive);
        setEditIsActive(result.data.isActive);
        setEditId(id);
        //console.log(editActive);
      })
      .catch((error) => {
        toast.success(error);
      });
  };

  const handleDelete = (id) => {
    if (
      window.confirm('Are you sure want to delete this employee...?') === true
    ) {
      axios
        .delete(`https://localhost:7087/api/Employee/${id}`)
        .then((result) => {
          if (result.status === 200) {
            toast.success('Employee has been deleted.');
            getData();
          }
        })
        .catch((error) => {
          toast.success(error);
        });
    }
  };

  const handleUpdate = () => {
    const url = `https://localhost:7087/api/Employee/${editId}`;
    const data = {
      id: editId,
      name: editName,
      age: editAge,
      isActive: editActive,
    };
    axios
      .put(url, data)
      .then((result) => {
        toast.success('Employee has been Updated.');
        getData();
        clear();
      })
      .catch((error) => {
        toast.success(error);
      });
  };

  const [data, setData] = useState([]);
  useEffect(() => {
    getData();
  }, []);

  const handleSave = () => {
    const url = 'https://localhost:7087/api/Employee';
    const data = {
      name: name,
      age: age,
      isActive: active,
    };
    axios
      .post(url, data)
      .then((result) => {
        setData(result);
        getData();
        clear();
        toast.success('Employee has been added.');
      })
      .catch((error) => {
        toast.success(error);
      });
  };

  const clear = () => {
    setName('');
    setAge('');
    setIsActive('');
    setEditId('');
    setEditName('');
    setEditAge('');
    setEditIsActive('');
  };

  const handleIsActive = (e) => {
    if (e.target.checked) {
      setIsActive(1);
    } else {
      setIsActive(0);
    }
  };

  const handleEditIsActive = (e) => {
    if (e.target.checked) {
      setEditIsActive(1);
    } else {
      setEditIsActive(0);
    }
  };

  const getData = () => {
    axios
      .get('https://localhost:7087/api/Employee')
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Fragment>
      <ToastContainer />
      <Container className="form">
        <Row>
          <Col>
            <input
              type="text"
              className="form-controler"
              placeholder="Enter Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Col>
          <Col>
            <input
              type="text"
              className="form-controler"
              placeholder="Enter Age"
              value={age}
              onChange={(event) => setAge(event.target.value)}
            />
          </Col>
          <Col>
            <input
              type="checkbox"
              value={active}
              checked={active === 1 ? true : false}
              onChange={(e) => handleIsActive(e)}
            />
            <label>Is Active</label>
          </Col>
          <Col>
            <Button
              className="btn btn-primary"
              onClick={() => {
                handleSave();
              }}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Container>
      <Table striped bordered hover className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Age</th>
            <th>IsActive</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0
            ? data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.age}</td>
                    <td>{item.isActive}</td>
                    <td colSpan={2}>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(item.id)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            : 'Loading...'}
        </tbody>
      </Table>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modify/Update Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {' '}
          <Row>
            <Col>
              <input
                type="text"
                className="form-controler"
                placeholder="Enter Name"
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
              />
            </Col>
            <Col>
              <input
                type="text"
                className="form-controler"
                placeholder="Enter Age"
                value={editAge}
                onChange={(event) => setEditAge(event.target.value)}
              />
            </Col>
            <Col>
              <input
                type="checkbox"
                onChange={(e) => handleEditIsActive(e)}
                checked={editActive === 1 ? true : false}
                value={editActive}
              />
              <label>Is Active</label>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}
