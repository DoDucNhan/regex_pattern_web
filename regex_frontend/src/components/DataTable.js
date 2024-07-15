import React from 'react';
import { Table } from 'react-bootstrap';

const DataTable = ({ data }) => {
    if (!data.length) {
        return <p>No data available.</p>;
    }

    const headers = Object.keys(data[0]);

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    {headers.map((header, index) => (
                        <th key={index}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
                    <tr key={index}>
                        {headers.map((header, idx) => (
                            <td key={idx}>{row[header]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default DataTable;
