import React, { useState } from 'react';
import '../../styles/userForm.css';

export default function UserForm({ user, onSave, onCancel }) {
   
  const [power, setPower] = useState(user.power ?? 0);
  const [rallie, setRallie] = useState(user.rallie ?? 0);

  const handleSubmit = e => {
    e.preventDefault();
    onSave(power, rallie );
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <label>
        Power:
        <input
          type="number"
          value={power}
          onChange={e => setPower(Number(e.target.value))}
          required
        />
      </label>
      <label>
        Rallie:
        <input
          type="number"
          value={rallie}
          onChange={e => setRallie(Number(e.target.value))}
          required
        />
      </label>
      <div className="form-actions">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
