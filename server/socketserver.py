import asyncio
import json
from websockets.asyncio.server import serve

connected_clients = set()

async def handler(websocket):
    connected_clients.add(websocket)

    try:
        while True:
            message = await websocket.recv()
            print(message)

            messageJson = json.loads(message)
            type = messageJson["type"]

            if type == "NEW_LOG":
                await handlerNewLog(messageJson)
            elif type == "SET_FLAG":
                await handlerSetFlag(messageJson)

        await websocket.wait_closed()
    finally:
            connected_clients.remove(websocket)


async def handlerSetFlag(messageJson):
    await broadcast(json.dumps(messageJson))
    print("Handle new flag complete")

async def handlerNewLog(messageJson):
    await broadcast(json.dumps(messageJson))
    print("Handle new log complete")

async def broadcast(message):
    if connected_clients:
        for client in connected_clients:
            try:
                await client.send(message)
            except:
                print("failed to send to client")

async def main():
    async with serve(handler, "", 50000) as server:
        await server.serve_forever()


if __name__ == "__main__":
    asyncio.run(main())
