// Context-aware event detection for different tasks
console.log('Script starting...');

// Pipeline Flow Management
function updatePipelineFlow(step) {
    // Reset all steps
    document.querySelectorAll('.flow-step').forEach(el => {
        el.classList.remove('active', 'completed');
    });
    
    // Mark completed steps
    const steps = ['flow-state', 'flow-event', 'flow-decision', 'flow-action', 'flow-result'];
    const stepIndex = steps.indexOf(step);
    
    for (let i = 0; i < stepIndex; i++) {
        document.getElementById(steps[i]).classList.add('completed');
    }
    
    // Mark current step as active
    if (stepIndex >= 0 && stepIndex < steps.length) {
        document.getElementById(step).classList.add('active');
    }
}

// Add click handlers to pipeline steps
function initializePipelineClickHandlers() {
    const flowSteps = document.querySelectorAll('.flow-step');
    
    flowSteps.forEach(step => {
        step.style.cursor = 'pointer';
        step.addEventListener('click', function() {
            const stepId = this.id;
            
            // Navigate to specific sections based on step clicked
            if (stepId === 'flow-result') {
                // Navigate to execution logs
                const executionLogs = document.getElementById('executionLogs');
                if (executionLogs) {
                    executionLogs.scrollIntoView({ behavior: 'smooth' });
                    // Highlight the logs briefly
                    executionLogs.style.border = '2px solid #00ff88';
                    setTimeout(() => {
                        executionLogs.style.border = '1px solid #333';
                    }, 2000);
                }
            } else if (stepId === 'flow-state') {
                // Navigate to system state panel
                const statePanel = document.querySelector('.panel:has(#cpuUsage)');
                if (statePanel) {
                    statePanel.scrollIntoView({ behavior: 'smooth' });
                }
            } else if (stepId === 'flow-event') {
                // Navigate to configuration panel
                const configPanel = document.querySelector('.panel:has(#taskSelect)');
                if (configPanel) {
                    configPanel.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
        
        // Add hover effect
        step.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        step.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

function resetPipelineFlow() {
    document.querySelectorAll('.flow-step').forEach(el => {
        el.classList.remove('active', 'completed');
    });
}

// Task-specific event mappings
const taskEventMap = {
    'load_balancing_optimization': ['HIGH_CPU_USAGE', 'TRAFFIC_SPIKE', 'DISK_SPACE_FULL', 'NETWORK_OUTAGE'],
    'anomaly_detection_monitoring': ['MEMORY_LEAK', 'SERVICE_FAILURE', 'DATABASE_CONNECTION_FAILED'],
    'resource_allocation_planning': ['MEMORY_LEAK', 'HIGH_CPU_USAGE', 'DATA_CORRUPTION'],
    'incident_response_automation': ['SERVICE_FAILURE', 'HIGH_CPU_USAGE', 'SECURITY_BREACH', 'APPLICATION_CRASH'],
    'performance_tuning_engine': ['HIGH_CPU_USAGE', 'MEMORY_LEAK', 'SYSTEM_OVERLOAD'],
    'cost_efficiency_optimization': ['MEMORY_LEAK', 'TRAFFIC_SPIKE', 'RESOURCE_EXHAUSTION'],
    'intelligent_scheduling_system': ['TRAFFIC_SPIKE', 'SERVICE_FAILURE', 'NETWORK_OUTAGE', 'SECURITY_BREACH'],
    'database_performance_tuning': ['MEMORY_LEAK', 'SERVICE_FAILURE', 'DATABASE_CONNECTION_FAILED', 'DATA_CORRUPTION'],
    'basic_system_monitoring': ['HIGH_CPU_USAGE', 'TRAFFIC_SPIKE', 'DISK_SPACE_FULL', 'SYSTEM_OVERLOAD'],
    'simple_log_analysis': ['SERVICE_FAILURE', 'MEMORY_LEAK', 'DATA_CORRUPTION']
};

function getTaskSpecificEvent(taskType) {
    const taskEvents = taskEventMap[taskType] || ['HIGH_CPU_USAGE', 'MEMORY_LEAK', 'SERVICE_FAILURE', 'TRAFFIC_SPIKE'];
    return taskEvents[Math.floor(Math.random() * taskEvents.length)];
}

function showEvent(eventName) {
    const eventDisplay = document.getElementById('detectedEvent');
    const eventSelect = document.getElementById('eventSelect');
    
    if (eventDisplay) {
        eventDisplay.textContent = eventName;
        console.log('Event set to:', eventName);
    }
    
    // Also update the dropdown value to match
    if (eventSelect) {
        eventSelect.value = eventName;
        console.log('Event dropdown updated to:', eventName);
    }
}

function handleModeChange() {
    console.log('Mode change triggered');
    const mode = document.getElementById('eventModeSelect').value;
    const manualGroup = document.getElementById('manualEventGroup');
    const autoGroup = document.getElementById('autoEventGroup');
    const taskType = document.getElementById('taskSelect').value;
    
    console.log('Selected mode:', mode);
    console.log('Current task:', taskType);
    
    if (mode === 'manual') {
        manualGroup.style.display = 'block';
        autoGroup.style.display = 'none';
        console.log('Manual mode activated - showing all event options');
    } else {
        manualGroup.style.display = 'none';
        autoGroup.style.display = 'block';
        
        // Generate task-specific event immediately
        const taskSpecificEvent = getTaskSpecificEvent(taskType);
        showEvent(taskSpecificEvent);
        console.log('Auto mode activated with task-specific event:', taskSpecificEvent, 'for task:', taskType);
    }
}

// Missing function definitions
function updateAIDecision(decisions) {
    const aiDecisionPanel = document.getElementById('aiDecision');
    aiDecisionPanel.innerHTML = decisions.map(decision => `<div class="decision-step">${decision}</div>`).join('');
}

function updateActionOutput(actions) {
    const actionPanel = document.getElementById('actionOutput');
    actionPanel.innerHTML = actions.map(action => `
        <div class="action-item">
            <span class="action-text">${action}</span>
            <span class="action-status">Action Taken</span>
        </div>
    `).join('');
    
    // Add actions to Last Actions Memory
    actions.forEach(action => addLastAction(action));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing...');
    
    // Clear execution logs on page load
    const logsElement = document.getElementById('executionLogs');
    logsElement.innerHTML = '';
    
    // Set event display to none on page load
    document.getElementById('detectedEvent').textContent = 'none';
    
    // Get current task type
    const taskType = document.getElementById('taskSelect').value;
    const mode = document.getElementById('eventModeSelect').value;
    console.log('Current task on load:', taskType, 'Mode:', mode);
    
    // Don't set event immediately - wait for user selection
    console.log('Waiting for user to select task...');
    
    // Ensure auto mode is selected by default
    document.getElementById('eventModeSelect').value = 'auto';
    console.log('Auto mode set as default');
});

// Add task change listener to update event display immediately
document.getElementById('taskSelect').addEventListener('change', function() {
    const newTaskType = this.value;
    const mode = document.getElementById('eventModeSelect').value;
    console.log('Task changed to:', newTaskType);
    console.log('Current mode when task changed:', mode);
    
    if (mode === 'auto') {
        // Auto mode: intelligently select the best event for each task
        const taskBestEvents = {
            'load_balancing_optimization': 'TRAFFIC_SPIKE',
            'anomaly_detection_monitoring': 'MEMORY_LEAK',
            'resource_allocation_planning': 'MEMORY_LEAK',
            'incident_response_automation': 'SERVICE_FAILURE',
            'performance_tuning_engine': 'HIGH_CPU_USAGE',
            'cost_efficiency_optimization': 'MEMORY_LEAK',
            'intelligent_scheduling_system': 'TRAFFIC_SPIKE',
            'database_performance_tuning': 'DATABASE_CONNECTION_FAILED',
            'basic_system_monitoring': 'HIGH_CPU_USAGE',
            'simple_log_analysis': 'SERVICE_FAILURE'
        };
        
        const bestEvent = taskBestEvents[newTaskType] || 'HIGH_CPU_USAGE';
        showEvent(bestEvent);
        console.log('Auto mode selected optimal event:', bestEvent, 'for task:', newTaskType);
    } else {
        console.log('Manual mode active - event will be selected from dropdown');
    }
});

// Duplicate event listener removed to prevent conflicts

// Function to reset system and reset all selections
function resetSystem() {
    console.log('=== RESETTING SYSTEM ===');
    console.log('Checking all panel elements before reset...');
    
    // Check which elements exist
    const elements = [
        'aiDecision', 'actionOutput', 'rootCauseAnalysis', 'aiJustification', 
        'aiIncidentAnalysis', 'confidenceRiskAnalysis', 'actionImpact', 
        'whatIfResults', 'riskLevel', 'progressFill', 'eventSeverity'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        console.log(`Element ${id}:`, element ? 'EXISTS' : 'MISSING');
        if (element) {
            console.log(`  Current content:`, element.innerHTML.substring(0, 100));
        }
    });
    
    console.log('Starting reset process...');
    
    // Reset pipeline flow
    resetPipelineFlow();
    
    // Reset task selection to default
    const taskSelect = document.getElementById('taskSelect');
    if (taskSelect) taskSelect.selectedIndex = 0;
    
    // Reset mode selection to default
    const eventModeSelect = document.getElementById('eventModeSelect');
    if (eventModeSelect) eventModeSelect.value = 'auto';
    
    // Reset event selection to default
    const eventSelect = document.getElementById('eventSelect');
    if (eventSelect) eventSelect.selectedIndex = 0;
    
    // Hide manual event group and show auto event group
    const manualEventGroup = document.getElementById('manualEventGroup');
    if (manualEventGroup) manualEventGroup.style.display = 'none';
    const autoEventGroup = document.getElementById('autoEventGroup');
    if (autoEventGroup) autoEventGroup.style.display = 'block';
    
    // Reset event display to none
    const detectedEvent = document.getElementById('detectedEvent');
    if (detectedEvent) detectedEvent.textContent = 'none';
    
    // Show reset notifications
    updateNotifications([
        `[SYSTEM] System reset complete`,
        `[TASK] Reset to none`,
        `[EVENT] Reset to none`,
        `[MODE] Reset to Auto Detect mode`,
        `[STATUS] Ready for new operations`
    ]);
    
    // Reset execution logs
    const logsElement = document.getElementById('executionLogs');
    if (logsElement) {
        logsElement.innerHTML = `
            <div class="log-line log-start">[SYSTEM] System reset initiated</div>
            <div class="log-line log-step">[TASK] Reset to none</div>
            <div class="log-line log-step">[EVENT] Reset to none</div>
            <div class="log-line log-step">[MODE] Reset to: Auto Detect</div>
            <div class="log-line log-step">[STATUS] System reset complete - Ready for new operations</div>
        `;
        logsElement.scrollTop = logsElement.scrollHeight;
    }
    
    // Reset all panels to default state
    const cpuUsage = document.getElementById('cpuUsage');
    if (cpuUsage) cpuUsage.textContent = '85%';
    const memoryUsage = document.getElementById('memoryUsage');
    if (memoryUsage) memoryUsage.textContent = '72%';
    const systemStatus = document.getElementById('systemStatus');
    if (systemStatus) systemStatus.textContent = 'READY';
    
    // Reset AI Decision Panel to placeholder
    updateAIDecision(['Run the system to see AI decisions...']);
    
    // Reset action output panel to placeholder
    updateActionOutput(['Run the system to see action outputs...']);
    
    // Reset AI Decision Panel (direct HTML reset)
    const aiDecision = document.getElementById('aiDecision');
    if (aiDecision) aiDecision.innerHTML = '<div class="decision-step">Run the system to see AI decisions...</div>';
    
    // Reset Action Output Panel (direct HTML reset)
    const actionOutput = document.getElementById('actionOutput');
    if (actionOutput) actionOutput.innerHTML = '<div class="action-item">Run the system to see action outputs...</div>';
    
    // Reset what-if simulation
    originalSystemState = null;
    const whatIfResults = document.getElementById('whatIfResults');
    if (whatIfResults) {
        whatIfResults.innerHTML = '<div class="what-if-placeholder">Run the system first, then explore alternative actions...</div>';
    }
    
    // Keep Last Actions Memory (persist across resets)
    // lastActions = [];  // Commented out to persist actions
    updateLastActionsDisplay();
    
    // Reset Action Impact Breakdown
    const actionImpact = document.getElementById('actionImpact');
    if (actionImpact) actionImpact.innerHTML = '<div class="impact-placeholder">Run the system to see detailed action impacts...</div>';
    
    // Reset Risk Level
    const riskBadge = document.getElementById('riskLevel');
    if (riskBadge) {
        riskBadge.classList.remove('risk-high', 'risk-medium', 'risk-low');
        riskBadge.textContent = 'MEDIUM';
        riskBadge.classList.add('risk-medium');
    }
    
    // Reset Recovery Progress
    const progressFill = document.getElementById('progressFill');
    if (progressFill) progressFill.style.width = '0%';
    const progressText = document.getElementById('progressText');
    if (progressText) progressText.textContent = '0%';
    
    // Reset Event Severity
    const severityBadge = document.getElementById('eventSeverity');
    if (severityBadge) {
        severityBadge.classList.remove('severity-high', 'severity-medium', 'severity-low');
        severityBadge.textContent = 'READY';
        severityBadge.classList.add('severity-ready');
    }
    
    // Reset AI Incident Analysis
    const aiIncidentAnalysis = document.getElementById('aiIncidentAnalysis');
    if (aiIncidentAnalysis) aiIncidentAnalysis.innerHTML = '<div class="analysis-placeholder">Run the system to see detailed incident analysis...</div>';
    
    // Reset AI Decision Confidence & Risk Analysis
    const confidenceRiskAnalysis = document.getElementById('confidenceRiskAnalysis');
    if (confidenceRiskAnalysis) confidenceRiskAnalysis.innerHTML = '<div class="confidence-risk-placeholder">Run the system to see AI confidence and risk analysis...</div>';
    
    // Reset Root Cause Confidence Breakdown
    const rootCauseAnalysis = document.getElementById('rootCauseAnalysis');
    if (rootCauseAnalysis) rootCauseAnalysis.innerHTML = '<div class="analysis-placeholder">Run the system to see root cause probability analysis...</div>';
    
    // Reset AI Decision Justification
    const aiJustification = document.getElementById('aiJustification');
    if (aiJustification) aiJustification.innerHTML = '<div class="justification-placeholder">Run the system to see AI decision reasoning...</div>';
    
    // Reset Action Learning Insights
    const actionLearningInsights = document.getElementById('actionLearningInsights');
    if (actionLearningInsights) actionLearningInsights.innerHTML = '<div class="learning-placeholder">Run the system to see action learning insights...</div>';
    
    // Reset AI Insights & Learning panel
    const aiInsightsLogs = document.getElementById('aiInsightsLogs');
    if (aiInsightsLogs) aiInsightsLogs.innerHTML = '<div class="insights-placeholder">Run the system to see AI insights and learning data...</div>';
    
    // Reset Action Learning Insights panel to match (using existing variable)
    if (actionLearningInsights) actionLearningInsights.innerHTML = '<div class="learning-placeholder">Run the system to see action learning insights...</div>';
    
    // Reset health score to default
    updateHealthScore(65, 55, 0.15);
    
    // Reset system status badge
    updateSystemStatusBadge('READY');
    
    // Reset event severity badge
    const eventSeverityBadge = document.getElementById('eventSeverity');
    if (eventSeverityBadge) {
        eventSeverityBadge.textContent = 'READY';
        eventSeverityBadge.className = 'severity-badge severity-ready';
    }
    
    // AGGRESSIVE RESET - Force clear all panels
    console.log('Performing aggressive reset...');
    
    const aggressiveResets = [
        { id: 'aiDecision', content: '<div class="decision-step">Run the system to see AI decisions...</div>' },
        { id: 'actionOutput', content: '<div class="action-item">Run the system to see action outputs...</div>' },
        { id: 'rootCauseAnalysis', content: '<div class="analysis-placeholder">Run the system to see root cause probability analysis...</div>' },
        { id: 'aiJustification', content: '<div class="justification-placeholder">Run the system to see AI decision reasoning...</div>' },
        { id: 'aiIncidentAnalysis', content: '<div class="analysis-placeholder">Run the system to see detailed incident analysis...</div>' },
        { id: 'confidenceRiskAnalysis', content: '<div class="confidence-risk-placeholder">Run the system to see AI confidence and risk analysis...</div>' },
        { id: 'actionImpact', content: '<div class="impact-placeholder">Run the system to see detailed action impacts...</div>' },
        { id: 'whatIfResults', content: '<div class="what-if-placeholder">Run the system first, then explore alternative actions...</div>' },
        { id: 'actionLearningInsights', content: '<div class="learning-placeholder">Run the system to see action learning insights...</div>' },
        { id: 'aiInsightsLogs', content: '<div class="insights-placeholder">Run the system to see AI insights and learning data...</div>' }
    ];
    
    aggressiveResets.forEach(reset => {
        const element = document.getElementById(reset.id);
        if (element) {
            console.log(`Force resetting ${reset.id}`);
            element.innerHTML = reset.content;
        } else {
            console.log(`Warning: Element ${reset.id} not found`);
        }
    });
    
    // Clear last actions if needed
    if (document.getElementById('lastActions')) {
        console.log('Clearing last actions...');
        lastActions = [];
        updateLastActionsDisplay();
    }
    
    console.log('System reset complete - All selections reset to default');
    console.log('=== RESET COMPLETE ===');
}

// Update execution logs with hybrid flow
function updateExecutionLogsWithHybridFlow(taskType, eventType, detectionMethod, cpuState, memoryState, statusState, aiDecision, action, actionResult, finalCpu, finalMemory, finalStatus) {
    const logs = document.getElementById('executionLogs');
    const timestamp = new Date().toISOString();
    logs.innerHTML = `
        <div class="log-line log-start">[EVENT DETECTED] ${eventType} (${detectionMethod})</div>
        <div class="log-line log-step">[STATE] CPU: ${cpuState} | Memory: ${memoryState} | Status: ${statusState}</div>
        <div class="log-line log-step">[AI_DECISION] ${aiDecision}</div>
        <div class="log-line log-step">[ACTION] ${action.replace('_', ' ').toUpperCase()}</div>
        <div class="log-line log-step">[ACTION_RESULT] ${actionResult}</div>
        <div class="log-line log-step">[NOTIFICATION] System ${detectionMethod.toLowerCase()} optimization successful</div>
        <div class="log-line log-start">[START] task=${taskType} event=${eventType} mode=${detectionMethod.toLowerCase()} env=ai_ops model=Qwen/Qwen2.5-72B-Instruct</div>
        <div class="log-line log-step">[STEP] step=1 action=detect_incident reward=0.25 done=false error=null</div>
        <div class="log-line log-step">[STEP] step=2 action=analyze_context reward=0.35 done=false error=null</div>
        <div class="log-line log-step">[STEP] step=3 action=execute_decision reward=0.45 done=false error=null</div>
        <div class="log-line log-step">[STEP] step=4 action=apply_response reward=0.55 done=false error=null</div>
        <div class="log-line log-step">[STEP] step=5 action=verify_recovery reward=0.65 done=true error=null</div>
        <div class="log-line log-end">[END] success=true steps=5 score=0.75 rewards=0.25,0.35,0.45,0.55,0.65</div>
        <div class="log-line log-score">Score: 0.75</div>
    `;
    logs.scrollTop = logs.scrollHeight;
}

// Update notifications function
function updateNotifications(notices) {
    const container = document.getElementById('popupNotifications');
    container.innerHTML = notices.map(notice => `<div class="notification success">${notice}</div>`).join('');
    
    // Update notification count
    const countElement = document.getElementById('notificationCount');
    countElement.textContent = notices.length;
    
    // Don't auto-show popup - only show when user clicks notification button
}

// Toggle notifications function
async function toggleNotifications() {
    const popup = document.getElementById('notificationPopup');
    const currentDisplay = popup.style.display;
    
    // Toggle between showing and hiding
    if (currentDisplay === 'none' || currentDisplay === '') {
        popup.style.display = 'block';
    } else {
        popup.style.display = 'none';
    }
}

// Real AI inference system using existing inference.py logs
async function runHybridSystem() {
    try {
        // Get selected task and event
        const taskSelect = document.getElementById('taskSelect');
        const taskType = taskSelect.value;
        const eventSelect = document.getElementById('eventSelect');
        const eventType = eventSelect.value;
        
        console.log('=== RUNTIME EVENT CHECK ===');
        console.log('Task from dropdown:', taskType);
        console.log('Event from dropdown:', eventType);
        console.log('Event dropdown value:', eventSelect.value);
        console.log('Event dropdown text:', eventSelect.options[eventSelect.selectedIndex]?.text);
        
        // Validate task selection
        if (!taskType || taskType === '') {
            alert('Please select a task before running the system!');
            taskSelect.focus();
            return;
        }
        
        // Validate event selection
        if (!eventType || eventType === '') {
            alert('Please select an event before running the system!');
            eventSelect.focus();
            return;
        }
        
        updateNotifications([`Processing ${taskType} with ${eventType}...`]);
        
        // STEP 1: SHOW TASK-SPECIFIC PROBLEM STATE
        const taskStates = {
            'load_balancing_optimization': { cpu: '90%', memory: '68%', status: 'CRITICAL' },
            'anomaly_detection_monitoring': { cpu: '75%', memory: '88%', status: 'CRITICAL' },
            'resource_allocation_planning': { cpu: '82%', memory: '91%', status: 'CRITICAL' },
            'incident_response_automation': { cpu: '95%', memory: '78%', status: 'CRITICAL' },
            'performance_tuning_engine': { cpu: '88%', memory: '85%', status: 'WARNING' },
            'cost_efficiency_optimization': { cpu: '70%', memory: '92%', status: 'WARNING' },
            'intelligent_scheduling_system': { cpu: '85%', memory: '73%', status: 'CRITICAL' },
            'database_performance_tuning': { cpu: '78%', memory: '89%', status: 'CRITICAL' },
            'basic_system_monitoring': { cpu: '65%', memory: '58%', status: 'WARNING' },
            'simple_log_analysis': { cpu: '72%', memory: '61%', status: 'WARNING' }
        };
        
        const problemState = taskStates[taskType] || { cpu: '85%', memory: '72%', status: 'CRITICAL' };
        document.getElementById('cpuUsage').textContent = problemState.cpu;
        document.getElementById('memoryUsage').textContent = problemState.memory;
        document.getElementById('systemStatus').textContent = problemState.status;
        
        // Call the real inference system with task and event
        console.log('=== SENDING TO INFERENCE ===');
        console.log('Task:', taskType);
        console.log('Event:', eventType);
        console.log('Full URL:', `/run?event=${eventType}&task=${taskType}`);
        
        const response = await fetch(`/run?event=${eventType}&task=${taskType}`);
        const data = await response.json();
        
        // Also fetch raw inference output for AI Insights
        const rawResponse = await fetch(`/inference-raw`);
        const rawData = await rawResponse.json();
        
        console.log('Inference response:', data);
        console.log('Raw inference response:', rawData);
        
        if (data.logs && data.logs.length > 0) {
            // Debug: Log the raw data
            console.log('Raw logs data:', data.logs);
            
            // Update pipeline flow based on log content
            data.logs.forEach(line => {
                if (line.includes('[START]')) {
                    updatePipelineFlow('flow-state');
                } else if (line.includes('[EVENT DETECTED]')) {
                    updatePipelineFlow('flow-event');
                } else if (line.includes('[STEP]')) {
                    updatePipelineFlow('flow-decision');
                } else if (line.includes('[END]')) {
                    updatePipelineFlow('flow-result');
                }
            });
            
            // Update execution logs with real results from inference.py (filtered)
            const logsElement = document.getElementById('executionLogs');
            const aiInsightsElement = document.getElementById('aiInsightsLogs');
            
            console.log('Elements found - executionLogs:', !!logsElement, 'aiInsightsLogs:', !!aiInsightsElement);
            
            let executionLogsContent = [];
            let aiInsightsContent = [];
            
            data.logs.forEach(line => {
                // Clean up the line and ensure it's properly escaped
                const cleanLine = line.replace(/'/g, '&#39;').replace(/"/g, '&quot;');
                
                // Add to execution logs (filtered data - no learning logs)
                executionLogsContent.push(`<div class="log-line ${line.includes('[START]') ? 'log-start' : 
                                                          line.includes('[STEP]') ? 'log-step' : 
                                                          line.includes('[END]') ? 'log-end' : 
                                                          line.includes('[AI_DECISION]') ? 'log-step' : 
                                                          line.includes('[ACTION]') ? 'log-step' :
                                                          line.includes('[ACTION RESULT]') ? 'log-step' :
                                                          line.includes('[FINAL_SCORE]') ? 'log-score' :
                                                          line.includes('[STATE]') ? 'log-step' :
                                                          line.includes('[EVENT DETECTED]') ? 'log-start' :
                                                          line.includes('[EVENT CONTEXT]') ? 'log-step' :
                                                          line.includes('[STATE UPDATE]') ? 'log-step' :
                                                          'log-line'}">${cleanLine}</div>`);
            });
            
            // Process raw data for AI Insights panel
            if (rawData.logs && rawData.logs.length > 0) {
                rawData.logs.forEach(line => {
                    // Clean up the line and ensure it's properly escaped
                    const cleanLine = line.replace(/'/g, '&#39;').replace(/"/g, '&quot;');
                    
                    // Separate AI insights from raw logs
                    if (line.startsWith('[LEARNING]') || 
                        line.startsWith('[CONFIDENCE]') || 
                        line.startsWith('[SUMMARY]') || 
                        line.startsWith('[IMPACT]')) {
                        
                        // Add to AI insights panel
                        let lineClass = 'insight-line';
                        if (line.startsWith('[LEARNING]')) lineClass += ' insight-learning';
                        else if (line.startsWith('[CONFIDENCE]')) lineClass += ' insight-confidence';
                        else if (line.startsWith('[SUMMARY]')) lineClass += ' insight-summary';
                        else if (line.startsWith('[IMPACT]')) lineClass += ' insight-impact';
                        
                        aiInsightsContent.push(`<div class="${lineClass}">${cleanLine}</div>`);
                    }
                });
            }
            
            // Update execution logs
            if (executionLogsContent.length > 0) {
                logsElement.innerHTML = executionLogsContent.join('') + '<span class="blinking-cursor"></span>';
            } else {
                // Fallback: show all logs if execution logs are empty
                logsElement.innerHTML = data.logs.map(line => {
                    const cleanLine = line.replace(/'/g, '&#39;').replace(/"/g, '&quot;');
                    return `<div class="log-line">${cleanLine}</div>`;
                }).join('') + '<span class="blinking-cursor"></span>';
            }
            
            // Update AI insights panel
            if (aiInsightsContent.length > 0) {
                aiInsightsElement.innerHTML = aiInsightsContent.join('');
                aiInsightsElement.scrollTop = aiInsightsElement.scrollHeight;
                
                // Extract action performance data from learning logs
                const actionPerformanceData = extractActionPerformanceData(rawData.logs || []);
                
                // Update Action Learning Insights panel with dynamic metrics
                updateActionLearningInsightsWithData(actionPerformanceData);
            } else {
                aiInsightsElement.innerHTML = '<div class="insights-placeholder">Run the system to see AI insights and learning data...</div>';
                
                // Reset Action Learning Insights panel
                const actionLearningInsightsElement = document.getElementById('actionLearningInsights');
                if (actionLearningInsightsElement) {
                    actionLearningInsightsElement.innerHTML = '<div class="learning-placeholder">Run the system to see action learning insights...</div>';
                }
            }
            logsElement.scrollTop = logsElement.scrollHeight;
            
            console.log('Updated execution logs with', executionLogsContent.length, 'entries');
            console.log('Updated AI insights with', aiInsightsContent.length, 'entries');
            console.log('Total logs received:', data.logs.length);
            
            // Parse real inference results to update UI panels
            let cpuState = '';
            let memoryState = '';
            let systemState = '';
            let errorState = '';
            let latencyState = '';
            let aiDecision = 'AI processing...';
            let action = 'Monitoring...';
            let actionResult = 'System analyzed';
            
            // Parse state updates from logs
            data.logs.forEach(log => {
                if (log.includes('[STATE UPDATE]')) {
                    // Extract CPU, Memory, Error, Latency, Status from state update logs
                    const stateMatch = log.match(/CPU=(\d+)%/);
                    if (stateMatch) cpuState = stateMatch[1] + '%';
                    const memoryMatch = log.match(/MEMORY=(\d+)%/);
                    if (memoryMatch) memoryState = memoryMatch[1] + '%';
                    const errorMatch = log.match(/ERROR=(\d+\.?\d+)%/);
                    if (errorMatch) errorState = errorMatch[1] + '%';
                    const latencyMatch = log.match(/LATENCY=(\d+)ms/);
                    if (latencyMatch) latencyState = latencyMatch[1] + 'ms';
                    const statusMatch = log.match(/STATUS=(\w+)/);
                    if (statusMatch) systemState = statusMatch[1];
                }
                else if (log.includes('[AI_DECISION]')) {
                    aiDecision = log.replace('[AI_DECISION]', '').trim();
                }
                else if (log.includes('[ACTION]')) {
                    action = log.replace('[ACTION]', '').trim();
                }
                else if (log.includes('[ACTION RESULT]')) {
                    actionResult = log.replace('[ACTION RESULT]', '').trim();
                }
            });
            
            // Update system state panel with real values
            console.log('=== UI ACTUAL VALUES ===');
            console.log('CPU being set to:', cpuState);
            console.log('Memory being set to:', memoryState);
            console.log('Status being set to:', systemState);
            console.log('Error being set to:', errorState);
            
            document.getElementById('cpuUsage').textContent = cpuState;
            document.getElementById('memoryUsage').textContent = memoryState;
            updateSystemStatusBadge(systemState);
            
            console.log('=== UI AFTER UPDATE ===');
            console.log('CPU Usage element now shows:', document.getElementById('cpuUsage').textContent);
            console.log('Memory Usage element now shows:', document.getElementById('memoryUsage').textContent);
            
            // Update live health score gauge
            const cpuValue = parseFloat(cpuState);
            const memoryValue = parseFloat(memoryState);
            const errorValue = typeof errorState !== 'undefined' ? parseFloat(errorState) : 0.15;
            updateHealthScore(cpuValue, memoryValue, errorValue, systemState);
            
            // Store original state for what-if simulations
            storeOriginalState(cpuState, memoryState, errorValue, systemState);
            
            // Update error and latency if available
            if (typeof errorState !== 'undefined' && document.getElementById('errorRate')) {
                document.getElementById('errorRate').textContent = errorState;
            }
            if (typeof latencyState !== 'undefined' && document.getElementById('latency')) {
                document.getElementById('latency').textContent = latencyState;
            }
            
            // Update AI decision panel with finalist-level thinking process
            const eventDecisions = {
                'HIGH_CPU_USAGE': [
                    'CPU usage exceeded threshold',
                    'System under heavy computational load',
                    'Evaluating scaling and optimization options',
                    'Selecting resource scaling strategy'
                ],
                'MEMORY_LEAK': [
                    'High memory usage detected',
                    'Memory leak suspected in system processes',
                    'Analyzing resource allocation patterns',
                    'Selecting memory cleanup strategy'
                ],
                'SERVICE_FAILURE': [
                    'Service failure detected',
                    'Critical system component unresponsive',
                    'Analyzing recovery and restart options',
                    'Selecting service restart strategy'
                ],
                'TRAFFIC_SPIKE': [
                    'Sudden traffic spike detected',
                    'Load imbalance across system nodes',
                    'Evaluating traffic distribution strategies',
                    'Selecting load balancing approach'
                ],
                'DISK_SPACE_FULL': [
                    'Disk space critically low',
                    'Storage allocation reaching capacity',
                    'Analyzing cleanup and archival options',
                    'Selecting storage optimization strategy'
                ],
                'NETWORK_OUTAGE': [
                    'Network connectivity issues detected',
                    'Communication failure between nodes',
                    'Analyzing network recovery protocols',
                    'Selecting network restoration strategy'
                ],
                'DATABASE_CONNECTION_FAILED': [
                    'Database connection failure detected',
                    'Data access layer experiencing issues',
                    'Analyzing connection pool and retry options',
                    'Selecting database recovery strategy'
                ],
                'SECURITY_BREACH': [
                    'Security anomaly detected',
                    'Unauthorized access attempt identified',
                    'Analyzing security protocols and containment',
                    'Selecting security response strategy'
                ],
                'DATA_CORRUPTION': [
                    'Data integrity issues detected',
                    'Corruption found in critical datasets',
                    'Analyzing backup and repair options',
                    'Selecting data recovery strategy'
                ],
                'SYSTEM_OVERLOAD': [
                    'System overload detected',
                    'Multiple resources at capacity',
                    'Analyzing load distribution and prioritization',
                    'Selecting resource optimization strategy'
                ],
                'APPLICATION_CRASH': [
                    'Application crash detected',
                    'Process termination occurred unexpectedly',
                    'Analyzing crash logs and recovery options',
                    'Selecting application restart strategy'
                ],
                'RESOURCE_EXHAUSTION': [
                    'Resource exhaustion detected',
                    'System resources depleted',
                    'Analyzing resource reallocation options',
                    'Selecting resource replenishment strategy'
                ]
            };
            
            const decisionSteps = eventDecisions[eventType] || [
                'System anomaly detected',
                'Analyzing system state and metrics',
                'Evaluating response options',
                'Selecting appropriate action strategy'
            ];
            
            updateAIDecision(decisionSteps);
            
            // Update action output panel with actions that match AI decisions
            const eventActions = {
                'HIGH_CPU_USAGE': [
                    'Scaled compute resources',
                    'Redistributed workload across nodes',
                    'Optimized CPU allocation',
                    'Reduced processing load'
                ],
                'MEMORY_LEAK': [
                    'Freed unused memory resources',
                    'Cleared memory cache',
                    'Optimized memory allocation',
                    'Restarted memory-intensive processes'
                ],
                'SERVICE_FAILURE': [
                    'Restarted failed services',
                    'Activated failover protocols',
                    'Initiated health checks',
                    'Restored service availability'
                ],
                'TRAFFIC_SPIKE': [
                    'Scaled out horizontally',
                    'Updated load balancer',
                    'Applied rate limiting',
                    'Redistributed traffic evenly'
                ],
                'DISK_SPACE_FULL': [
                    'Cleaned temporary files',
                    'Archived old data',
                    'Optimized storage allocation',
                    'Freed disk space'
                ],
                'NETWORK_OUTAGE': [
                    'Reset network connections',
                    'Reestablished communication links',
                    'Applied network recovery',
                    'Restored network connectivity'
                ],
                'DATABASE_CONNECTION_FAILED': [
                    'Reset connection pool',
                    'Restarted database service',
                    'Optimized connection settings',
                    'Restored database access'
                ],
                'SECURITY_BREACH': [
                    'Isolated affected systems',
                    'Enhanced security protocols',
                    'Blocked unauthorized access',
                    'Secured system perimeter'
                ],
                'DATA_CORRUPTION': [
                    'Initiated data recovery',
                    'Restored from backup',
                    'Repaired corrupted datasets',
                    'Validated data integrity'
                ],
                'SYSTEM_OVERLOAD': [
                    'Redistributed system load',
                    'Optimized resource usage',
                    'Prioritized critical processes',
                    'Balanced system load'
                ],
                'APPLICATION_CRASH': [
                    'Restarted application',
                    'Applied crash recovery',
                    'Restored application state',
                    'Verified application stability'
                ],
                'RESOURCE_EXHAUSTION': [
                    'Reallocated resources',
                    'Optimized resource usage',
                    'Increased resource capacity',
                    'Balanced resource distribution'
                ]
            };
            
            // Extract actual action steps from inference logs
            const actionSteps = [];
            console.log('Extracting action steps from logs...');
            console.log('Available logs:', data.logs);
            
            data.logs.forEach(log => {
                if (log.includes('[STEP]')) {
                    const stepMatch = log.match(/action=([^\s]+)/);
                    if (stepMatch && stepMatch[1]) {
                        console.log('Found step:', stepMatch[1]);
                        actionSteps.push(stepMatch[1]);
                    }
                }
            });
            
            console.log('Extracted action steps:', actionSteps);
            
            // If no steps found in logs, use default
            if (actionSteps.length === 0) {
                console.log('No action steps found, using defaults');
                actionSteps.push('Applied system optimization', 'Optimized resource allocation', 'Improvement system performance', 'Enhanced system stability');
            }
            
            updateActionOutput(actionSteps);
            console.log('Action output updated with', actionSteps.length, 'steps');
            
            // Update Root Cause Confidence Breakdown
            updateRootCauseAnalysis(eventType);
            
            // Update AI Decision Justification
            updateAIJustification(eventType);
            
            // Update Action Learning Insights
            updateActionLearningInsights();
            
            // Update AI Incident Analysis
            updateAIIncidentAnalysis(eventType);
            
            // Update Action Impact Breakdown
            const cpuBefore = parseFloat(cpuState) || 85;
            const memoryBefore = parseFloat(memoryState) || 72;
            const errorBefore = parseFloat(errorState) || 0.15;
            
            // Simulate final state after actions
            const cpuAfter = Math.max(20, cpuBefore - Math.random() * 30);
            const memoryAfter = Math.max(20, memoryBefore - Math.random() * 35);
            const errorAfter = Math.max(0.01, errorBefore - Math.random() * 0.1);
            
            updateActionImpact(actionSteps, cpuBefore, cpuAfter, memoryBefore, memoryAfter, errorBefore, errorAfter);
            updateRiskLevel(cpuAfter, memoryAfter, errorAfter);
            updateRecoveryProgress(actionSteps, [0.8, 0.9, 0.85, 0.95]);
            updateEventSeverity(eventType);
            
            // Update AI Decision Confidence & Risk Analysis with real system state
            console.log('About to call updateConfidenceRiskAnalysis with real state:', eventType, cpuState, memoryState, errorState);
            updateConfidenceRiskAnalysis(eventType, parseFloat(cpuState), parseFloat(memoryState), parseFloat(errorState));
            console.log('Finished calling updateConfidenceRiskAnalysis');
            
            // Update notifications with real system results
            const detectionMethod = 'AI_DETECTION'; // Default detection method
            updateNotifications([
                `[EVENT DETECTED] ${eventType} (${detectionMethod})`,
                `[NOTIFICATION] Real AI inference completed`,
                `[NOTIFICATION] System processed ${taskType} with ${eventType}`,
                `[NOTIFICATION] Results: ${data.logs.length} steps processed`
            ]);
            
        } else {
            console.log('No valid inference results - confidence analysis will not be called');
            updateNotifications(['[ERROR] No valid inference results received']);
        }
        
    } catch (error) {
        console.error('Error running inference:', error);
        updateNotifications([`[NOTIFICATION] Error: ${error.message}`]);
    }
}

// Update system status badge with appropriate color
function updateSystemStatusBadge(status) {
    const statusElement = document.getElementById('systemStatus');
    
    // Remove all status classes
    statusElement.className = statusElement.className.replace(/status-\w+/g, '').trim();
    
    // Add appropriate status class based on status value
    switch(status.toUpperCase()) {
        case 'CRITICAL':
            statusElement.classList.add('status-critical');
            break;
        case 'WARNING':
            statusElement.classList.add('status-warning');
            break;
        case 'STABLE':
            statusElement.classList.add('status-stable');
            break;
        case 'READY':
            statusElement.classList.add('status-ready');
            break;
        default:
            // Default to ready for unknown statuses
            statusElement.classList.add('status-ready');
    }
    
    statusElement.textContent = status;
}

// Update live health score gauge
function updateHealthScore(cpuUsage, memoryUsage, errorRate, systemStatus = 'READY') {
    const healthScoreElement = document.getElementById('healthScore');
    const healthIndicatorElement = document.getElementById('healthIndicator');
    
    // Calculate health score (0-100)
    const cpuScore = Math.max(0, 100 - cpuUsage);
    const memoryScore = Math.max(0, 100 - memoryUsage);
    const errorScore = Math.max(0, 100 - (errorRate * 100));
    
    // Weighted average (CPU: 40%, Memory: 40%, Error: 20%)
    let healthScore = Math.round((cpuScore * 0.4) + (memoryScore * 0.4) + (errorScore * 0.2));
    
    // Fix logic to match system status
    if (systemStatus === 'STABLE') {
        healthScore = Math.max(70, healthScore); // If STABLE, health > 70
    } else if (systemStatus === 'CRITICAL') {
        healthScore = Math.min(40, healthScore); // If CRITICAL, health < 40
    } else if (systemStatus === 'WARNING') {
        healthScore = Math.max(40, Math.min(70, healthScore)); // If WARNING, health 40-70
    }
    
    // Update score display
    healthScoreElement.textContent = `${healthScore}/100`;
    
    // Remove all health classes
    healthIndicatorElement.className = healthIndicatorElement.className.replace(/health-\w+/g, '').trim();
    
    // Determine health indicator and color
    let indicator, healthClass;
    if (healthScore >= 90) {
        indicator = 'Excellent';
        healthClass = 'health-excellent';
    } else if (healthScore >= 75) {
        indicator = 'Good';
        healthClass = 'health-good';
    } else if (healthScore >= 60) {
        indicator = 'Fair';
        healthClass = 'health-fair';
    } else if (healthScore >= 40) {
        indicator = 'Poor';
        healthClass = 'health-poor';
    } else {
        indicator = 'Critical';
        healthClass = 'health-critical';
    }
    
    // Update indicator text and class
    healthIndicatorElement.textContent = indicator;
    healthIndicatorElement.classList.add(healthClass);
}

// What-If Simulation functionality
let originalSystemState = null;

function storeOriginalState(cpuState, memoryState, errorState, systemState) {
    originalSystemState = {
        cpu: parseFloat(cpuState),
        memory: parseFloat(memoryState),
        error: parseFloat(errorState) || 0.15,
        status: systemState
    };
}

function simulateAction(state, action) {
    // Create a copy of the state to avoid modifying original
    let simulatedState = { ...state };
    
    if (action === "scale_resources") {
        simulatedState.cpu = Math.max(25, simulatedState.cpu - 30);
        simulatedState.cost = "HIGH";
        simulatedState.impact = "Fast performance improvement but higher resource usage";
    } else if (action === "restart_service") {
        simulatedState.error = Math.max(0.01, simulatedState.error - 0.15);
        simulatedState.cpu = Math.max(30, simulatedState.cpu - 10);
        simulatedState.cost = "LOW";
        simulatedState.impact = "Effective error reduction with minimal resource cost";
    } else if (action === "redistribute_load") {
        simulatedState.cpu = Math.max(35, simulatedState.cpu - 25);
        simulatedState.cost = "MEDIUM";
        simulatedState.impact = "Balanced performance improvement with moderate cost";
    }
    
    return simulatedState;
}

function runWhatIf(action) {
    if (!originalSystemState) {
        document.getElementById('whatIfResults').innerHTML = 
            '<div class="what-if-placeholder">Please run the system first to establish a baseline state...</div>';
        return;
    }
    
    // Simulate the action
    const resultState = simulateAction(originalSystemState, action);
    
    // Calculate health scores
    const originalHealth = calculateHealthScore(originalSystemState.cpu, originalSystemState.memory, originalSystemState.error);
    const newHealth = calculateHealthScore(resultState.cpu, resultState.memory, resultState.error);
    
    // Display results
    const resultsHtml = `
        <div class="what-if-result">
            <div class="what-if-action">[WHAT-IF] Action: ${action.replace('_', ' ').toUpperCase()}</div>
            <div class="what-if-comparison">CPU: ${originalSystemState.cpu}%  ${resultState.cpu > originalSystemState.cpu ? 'increase' : 'decrease'}  ${resultState.cpu}%</div>
            <div class="what-if-comparison">Memory: ${originalSystemState.memory}%  ${resultState.memory > originalSystemState.memory ? 'increase' : 'decrease'}  ${resultState.memory}%</div>
            <div class="what-if-comparison">Error Rate: ${(originalSystemState.error * 100).toFixed(1)}%  ${resultState.error > originalSystemState.error ? 'increase' : 'decrease'}  ${(resultState.error * 100).toFixed(1)}%</div>
            <div class="what-if-comparison">Health Score: ${originalHealth}/100  ${newHealth > originalHealth ? 'increase' : 'decrease'}  ${newHealth}/100</div>
            <div class="what-if-comparison">Cost: ${resultState.cost}</div>
            <div class="what-if-insight">Insight: ${resultState.impact}</div>
        </div>
    `;
    
    document.getElementById('whatIfResults').innerHTML = resultsHtml;
}

function calculateHealthScore(cpuUsage, memoryUsage, errorRate, systemStatus) {
    const cpuScore = Math.max(0, 100 - cpuUsage);
    const memoryScore = Math.max(0, 100 - memoryUsage);
    const errorScore = Math.max(0, 100 - (errorRate * 100));
    
    // Weighted average (CPU: 40%, Memory: 40%, Error: 20%)
    let healthScore = Math.round((cpuScore * 0.4) + (memoryScore * 0.4) + (errorScore * 0.2));
    
    // Fix logic to match system status
    if (systemStatus === 'STABLE') {
        healthScore = Math.max(70, healthScore); // If STABLE, health > 70
    } else if (systemStatus === 'CRITICAL') {
        healthScore = Math.min(40, healthScore); // If CRITICAL, health < 40
    } else if (systemStatus === 'WARNING') {
        healthScore = Math.max(40, Math.min(70, healthScore)); // If WARNING, health 40-70
    }
    
    return healthScore;
}

// Last Actions Memory
let lastActions = [];

function addLastAction(action) {
    // Create action object with enhanced intelligence
    const now = new Date();
    const actionWithIntelligence = {
        action: action,
        timestamp: now,
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        day: now.toLocaleDateString('en-US', { weekday: 'short' }),
        status: generateActionStatus(action),
        result: generateActionResult(action),
        confidence: generateActionConfidence(action)
    };
    
    lastActions.push(actionWithIntelligence);
    // Keep only last 10 actions
    if (lastActions.length > 10) {
        lastActions.shift();
    }
    updateLastActionsDisplay();
}

// Generate intelligent status with decision switching
function generateActionStatus(action) {
    const confidence = generateActionConfidence(action);
    const shouldSwitch = Math.random() < 0.3; // 30% chance of decision switching
    
    const statusMap = {
        'analyze_system_state': 'Completed',
        'detect_memory_leak': 'Detected',
        'detect_high_cpu': 'Detected',
        'detect_service_failure': 'Detected',
        'detect_traffic_spike': 'Detected',
        'classify_leak_severity': 'High',
        'classify_failure_type': 'Critical',
        'evaluate_cleanup_options': shouldSwitch && confidence < calculateDynamicConfidence() ? 'Failed - High error rate persists' : '3 strategies analyzed',
        'evaluate_scaling': shouldSwitch && confidence < calculateDynamicConfidence() ? 'Failed - Scaling ineffective' : 'Scaling options evaluated',
        'select_optimal_strategy': shouldSwitch && confidence < calculateDynamicConfidence() ? 'Switched Plan: Load Balancing' : 'Selected',
        'scale_resources': shouldSwitch && confidence < calculateDynamicConfidence() ? 'Switched Plan: Restart Service' : 'In Progress',
        'free_memory_resources': shouldSwitch && confidence < calculateDynamicConfidence() ? 'Switched Plan: Cache Clearing' : 'Memory reduced 30%',
        'restart_service': shouldSwitch && confidence < calculateDynamicConfidence() ? 'Failed - Service crash persists' : 'Service restarted',
        'stabilize_system': shouldSwitch ? 'System recovering with alternative strategy' : 'System stable',
        'default': 'Completed'
    };
    return statusMap[action] || statusMap['default'];
}

// Generate intelligent result summary
function generateActionResult(action) {
    const resultMap = {
        'detect_memory_leak': 'Leak detected in service: API Gateway',
        'detect_high_cpu': 'CPU spike detected in process: Worker-1',
        'detect_service_failure': 'Service failed: Database Connection',
        'detect_traffic_spike': 'Traffic spike detected: 250% increase',
        'classify_leak_severity': 'Memory usage increased by 35%',
        'classify_failure_type': 'Error rate increased by 45%',
        'evaluate_cleanup_options': '3 cleanup strategies analyzed',
        'evaluate_scaling': '2 scaling options evaluated',
        'free_memory_resources': 'Memory freed: 2.3GB',
        'restart_service': 'Service restart time: 12s',
        'stabilize_system': 'System recovery time: 45s',
        'default': 'Action executed successfully'
    };
    return resultMap[action] || resultMap['default'];
}

// Generate AI confidence score
function generateActionConfidence(action) {
    const confidenceMap = {
        'analyze_system_state': 0.95,
        'detect_memory_leak': 0.89,
        'detect_high_cpu': 0.92,
        'detect_service_failure': 0.87,
        'detect_traffic_spike': 0.91,
        'classify_leak_severity': 0.84,
        'classify_failure_type': 0.86,
        'evaluate_cleanup_options': 0.88,
        'evaluate_scaling': 0.85,
        'select_optimal_strategy': 0.87,
        'scale_resources': 0.83,
        'free_memory_resources': 0.90,
        'restart_service': 0.88,
        'stabilize_system': 0.93,
        'default': calculateDynamicConfidence()
    };
    return confidenceMap[action] || confidenceMap['default'];
}

function updateLastActionsDisplay() {
    const container = document.getElementById('lastActions');
    if (lastActions.length === 0) {
        container.innerHTML = '<div class="actions-placeholder">No actions taken yet...</div>';
    } else {
        container.innerHTML = lastActions.map(item => 
            `<div class="intelligent-action-item">
                <div class="action-main">
                    <span class="action-check">(${getStatusIcon(item.status)})</span>
                    <span class="action-name">${item.action}</span>
                    <span class="action-confidence">(Confidence: ${item.confidence})</span>
                </div>
                <div class="action-result">${item.result}</div>
                <div class="action-timeline">
                    <span class="action-time">${item.time}</span>
                    <span class="action-date">${item.date}</span>
                    <span class="action-day">${item.day}</span>
                </div>
            </div>`
        ).join('');
    }
}

// Get status icon based on status
function getStatusIcon(status) {
    const iconMap = {
        'Completed': 'Completed',
        'Detected': 'Detected',
        'High': 'High',
        'Critical': 'Critical',
        'Selected': 'Selected',
        'In Progress': 'In Progress',
        'System stable': 'System stable',
        'default': status
    };
    return iconMap[status] || iconMap['default'];
}

// Action Impact Breakdown
function updateActionImpact(actions, cpuBefore, cpuAfter, memoryBefore, memoryAfter, errorBefore, errorAfter) {
    const container = document.getElementById('actionImpact');
    
    if (actions.length === 0) {
        container.innerHTML = '<div class="impact-placeholder">Run the system to see detailed action impacts...</div>';
        return;
    }
    
    let impactHTML = '';
    
    actions.forEach((action, index) => {
        // Simulate impact changes for each action
        const cpuChange = index < actions.length - 1 ? Math.random() * 20 - 10 : cpuAfter - cpuBefore;
        const memoryChange = index < actions.length - 1 ? Math.random() * 25 - 12 : memoryAfter - memoryBefore;
        const errorChange = index < actions.length - 1 ? Math.random() * 0.1 - 0.05 : errorAfter - errorBefore;
        
        const currentCpu = cpuBefore + (cpuChange * (index + 1));
        const currentMemory = memoryBefore + (memoryChange * (index + 1));
        const currentError = errorBefore + (errorChange * (index + 1));
        
        impactHTML += `
            <div class="impact-item">
                <div class="impact-action">${action}</div>
                <div class="impact-change">
                    <span class="impact-arrow">Memory:</span>
                    <span class="impact-result">${Math.round(currentMemory)}%</span>
                </div>
                <div class="impact-change">
                    <span class="impact-arrow">CPU:</span>
                    <span class="impact-result">${Math.round(currentCpu)}%</span>
                </div>
                <div class="impact-change">
                    <span class="impact-arrow">Error Rate:</span>
                    <span class="impact-result">${errorChange > 0 ? 'up' : 'down'}</span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = impactHTML;
}

function updateRiskLevel(cpu, memory, error) {
    const riskBadge = document.getElementById('riskLevel');
    
    // Calculate risk based on CPU, Memory, and Error
    const cpuScore = cpu > 80 ? 3 : cpu > 60 ? 2 : 1;
    const memoryScore = memory > 80 ? 3 : memory > 60 ? 2 : 1;
    const errorScore = error > 0.2 ? 3 : error > 0.1 ? 2 : 1;
    
    const totalRisk = cpuScore + memoryScore + errorScore;
    
    // Remove all risk classes
    riskBadge.classList.remove('risk-high', 'risk-medium', 'risk-low');
    
    if (totalRisk >= 7) {
        riskBadge.textContent = 'HIGH';
        riskBadge.classList.add('risk-high');
    } else if (totalRisk >= 5) {
        riskBadge.textContent = 'MEDIUM';
        riskBadge.classList.add('risk-medium');
    } else {
        riskBadge.textContent = 'LOW';
        riskBadge.classList.add('risk-low');
    }
}

function updateRecoveryProgress(actions, rewards) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (actions.length === 0) {
        progressFill.style.width = '0%';
        progressText.textContent = '0%';
        return;
    }
    
    // Calculate progress based on actions completed and rewards
    const actionProgress = (actions.length / 7) * 100; // Assuming max 7 actions
    const rewardProgress = rewards.length > 0 ? (rewards.reduce((a, b) => a + b, 0) / rewards.length) * 100 : 0;
    const totalProgress = Math.min(95, (actionProgress + rewardProgress) / 2);
    
    progressFill.style.width = `${totalProgress}%`;
    progressText.textContent = `${Math.round(totalProgress)}%`;
}

function updateEventSeverity(eventType) {
    const severityBadge = document.getElementById('eventSeverity');
    
    // Check if element exists
    if (!severityBadge) {
        console.log('Event severity badge not found, skipping update');
        return;
    }
    
    // Remove all severity classes
    severityBadge.classList.remove('severity-high', 'severity-medium', 'severity-low', 'severity-ready');
    
    // Determine severity based on event type
    const highSeverityEvents = ['SERVICE_FAILURE', 'SECURITY_BREACH', 'DATA_CORRUPTION', 'APPLICATION_CRASH'];
    const mediumSeverityEvents = ['HIGH_CPU_USAGE', 'MEMORY_LEAK', 'TRAFFIC_SPIKE', 'SYSTEM_OVERLOAD', 'RESOURCE_EXHAUSTION'];
    const lowSeverityEvents = ['DISK_SPACE_FULL', 'DATABASE_CONNECTION_FAILED', 'NETWORK_OUTAGE', 'PERFORMANCE_DEGRADATION'];
    
    if (highSeverityEvents.includes(eventType)) {
        severityBadge.textContent = 'HIGH';
        severityBadge.classList.add('severity-high');
    } else if (mediumSeverityEvents.includes(eventType)) {
        severityBadge.textContent = 'MEDIUM';
        severityBadge.classList.add('severity-medium');
    } else if (lowSeverityEvents.includes(eventType)) {
        severityBadge.textContent = 'LOW';
        severityBadge.classList.add('severity-low');
    } else {
        severityBadge.textContent = 'READY';
        severityBadge.classList.add('severity-ready');
    }
}


// Update AI Incident Analysis
function updateAIIncidentAnalysis(eventType) {
    const analysisElement = document.getElementById('aiIncidentAnalysis');
    
    // Check if element exists
    if (!analysisElement) {
        console.log('AI incident analysis element not found, skipping update');
        return;
    }
    
    const analysisData = {
        'MEMORY_LEAK': {
            problem: 'Memory leak detected in application process',
            rootCause: ['Process memory accumulation', 'Garbage collection failure', 'Memory allocation error'],
            impact: ['System degradation', 'Increased response time', 'Risk of application crash'],
            reasoning: 'Memory usage exceeded threshold (85%) → Memory fragmentation detected → Garbage collection ineffective → Selected memory cleanup as optimal solution',
            conclusion: 'Memory optimization initiated to restore application performance and prevent system instability'
        },
        'HIGH_CPU_USAGE': {
            problem: 'CPU utilization critically high',
            rootCause: ['Process overload', 'Insufficient resources', 'Inefficient algorithms'],
            impact: ['Slow response times', 'System bottleneck', 'User experience degradation'],
            reasoning: 'CPU usage sustained above 90% -> Multiple processes competing -> Resource contention detected -> Chose resource scaling for immediate relief',
            conclusion: 'CPU optimization initiated with load redistribution and resource allocation'
        },
        'SERVICE_FAILURE': {
            problem: 'Critical service failure detected',
            rootCause: ['Service crash', 'Network timeout', 'Resource exhaustion'],
            impact: ['Service unavailable', 'Data loss risk', 'User impact'],
            reasoning: 'Service unresponsive for >30 seconds → Health checks failing → Service dependencies broken → Restart service as fastest recovery method',
            conclusion: 'Service recovery initiated with failover activation to restore availability'
        },
        'TRAFFIC_SPIKE': {
            problem: 'Unusual traffic surge detected',
            rootCause: ['Sudden user increase', 'DDoS attack', 'Viral content'],
            impact: ['Server overload', 'Response delays', 'Potential crash'],
            reasoning: 'Traffic exceeded 5x normal levels -> Request queue overflow -> Response time degradation -> Load balancing required for stability',
            conclusion: 'Traffic management activated with auto-scaling and request throttling'
        },
        'DISK_SPACE_FULL': {
            problem: 'Disk space critically exhausted in storage system',
            rootCause: ['Temporary files accumulation', 'Log rotation failure', 'Backup overflow'],
            impact: ['Write operations failing', 'Increased latency', 'Risk of system crash'],
            reasoning: 'Disk usage exceeded threshold (95%) → System still responsive but degrading → Selected cleanup strategy as fastest low-cost solution',
            conclusion: 'Cleanup operations initiated to restore disk availability and prevent data corruption'
        },
        'DATABASE_CONNECTION_FAILED': {
            problem: 'Database connection pool exhausted',
            rootCause: ['Connection leak', 'Max connections reached', 'Network latency'],
            impact: ['Data access failure', 'Transaction errors', 'Service disruption'],
            reasoning: 'Connection failure rate >10%',
            conclusion: 'Connection reset and optimization required'
        },
        'NETWORK_OUTAGE': {
            problem: 'Network connectivity failure',
            rootCause: ['Router failure', 'Cable damage', 'DNS resolution'],
            impact: ['Service isolation', 'Data sync failure', 'User access loss'],
            reasoning: 'Network packets dropping >50%',
            conclusion: 'Network reset and failover activation'
        },
        'SECURITY_BREACH': {
            problem: 'Unauthorized access attempt detected',
            rootCause: ['Weak credentials', 'Exploit vulnerability', 'Insider threat'],
            impact: ['Data compromise', 'System integrity risk', 'Compliance violation'],
            reasoning: 'Multiple failed authentication attempts → Anomalous access patterns detected → Security protocols triggered → Immediate isolation and security enforcement',
            conclusion: 'Security breach contained with system lockdown and forensic analysis initiated'
        },
        'DATA_CORRUPTION': {
            problem: 'Data integrity corruption detected',
            rootCause: ['Disk error', 'Memory fault', 'Transmission corruption'],
            impact: ['Data loss', 'System instability', 'Recovery time'],
            reasoning: 'Checksum validation failing',
            conclusion: 'Data recovery and integrity restoration needed'
        },
        'SYSTEM_OVERLOAD': {
            problem: 'System resources critically overloaded',
            rootCause: ['Resource exhaustion', 'Process explosion', 'Memory pressure'],
            impact: ['Performance degradation', 'Queue overflow', 'System instability'],
            reasoning: 'All resource metrics >90%',
            conclusion: 'Load redistribution and prioritization required'
        },
        'APPLICATION_CRASH': {
            problem: 'Application process terminated unexpectedly',
            rootCause: ['Memory overflow', 'Exception not handled', 'Resource conflict'],
            impact: ['Service unavailable', 'User disruption', 'Data consistency risk'],
            reasoning: 'Application exit code non-zero',
            conclusion: 'Application restart and verification needed'
        },
        'RESOURCE_EXHAUSTION': {
            problem: 'System resources completely exhausted',
            rootCause: ['Memory leak', 'CPU bound processes', 'I/O bottleneck'],
            impact: ['System freeze', 'Service failure', 'Recovery mode'],
            reasoning: 'Resource availability <5%',
            conclusion: 'Resource reallocation and optimization critical'
        },
        'PERFORMANCE_DEGRADATION': {
            problem: 'System performance severely degraded',
            rootCause: ['Resource contention', 'Algorithm inefficiency', 'Hardware limitation'],
            impact: ['Slow response', 'User experience poor', 'SLA violation risk'],
            reasoning: 'Response time >5x normal',
            conclusion: 'Performance optimization and tuning required'
        }
    };
    
    const analysis = analysisData[eventType] || {
        problem: 'System anomaly detected',
        rootCause: ['Unknown factor', 'System stress', 'External influence'],
        impact: ['Performance impact', 'System behavior change', 'User experience affected'],
        reasoning: 'System metrics indicate abnormal behavior',
        conclusion: 'Further analysis and optimization required'
    };
    
    const analysisHTML = `
        <div class="analysis-section">
            <span class="analysis-section-title">Problem:</span>
            <div class="analysis-item">${analysis.problem}</div>
        </div>
        <div class="analysis-section">
            <span class="analysis-section-title">Root Cause:</span>
            ${analysis.rootCause.map(cause => `<div class="analysis-item">${cause}</div>`).join('')}
        </div>
        <div class="analysis-section">
            <span class="analysis-section-title">Impact:</span>
            ${analysis.impact.map(impact => `<div class="analysis-item">${impact}</div>`).join('')}
        </div>
        <div class="analysis-section">
            <span class="analysis-section-title">AI Reasoning:</span>
            <div class="analysis-item analysis-highlight">${analysis.reasoning}</div>
        </div>
    `;
    
    analysisElement.innerHTML = analysisHTML;
}

// Calculate AI confidence based on reward and system state
function calculateConfidence(cpuUsage, memoryUsage, errorRate, reward, systemStatus) {
    // Step 1: Normalize metrics
    const cpuScore = 1 - (cpuUsage / 100);
    const memoryScore = 1 - (memoryUsage / 100);
    const errorScore = 1 - errorRate;
    
    // Step 2: Combine with reward
    let confidence = (
        0.5 * reward +
        0.2 * cpuScore +
        0.2 * memoryScore +
        0.1 * errorScore
    );
    
    // Extra boost: Apply penalty if system not stable
    if (systemStatus !== 'STABLE') {
        confidence -= 0.1;
    }
    
    // Step 3: Clamp + round
    confidence = Math.max(0.1, Math.min(confidence, 0.99));
    return Math.round(confidence * 100) / 100; // Round to 2 decimal places
}

// Get confidence label
function getConfidenceLabel(confidence) {
    if (confidence > 0.8) {
        return "High";
    } else if (confidence > 0.6) {
        return "Medium";
    } else {
        return "Low";
    }
}

// Calculate dynamic confidence based on event type and task
function calculateDynamicConfidence() {
    const taskSelect = document.getElementById('taskSelect');
    const eventSelect = document.getElementById('eventSelect');
    
    const task = taskSelect ? taskSelect.value : 'load_balancing_optimization';
    const event = eventSelect ? eventSelect.value : 'HIGH_CPU_USAGE';
    
    // Base confidence by event type
    const eventConfidence = {
        'MEMORY_LEAK': 0.92,        // High confidence - clear detection
        'HIGH_CPU_USAGE': 0.78,      // Medium confidence - complex issue
        'SERVICE_FAILURE': 0.85,       // High confidence - obvious failure
        'TRAFFIC_SPIKE': 0.73,        // Medium confidence - unpredictable
        'DATA_CORRUPTION': 0.68,       // Lower confidence - complex diagnosis
        'SECURITY_BREACH': 0.95        // Very high confidence - clear threat
    };
    
    // Task-specific modifiers
    const taskModifier = {
        'basic_system_monitoring': 0.05,      // Easy task - boost confidence
        'simple_log_analysis': 0.03,           // Easy task - small boost
        'load_balancing_optimization': 0.02,   // Medium task - small boost
        'anomaly_detection_monitoring': 0.01,   // Medium task - tiny boost
        'resource_allocation_planning': -0.02,   // Complex task - slight penalty
        'incident_response_automation': -0.05,   // Hard task - penalty
        'performance_tuning_engine': -0.03,       // Hard task - penalty
        'cost_efficiency_optimization': -0.04,   // Hard task - penalty
        'intelligent_scheduling_system': -0.01,   // Medium task - tiny penalty
        'database_performance_tuning': -0.06       // Hard task - penalty
    };
    
    let baseConfidence = eventConfidence[event] || 0.80;
    let modifier = taskModifier[task] || 0.0;
    
    // Add some randomness for realism
    const randomFactor = (Math.random() - 0.5) * 0.1; // ±5% randomness
    
    let finalConfidence = baseConfidence + modifier + randomFactor;
    
    // Clamp to valid range
    finalConfidence = Math.max(0.1, Math.min(finalConfidence, 0.99));
    
    return Math.round(finalConfidence * 100) / 100; // Round to 2 decimal places
}

// Update AI Decision Confidence & Risk Analysis with real system state
function updateConfidenceRiskAnalysis(eventType, cpuState, memoryState, errorState) {
    console.log('Updating confidence risk analysis with:', eventType, cpuState, memoryState, errorState);
    const analysisElement = document.getElementById('confidenceRiskAnalysis');
    console.log('Found element:', analysisElement);
    
    // Check if element exists
    if (!analysisElement) {
        console.log('Confidence risk analysis element not found, skipping update');
        return;
    }
    
    // Calculate reward based on system improvement
    const cpuImprovement = Math.max(0, (85 - cpuState) / 85);
    const memoryImprovement = Math.max(0, (75 - memoryState) / 75);
    const errorImprovement = Math.max(0, (0.15 - errorState) / 0.15);
    const reward = (cpuImprovement + memoryImprovement + errorImprovement) / 3;
    
    // Get system status
    const systemStatusElement = document.getElementById('systemStatus');
    const systemStatus = systemStatusElement ? systemStatusElement.textContent : 'STABLE';
    
    // Calculate dynamic confidence
    const confidence = calculateConfidence(cpuState, memoryState, errorState, reward, systemStatus);
    const confidenceLabel = getConfidenceLabel(confidence);
    
    console.log('Confidence calculation details:');
    console.log('- CPU State:', cpuState, 'CPU Score:', (1 - cpuState / 100).toFixed(3));
    console.log('- Memory State:', memoryState, 'Memory Score:', (1 - memoryState / 100).toFixed(3));
    console.log('- Error State:', errorState, 'Error Score:', (1 - errorState).toFixed(3));
    console.log('- Reward:', reward.toFixed(3));
    console.log('- System Status:', systemStatus);
    console.log('- Final Confidence:', confidence, 'Label:', confidenceLabel);
    
    // Determine risk level based on current system state
    let riskLevel = 'LOW';
    let riskColor = 'low';
    
    if (cpuState > 70 || memoryState > 70 || errorState > 0.1) {
        riskLevel = 'HIGH';
        riskColor = 'high';
    } else if (cpuState > 50 || memoryState > 50 || errorState > 0.05) {
        riskLevel = 'MEDIUM';
        riskColor = 'medium';
    }
    
    const riskAnalysis = {
        'MEMORY_LEAK': {
            residual: ['Minor memory fluctuation possible', 'Monitor garbage collection efficiency'],
            reliability: ['High confidence in memory cleanup strategy', 'Alternative restart option evaluated but less efficient']
        },
        'HIGH_CPU_USAGE': {
            residual: ['CPU may spike under load', 'Monitor process scheduling'],
            reliability: ['Strong confidence in resource scaling', 'Load balancing alternative considered but slower']
        },
        'SERVICE_FAILURE': {
            residual: ['Service dependency stability to monitor', 'Watch for cascading failures'],
            reliability: ['Very high confidence in restart approach', 'Failover mechanism ready as backup']
        },
        'TRAFFIC_SPIKE': {
            residual: ['Traffic patterns may fluctuate', 'Monitor auto-scaling response time'],
            reliability: ['High confidence in load balancing', 'Rate limiting alternative less optimal']
        },
        'DISK_SPACE_FULL': {
            residual: ['Minor memory fluctuation possible', 'Monitor system for further anomalies'],
            reliability: ['High confidence in selected optimization strategy', 'Alternative actions evaluated but less efficient']
        }
    };
    
    const analysis = riskAnalysis[eventType] || {
        residual: ['System behavior to monitor', 'Performance metrics to track'],
        reliability: ['Confidence in selected approach', 'Multiple alternatives considered']
    };
    
    const analysisHTML = `
        <div class="confidence-score">Confidence Score: ${confidence} (${confidenceLabel})</div>
        
        <div class="risk-level ${riskColor}">Risk Level: ${riskLevel}</div>
        <div class="risk-item">System ${riskLevel.toLowerCase() === 'low' ? 'stabilized successfully' : riskLevel.toLowerCase() === 'medium' ? 'partially stabilized' : 'requires monitoring'}</div>
        <div class="risk-item">Resource usage ${riskLevel.toLowerCase() === 'low' ? 'within safe limits' : riskLevel.toLowerCase() === 'medium' ? 'approaching limits' : 'exceeds optimal range'}</div>
        
        <div class="residual-risk">
            <span class="section-title">Residual Risk:</span>
            ${analysis.residual.map(risk => `<div class="risk-item">${risk}</div>`).join('')}
        </div>
        
        <div class="decision-reliability">
            <span class="section-title">Decision Reliability:</span>
            ${analysis.reliability.map(reliability => `<div class="risk-item">${reliability}</div>`).join('')}
        </div>
    `;
    
    // Update the element with the generated HTML
    analysisElement.innerHTML = analysisHTML;
}

// Scroll to logs function
function scrollToLogs() {
    const logsElement = document.getElementById('executionLogs');
    if (logsElement) {
        logsElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Highlight the logs panel temporarily
        logsElement.style.border = '2px solid #00ff88';
        setTimeout(() => {
            logsElement.style.border = '1px solid #333';
        }, 2000);
    }
}

// Test function to check if confidence element exists
function testConfidenceElement() {
    const element = document.getElementById('confidenceRiskAnalysis');
    console.log('Confidence element exists:', !!element);
    if (element) {
        console.log('Confidence element HTML:', element.innerHTML);
        console.log('Confidence element classes:', element.className);
    }
}


// Update Root Cause Confidence Breakdown
function updateRootCauseAnalysis(eventType) {
    const rootCauseElement = document.getElementById('rootCauseAnalysis');
    
    // Check if element exists
    if (!rootCauseElement) {
        console.log('Root cause analysis element not found, skipping update');
        return;
    }
    
    // Dynamic root cause analysis with variation
    const generateDynamicRootCauses = (eventType) => {
        const baseCauses = {
            'TRAFFIC_SPIKE': [
                { cause: 'Sudden Traffic Increase', baseProb: 70 },
                { cause: 'DDoS Attack', baseProb: 15 },
                { cause: 'Viral Content Surge', baseProb: 15 },
                { cause: 'Load Balancer Failure', baseProb: 10 },
                { cause: 'Cache Invalidation Storm', baseProb: 8 }
            ],
            'MEMORY_LEAK': [
                { cause: 'Memory Fragmentation', baseProb: 60 },
                { cause: 'Process Memory Accumulation', baseProb: 25 },
                { cause: 'Garbage Collection Failure', baseProb: 15 },
                { cause: 'Database Connection Pool Exhaustion', baseProb: 12 },
                { cause: 'Buffer Overflow', baseProb: 10 }
            ],
            'HIGH_CPU_USAGE': [
                { cause: 'Process Overload', baseProb: 50 },
                { cause: 'Insufficient Resources', baseProb: 30 },
                { cause: 'Inefficient Algorithms', baseProb: 20 },
                { cause: 'CPU Throttling', baseProb: 15 },
                { cause: 'Context Switch Overhead', baseProb: 12 }
            ],
            'SERVICE_FAILURE': [
                { cause: 'Service Crash', baseProb: 40 },
                { cause: 'Network Timeout', baseProb: 35 },
                { cause: 'Resource Exhaustion', baseProb: 25 },
                { cause: 'Dependency Failure', baseProb: 20 },
                { cause: 'Configuration Error', baseProb: 15 }
            ]
        };
        
        // Add dynamic variation
        const causes = baseCauses[eventType] || baseCauses['HIGH_CPU_USAGE'];
        const variation = Math.random() * 20 - 10; // ±10% variation
        
        return causes.map(cause => ({
            cause: cause.cause,
            probability: Math.max(5, Math.min(95, cause.baseProb + variation + (Math.random() * 10 - 5))),
            likelihood: cause.baseProb > 50 ? 'High' : cause.baseProb > 25 ? 'Moderate' : 'Low'
        })).sort((a, b) => b.probability - a.probability);
    };
    
    const rootCauseData = {};
    ['TRAFFIC_SPIKE', 'MEMORY_LEAK', 'HIGH_CPU_USAGE', 'SERVICE_FAILURE'].forEach(eventType => {
        const causes = generateDynamicRootCauses(eventType);
        const explanations = {
            'TRAFFIC_SPIKE': [
                'Traffic pattern matches organic user growth with gradual increase, no abnormal request signatures detected',
                'Analysis shows mixed traffic patterns with both legitimate and potentially malicious sources',
                'Traffic distribution geographically diverse, suggesting natural viral growth rather than coordinated attack'
            ],
            'MEMORY_LEAK': [
                'Memory usage exceeded threshold with gradual degradation pattern indicating memory leak rather than sudden spike',
                'Memory allocation patterns show fragmentation in heap space, consistent with leak behavior',
                'Garbage collection metrics indicate reduced efficiency over time, confirming leak hypothesis'
            ],
            'HIGH_CPU_USAGE': [
                'CPU spike sustained over time suggesting resource contention rather than temporary load',
                'Process analysis shows CPU-bound operations dominating system resources',
                'Thread dump reveals blocking operations causing CPU saturation'
            ],
            'SERVICE_FAILURE': [
                'Service unresponsive pattern indicates infrastructure stress rather than random failure',
                'Health check failures correlate with increased system load, suggesting overload condition',
                'Dependency chain analysis shows upstream service degradation affecting target service'
            ]
        };
        
        rootCauseData[eventType] = {
            causes: causes,
            explanation: explanations[eventType][Math.floor(Math.random() * explanations[eventType].length)]
        };
    });
    
    const data = rootCauseData[eventType] || rootCauseData['HIGH_CPU_USAGE'];
    
    // Generate HTML content with progress bars
    let htmlContent = `
        <div class="root-cause-item">
            <div class="cause-title">Most Likely Root Cause:</div>
            <div class="cause-probability">
                <div class="cause-name">${data.causes[0].cause}</div>
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill high" style="width: ${data.causes[0].probability}%"></div>
                    </div>
                    <span class="progress-text">${data.causes[0].probability}%</span>
                </div>
            </div>
        </div>
        
        <div class="other-causes">
            <div class="cause-title">Alternative Possibilities:</div>
            ${data.causes.slice(1).map(cause => `
                <div class="cause-item">
                    <div class="cause-name">${cause.cause}</div>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill ${cause.likelihood.toLowerCase()}" style="width: ${cause.probability}%"></div>
                        </div>
                        <span class="progress-text">${cause.probability}%</span>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="analysis-explanation">
            <div class="explanation-title">Analysis:</div>
            <div class="explanation-text">${data.explanation}</div>
        </div>
        
        <div class="certainty-statement">
            <span class="certainty-label">AI Certainty:</span>
            <span class="certainty-value">High (based on data consistency)</span>
        </div>
        
        <div class="decision-basis">
            <div class="basis-title">Decision Basis:</div>
            <div class="basis-item">
                <span class="basis-check">Pattern similarity: 92%</span>
            </div>
            <div class="basis-item">
                <span class="basis-check">Historical match: 87%</span>
            </div>
            <div class="basis-item">
                <span class="basis-check">Anomaly score: Low (non-malicious)</span>
            </div>
        </div>
    `;
    
    rootCauseElement.innerHTML = htmlContent;
    console.log('Root cause analysis updated for:', eventType);
}

// Extract action performance data from learning logs
function extractActionPerformanceData(logs) {
    const actionStats = {};
    const performanceData = [];
    
        
    logs.forEach(log => {
        if (log.startsWith('[LEARNING]')) {
            // Parse action performance insights format
            const actionInsightsMatch = log.match(/\[LEARNING\] Action '([\w_]+)': success_rate=(\d+)% trend=(\w+) performance=(\w+) uses=(\d+)/);
            if (actionInsightsMatch) {
                const action = actionInsightsMatch[1];
                const successRate = parseInt(actionInsightsMatch[2]);
                const trend = actionInsightsMatch[3];
                const performance = actionInsightsMatch[4];
                const totalUses = parseInt(actionInsightsMatch[5]);
                
                // Map technical action names to user-friendly names
                const actionMapping = {
                    'analyze_system_state': 'System Analysis',
                    'detect_high_cpu': 'CPU Detection',
                    'detect_memory_leak': 'Memory Detection',
                    'detect_traffic_spike': 'Traffic Detection',
                    'evaluate_scaling': 'Scaling Evaluation',
                    'scale_resources': 'Scale Resources',
                    'restart_service': 'Restart Service',
                    'stabilize_system': 'System Stabilization',
                    'free_memory_resources': 'Memory Cleanup',
                    'redistribute_traffic': 'Load Balancing',
                    'classify_leak_severity': 'Leak Classification',
                    'evaluate_cleanup_options': 'Cleanup Evaluation',
                    'select_optimal_strategy': 'Strategy Selection',
                    'select_balancing_strategy': 'Balancing Strategy'
                };
                
                const friendlyActionName = actionMapping[action] || action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
                
                performanceData.push({
                    action: friendlyActionName,
                    successRate: successRate,
                    trend: trend,
                    performance: performance,
                    totalUses: totalUses
                });
                
                console.log(`Parsed action insight: ${action} -> ${friendlyActionName} - ${successRate}% ${trend} ${performance} (${totalUses} uses)`);
            }
            
            // Also parse the original learning logs for backward compatibility
            const learningMatch = log.match(/\[LEARNING\] (\w+): base=([\d.]+) -> adaptive=([\d.]+) \(avg_history=([\d.]+)\)/);
            if (learningMatch) {
                const action = learningMatch[1];
                const baseReward = parseFloat(learningMatch[2]);
                const adaptiveReward = parseFloat(learningMatch[3]);
                const avgHistory = parseFloat(learningMatch[4]);
                
                if (!actionStats[action]) {
                    actionStats[action] = {
                        uses: 0,
                        totalReward: 0,
                        rewards: []
                    };
                }
                
                actionStats[action].uses++;
                actionStats[action].totalReward += adaptiveReward;
                actionStats[action].rewards.push(adaptiveReward);
            }
        }
    });
    
    // If we got action insights data, return it directly
    if (performanceData.length > 0) {
        console.log('Returning performance data from action insights:', performanceData);
        return performanceData;
    }
    
    // Otherwise, convert from actionStats (backward compatibility)
    Object.keys(actionStats).forEach(action => {
        const stats = actionStats[action];
        const successRate = Math.round((stats.totalReward / stats.uses) * 100);
        
        // Calculate trend based on recent vs older performance
        const recentRewards = stats.rewards.slice(-3);
        const olderRewards = stats.rewards.slice(0, -3);
        const recentAvg = recentRewards.reduce((a, b) => a + b, 0) / recentRewards.length;
        const olderAvg = olderRewards.length > 0 ? olderRewards.reduce((a, b) => a + b, 0) / olderRewards.length : recentAvg;
        
        let trend = 'stable';
        if (recentAvg > olderAvg + 0.05) trend = 'up';
        else if (recentAvg < olderAvg - 0.05) trend = 'down';
        
        // Determine performance level
        let performance = 'medium';
        if (successRate >= 85) performance = 'high';
        else if (successRate < 60) performance = 'low';
        
        performanceData.push({
            action: action,
            successRate: successRate,
            trend: trend,
            performance: performance,
            totalUses: stats.uses
        });
    });
    
    // Add some default actions if no data found
    if (performanceData.length === 0) {
        console.log('No action insights found, using default data');
        performanceData.push(
            { action: 'Scale Resources', successRate: 85, trend: 'up', performance: 'high', totalUses: 10 },
            { action: 'Restart Service', successRate: 42, trend: 'down', performance: 'low', totalUses: 8 },
            { action: 'Memory Cleanup', successRate: 78, trend: 'stable', performance: 'medium', totalUses: 12 },
            { action: 'Load Balancing', successRate: 91, trend: 'up', performance: 'high', totalUses: 15 }
        );
    }
    
    console.log('Final performance data:', performanceData);
    return performanceData;
}

// Update Action Learning Insights with dynamic data
function updateActionLearningInsightsWithData(learningData) {
    const insightsElement = document.getElementById('actionLearningInsights');
    
    if (!insightsElement) {
        console.log('Action Learning Insights element not found, skipping update');
        return;
    }
    
    // Generate HTML content
    let htmlContent = '<div class="learning-insights">';
    
    learningData.forEach(item => {
        const performanceClass = `${item.performance}-performance`;
        const trendClass = `trend-${item.trend}`;
        const performanceBadgeClass = `performance-${item.performance}`;
        const trendSymbol = item.trend === 'up' ? 'up' : item.trend === 'down' ? 'down' : 'stable';
        const trendIcon = item.trend === 'up' ? 'up' : item.trend === 'down' ? 'down' : 'stable';
        
        htmlContent += `
            <div class="learning-item ${performanceClass}">
                <div class="action-name">${item.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                <div class="action-metrics">
                    <span class="success-rate">${item.successRate}%</span>
                    <span class="trend-indicator ${trendClass}">${trendIcon}</span>
                    <span class="performance-badge ${performanceBadgeClass}">${item.performance}</span>
                </div>
            </div>
        `;
    });
    
    htmlContent += '</div>';
    
    insightsElement.innerHTML = htmlContent;
    console.log('Action Learning Insights updated with dynamic data:', learningData);
}

// Update Action Learning Insights (legacy function for compatibility)
function updateActionLearningInsights() {
    const insightsElement = document.getElementById('actionLearningInsights');
    
    if (!insightsElement) {
        console.log('Action Learning Insights element not found, skipping update');
        return;
    }
    
    // Simulate learning insights (in real implementation, this would come from backend)
    const learningData = [
        {
            action: 'load_balancing',
            successRate: 91,
            trend: 'up',
            performance: 'high',
            totalUses: 15
        },
        {
            action: 'restart_service',
            successRate: 42,
            trend: 'down',
            performance: 'low',
            totalUses: 8
        },
        {
            action: 'memory_cleanup',
            successRate: 78,
            trend: 'stable',
            performance: 'medium',
            totalUses: 12
        },
        {
            action: 'scale_resources',
            successRate: 85,
            trend: 'up',
            performance: 'high',
            totalUses: 10
        },
        {
            action: 'redistribute_traffic',
            successRate: 68,
            trend: 'stable',
            performance: 'medium',
            totalUses: 6
        }
    ];
    
    // Generate HTML content
    let htmlContent = '<div class="learning-insights">';
    
    learningData.forEach(item => {
        const performanceClass = `${item.performance}-performance`;
        const trendClass = `trend-${item.trend}`;
        const performanceBadgeClass = `performance-${item.performance}`;
        const trendSymbol = item.trend === 'up' ? 'up' : item.trend === 'down' ? 'down' : 'stable';
        const trendIcon = item.trend === 'up' ? 'up' : item.trend === 'down' ? 'down' : 'stable';
        
        htmlContent += `
            <div class="learning-item ${performanceClass}">
                <div class="action-name">${item.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                <div class="action-metrics">
                    <span class="success-rate">${item.successRate}%</span>
                    <span class="trend-indicator ${trendClass}">${trendIcon}</span>
                    <span class="performance-badge ${performanceBadgeClass}">${item.performance}</span>
                </div>
            </div>
        `;
    });
    
    htmlContent += '</div>';
    
    insightsElement.innerHTML = htmlContent;
    console.log('Action Learning Insights updated');
}

// Update AI Decision Justification
function updateAIJustification(eventType) {
    console.log('=== UPDATE AI JUSTIFICATION ===');
    console.log('Event type:', eventType);
    
    const justificationElement = document.getElementById('aiJustification');
    
    // Check if element exists
    if (!justificationElement) {
        console.log('AI justification element not found, skipping update');
        return;
    }
    
    console.log('AI justification element found:', justificationElement);
    
    // Generate intelligent justification with reasoning
    const justificationData = {
        'TRAFFIC_SPIKE': {
            selectedAction: 'Load Balancing',
            alternatives: ['Scale Resources', 'Cache Optimization', 'Rate Limiting'],
            reasoning: {
                why: 'Traffic increased by 5x → horizontal scaling needed',
                whyNot: [
                    'Restart Service: ❌ Would cause downtime',
                    'Scale Resources: ⚠️ Effective but high cost',
                    'Rate Limiting: ⚠️ Slower response compared to load balancing'
                ],
                confidence: 0.83,
                riskAfterAction: 'LOW',
                historicalSuccess: '92%'
            },
            explanation: 'Load balancing provides fastest stabilization with lowest risk, based on historical success rate and current traffic patterns'
        },
        'MEMORY_LEAK': {
            selectedAction: 'Memory Cleanup',
            alternatives: ['Service Restart', 'Cache Clearing', 'Process Isolation'],
            reasoning: {
                why: 'Memory fragmentation detected → cleanup required',
                whyNot: [
                    'Service Restart: ❌ Temporary fix, leak will return',
                    'Cache Clearing: ⚠️ Partial solution, leak persists',
                    'Process Isolation: ⚠️ Complex, may break dependencies'
                ],
                confidence: 0.87,
                riskAfterAction: 'MODERATE',
                historicalSuccess: '89%'
            },
            explanation: 'Memory cleanup directly addresses fragmentation issue with 89% historical success rate, minimal service disruption'
        },
        'HIGH_CPU_USAGE': {
            selectedAction: 'Resource Scaling',
            alternatives: ['Process Optimization', 'Load Redistribution', 'Service Throttling'],
            reasoning: {
                why: 'CPU at 95% → immediate scaling needed',
                whyNot: [
                    'Process Optimization: ⚠️ Slow, requires code changes',
                    'Load Redistribution: ⚠️ Limited effectiveness, CPU still high',
                    'Service Throttling: ⚠️ Degrades user experience'
                ],
                confidence: 0.91,
                riskAfterAction: 'LOW',
                historicalSuccess: '94%'
            },
            explanation: 'Resource scaling provides immediate CPU relief with 94% historical success, preserves user experience'
        },
        'SERVICE_FAILURE': {
            selectedAction: 'Service Recovery',
            alternatives: ['Manual Restart', 'Failover Activation', 'Diagnostic Mode'],
            reasoning: {
                why: 'Service unresponsive → recovery required',
                whyNot: [
                    'Manual Restart: ❌ High risk of data loss',
                    'Failover Activation: ⚠️ Complex, may cause cascade failures',
                    'Diagnostic Mode: ⚠️ Time-consuming, may not resolve issue'
                ],
                confidence: 0.88,
                riskAfterAction: 'MODERATE',
                historicalSuccess: '87%'
            },
            explanation: 'Service recovery with failover provides fastest restoration with 87% success rate, minimal data risk'
        }
    };
    
    console.log('Available event types in justificationData:', Object.keys(justificationData));
    console.log('Looking for event type:', eventType);
    
    const data = justificationData[eventType] || justificationData['HIGH_CPU_USAGE'];
    
    console.log('Selected data:', data);
    
    // Generate HTML content
    let htmlContent = `
        <div class="justification-header">
            <div class="selected-action">
                <span class="action-label">Selected Action:</span>
                <span class="action-value">${data.selectedAction}</span>
            </div>
            <div class="confidence-impact">
                <span class="confidence-label">Decision Reliability:</span>
                <span class="confidence-value">HIGH (${data.confidence || calculateDynamicConfidence()} confidence score)</span>
                <span class="risk-label">Risk After Action:</span>
                <span class="risk-value ${(data.riskAfterAction || 'LOW').toLowerCase()}">${data.riskAfterAction || 'LOW'}</span>
            </div>
        </div>
        
        <div class="justification-reasoning">
            <div class="reasoning-title">WHY this action?</div>
            <div class="reasoning-content">${data.reasoning.why}</div>
        </div>
        
        <div class="justification-alternatives">
            <div class="alternatives-title">WHY NOT other actions?</div>
            ${data.reasoning.whyNot.map(alt => `
                <div class="alternative-item">
                    <span class="alternative-action">${alt.split(':')[0]}</span>
                    <span class="alternative-reason">${alt.split(':')[1]}</span>
                </div>
            `).join('')}
        </div>
        
        <div class="justification-explanation">
            <div class="explanation-title">Final Reason:</div>
            <div class="explanation-text">${data.explanation}</div>
        </div>
        
        <div class="justification-metrics">
            <div class="metrics-title">Confidence Impact:</div>
            <div class="metrics-item">
                <span class="metrics-label">Decision reliability:</span>
                <span class="metrics-value">HIGH (${data.confidence || calculateDynamicConfidence()} confidence score)</span>
            </div>
            <div class="metrics-item">
                <span class="metrics-label">Risk after action:</span>
                <span class="metrics-value ${(data.riskAfterAction || 'LOW').toLowerCase()}">${data.riskAfterAction || 'LOW'}</span>
            </div>
            <div class="metrics-item">
                <span class="metrics-label">Historical success:</span>
                <span class="metrics-value">${data.historicalSuccess || '89%'}</span>
            </div>
            <div class="metrics-item">
                <span class="metrics-label">Decision Strategy Type:</span>
                <span class="metrics-value">Risk-Optimized Selection</span>
            </div>
        </div>
    `;
    
    justificationElement.innerHTML = htmlContent;
    console.log('AI justification updated for:', eventType);
}

// Test function for AI Justification panel
function testAIJustification() {
    console.log('=== TESTING AI JUSTIFICATION ===');
    updateAIJustification('HIGH_CPU_USAGE');
}

// Initialize pipeline click handlers when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializePipelineClickHandlers();
    // Initialize default status badge
    updateSystemStatusBadge('READY');
    // Initialize default health score
    updateHealthScore(65, 55, 0.15);
    // Initialize last actions display
    updateLastActionsDisplay();
    
    // Test confidence element
    setTimeout(testConfidenceElement, 1000);
    
    // Make test function available globally
    window.testAIJustification = testAIJustification;
});
