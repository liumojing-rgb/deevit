from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import subprocess
import tempfile
import shutil
import os

app = Flask(__name__, static_folder='../public', static_url_path='')
CORS(app)

# Serve the frontend
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

# Execute SystemVerilog code with iverilog
@app.route('/api/execute', methods=['POST'])
def execute_code():
    data = request.get_json()
    if not data or 'files' not in data:
        return jsonify({"output": "Error: No files provided."}), 400

    files = data.get('files', [])
    if not files:
        return jsonify({"output": "Error: Empty files list."}), 400

    tmpdir = tempfile.mkdtemp(prefix='svleet_')

    try:
        filepaths = []
        for f in files:
            name = f.get('name', 'unknown.sv')
            content = f.get('content', '')
            # Sanitize filename to prevent path traversal
            safe_name = os.path.basename(name)
            filepath = os.path.join(tmpdir, safe_name)
            with open(filepath, 'w') as fh:
                fh.write(content)
            filepaths.append(filepath)

        sim_vvp = os.path.join(tmpdir, 'sim.vvp')

        # Step 1: Compile with iverilog (-g2012 enables SystemVerilog)
        compile_cmd = ['iverilog', '-g2012', '-o', sim_vvp] + filepaths
        compile_result = subprocess.run(
            compile_cmd,
            capture_output=True,
            text=True,
            timeout=10,
            cwd=tmpdir
        )

        # Build a realistic compiler log
        file_list = ', '.join([os.path.basename(f) for f in filepaths])
        log_header = (
            f"[iverilog] Compiling: {file_list}\n"
            f"[iverilog] Mode: SystemVerilog (-g2012)\n"
            f"{'=' * 50}\n"
        )

        if compile_result.returncode != 0:
            error_output = compile_result.stderr or compile_result.stdout or "Unknown compilation error."
            return jsonify({
                "output": log_header + "\n" + error_output + "\n\n[iverilog] Compilation FAILED."
            }), 400

        # Step 2: Run the simulation with vvp
        run_result = subprocess.run(
            ['vvp', sim_vvp],
            capture_output=True,
            text=True,
            timeout=10,
            cwd=tmpdir
        )

        sim_output = run_result.stdout or ""
        sim_errors = run_result.stderr or ""
        combined = sim_output + sim_errors

        if not combined.strip():
            combined = "(No output produced by simulation)"

        return jsonify({
            "output": log_header + "\n[iverilog] Compilation successful.\n\n" + "=" * 50 + "\n[Simulation Output]\n" + "=" * 50 + "\n\n" + combined
        }), 200

    except subprocess.TimeoutExpired:
        return jsonify({
            "output": "[Error] Simulation timed out after 10 seconds.\nYour code may contain an infinite loop."
        }), 400

    except Exception as e:
        return jsonify({
            "output": f"[Error] Internal server error: {str(e)}"
        }), 500

    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3000))
    app.run(host='0.0.0.0', port=port, debug=False)
