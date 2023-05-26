import { useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { BsCircle, BsCircleFill } from 'react-icons/bs';
import { useMutation } from "react-query";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { API } from "../../config/api";

export default function DetailInfo({item}){
    let navigate = useNavigate()
    const [show, setShow] = useState(false);
    const [form, setForm] = useState({
        responseText: "",
        consultationLink: "",
    })

    const handleChange = (e) => {
        setForm({
            ...form, [e.target.name]: e.target.value
        })
    }

    const handleSubmit = useMutation(async () => {
        try {

            const config = {
                headers: {
                  "Content-type": "multipart/form-data",
                },
              };

            const formData = new FormData()
            formData.set("responseText", form.responseText)
            formData.set("consultationLink", form.consultationLink)

            const response = await API.post('/response/' + item.ID, formData, config)
            const consultation = await API.patch('/consultation/' + item.ID)
            Navigate('/reservasi-data')
        } catch (error) {
            console.log("Add response failed", error)
        }
    })

    async function handleCancel(id) {
        try {
            const _ = await API.patch('/cancel-consultaion/' + id);
            console.log("Cancel successful", const_)
            refetch()
        } catch (error) {
            console.log("Cancel failed", error)
        }
    }

    return (
        <>
        <Link>
            <button onClick={() => setShow(true)} className=" btn btn-primary">
                Give Response
            </button>
        </Link>
        <Modal show={show} onHide={() => setShow(false)} size="lg">
            <div className="p-5">
                <div className="">
                    <Row>
                        <Col>
                            <h1>{item.Subject}</h1>
                            <p>{item.Description}</p>
                        </Col>
                        <Col xs={5}>
                            <div className="d-flex align-items-center">
                                <BsCircle style={{color:"#FF6185"}}/>
                                <div className="ps-3">
                                    <h4>Date of complaint</h4>
                                    <p>{item.CreatedAt.split("T")[0]}</p>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <BsCircleFill style={{color:"#FF6185"}}/>
                                <div className="ps-3">
                                    <h4>Live Consultation</h4>
                                    <p>{item.RequestDate}</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
                <Table>
                    <thead>
                        <tr>
                        <th>Full Name</th>
                        <th>Gender</th>
                        <th>Phone</th>
                        <th>Age</th>
                        <th>Height</th>
                        <th>Weight</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{item.User.FullName}</td>
                            <td>{item.User.Gender}</td>
                            <td>{item.User.Phone}</td>
                            <td>{item.Age}</td>
                            <td>{item.Height}</td>
                            <td>{item.Weight}</td>
                        </tr>
                    </tbody>
                </Table>
                <div>
                <Form  >
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Description</Form.Label>
                        <Form.Control as="textarea" name="responseText" onChange={handleChange} style={{ height: '100px' }}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Link</Form.Label>
                        <Form.Control type="text" name="consultationLink" onChange={handleChange} />
                    </Form.Group>
                    <div className="d-flex justify-content-end gap-3">
                        <Button type="submit" className="btn-danger" onClick={() => handleCancel(item.ID)}>Cancel</Button>
                        <Button type="submit" onClick={(e) => handleSubmit.mutate(e)} className="btn-success">Approve</Button>
                    </div>
                </Form>
                </div>
            </div>
            
        </Modal>
        
        </>
    )
}