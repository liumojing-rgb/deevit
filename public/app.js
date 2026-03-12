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
        testbench: {
        	"testbench.sv": `// Write your ALU testbench`
        }
    },
    apb: {
        title: "APB Memory - Full UVM Architecture",
        description: `
            <h3>Overview</h3>
            <p>Implement a full UVM testbench architecture to verify an APB Memory module. The environment requires all standard UVM 1.2 base-classes.</p>
            <h3>Requirements</h3>
            <ul>
                <li><strong>uvm_sequence_item</strong>: Define APB transaction (addr, data, write/read, etc).</li>
                <li><strong>uvm_sequence & uvm_sequencer</strong>: Generate read/write traffic.</li>
                <li><strong>uvm_driver & uvm_monitor</strong>: Interface with the APB bus signals.</li>
                <li><strong>uvm_agent & uvm_env</strong>: Encapsulate the active/passive components.</li>
                <li><strong>uvm_scoreboard</strong>: Verify memory contents against a predictor array.</li>
                <li><strong>uvm_test</strong>: Top-level test class to configure and run the sequence.</li>
            </ul>
        `,
        design: `module apb_memory #(
    parameter ADDR_WIDTH = 8,
    parameter DATA_WIDTH = 32
) (
    input clk,
    input rst_n,
    input psel,
    input penable,
    input pwrite,
    input [ADDR_WIDTH-1:0] paddr,
    input [DATA_WIDTH-1:0] pwdata,
    output logic [DATA_WIDTH-1:0] prdata,
    output logic pready
);
    logic [DATA_WIDTH-1:0] mem [0:(1<<ADDR_WIDTH)-1];

    always_ff @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            prdata <= '0;
            pready <= 1'b0;
        end else begin
            if (psel && !penable) begin
                pready <= 1'b0;
            end else if (psel && penable) begin
                pready <= 1'b1;
                if (pwrite) 
                    mem[paddr] <= pwdata;
                else
                    prdata <= mem[paddr];
            end else begin
                pready <= 1'b0;
            end
        end
    end
endmodule`,
        testbench: {
        	"apb_item.sv": `import uvm_pkg::*;
\`include "uvm_macros.svh"

// 1. Transaction Item
class apb_item extends uvm_sequence_item;
    rand bit [31:0] addr;
    rand bit [31:0] data;
    rand bit        write;
    
    \`uvm_object_utils_begin(apb_item)
        \`uvm_field_int(addr, UVM_ALL_ON)
        \`uvm_field_int(data, UVM_ALL_ON)
        \`uvm_field_int(write, UVM_ALL_ON)
    \`uvm_object_utils_end

    function new(string name = "apb_item");
        super.new(name);
    endfunction
endclass`,

			"apb_sequence.sv": `import uvm_pkg::*;
\`include "uvm_macros.svh"

// 2. Sequence
class apb_sequence extends uvm_sequence#(apb_item);
    \`uvm_object_utils(apb_sequence)
    
    function new(string name = "apb_sequence");
        super.new(name);
    endfunction

    task body();
        // create and randomize items here
    endtask
endclass`,

			"apb_driver.sv": `import uvm_pkg::*;
\`include "uvm_macros.svh"

// 3. Driver
class apb_driver extends uvm_driver#(apb_item);
    \`uvm_component_utils(apb_driver)
    
    function new(string name, uvm_component parent);
        super.new(name, parent);
    endfunction
    // Add run_phase
endclass`,

			"apb_monitor.sv": `import uvm_pkg::*;
\`include "uvm_macros.svh"

// 4. Monitor
class apb_monitor extends uvm_monitor;
    \`uvm_component_utils(apb_monitor)
    
    function new(string name, uvm_component parent);
        super.new(name, parent);
    endfunction
    // Add run_phase and analysis port
endclass`,

			"apb_agent.sv": `import uvm_pkg::*;
\`include "uvm_macros.svh"

// 5. Agent
class apb_agent extends uvm_agent;
    \`uvm_component_utils(apb_agent)
    apb_driver    drv;
    apb_monitor   mon;
    uvm_sequencer#(apb_item) sqr;
    
    function new(string name, uvm_component parent);
        super.new(name, parent);
    endfunction
endclass`,

			"apb_scoreboard.sv": `import uvm_pkg::*;
\`include "uvm_macros.svh"

// 6. Scoreboard
class apb_scoreboard extends uvm_scoreboard;
    \`uvm_component_utils(apb_scoreboard)
    
    function new(string name, uvm_component parent);
        super.new(name, parent);
    endfunction
endclass`,

			"apb_env.sv": `import uvm_pkg::*;
\`include "uvm_macros.svh"

// 7. Environment
class apb_env extends uvm_env;
    \`uvm_component_utils(apb_env)
    apb_agent      agt;
    apb_scoreboard scb;
    
    function new(string name, uvm_component parent);
        super.new(name, parent);
    endfunction
endclass`,

			"apb_test.sv": `import uvm_pkg::*;
\`include "uvm_macros.svh"

// 8. Test
class apb_test extends uvm_test;
    \`uvm_component_utils(apb_test)
    apb_env env;
    
    function new(string name = "apb_test", uvm_component parent = null);
        super.new(name, parent);
    endfunction
    
    function void build_phase(uvm_phase phase);
        super.build_phase(phase);
        env = apb_env::type_id::create("env", this);
    endfunction
    
    task run_phase(uvm_phase phase);
        apb_sequence seq;
        phase.raise_objection(this);
        \`uvm_info("TEST", "Starting APB Test UVM 1.2...", UVM_LOW)
        seq = apb_sequence::type_id::create("seq");
        seq.start(env.agt.sqr);
        #100;
        phase.drop_objection(this);
    endtask
endclass`,

			"top.sv": `import uvm_pkg::*;
\`include "uvm_macros.svh"

module top;
    initial begin
        run_test("apb_test");
    end
endmodule`
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
