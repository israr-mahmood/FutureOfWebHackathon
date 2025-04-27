import asyncio
import websockets
import json

async def test_client():
    uri = "ws://localhost:50000"  # The WebSocket server URI
    
    # Connect to the WebSocket server
    async with websockets.connect(uri) as websocket:
#         # Subscribe to flags
#         await websocket.send(json.dumps({
#             "type": "subscribe",
#             "subscription_type": "flags"
#         }))
#
#         # Subscribe to logs
#         await websocket.send(json.dumps({
#             "type": "subscribe",
#             "subscription_type": "logs"
#         }))
#
#         # Send a flag change
#         await websocket.send(json.dumps({
#             "type": "change_flag",
#             "flag": "NewFlag1"
#         }))

        # Send a flag change
        await websocket.send(json.dumps({
            "type": "SET_FLAG",
            "path": "app.index",
            "isEnabled": True
        }))

        # Send a flag change
        await websocket.send(json.dumps({
            "type": "NEW_LOG",
            "path": "app.index",
            "message": "new message"
        }))
        
#         # Toggle logging
#         await websocket.send(json.dumps({
#             "type": "toggle_log"
#         }))
        
        # Listen for responses
        try:
            while True:
                response = await websocket.recv()
                data = json.loads(response)
                print(f"Received: {data}")
        except websockets.exceptions.ConnectionClosed:
            print("Connection closed by server")

# Run the WebSocket client
if __name__ == "__main__":
    asyncio.run(test_client())
