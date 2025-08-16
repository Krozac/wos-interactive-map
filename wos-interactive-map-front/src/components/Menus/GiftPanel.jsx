import React, { useState } from 'react';

export default function GiftPanel() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState(null);
  const [jobs, setJobs] = useState([]);

  const handleSubmit = async () => {
    if (!code) {
      setStatus('Please enter a gift code');
      return;
    }

    setStatus('Starting redemption...');
    try {
      const response = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ giftcode: code }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus(`Redemption started! Job ID: ${data.jobId}`);
      } else {
        setStatus(`Failed: ${data.message}`);
      }
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      const data = await response.json();

      if (data.success) {
        // Convert jobs object to array
        const jobsArray = Object.entries(data.jobs).map(([id, job]) => ({
          id,
          ...job,
        }));
        setJobs(jobsArray);
      } else {
        setStatus('Failed to fetch jobs');
      }
    } catch (err) {
      setStatus(`Error fetching jobs: ${err.message}`);
    }
  };

  return (
    <div className="gift-panel">
      <input
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="Enter gift code"
      />
      <button onClick={handleSubmit}>Confirm</button>
      <button onClick={fetchJobs} style={{ marginLeft: '10px' }}>Fetch Jobs</button>

      {status && <p>{status}</p>}

      
      {jobs.length > 0 && (
        <table className="jobs-table">
          <thead>
            <tr>
              <th>Giftcode</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Elapsed (s)</th>
              <th>Last Result</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id}>
                <td>{job.giftcode}</td>
                <td>{job.status}</td>
                <td>{job.completedUsers}/{job.totalUsers}</td>
                <td>{job.elapsedTime}</td>
                <td>
                  {job.results && job.results.length > 0
                    ? job.results[job.results.length - 1].fid + " : "+job.results[job.results.length - 1].status
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <style jsx>{`
        .jobs-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .jobs-table th,
        .jobs-table td {
          border: 1px solid #ccc;
          padding: 8px 12px;
          text-align: center;
        }
        .jobs-table th {
          background-color: #62a1ffff;
        }

        .gift-panel input {
          padding: 6px 10px;
          margin-right: 8px;
        }
        .gift-panel button {
          padding: 6px 12px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}



