import json
import os
from pathlib import Path
from fastmcp import FastMCP

mcp = FastMCP("Portfolio MCP Server")

DATA_DIR = Path(__file__).parent / "data"


def load_json(filename: str) -> dict:
    with open(DATA_DIR / filename) as f:
        return json.load(f)


@mcp.tool()
def get_resume() -> dict:
    """Get the full resume including experience, education, skills, and contact info."""
    return load_json("resume.json")


@mcp.tool()
def get_skills() -> list[str]:
    """Get list of technical skills."""
    resume = load_json("resume.json")
    return resume["skills"]


@mcp.tool()
def get_contact() -> dict:
    """Get contact information including email, GitHub, and LinkedIn."""
    resume = load_json("resume.json")
    return resume["contact"]


@mcp.tool()
def get_all_projects() -> list[dict]:
    """Get all portfolio projects with descriptions and tech stacks."""
    return load_json("projects.json")


@mcp.tool()
def search_projects(query: str) -> list[dict]:
    """Search projects by technology, category, or keyword."""
    # Guard against empty/oversized/non-string input reaching the search loop.
    if not isinstance(query, str) or not query.strip():
        return []
    query = query.strip()[:200]  # cap length — this is a search term, not a document

    projects = load_json("projects.json")
    query_lower = query.lower()
    results = []
    for p in projects:
        searchable = f"{p['name']} {p['description']} {' '.join(p['tech'])} {p['category']}".lower()
        if query_lower in searchable:
            results.append(p)
    return results


@mcp.tool()
def get_summary() -> str:
    """Get a brief professional summary."""
    resume = load_json("resume.json")
    return f"{resume['name']} — {resume['title']}. {resume['summary']}"

@mcp.tool()
def get_preferences() -> dict:
    """Get user preferences for portfolio interaction."""
    
    resume =load_json("resume.json")
    return resume.get("preferences", {})
if __name__ == "__main__":
    # SECURITY: bind to localhost/internal network only, NOT 0.0.0.0, unless this
    # process is itself behind a firewall that blocks external access to this port.
    # The FastAPI backend (main.py) is the only thing that should ever reach this
    # server. If they run on the same machine/container, "127.0.0.1" is correct.
    # If they run in separate containers on the same private network (e.g. same
    # Docker Compose network or same VPC), use that internal hostname instead of
    # 0.0.0.0, and make sure your cloud firewall/security group does NOT expose
    # this port publicly.
    host = os.getenv("MCP_HOST", "127.0.0.1")
    port = int(os.getenv("MCP_PORT", "8001"))
    mcp.run(transport="streamable-http", host=host, port=port, path="/mcp")