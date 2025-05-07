import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function WorkflowIndex({ workflows, triggers }) {
    const workflowList = Array.isArray(workflows?.data) ? workflows.data : [];
    triggers = Array.isArray(triggers) ? triggers : [];

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        reset,
    } = useForm({
        name: '',
        status: 'active',
        trigger_id: '',
    });

    const [editId, setEditId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreate = (e) => {
        e.preventDefault();
        if (!data.name || !data.status || !data.trigger_id) return;

        post(route('workflows.store'), {
            onSuccess: () => {
                reset();
                setIsModalOpen(false); // Close the modal
            },
            onError: (errors) => {
                console.error('Create failed:', errors);
            },
        });
    };

    const startEdit = (workflow) => {
        setEditId(workflow.id);
        setData({
            name: workflow.name,
            status: workflow.status,
            trigger_id: workflow.trigger_id ?? '',
        });
    };

    const handleUpdate = (id) => {
        put(route('workflows.update', id), {
            preserveScroll: true,
            onSuccess: () => {
                setEditId(null);
                reset();
            },
            onError: (errors) => {
                console.error('Update failed:', errors);
            },
        });
    };

    const handleCancelEdit = () => {
        setEditId(null);
        reset();
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this workflow?')) {
            destroy(route('workflows.destroy', id));
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Workflows</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
                >
                    Create Workflow
                </button>
            </div>

            {/* Workflow Table */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Existing Workflows</h2>
                <table className="w-full border text-left bg-white rounded shadow-md overflow-hidden">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 border-b">Name</th>
                            <th className="p-3 border-b">Status</th>
                            <th className="p-3 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workflowList.map((workflow) => (
                            <tr key={workflow.id} className="border-t hover:bg-gray-50">
                                <td className="p-3">
                                    {editId === workflow.id ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="border p-1 rounded w-full"
                                        />
                                    ) : (
                                        workflow.name
                                    )}
                                </td>
                                <td className="p-3">
                                    {editId === workflow.id ? (
                                        <select
                                            name="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="border p-1 rounded"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    ) : (
                                        <span
                                            className={`px-2 py-1 rounded text-white ${
                                                workflow.status === 'active'
                                                    ? 'bg-green-500'
                                                    : 'bg-gray-500'
                                            }`}
                                        >
                                            {workflow.status}
                                        </span>
                                    )}
                                </td>
                                <td className="p-3 space-x-2">
                                    {editId === workflow.id ? (
                                        <>
                                            <button
                                                onClick={() => handleUpdate(workflow.id)}
                                                className="text-green-600 hover:underline"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="text-gray-600 hover:underline"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => startEdit(workflow)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(workflow.id)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                            <a
                                                href={route('canvas.show', workflow.id)}
                                                className="text-indigo-600 hover:underline"
                                            >
                                                Open Canvas
                                            </a>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Creating Workflow */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Create Workflow</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Workflow Name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="border p-2 w-full rounded"
                            />
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="border p-2 w-full rounded"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <select
                                value={data.trigger_id}
                                onChange={(e) => setData('trigger_id', e.target.value)}
                                className="border p-2 w-full rounded"
                            >
                                <option value="">Select Trigger</option>
                                {triggers.map((trigger) => (
                                    <option key={trigger.id} value={trigger.id}>
                                        {trigger.name}
                                    </option>
                                ))}
                            </select>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}