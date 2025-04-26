import asyncio
import websockets
import json

# Set up an empty list to hold all flag changes
flag_changes = []

# Set up a set to keep track of connected clients
connected_clients = set()

async def handle_connection(websocket):
    # Add new client to the list of connected clients
    connected_clients.add(websocket)
    print(f"New client connected. Total clients: {len(connected_clients)}")

    # Send the current flag changes to the new client
    await websocket.send(json.dumps({"flags": flag_changes}))

    try:
        # Wait for messages from the client
        async for message in websocket:
            print(f"Received message: {message}")
            
            # Parse the message as JSON
            try:
                data = json.loads(message)
                message_type = data.get("type")
                
                if message_type == "change_flag":
                    new_flag = data.get("flag")
                    if new_flag:
                        await change_flag(new_flag)
                elif message_type == "toggle_log":
                    await toggle_log()
                elif message_type == "subscribe":
                    # Handle subscription requests
                    await handle_subscription(websocket, data)
                    
            except json.JSONDecodeError:
                print(f"Invalid JSON message received: {message}")
    
    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")
    finally:
        # Remove the client from connected clients when they disconnect
        connected_clients.remove(websocket)
        print(f"Client disconnected. Total clients: {len(connected_clients)}")

async def handle_subscription(websocket, data):
    """Handle client subscription requests"""
    subscription_type = data.get("subscription_type")
    if subscription_type == "flags":
        # Send current flags to the subscriber
        await websocket.send(json.dumps({"type": "flags", "data": flag_changes}))
    elif subscription_type == "logs":
        # Send current log state to the subscriber
        await websocket.send(json.dumps({"type": "log_state", "data": {"active": log_active}}))

# Function to change a flag and notify all connected clients
async def change_flag(new_flag):
    # Persist the flag change (add to flag_changes list)
    flag_changes.append(new_flag)
    # Notify all clients about the flag change
    await publish_flags()

# Function to publish flags to all connected clients
async def publish_flags():
    message = json.dumps({"type": "flags", "data": flag_changes})
    for websocket in connected_clients:
        try:
            await websocket.send(message)
        except websockets.exceptions.ConnectionClosed:
            print("Failed to send to disconnected client")

# Function to toggle log (for logging functionality)
log_active = False
async def toggle_log():
    global log_active
    log_active = not log_active
    status = "started" if log_active else "stopped"
    print(f"Logging {status}")

    # Notify all clients about the log state change
    await publish_logs()

# Function to publish log data
async def publish_logs():
    message = json.dumps({"type": "log_state", "data": {"active": log_active}})
    for websocket in connected_clients:
        try:
            await websocket.send(message)
        except websockets.exceptions.ConnectionClosed:
            print("Failed to send to disconnected client")

# Function to start the WebSocket server
async def start_server():
    # Create a WebSocket server that listens for incoming connections
    server = await websockets.serve(handle_connection, "localhost", 50000)
    print("Server started at ws://localhost:50000")
    await server.wait_closed()

# Run the WebSocket server
if __name__ == "__main__":
    asyncio.run(start_server())
