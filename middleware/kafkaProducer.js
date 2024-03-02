const kafka = require('kafka-node');
const Producer = kafka.Producer;
const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' });
const producer = new Producer(client);



function sendToKafka(topic, message) {
    const payloads = [
        { topic: topic, messages: JSON.stringify(message) }
    ];
    producer.send(payloads, function (err, data) {
        if (err) {
            console.error('Error sending to Kafka:', err);
        }
    });
}

producer.on('error', function (err) {
    console.error('Kafka producer error:', err);
});

module.exports = {
    sendToKafka
};