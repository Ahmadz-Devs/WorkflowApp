<?php

namespace App\Http\Controllers;

use App\Models\Workflow;
use App\Models\Trigger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class WorkflowController extends Controller
{
    public function index()
    {
        $workflows = Workflow::with('trigger')->paginate(10); // Paginated with trigger relationship
        return Inertia::render('Workflows/Index', [
            'workflows' => $workflows, // Now using paginated data
            'triggers' => Trigger::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Workflows/Create', [
            'triggers' => Trigger::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'status' => 'required|in:active,inactive',
            'trigger_id' => 'required|exists:triggers,id'
        ]);

        Workflow::create($request->only(['name', 'status', 'trigger_id']));
        return redirect()->route('workflows.index')->with('success', 'Workflow created.');
    }

    public function edit(Workflow $workflow)
    {
        return Inertia::render('Workflows/Edit', [
            'workflow' => $workflow
        ]);
    }

    public function update(Request $request, Workflow $workflow)
{

    Log::info('Request all data:', $request->all());

    Log::info('Updating workflow ID: ' . $workflow->id, $request->only(['name', 'status']));

    $request->validate([
        'name' => 'required|string',
        'status' => 'required|in:active,inactive',
    ]);

    try {
        $updated = $workflow->update($request->only(['name', 'status']));
        Log::info('Update result for ID: ' . $workflow->id, ['updated' => $updated, 'attributes' => $workflow->getAttributes()]);
        return back()->with('success', 'Workflow updated.');
    } catch (\Exception $e) {
        Log::error('Error updating workflow ID: ' . $workflow->id, ['error' => $e->getMessage()]);
        return back()->withErrors(['error' => 'Failed to update workflow. Please check the logs.']);
    }
}

    public function destroy(Workflow $workflow)
    {
        $workflow->delete();
        return back()->with('success', 'Workflow deleted.');
    }
}