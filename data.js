// const data = {
//     uniqueCategories: [
//         "UI Performance Issues",
//         "Batch Performance Issues",
//         "Invoice Functionality",
//         "Process Container Issues",
//         "Kafka Issues",
//         "UI Level Issues",
//         "File Upload",
//         "Pricing"
//     ],
//     commonSymptoms: {
//         "UI Performance Issues": [
//             "Slow loading times",
//             "Crashes or freezes",
//             "Unresponsive UI elements"
//         ],
//         "Batch Performance Issues": [
//             "Elongated Job execution time - Job hanging",
//             "Batch job failed with error",
//             "Recurring pricing is long running"
//         ]
//     },
//     possibleCauses: {
//         "Slow loading times": [
//             "Server overload",
//             "High database response time"
//         ],
//         "Crashes or freezes": [
//             "Memory leaks",
//             "Load balancing issues"
//         ]
//     }
// };

// Ensure `module.exports` exports the correct structure

const data = {
    uniqueCategories: [
        "UI Performance Issues",
        "Batch Performance Issues",
        "Invoice Functionality",
        "Process Container Issues",
        "Kafka Issues",
        "UI Level Issues",
        "File Upload",
        "Pricing"
    ],
    commonSymptoms: {
        "UI Performance Issues": [
            "Slow loading times",
            "Crashes or freezes",
            "Unresponsive UI elements"
        ],
        "Batch Performance Issues": [
            "Elongated Job execution time - Job hanging",
            "Batch job failed with error",
            "Recurring pricing is long running"
        ],
        "Invoice Functionality": [
            "Direct debit amount is wrong",
            "Invoice job ended with errors"
        ],
        "Process Container Issues": [
            "Process Container Not starting",
            "Out of memory error while restarting"
        ],
        "Kafka Issues": [
            "Kafka Startup Error",
            "Huge amount of logs getting accumulated"
        ],
        "UI Level Issues": [
            "Record Locked error in edit mode",
            "Drop-down options missing intermittently",
            "UI screen takes time to refresh"
        ],
        "File Upload": [
            "File upload not working",
            "Slow file upload speeds"
        ],
        "Pricing": [
            "High CPU utilization and memory usage",
            "Incorrect pricing applied"
        ]
    },
    possibleCauses: {
        "Slow loading times": [
            "Server overload",
            "High database response time"
        ],
        "Crashes or freezes": [
            "Memory leaks",
            "Issue in load balancing with multiple nodes",
            "Network issues"
        ],
        "Unresponsive UI elements": [
            "UI event listeners blocked",
            "Heavy frontend rendering"
        ],
        "Elongated Job execution time - Job hanging": [
            "High-cost SQL queries",
            "Stale indexes",
            "Waiting or locked threads"
        ],
        "Batch job failed with error": [
            "Incorrect batch parameters",
            "Database connection timeout"
        ],
        "Recurring pricing is long running": [
            "Large dataset size",
            "Inefficient pricing rule execution"
        ],
        "Direct debit amount is wrong": [
            "Wrong price configured",
            "Currency conversion error"
        ],
        "Invoice job ended with errors": [
            "Tax calculation issue",
            "Billing account mismatch"
        ],
        "Process Container Not starting": [
            "Max memory configured is not enough",
            "Process dependency service is down"
        ],
        "Out of memory error while restarting": [
            "Memory leak in process",
            "Improper garbage collection"
        ],
        "Kafka Startup Error": [
            "Error in broker listener configuration",
            "Kafka logs exceeding disk limit"
        ],
        "Huge amount of logs getting accumulated": [
            "Excessive debug logging enabled",
            "Log rotation not configured properly"
        ],
        "Record Locked error in edit mode": [
            "Previous session lock not released",
            "Simultaneous edit conflict"
        ],
        "Drop-down options missing intermittently": [
            "UI cache not refreshing",
            "API response delay"
        ],
        "UI screen takes time to refresh": [
            "Excessive API calls",
            "Heavy UI rendering"
        ],
        "File upload not working": [
            "File upload service is down",
            "Permission issues in storage location"
        ],
        "Slow file upload speeds": [
            "Network bandwidth congestion",
            "File compression not optimized"
        ],
        "High CPU utilization and memory usage": [
            "Data analysis workload increase",
            "Inefficient processing loops"
        ],
        "Incorrect pricing applied": [
            "Wrong pricing rule executed",
            "Historical pricing data mismatch"
        ]
    },
    recommendedActions: {
        "Slow loading times": [
            "Increase the max memory in the JVM startup",
            "Optimize database queries"
        ],
        "Crashes or freezes": [
            "Analyze the code for possible memory leaks",
            "Check the load balancer configurations",
            "Check the network ports"
        ],
        "Unresponsive UI elements": [
            "Optimize event listeners",
            "Reduce UI rendering load"
        ],
        "Elongated Job execution time - Job hanging": [
            "SQL tuning",
            "Rebuild Oracle statistics",
            "Code optimization"
        ],
        "Batch job failed with error": [
            "Adjust batch processing parameters",
            "Increase database timeout settings"
        ],
        "Recurring pricing is long running": [
            "Optimize pricing logic",
            "Increase system memory allocation"
        ],
        "Direct debit amount is wrong": [
            "Correct pricelist settings",
            "Verify currency conversion rates"
        ],
        "Invoice job ended with errors": [
            "Fix tax calculation logic",
            "Verify customer account details"
        ],
        "Process Container Not starting": [
            "Increase max memory allocation",
            "Restart dependent services"
        ],
        "Out of memory error while restarting": [
            "Fix memory leaks",
            "Optimize garbage collection settings"
        ],
        "Kafka Startup Error": [
            "Correct broker listener configurations",
            "Clean up excessive logs"
        ],
        "Huge amount of logs getting accumulated": [
            "Disable debug logging",
            "Set up proper log rotation"
        ],
        "Record Locked error in edit mode": [
            "Manually release locked records",
            "Fix session timeout settings"
        ],
        "Drop-down options missing intermittently": [
            "Refresh UI cache",
            "Fix API response delays"
        ],
        "UI screen takes time to refresh": [
            "Reduce API polling frequency",
            "Optimize front-end performance"
        ],
        "File upload not working": [
            "Restart file upload service",
            "Fix storage permission issues"
        ],
        "Slow file upload speeds": [
            "Optimize file compression",
            "Increase network bandwidth allocation"
        ],
        "High CPU utilization and memory usage": [
            "Optimize query execution",
            "Refactor inefficient processing loops"
        ],
        "Incorrect pricing applied": [
            "Update pricing rules",
            "Fix historical data inconsistencies"
        ]
    },
    detectionMethods: {
        "Slow loading times": [
            "Check system resource usage using `top` command",
            "Monitor database query execution times"
        ],
        "Crashes or freezes": [
            "Perform code analysis",
            "Check server logs for crashes"
        ],
        "Unresponsive UI elements": [
            "Analyze front-end event listener usage",
            "Check browser console errors"
        ]
    }
};

module.exports = data;
