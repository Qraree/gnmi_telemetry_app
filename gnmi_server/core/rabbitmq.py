import pika
from pika import BlockingConnection

class RabbitMQClient:
    connection: BlockingConnection

    def __init__(self, username, password, host='localhost'):
        credentials = pika.PlainCredentials(username, password)
        parameters = pika.ConnectionParameters(host=host, credentials=credentials)
        self.connection = pika.BlockingConnection(parameters)
        channel = self.connection.channel()
        channel.queue_declare(queue='hello')


    def get_connection(self):
        return self.connection