import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [pattern, setPattern] = useState("");
    const [replacement, setReplacement] = useState("");
    const [fileId, setFileId] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post('http://localhost:8000/api/upload/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        setFileId(response.data.id);
    };

    const handleProcess = async () => {
        const data = {
            pattern: pattern,
            replacement: replacement,
            file_id: fileId
        };

        const response = await axios.post('http://localhost:8000/api/process/', data);
        console.log(response.data);
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>

            <input type="text" placeholder="Pattern" value={pattern} onChange={(e) => setPattern(e.target.value)} />
            <input type="text" placeholder="Replacement" value={replacement} onChange={(e) => setReplacement(e.target.value)} />
            <button onClick={handleProcess}>Process</button>
        </div>
    );
};

export default FileUpload;