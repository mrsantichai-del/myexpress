require('dotenv').config();
const express = require('express');
const line = require('@line/bot-sdk');
const app = express();

// ตั้งค่าจาก LINE Developers Console
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "",
  channelSecret: process.env.LINE_CHANNEL_SECRET || ""
};

app.use('/webhook', line.middleware(config));

// รับ webhook
app.post('/webhook', (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then(result => res.json(result));
});

// ตอบกลับข้อความ
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  // --- เวอร์ชันเก่า (v10 ลงไป) ---
  // return client.replyMessage(event.replyToken, {
  //   type: 'text',
  //   text: `คุณพิมพ์ว่า: ${event.message.text}`
  // });

  // --- เวอร์ชันใหม่ (v11 ขึ้นไป) ---
  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [{
      type: 'text',
      text: `คุณพิมพ์ว่า: ${event.message.text}`
    }]
  });
}

// --- เวอร์ชันเก่า (v10 ลงไป) ---
// const client = new line.Client(config);

// --- เวอร์ชันใหม่ (v11 ขึ้นไป) ---
const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken
});

app.get('/', (req, res) => {
  res.send('hello world, Santichai');
});

const PORT = process.env.PORT || 3018;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});