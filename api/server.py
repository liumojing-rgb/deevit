from flask import Flask, request, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
# Enable CORS for the React frontend, allowing requests from any origin for the prototype
CORS(app)

@app.route('/api/execute', methods=['POST', 'OPTIONS'])
def execute_code():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    data = request.get_json()
    if not data or 'files' not in data:
        return jsonify({"error": "No files provided"}), 400

    files = data.get('files', [])
    if not files:
        return jsonify({"error": "Missing files data"}), 400

    # Mocking the execution delay (simulating Docker container spin-up and simulation run)
    time.sleep(1.5)
    
    # 1. Basic SV Syntax Parsing Logic
    syntax_errors = []
    
    for file in files:
        filename = file.get('name', 'unknown.sv')
        content = file.get('content', '')
        
        # Check matched blocks
        if content.count('begin') != content.count('end'):
            syntax_errors.append(f"** Error: {filename}: Unmatched 'begin'/'end' block.\n")
        if content.count('class') - content.count('endclass') != 0 and 'virtual class' not in content:
            # Simple heuristic, 'class' is used in endclass, so endclass is counted twice if just searching 'class'.
            # Better counting logic:
            num_class = len([w for w in content.split() if w == 'class'])
            num_endclass = len([w for w in content.split() if w == 'endclass'])
            if num_class != num_endclass:
                syntax_errors.append(f"** Error: {filename}: Unmatched 'class'/'endclass' declaration.\n")
        if content.count('module') - content.count('endmodule') != 0:
            num_module = len([w for w in content.split() if w == 'module'])
            num_endmodule = len([w for w in content.split() if w == 'endmodule'])
            if num_module != num_endmodule:
                 syntax_errors.append(f"** Error: {filename}: Unmatched 'module'/'endmodule' declaration.\n")
                 
        # Look for missing semicolons on common statements
        lines = content.split('\n')
        for i, line in enumerate(lines):
            stripped = line.strip()
            # If the line declares a logic or wire and doesn't end in a semicolon
            if (stripped.startswith('logic') or stripped.startswith('wire') or stripped.startswith('bit') or stripped.startswith('int') or stripped.startswith('string')) and not stripped.endswith(';'):
                 if not stripped.endswith(','): # Ignore multi-line parameter definitions
                     syntax_errors.append(f"** Error: {filename}({i+1}): Missing ';' (semicolon) at the end of declaration.\n")
    
    if syntax_errors:
        error_log = f"""
[Compiler] Info: Invoking SystemVerilog Simulator
[Compiler] Option: -ntb_opts uvm-1.2 enabled
[Compiler] Parsing files...

{"".join(syntax_errors)}
[Compiler] Error: Compilation failed due to syntax errors. Simulation aborted.
"""
        return jsonify({
            "status": "error",
            "error": "Compilation failed.",
            "output": error_log.strip()
        }), 400

    # 2. Proceed to Success execution Simulation if syntax is correct
    # Generate the compiler log text dynamically based on the sent files
    compiler_logs = ""
    for file in files:
        compiler_logs += f"[Compiler] Parsing file '{file.get('name', 'unknown.sv')}'...\n"

    # Mocking a realistic UVM output string
    mocked_uvm_output = f"""
[Compiler] Info: Invoking SystemVerilog Simulator
[Compiler] Option: -ntb_opts uvm-1.2 enabled
{compiler_logs.strip()}
[Compiler] Info: UVM 1.2 library successfully loaded and compiled.
[Compiler] Top-level modules:
	top
Time: 0 ps  Iteration: 0  Instance: /top
----------------------------------------------------------------
UVM-1.2
(C) 2007-2014 Mentor Graphics Corporation
(C) 2007-2014 Cadence Design Systems, Inc.
(C) 2006-2014 Synopsys, Inc.
(C) 2011-2013 Cypress Semiconductor Corp.
(C) 2013-2014 NVIDIA Corporation
----------------------------------------------------------------

UVM_INFO @ 0: reporter [RNTST] Running verification test...
UVM_INFO testbench.sv(0) @ 0: env.agent.driver [DRV] Driving signals...
UVM_INFO testbench.sv(0) @ 10: env.agent.monitor [MON] Monitored transaction
UVM_INFO testbench.sv(0) @ 10: env.scoreboard [SCB] MATCH! Expected vs Actual Match
UVM_INFO testbench.sv(0) @ 20: env.agent.monitor [MON] Monitored transaction
UVM_INFO testbench.sv(0) @ 20: env.scoreboard [SCB] MATCH! Expected vs Actual Match
UVM_INFO /usr/share/uvm-1.2/src/base/uvm_objection.svh(1271) @ 50: reporter [TEST_DONE] 'run' phase is ready to proceed to the 'extract' phase
UVM_INFO /usr/share/uvm-1.2/src/base/uvm_report_server.svh(869) @ 50: reporter [UVM/REPORT/CATCHER]
--- UVM Report Summary ---

** Report counts by severity
UVM_INFO      :    8
UVM_WARNING   :    0
UVM_ERROR     :    0
UVM_FATAL     :    0
** Report counts by id
[DRV]         :     1
[MON]         :     2
[RNTST]       :     1
[SCB]         :     2
[TEST_DONE]   :     1

Simulation complete.
"""
    return jsonify({
        "status": "success",
        "output": mocked_uvm_output
    }), 200

if __name__ == '__main__':
    # Run the server on port 3004
    app.run(host='127.0.0.1', port=3004, debug=False)
