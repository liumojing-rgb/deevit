// Problem Data
const problems = {
    dff: {
        title: "D Flip-Flop Verification",
        description: `
            <h3>Overview</h3>
            <p>Verify a simple D Flip-Flop design using UVM. The D Flip-Flop has a clock (<code>clk</code>), reset (<code>rst_n</code>), data input (<code>d</code>), and data output (<code>q</code>).</p>
            <h3>Requirements</h3>
            <ul>
                <li>Create a basic UVM driver that drives random data to <code>d</code> on the positive edge of <code>clk</code>.</li>
                <li>Create a monitor that captures the input and output.</li>
                <li>Create a scoreboard that checks if <code>q</code> matches the expected value based on standard DFF behavior.</li>
            </ul>
        `,
        design: `module dff (
    input logic clk,
    input logic rst_n,
    input logic d,
    output logic q
);

    always_ff @(posedge clk or negedge rst_n) begin
        if (!rst_n)
            q <= 1'b0;
        else
            q <= d;
    end

endmodule`,
        testbench: {
        	"testbench.sv": `import uvm_pkg::*;
\`include "uvm_macros.svh"

// Basic UVM Testbench Structure Template
// Add your Agent, Scoreboard, and Environment here...

class my_test extends uvm_test;
    \`uvm_component_utils(my_test)

    function new(string name="my_test", uvm_component parent=null);
        super.new(name, parent);
    endfunction

    task run_phase(uvm_phase phase);
        phase.raise_objection(this);
        \`uvm_info("RNTST", "Running test my_test...", UVM_LOW)
        // Your test sequence logic here
        #50;
        phase.drop_objection(this);
    endtask
endclass

module top;
    initial begin
        run_test("my_test");
    end
endmodule`
        }
    },
    fifo: {
        title: "Synchronous FIFO",
        description: `
            <h3>Overview</h3>
            <p>Verify a Synchronous FIFO memory module using SystemVerilog UVM.</p>
            <h3>Requirements</h3>
            <ul>
                <li>Check full and empty flags.</li>
                <li>Verify push and pop operations.</li>
                <li>Write a scoreboard to predict FIFO content.</li>
            </ul>
        `,
        design: `module sync_fifo #(parameter DEPTH=8, DATA_WIDTH=8) (
    input clk, rst_n,
    input w_en, r_en,
    input [DATA_WIDTH-1:0] data_in,
    output [DATA_WIDTH-1:0] data_out,
    output full, empty
);
    // basic implementation omitted for brevity
endmodule`,
        testbench: {
        	"testbench.sv": `import uvm_pkg::*;
\`include "uvm_macros.svh"

// Write your FIFO testbench`
		}
    },
    alu: {
        title: "Simple ALU",
        description: `
            <h3>Overview</h3>
            <p>Verify an Arithmetic Logic Unit supporting ADD, SUB, AND, and OR operations.</p>
        `,
        design: `module alu(
    input [3:0] a, b,
    input [1:0] op,
    output reg [3:0] res
);
    // implementation
endmodule`,
    },
    apb_item: {
        title: "APB 1: Sequence Item (Constraints)",
        description: `
            <h3>Overview</h3>
            <p>Define an APB Transaction item (<code>apb_item</code>) inheriting from <code>uvm_sequence_item</code>. Add appropriate properties and constraints for random generation.</p>
            <h3>Requirements</h3>
            <ol>
                <li>Define 32-bit <code>addr</code>, 32-bit <code>data</code>, and 1-bit <code>write</code> variables. Make them randomizable.</li>
                <li>Add UVM Field macros for all variables to enable printing/comparing.</li>
                <li>Add a Constraint: <code>addr</code> must be word-aligned (divisible by 4) and less than <code>32'h1000</code>.</li>
                <li>Add a Constraint: <code>write</code> should be 1 (Write) 70% of the time, and 0 (Read) 30% of the time.</li>
            </ol>
        `,
        design: `// Design is pre-compiled in the background for this exercise.
// Focus on the apb_item.sv tab to complete the uvm_sequence_item.
module dummy_design;
endmodule`,
        testbench: {
        	"apb_item.sv": `import uvm_pkg::*;
\`include "uvm_macros.svh"

class apb_item extends uvm_sequence_item;
    // 1. Declare properties here: addr, data, write
    
    \`uvm_object_utils_begin(apb_item)
        // 2. Add UVM Field macros here
    \`uvm_object_utils_end

    function new(string name = "apb_item");
        super.new(name);
    endfunction
    
    // 3. Add addr constraint here
    
    // 4. Add write probability constraint here
    
endclass`
        }
    },
    apb_sequence: {
        title: "APB 2: Sequence (Stress Testing)",
        description: `
            <h3>Overview</h3>
            <p>Create a UVM Sequence that generates consecutive write/read back-to-back traffic to stress-test the APB protocol.</p>
            <h3>Requirements</h3>
            <ol>
                <li>Define a sequence inheriting from <code>uvm_sequence#(apb_item)</code>.</li>
                <li>Write a <code>body()</code> task that loops 10 times.</li>
                <li>In each loop iteration, create an item. Randomize it but constrain it to be a WRITE to a specific address, and send it.</li>
                <li>Immediately create a second item. Constrain it to be a READ to that exact same address, and send it.</li>
            </ol>
        `,
        design: `// Design is pre-compiled in the background for this exercise.
// Focus on the apb_sequence.sv tab to complete the uvm_sequence.
module dummy_design;
endmodule`,
        testbench: {
        	"apb_sequence.sv": `import uvm_pkg::*;
\`include "uvm_macros.svh"

class apb_sequence extends uvm_sequence#(apb_item);
    \`uvm_object_utils(apb_sequence)
    
    function new(string name = "apb_sequence");
        super.new(name);
    endfunction

    task body();
        apb_item req_wr, req_rd;
        
        // Write your loop here
        
    endtask
endclass`
        }
    },
    apb_driver: {
        title: "APB 3: Driver (Bus Protocol)",
        description: `
            <h3>Overview</h3>
            <p>Implement the APB Driver's <code>run_phase</code> to toggle the standard APB protocol signals based on the received transaction.</p>
            <h3>Requirements</h3>
            <ol>
                <li>Wait for <code>seq_item_port.get_next_item(req)</code>.</li>
                <li><strong>Setup Phase</strong>: On the positive clock edge, drive <code>paddr</code>, <code>pwdata</code>, <code>pwrite</code>, and assert <code>psel</code>. <code>penable</code> must be 0.</li>
                <li><strong>Access Phase</strong>: On the next positive clock edge, assert <code>penable</code>.</li>
                <li>Wait for the slave to assert <code>pready</code> (simulated as immediately ready for this exercise).</li>
                <li>Deassert <code>psel</code> and <code>penable</code>, then call <code>seq_item_port.item_done()</code>.</li>
            </ol>
        `,
        design: `// Design is pre-compiled in the background for this exercise.
// Focus on the apb_driver.sv tab to complete the uvm_driver.
module dummy_design;
endmodule`,
        testbench: {
        	"apb_driver.sv": `import uvm_pkg::*;
\`include "uvm_macros.svh"

class apb_driver extends uvm_driver#(apb_item);
    \`uvm_component_utils(apb_driver)
    
    virtual apb_if vif;
    
    function new(string name, uvm_component parent);
        super.new(name, parent);
    endfunction
    
    task run_phase(uvm_phase phase);
        // Initialize signals to 0
        vif.psel <= 0;
        vif.penable <= 0;
        
        forever begin
            seq_item_port.get_next_item(req);
            
            // 1. Setup Phase
            
            // 2. Access Phase
            
            // 3. Complete Transaction
            
            seq_item_port.item_done();
        end
    endtask
endclass`
        }
    },
    apb_scoreboard: {
        title: "APB 4: Scoreboard (Analysis Ports)",
        description: `
            <h3>Overview</h3>
            <p>Implement the <code>write</code> method of a UVM Scoreboard connected to a Monitor via an analysis port. Use it to verify data correctness.</p>
            <h3>Requirements</h3>
            <ol>
                <li>Define the <code>write</code> function required by <code>uvm_analysis_imp</code>.</li>
                <li>Maintain a Golden Memory array (e.g., <code>bit [31:0] mem [int]</code>).</li>
                <li>If the incoming transaction is a WRITE, update the golden memory array with the data at the address.</li>
                <li>If it's a READ, compare the incoming data against the golden memory array. Print a <code>UVM_INFO</code> MATCH message if correct, or a <code>UVM_ERROR</code> if there's a mismatch.</li>
            </ol>
        `,
        design: `// Design is pre-compiled in the background for this exercise.
// Focus on the apb_scoreboard.sv tab to complete the uvm_scoreboard.
module dummy_design;
endmodule`,
        testbench: {
        	"apb_scoreboard.sv": `import uvm_pkg::*;
\`include "uvm_macros.svh"

\`uvm_analysis_imp_decl(_mon)

class apb_scoreboard extends uvm_scoreboard;
    \`uvm_component_utils(apb_scoreboard)
    
    uvm_analysis_imp_mon#(apb_item, apb_scoreboard) item_collected_export;
    
    // Golden memory predictor array
    bit [31:0] mem [int];
    
    function new(string name, uvm_component parent);
        super.new(name, parent);
        item_collected_export = new("item_collected_export", this);
    endfunction
    
    // Implement the write_mon function
    virtual function void write_mon(apb_item req);
        
        // Write your scoreboard logic here
        
    endfunction
endclass`
        }
    }
};

// Application State
// Application State
let editor;
let currentTab = 'design.sv';
let currentProblem = 'dff';
const userCode = {
    "design.sv": "",
    "testbench.sv": ""
};

// Initialize Split.js for resizable panes
Split(['#problem-pane', '#editor-console-pane'], {
    sizes: [30, 70],
    minSize: [200, 400],
    gutterSize: 8,
});

Split(['#editor-pane', '#console-pane'], {
    direction: 'vertical',
    sizes: [70, 30],
    minSize: [100, 100],
    gutterSize: 8,
});

// Initialize Editor When Monaco is Ready
require(['vs/editor/editor.main'], function() {
    
    // Register basic SystemVerilog syntax highlighting rules
    monaco.languages.register({ id: 'systemverilog' });
    monaco.languages.setMonarchTokensProvider('systemverilog', {
        tokenizer: {
            root: [
                [/\b(?:module|endmodule|class|endclass|function|endfunction|task|endtask|package|endpackage|import|export)\b/, 'keyword'],
                [/\b(?:input|output|inout|logic|wire|reg|bit|int|string|void|virtual)\b/, 'type'],
                [/\b(?:if|else|for|while|do|foreach|case|endcase|always|always_ff|always_comb|always_latch|initial|begin|end)\b/, 'keyword'],
                [/\b(?:uvm_component|uvm_object|uvm_test|uvm_env|uvm_agent|uvm_driver|uvm_monitor|uvm_scoreboard|uvm_sequence_item)\b/, 'type.identifier'],
                [/\`uvm_[a-zA-Z_]+/, 'macro'],
                [/\/\/.*/, 'comment'],
                [/\/\*[\s\S]*?\*\//, 'comment'],
                [/"([^"\\]|\\.)*$/, 'string.invalid'],
                [/"/, 'string', '@stringBody'],
                [/'[bBoOdDhH][0-9a-fA-F_xXzZ]+/, 'number.hex'],
                [/[0-9]+/, 'number']
            ],
            stringBody: [
                [/[^\\"]+/, 'string'],
                [/\\./, 'string.escape'],
                [/"/, 'string', '@pop']
            ]
        }
    });

    editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: problems[currentProblem].design,
        language: 'systemverilog',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: "'Fira Code', 'Menlo', 'Monaco', 'Courier New', monospace",
        scrollBeyondLastLine: false,
        roundedSelection: false,
        padding: { top: 16 }
    });

    // Save code when editor content changes
    editor.onDidChangeModelContent(() => {
        userCode[currentTab] = editor.getValue();
    });

    // Load initial problem
    loadProblem(currentProblem);
});

// Setup dynamic tabs
function setupTabs() {
    const tabsContainer = document.querySelector('.tabs');
    tabsContainer.innerHTML = '';
    
    // Always add design.sv
    const designTab = document.createElement('button');
    designTab.className = 'tab';
    if(currentTab === 'design.sv') designTab.classList.add('active');
    designTab.dataset.target = 'design.sv';
    designTab.innerText = 'design.sv';
    tabsContainer.appendChild(designTab);

    // Add all testbench files as tabs
    for (const filename in userCode) {
        if(filename === 'design.sv') continue;
        
        const tbTab = document.createElement('button');
        tbTab.className = 'tab';
        if(currentTab === filename) tbTab.classList.add('active');
        tbTab.dataset.target = filename;
        tbTab.innerText = filename;
        tabsContainer.appendChild(tbTab);
    }

    // Attach click listeners to new tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            
            if(editor) {
                userCode[currentTab] = editor.getValue();
            }

            currentTab = e.target.dataset.target;
            if(editor) {
                editor.setValue(userCode[currentTab]);
            }
        });
    });
}

// Load Problem Data
function loadProblem(id) {
    const p = problems[id];
    document.getElementById('problem-content').innerHTML = p.description;
    
    // Clear old user code
    for (let key in userCode) delete userCode[key];
    
    // Reset to defaults
    userCode['design.sv'] = p.design;
    for (const [filename, content] of Object.entries(p.testbench)) {
        userCode[filename] = content;
    }
    
    // Default to design on switch
    currentTab = 'design.sv';
    setupTabs();
    
    if(editor) {
        editor.setValue(userCode[currentTab]);
    }
}

// Problem Selection Logic
document.getElementById('problem-selector').addEventListener('change', (e) => {
    currentProblem = e.target.value;
    loadProblem(currentProblem);
});

// Run Code Logic
document.getElementById('run-btn').addEventListener('click', async () => {
    const btn = document.getElementById('run-btn');
    const output = document.getElementById('output-content');
    const status = document.getElementById('status-indicator');
    
    if(editor) {
        userCode[currentTab] = editor.getValue();
    }

    btn.disabled = true;
    btn.innerHTML = 'Running...';
    output.textContent = 'Compiling and simulating Code...';
    status.textContent = 'Running';
    status.style.color = 'var(--accent)';

    // Format files for backend execution
    const filesToExecute = [];
    for (const [filename, content] of Object.entries(userCode)) {
        filesToExecute.push({ name: filename, content: content });
    }

    try {
        const response = await fetch('/api/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: filesToExecute
            })
        });

        const data = await response.json();
        
        if(response.ok) {
            output.textContent = data.output;
            status.textContent = 'Success';
            status.style.color = 'var(--success)';
        } else {
            output.textContent = "Error: " + data.error;
            status.textContent = 'Failed';
            status.style.color = 'var(--error)';
        }
    } catch (error) {
        output.textContent = "Network Error: Could not reach execution server.\nMake sure the backend is running.";
        status.textContent = 'Error';
        status.style.color = 'var(--error)';
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" class="play-icon"><path d="M8 5v14l11-7z" fill="currentColor"/></svg> Run Code';
    }
});
