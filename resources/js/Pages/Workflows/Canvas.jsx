 import '@xyflow/react/dist/style.css';
 import React, { useRef, useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
} from '@xyflow/react';

import axios from 'axios';
import Sidebar from './Sidebar';
import ActionConfigModal from './ActionConfigModal';
import './index.css';
import './xy-theme.css';

const DnDFlow = ({ workflowId }) => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [availableActions, setAvailableActions] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch actions, connections, and trigger data
    axios
      .get(`/workflows/${workflowId}/canvas-data`)
      .then((response) => {
        const { trigger, actions, connections } = response.data;

        // Add the trigger node to the canvas
        const initialNodes = [
          {
            id: trigger.id,
            type: trigger.type,
            position: trigger.position,
            data: {
              label: `${trigger.name} (Trigger)`,
              parameters: trigger.parameters,
            },
          },
          ...actions.map((action) => ({
            id: action.id.toString(),
            type: 'default',
            position: { x: action.x, y: action.y },
            data: { label: action.name, config: action.config },
          })),
        ];

        const initialEdges = connections.map((conn) => ({
          id: `edge_${conn.source}_${conn.target}`,
          source: conn.source.toString(),
          target: conn.target.toString(),
        }));

        setNodes(initialNodes);
        setEdges(initialEdges);
      });

    // Fetch available actions
    axios.get('/api/actions').then((response) => {
      setAvailableActions(response.data);
    });
  }, [workflowId]);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const actionType = event.dataTransfer.getData('application/reactflow');
      if (!actionType) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `node_${nodes.length + 1}`,
        type: 'default',
        position,
        data: { label: actionType, config: {} },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, screenToFlowPosition],
  );

  const onNodeDoubleClick = (event, node) => {
    setSelectedNode(node);
    setIsModalOpen(true);
  };


  return (
    <div className="dndflow">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeDoubleClick={onNodeDoubleClick}
          fitView
          style={{ backgroundColor: '#F7F9FB' }}
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      <Sidebar actions={availableActions} />
      {isModalOpen && (
        <ActionConfigModal
          node={selectedNode}
          onClose={() => setIsModalOpen(false)}
          onSave={(config) => {
            setNodes((nds) =>
              nds.map((n) => (n.id === selectedNode.id ? { ...n, data: { ...n.data, config } } : n)),
            );
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ({ workflowId }) => (
  <ReactFlowProvider>
    <DnDFlow workflowId={workflowId} />
  </ReactFlowProvider>
);