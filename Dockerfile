FROM python:3.11-slim

# Install iverilog
RUN apt-get update && \
    apt-get install -y --no-install-recommends iverilog && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY api/ ./api/
COPY public/ ./public/

# Railway injects PORT env var at runtime
ENV PORT=3000

CMD gunicorn --bind 0.0.0.0:$PORT --workers 2 --timeout 30 api.server:app
