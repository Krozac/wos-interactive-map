import React, { useEffect, useState } from "react";
import '../../styles/AlliancePanel.css'; // Adjust the path as needed
export default function AlliancePanel() {
  const [alliances, setAlliances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/guilds')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch alliances');
        return res.json();
      })
      .then(data => {
        setAlliances(data.guilds);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading alliances...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div id="AlliancePanel">
    {alliances.map(({ _id, Nom, acronym, color }) => (
        <div key={_id} className="alliance">
        <div
            className="alliance-color-box"
            style={{ background: `radial-gradient(110% 15% at bottom, transparent 50%, ${color} 51%)` }}
            title={Nom}>
            <img
                src="/img/flake.png"
                alt="Alliance Icon"
                />
        </div>
        <div className="alliance-info">
            <p className="alliance-name">{Nom}</p>
            <p className="alliance-acronym">{`[${acronym}]`}</p>
        </div>
        </div>
    ))}
    </div>

  );
}
