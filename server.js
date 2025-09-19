const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

app.post('/send', async (req, res) => {
  const { to, title, body } = req.body;
  if (!to) return res.status(400).json({ error: 'Token destino requerido' });
  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to,
        sound: 'default',
        title,
        body,
        data: { sentBy: 'MiniApp' },
      }),
    });
    const data = await response.json();
    res.json({ success: true, expoResponse: data });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(3000, () => console.log('Backend corriendo en puerto 3000'));