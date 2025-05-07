<?php

namespace App\Http\Controllers;

use App\Models\Workflow;
use App\Models\WorkflowAction;
use App\Models\WorkflowConnection;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Action;

class WorkflowCanvasController extends Controller
{
    public function show(Workflow $workflow)
    {
        \Log::info('Workflow passed to Canvas:', $workflow->toArray());
        return Inertia::render('Workflows/Canvas', [
            'workflow' => $workflow->load('trigger'),
        ]);
    }

    public function fetchCanvasData(Workflow $workflow)
    {
        $trigger = $workflow->trigger;
        $actions = $workflow->actions;
        $connections = $workflow->connections;

        return response()->json([
            'trigger' => [
                'id' => $trigger->id,
                'name' => $trigger->name,
                'parameters' => json_decode($trigger->parameters, true),
            ],
            'actions' => $actions->map(function ($action) {
                return [
                    'id' => $action->id,
                    'action_id' => $action->action_id,
                    'x' => $action->x,
                    'y' => $action->y,
                    'name' => $action->action->name,
                    'config' => json_decode($action->configuration, true),
                ];
            }),
            'connections' => $connections->map(function ($connection) {
                return [
                    'source' => $connection->source_node_id,
                    'target' => $connection->target_node_id,
                ];
            }),
        ]);
    }

    public function saveCanvas(Request $request, Workflow $workflow)
    {
        $request->validate([
            'actions' => 'required|array',
            'connections' => 'required|array',
        ]);

        $workflow->actions()->delete();
        $workflow->connections()->delete();

        foreach ($request->actions as $action) {
            WorkflowAction::create([
                'workflow_id' => $workflow->id,
                'action_id' => $action['action_id'],
                'x' => $action['x'],
                'y' => $action['y'],
                'configuration' => json_encode($action['config']),
            ]);
        }

        foreach ($request->connections as $conn) {
            WorkflowConnection::create([
                'workflow_id' => $workflow->id,
                'source_node_id' => $conn['source'],
                'target_node_id' => $conn['target'],
            ]);
        }

        return response()->json(['status' => 'saved']);
    }

    public function getActions()
    {

        
        return response()->json(Action::all());


    }

}