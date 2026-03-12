// Problem Data
const problems = {
    dff: {
        title: "D Flip-Flop Verification",
        difficulty: "easy",
        description: `
            <span class="difficulty-badge easy">Easy</span>
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
        difficulty: "easy",
        description: `
            <span class="difficulty-badge easy">Easy</span>
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
        difficulty: "easy",
        description: `
            <span class="difficulty-badge easy">Easy</span>
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
        difficulty: "medium",
        description: `
            <span class="difficulty-badge medium">Medium</span>
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
        difficulty: "medium",
        description: `
            <span class="difficulty-badge medium">Medium</span>
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
        difficulty: "medium",
        description: `
            <span class="difficulty-badge medium">Medium</span>
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
        difficulty: "medium",
        description: `
            <span class="difficulty-badge medium">Medium</span>
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

// Reset Button Logic
document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('Reset code to original boilerplate? Your changes will be lost.')) {
        loadProblem(currentProblem);
        const output = document.getElementById('output-content');
        const status = document.getElementById('status-indicator');
        output.textContent = 'Code reset to boilerplate.';
        output.className = '';
        status.textContent = 'Ready';
        status.className = 'status-indicator ready';
    }
});

// Show toast notification
function showToast(message, type) {
    const existing = document.querySelector('.success-toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.textContent = (type === 'success' ? '🎉 ' : '❌ ') + message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 3000);
}

// Verification Logic
document.getElementById('submit-btn').addEventListener('click', () => {
    if(editor) {
        userCode[currentTab] = editor.getValue();
    }
    
    const output = document.getElementById('output-content');
    const status = document.getElementById('status-indicator');
    
    status.textContent = 'Verifying';
    status.className = 'status-indicator verifying';
    
    // Small delay for visual feedback
    setTimeout(() => {
        const result = verifyAnswer(currentProblem, userCode);
        
        if (result.success) {
            output.textContent = "SUCCESS: " + result.message + "\n\n✓ All requirements met!";
            output.className = 'success';
            status.textContent = 'Passed';
            status.className = 'status-indicator passed';
            showToast('All requirements met!', 'success');
        } else {
            output.textContent = "VERIFICATION FAILED\n\n" + result.message + "\n\nExpected:\n" + result.expected;
            output.className = 'failed';
            status.textContent = 'Failed';
            status.className = 'status-indicator failed';
        }
    }, 300);
});

function verifyAnswer(problemId, codeObj) {
    if (problemId === 'apb_item') {
        const code = codeObj['apb_item.sv'] || "";
        if (!/rand\s+bit\s+\[31:0\]\s+addr/.test(code) || !/rand\s+bit\s+\[31:0\]\s+data/.test(code) || !/rand\s+bit\s+write/.test(code)) {
            return { success: false, message: "Missing required 'rand' property declarations (addr, data, write).", expected: "rand bit [31:0] addr;\nrand bit [31:0] data;\nrand bit write;" };
        }
        if (!/`uvm_field_int\(\s*addr/.test(code) || !/`uvm_field_int\(\s*data/.test(code) || !/`uvm_field_int\(\s*write/.test(code)) {
            return { success: false, message: "Missing UVM field macros for one or more properties.", expected: "`uvm_field_int(addr, UVM_ALL_ON)" };
        }
        if (!/addr\s*%\s*4\s*==\s*0/.test(code) || !/addr\s*<\s*(32'h1000|'h1000|4096)/.test(code)) {
            return { success: false, message: "Missing or incorrect address constraints (word-aligned and < 1000).", expected: "constraint addr_c { addr % 4 == 0; addr < 32'h1000; }" };
        }
        if (!/dist\s*{\s*1\s*:=\s*70\s*,\s*0\s*:=\s*30\s*}/.test(code) && !/dist\s*{\s*1\s*\/\s*70\s*,\s*0\s*\/\s*30\s*}/.test(code)) {
            return { success: false, message: "Missing or incorrect write probability constraint using 'dist'.", expected: "constraint write_c { write dist { 1 := 70, 0 := 30 }; }" };
        }
        return { success: true, message: "apb_item correctly defined with properties, macros, and constraints." };
    } 
    else if (problemId === 'apb_sequence') {
        const code = codeObj['apb_sequence.sv'] || "";
        if (!/task\s+body\(.*?\)/.test(code)) {
            return { success: false, message: "Missing the body() task.", expected: "task body();" };
        }
        if (!/repeat\s*\(\s*10\s*\)|for\s*\(/.test(code)) {
            return { success: false, message: "Missing the loop (repeat 10 or for loop) to execute 10 times.", expected: "repeat(10) begin ... end" };
        }
        if (!/`uvm_do_with\s*\(\s*req_wr/s.test(code) && !/start_item\(req_wr\)/.test(code)) {
             return { success: false, message: "Missing item creation and start_item/uvm_do for the WRITE transaction.", expected: "start_item(req_wr);" };
        }
        if (!/write\s*==\s*1/.test(code)) {
             return { success: false, message: "Missing 'write == 1' constraint for the Write transaction.", expected: "req_wr.randomize() with { write == 1; };" };
        }
        if (!/write\s*==\s*0/.test(code)) {
             return { success: false, message: "Missing 'write == 0' constraint for the Read transaction.", expected: "req_rd.randomize() with { write == 0; addr == req_wr.addr; };" };
        }
        if (!/addr\s*==\s*req_wr\.addr/.test(code)) {
             return { success: false, message: "Missing constraint ensuring the Read transaction address matches the Write transaction address.", expected: "addr == req_wr.addr;" };
        }
        return { success: true, message: "apb_sequence correctly implements the 10x back-to-back write/read stress test." };
    }
    else if (problemId === 'apb_driver') {
        const code = codeObj['apb_driver.sv'] || "";
        if (!/seq_item_port\.get_next_item/.test(code)) {
            return { success: false, message: "Missing seq_item_port.get_next_item.", expected: "seq_item_port.get_next_item(req);" };
        }
        if (!/vif\.psel\s*<=\s*1|vif\.psel\s*=\s*1/.test(code)) {
            return { success: false, message: "Missing assertion of psel during the Setup Phase.", expected: "vif.psel <= 1;" };
        }
        if (!/(?:@\s*\(\s*posedge.*?\)|#).*(?:vif\.penable\s*<=\s*1|vif\.penable\s*=\s*1)/s.test(code)) {
            return { success: false, message: "Missing assertion of penable on the NEXT clock edge (Access Phase).", expected: "@(posedge vif.clk);\nvif.penable <= 1;" };
        }
        if (!/wait\s*\(\s*vif\.pready\s*|\s*vif\.pready\s*==/.test(code)) {
            return { success: false, message: "Missing wait condition for pready.", expected: "wait (vif.pready == 1);" };
        }
        if (!/vif\.psel\s*<=\s*0|vif\.psel\s*=\s*0/.test(code) || !/vif\.penable\s*<=\s*0|vif\.penable\s*=\s*0/.test(code)) {
            return { success: false, message: "Missing deassertion of psel and penable after the transaction.", expected: "vif.psel <= 0;\nvif.penable <= 0;" };
        }
        if (!/seq_item_port\.item_done/.test(code)) {
            return { success: false, message: "Missing seq_item_port.item_done.", expected: "seq_item_port.item_done();" };
        }
        return { success: true, message: "apb_driver correctly implements the APB Setup and Access protocol phases." };
    }
    else if (problemId === 'apb_scoreboard') {
        const code = codeObj['apb_scoreboard.sv'] || "";
        if (!/virtual\s+function\s+void\s+write_mon\(apb_item\s+req\)/.test(code) && !/function\s+void\s+write_mon\(apb_item\s+req\)/.test(code)) {
            return { success: false, message: "Missing or incorrect write_mon function signature.", expected: "virtual function void write_mon(apb_item req);" };
        }
        if (!/if\s*\(\s*req\.write\s*(?:==\s*1|)\s*\)/.test(code) && !/req\.write/.test(code)) {
            return { success: false, message: "Missing check for whether the transaction is a Write or a Read (e.g., if(req.write)).", expected: "if (req.write) { ... } else { ... }" };
        }
        if (!/mem\s*\[\s*req\.addr\s*\]\s*=\s*req\.data/.test(code)) {
            return { success: false, message: "Missing logic to update the golden memory array during a Write transaction.", expected: "mem[req.addr] = req.data;" };
        }
        if (!/mem\s*\[\s*req\.addr\s*\]\s*(?:==|!==|!=)\s*req\.data/.test(code) && !/req\.data\s*(?:==|!==|!=)\s*mem\s*\[\s*req\.addr\s*\]/.test(code)) {
            return { success: false, message: "Missing logic comparing the read req.data against the golden memory array.", expected: "if (req.data == mem[req.addr])" };
        }
        if (!/`uvm_info/.test(code) || !/`uvm_error/.test(code)) {
            return { success: false, message: "Missing `uvm_info (for Match) or `uvm_error (for Mismatch) reporting macros.", expected: "`uvm_info(\"SCB\", \"MATCH\", UVM_LOW)\n`uvm_error(\"SCB\", \"MISMATCH\")" };
        }
        return { success: true, message: "apb_scoreboard correctly implements golden predictor updates and comparison logic." };
    }
    
    return { success: false, message: "Verification not yet supported for this problem type.", expected: "N/A" };
}
