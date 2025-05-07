import React from 'react';

export default ({ actions }) => {
  const onDragStart = (event, actionName) => {
    event.dataTransfer.setData('application/reactflow', actionName);
    event.dataTransfer.effectAllowed = 'move';
  };
  const saveCanvas = () => {
    const actions = nodes
      .filter((node) => node.id !== nodes[0]?.id) // Exclude the trigger node
      .map((node) => ({
        id: node.id,
        name: node.data.label,
        x: node.position.x,
        y: node.position.y,
        config: node.data.config,
      }));

    const connections = edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
    }));

    axios
      .post(`/workflows/${workflowId}/save-canvas`, { actions, connections })
      .then(() => alert('Canvas saved successfully!'))
      .catch((err) => console.error(err));
  };

  return (
    <aside>
      <div className="description">Drag actions to the canvas:</div>
      {actions.map((action) => (
        <div
          key={action.id}
          className="dndnode"
          onDragStart={(event) => onDragStart(event, action.name)}
          draggable
        >
          {action.name}
        </div>
      ))}

      <div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition" onClick={saveCanvas}>Save Canvas</button>

      </div>
    </aside>
  );
};