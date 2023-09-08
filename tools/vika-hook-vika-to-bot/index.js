const mqtt = require('mqtt');
const crypto = require('crypto');
// const formidable = require('formidable');

// 加密函数
function encrypt(payload, keyBase64) {
  const key = Buffer.from(keyBase64, 'base64');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: iv.toString('hex'), data: encrypted };
}

// 解密函数
function decrypt(message, keyBase64) {
  const key = Buffer.from(keyBase64, 'base64');
  const iv = Buffer.from(message.iv, 'hex');
  const encryptedText = Buffer.from(message.data, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}

// 生成密钥
function getKey() {
  return crypto.randomBytes(32).toString('base64');
}

class Http2Mqtt {
  constructor(ops) {
    this.headers = ops.headers;
    this.body = ops.body;
    this.responsePayload = { body: {}, status: 200 };
  }

  async pubMessage() {
    try {
      const { Endpoint: endpoint, Username: username, Password: password, Port: port, Key: key, Pubtopic:pubTopic, Subtopic:subTopic } = this.headers;
      const payload = this.body;

      const encryptedPayload = key ? encrypt(payload, key) : payload;
      const client = mqtt.connect(`mqtt://${endpoint}:${port || 1883}`, { username, password });

      return new Promise((resolve, reject) => {
        client.on('connect', () => {
          client.subscribe(subTopic, (err) => {
            if (err) {
              this.responsePayload.status = 500;
              this.responsePayload.body = { error: 'Failed to subscribe to topic' };
              client.end(true, () => reject(this.responsePayload));
              return;
            }

            client.publish(pubTopic, JSON.stringify(encryptedPayload), (err) => {
              if (err) {
                this.responsePayload.status = 500;
                this.responsePayload.body = { error: 'Failed to publish to topic' };
                client.end(true, () => reject(this.responsePayload));
              }
            });

            // Timeout after 10 seconds
            setTimeout(() => {
              this.responsePayload.status = 408;
              this.responsePayload.body = { error: 'Request timed out' };
              client.end(true, () => resolve(this.responsePayload));
            }, 10000);
          });
        });

        client.on('message', (topic, message) => {
          if (topic === subTopic) {
            const decryptedMessage = key ? decrypt(JSON.parse(message.toString()), key) : JSON.parse(message.toString());
            this.responsePayload.body = { status: 'ok', message: decryptedMessage };
            client.end(true, () => resolve(this.responsePayload));
          }
        });

        client.on('error', (err) => {
          this.responsePayload.status = 500;
          this.responsePayload.body = { error: err.message };
          client.end(true, () => reject(this.responsePayload));
        });
      });
    } catch (err) {
      this.responsePayload.status = 500;
      this.responsePayload.body = { error: err };
      return Promise.reject(this.responsePayload);
    }
  }
}

exports.handler = async (event, context, callback) => {
  try {
    const headers = event.headers;
    const bodyString = event.body
    const body = JSON.parse(bodyString);
    const http2mqtt = new Http2Mqtt({ headers, body });
    const res = await http2mqtt.pubMessage()
    callback(null, res.body);
  } catch (err) {
    console.error(err);
    callback(error, JSON.stringify({ error: err }));
  }
};
