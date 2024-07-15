import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import DataTable from './DataTable'; // Import the DataTable component


const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [input, setInput] = useState("");
    const [fileId, setFileId] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [regexPattern, setRegexPattern] = useState("");
    const [replacement, setReplacement] = useState("");
    const [processedCSV, setProcessedCSV] = useState("");
    const [uploadedData, setUploadedData] = useState([]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file to upload.");
            return;
        }
        setError("");
        setMessage("");
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post('http://localhost:8000/api/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setFileId(response.data.id);
            // console.log(response.data.data);
            setUploadedData(response.data.data); // Store uploaded data in state
            setMessage("File uploaded successfully.");
        } catch (err) {
            setError("Error uploading file.");
        }
    };

    const handleProcess = async () => {
        if (!fileId) {
            setError("Please hit upload button.");
            return;
        }
        if (!input) {
            setError("Please provide the input description.");
            return;
        }
        setError("");
        setMessage("");
        setProcessing(true);

        const data = {
            input: input,
            file_id: fileId
        };

        try {
            const response = await axios.post('http://localhost:8000/api/process/', data);
            setMessage("File processed successfully.");
            setRegexPattern(response.data.regex_pattern);
            setReplacement(response.data.replacement);
            setProcessedCSV(response.data.processed_file);
        } catch (err) {
            setError("Error processing file.");
        } finally {
            setProcessing(false);
        }
    };

    const handleDownload = async () => {
        try {
            const blob = new Blob([processedCSV], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'processed_file.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            setError("Error downloading file.");
        }
    };

    return (
        <Container>
            <h1 className="mt-5">Regex Pattern Matching and Replacement</h1>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Upload File</Form.Label>
                    <Form.Control type="file" onChange={handleFileChange} />
                    <Button variant="primary" className="mt-2" onClick={handleUpload}>Upload</Button>
                </Form.Group>

                {uploadedData.length > 0 && (
                    <div className="mt-5">
                        <h2>Uploaded Data</h2>
                        <DataTable data={uploadedData} />
                    </div>
                )}

                <Form.Group controlId="formInput" className="mb-3">
                    <Form.Label>Input</Form.Label>
                    <Form.Control type="text" placeholder="Enter input description" value={input} onChange={(e) => setInput(e.target.value)} />
                </Form.Group>

                <Button variant="success" onClick={handleProcess} disabled={processing}>
                    {processing ? <Spinner animation="border" size="sm" /> : "Process"}
                </Button>
                {regexPattern && replacement && (
                    <div className="mt-3">
                        <Alert variant="info">
                            <p><strong>Generated Regex Pattern:</strong> {regexPattern}</p>
                            <p><strong>Generated Replacement Value:</strong> {replacement}</p>
                        </Alert>
                    </div>
                )}
                {replacement && (
                    <Button variant="secondary" className="mt-3" onClick={handleDownload}>Download Processed File</Button>
                )}
            </Form>
        </Container>
    );
};

export default FileUpload;