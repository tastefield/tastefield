use serde::Serialize;

#[derive(Serialize)]
pub struct DiscoveredSkill {
    pub name: String,
    pub agent: String,
    pub path: String,
}

/// Stub: the real implementation will scan agent skill directories
/// (Cursor, Claude, Codex, local) and return discovered SKILL.md bundles.
#[tauri::command]
fn discover_skills() -> Vec<DiscoveredSkill> {
    Vec::new()
}

/// Stub: returns the local MCP server status. The real implementation
/// will report the port and whether the server is serving context.
#[tauri::command]
fn mcp_status() -> serde_json::Value {
    serde_json::json!({ "running": false, "port": 3000 })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![discover_skills, mcp_status])
        .run(tauri::generate_context!())
        .expect("error while running tastefield studio");
}
