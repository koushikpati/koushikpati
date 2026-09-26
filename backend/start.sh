#!/bin/bash
# Start MCP server in background, then FastAPI
python mcp_server.py &
sleep 2
uvicorn main:app --host 0.0.0.0 --port 8000
