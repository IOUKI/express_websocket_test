// import express and ws
const express = require('express')
const SocketServer = require('ws').Server
const PORT = 3000 // server listen port 

// 創建 express 物件，綁定監聽 port，設定啟動後在 console 中提示
const server = express().listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})

// 將 express 交給 SocketServer 開啟 WebSocket 的服務
const wss = new SocketServer({ server })

// 當有 client 連線成功時
wss.on('connection', ws => {
    console.log('New Client Connected!')
    ws.id = generateUniqueId()

    // 當收到 client 消息時
    ws.on('message', message => {

        // 收回來是 Buffer 格式，需轉成字串
        // message = message.toString()
        message = `${ws.id}: ${message}`

        // ws.send(message)

        let clients = wss.clients // 取得所有連線中的 client

        // 發送 message 至每個client
        clients.forEach(client => {
            client.send(message)
        })

    })

    // 連線關閉事件監聽
    ws.on('close', () => {
        console.log('A Client connected...')
    })
})

const generateUniqueId = () => {
    const timeStamp = Date.now().toString(36)
    const randomNum = Math.random().toString(36).substring(2, 5)
    return `${timeStamp}${randomNum}`
}
