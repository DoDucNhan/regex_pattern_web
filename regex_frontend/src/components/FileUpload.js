import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { saveAs } from 'file-saver';


const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [pattern, setPattern] = useState("");
    const [fileId, setFileId] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [downloadLink, setDownloadLink] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [regexPattern, setRegexPattern] = useState("");
    const [replacement, setReplacement] = useState("");

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
            setMessage("File uploaded successfully.");
        } catch (err) {
            setError("Error uploading file.");
        }
    };

    const handleProcess = async () => {
        if (!pattern || !fileId) {
            setError("Please provide the pattern description.");
            return;
        }
        setError("");
        setMessage("");
        setProcessing(true);

        const data = {
            pattern: pattern,
            file_id: fileId
        };

        try {
            const response = await axios.post('http://localhost:8000/api/process/', data);
            setMessage("File processed successfully.");
            setDownloadLink(response.data.processed_file);
            setRegexPattern(response.data.regex_pattern);
            setReplacement(response.data.replacement);
        } catch (err) {
            setError("Error processing file.");
        } finally {
            setProcessing(false);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/${downloadLink}`, { responseType: 'blob' });
            saveAs(response.data, 'processed_file.csv');
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
                <Form.Group controlId="formPattern" className="mb-3">
                    <Form.Label>Pattern</Form.Label>
                    <Form.Control type="text" placeholder="Enter pattern description" value={pattern} onChange={(e) => setPattern(e.target.value)} />
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
                {downloadLink && (
                    <Button variant="secondary" className="mt-3" onClick={handleDownload}>Download Processed File</Button>
                )}
            </Form>
        </Container>
    );
};

export default FileUpload;