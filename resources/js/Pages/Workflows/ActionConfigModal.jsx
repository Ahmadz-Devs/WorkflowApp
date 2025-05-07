import React, { useState } from 'react';

const ActionConfigModal = ({ node, onClose, onSave }) => {
  const [config, setConfig] = useState(node.data.config || {});

  const handleChange = (field, value) => {
    setConfig({ ...config, [field]: value });
  };

  return (
    <div className="modal">
      <h3>Configure {node.data.label}</h3>
      {node.data.label === 'Send Email' && (
        <>
          <label>
            To:
            <input
              type="email"
              value={config.to || ''}
              onChange={(e) => handleChange('to', e.target.value)}
            />
          </label>
          <label>
            Subject:
            <input
              type="text"
              value={config.subject || ''}
              onChange={(e) => handleChange('subject', e.target.value)}
            />
          </label>
          <label>
            Body:
            <textarea
              value={config.body || ''}
              onChange={(e) => handleChange('body', e.target.value)}
            />
          </label>
        </>
      )}
      {/* Add more configurations for other action types */}
      <button onClick={() => onSave(config)}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default ActionConfigModal;