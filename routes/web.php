<?php

use App\Http\Controllers\WorkflowController;
use App\Http\Controllers\WorkflowCanvasController;
use Illuminate\Support\Facades\Route;

// Workflow Routes
Route::get('/workflows', [WorkflowController::class, 'index'])->name('workflows.index');
Route::post('/workflows', [WorkflowController::class, 'store'])->name('workflows.store');
Route::put('/workflows/{workflow}', [WorkflowController::class, 'update'])->name('workflows.update');
Route::delete('/workflows/{workflow}', [WorkflowController::class, 'destroy'])->name('workflows.destroy');

// Workflow Canvas Route
Route::get('/workflows/{workflow}/canvas', [WorkflowCanvasController::class, 'show'])->name('canvas.show');
Route::get('/workflows/{workflow}/canvas-data', [WorkflowCanvasController::class, 'fetchCanvasData']);
Route::post('/workflows/{workflow}/save-canvas', [WorkflowCanvasController::class, 'saveCanvas']);




// API Routes
Route::get('/api/triggers', [WorkflowController::class, 'getTriggers']);
Route::get('/api/actions', [WorkflowCanvasController::class, 'getActions']);
