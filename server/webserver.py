import asyncio
import websockets
import json

# Set up an empty list to hold all flag changes
flag_changes = []

# Set up a set to keep track of connected clients
connected_clients = set()

async def handle_connection(websocket, path):
    # Add new client to the list of connected clients
    connected_clients.add(websocket)

    # Send the current flag changes to the new client
    await websocket.send(json.dumps(flag_changes))

    try:
        # Wait for messages from the client
        async for message in websocket:
            print(f"Received message: {message}")
            
            # If the message indicates a flag change, handle it
            if message.startswith("change_flag"):
                _, new_flag = message.split(" ", 1)
                await change_flag(new_flag)
            # Optionally, handle other types of messages (like log toggling)
            elif message == "toggle_log":
                await toggle_log()
    
    finally:
        # Remove the client from connected clients when they disconnect
        connected_clients.remove(websocket)

# Function to change a flag and notify all connected clients
async def change_flag(new_flag):
    # Persist the flag change (add to flag_changes list)
    flag_changes.append(new_flag)
    # Notify all clients about the flag change
    await publish_flags()

# Function to publish flags to all connected clients
async def publish_flags():
    for websocket in connected_clients:
        await websocket.send(json.dumps({"flags": flag_changes}))

# Function to toggle log (for logging functionality)
log_active = False
async def toggle_log():
    global log_active
    log_active = not log_active
    status = "started" if log_active else "stopped"
    print(f"Logging {status}.")

    # Optionally, notify all clients about the log state
    await publish_logs()

# Function to publish log data (can be expanded with actual logs)
async def publish_logs():
    if log_active:
        log_data = "Log data..."  # Replace with actual log data
        for websocket in connected_clients:
            await websocket.send(json.dumps({"logs": log_data}))

# Function to start the WebSocket server
async def start_server():
    # Create a WebSocket server that listens for incoming connections
    server = await websockets.serve(handle_connection, "localhost", 8765)
    print("Server started at ws://localhost:8765")
    await server.wait_closed()

# Run the WebSocket server
asyncio.run(start_server())
