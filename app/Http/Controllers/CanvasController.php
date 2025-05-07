<?php

namespace App\Http\Controllers;

use App\Models\Workflow;
use Inertia\Inertia;
use Illuminate\Http\Request;

class CanvasController extends Controller
{
    public function show(Workflow $workflow)
    {
        // In a real application, you would likely fetch related data here
        // needed to render the nodes and edges of the workflow canvas.
        // For now, we're just passing the workflow itself.

        return Inertia::render('Workflows/Canvas', [
            'workflow' => $workflow,
            // You might also pass initialNodes and initialEdges data here
            // if it's stored in your database or configuration.
        ]);
    }

    public function store(Request $request, Workflow $workflow)
    {
        // Logic to handle saving the canvas data for the specific workflow
        // This will depend entirely on how you structure your canvas data.
        // For example, you might receive JSON data representing nodes and edges.

        // Log the received data for now
        \Log::info('Saving canvas data for workflow ID: ' . $workflow->id, $request->all());

        // You would typically save this data to your database
        // associated with the $workflow.

        return response()->json(['message' => 'Canvas data saved successfully for workflow: ' . $workflow->id]);
    }

    public function getActions()
    {
        // Logic to fetch and return available actions for the canvas
        // This could be read from a configuration file, database, etc.

        return response()->json([
            ['id' => 'action-1', 'name' => 'Send Email'],
            ['id' => 'action-2', 'name' => 'Create Task'],
            ['id' => 'action-3', 'name' => 'Update Record'],
        ]);
    }
}