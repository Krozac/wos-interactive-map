import React, { useState } from 'react';

export default function GiftPanel() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = () => {
    setStatus('loading');
    // simulate API call
    setTimeout(() => setStatus('confirmed'), 1000);
  };

  return (
    <div className="gift-panel">
      <input value={code} onChange={e => setCode(e.target.value)} placeholder="Enter gift code" />
      <button onClick={handleSubmit}>Confirm</button>
      {status && <p>{status}</p>}
    </div>
  );
}