import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner, Table, Form, Row, Col, Button, Alert } from "react-bootstrap";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [country, setCountry] = useState("mexico");
  const [inputValue, setInputValue] = useState("");

  const fetchData = async function () {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://api.tradingeconomics.com/search/${country}?category=markets&c=${process.env.REACT_APP_API_KEY}`
      );
      console.log(res);
      setData(res.data);
      console.log("data:", data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [country]);

  const handleSubmit = function (e) {
    e.preventDefault();
    setCountry(inputValue);
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <h1 className="capitalize m-3">{country}</h1>
        <Form className="m-3" onSubmit={handleSubmit}>
          <Row>
            <Col xs="auto">
              <Form.Control
                type="text"
                placeholder="Search Country"
                className=" mr-sm-2"
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue}
              />
            </Col>
            <Col xs="auto">
              <Button type="submit">Submit</Button>
            </Col>
          </Row>
        </Form>
      </div>
      {loading ? (
        <div className="d-flex align-items-center justify-content-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert className="m-3" variant="danger">
          Unable to fetch data.
        </Alert>
      ) : data.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              {data.length > 0 &&
                Object.keys(data[0]).map((heading) => (
                  <th key={heading}>{heading}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 &&
              data.map((row, i) => (
                <tr key={i}>
                  {Object.keys(row).map((rowKey, idx) => (
                    <td key={idx}>{row[rowKey]}</td>
                  ))}
                </tr>
              ))}
          </tbody>
        </Table>
      ) : (
        <Alert className="m-3" variant="danger">
          No data available.
        </Alert>
      )}
    </div>
  );
}

export default App;
