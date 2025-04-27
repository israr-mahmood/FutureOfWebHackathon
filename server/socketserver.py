import asyncio
import json
from websockets.asyncio.server import serve

async def handler(websocket):
    while True:
        message = await websocket.recv()
        print(message)

        messageJson = json.loads(message)
        type = messageJson["type"]

        if type == "NEW_LOG":
            await handlerNewLog(websocket, messageJson)
        elif type == "SET_FLAG":
            await handlerSetFlag(websocket, messageJson)


async def handlerSetFlag(websocket, messageJson):
    await websocket.send(json.dumps(messageJson))
    print("Handle new flag complete")

async def handlerNewLog(websocket, messageJson):
    await websocket.send(json.dumps(messageJson))
    print("Handle new log complete")

async def main():
    async with serve(handler, "", 50000) as server:
        await server.serve_forever()


if __name__ == "__main__":
    asyncio.run(main())
