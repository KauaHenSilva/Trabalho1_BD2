"""
  Script to initialize the database
"""

import random
from threading import Thread
from time import sleep
from pyorient.otypes import OrientRecord  # pylint: disable=import-error
from BD.bd import BD  # pylint: disable=import-error
from BD.cliente.cliente import Cliente  # pylint: disable=import-error
from BD.cliente.seguir_cliente import SeguirCliente  # pylint: disable=import-error
from BD.post.post import Post  # pylint: disable=import-error

# Definir o range de IDs para clientes e posts
RANGE_ID_CLIENTES = 1_000_000_00
RANGE_ID_POSTS = 1_000_000_000

TEMPO = 15


def inserir_clientes(obj_cliente: Cliente):
    """
    Insere clientes no banco de dados periodicamente.
    """
    while True:
        sleep(random.uniform(0, TEMPO))  # Aguardar 10 segundos entre inserções
        # pegar id aleatório
        try:
            x = random.randint(1, RANGE_ID_CLIENTES)
            obj_cliente.create_client(f"Cliente{x}", x)  # Criar cliente com nome e ID
        except Exception as e:  # pylint: disable=broad-except
            print(f"Erro ao inserir cliente {x}: {e}")


def inserir_posts(obj_cliente: Cliente, obj_post: Post):
    """
    Insere posts no banco de dados para clientes aleatórios.
    """
    while True:
        sleep(random.uniform(0, TEMPO))  # Aguardar 10 segundos entre inserções
        try:
            # Procurar um cliente aleatório
            my_cliente: OrientRecord = obj_cliente.get_cliente_random()
            user_name = my_cliente.oRecordData["userName"]
            obj_post.create_post(
                f"Post do {user_name}", user_name
            )  # Criar post para o cliente
        except Exception as e:  # pylint: disable=broad-except
            print(f"Erro ao inserir post: {e}")


def inserir_seguir(obj_cliente: Cliente, obj_seguir: SeguirCliente):
    """
    Insere relacionamentos de seguir entre clientes no banco de dados.
    """
    while True:
        sleep(random.uniform(0, TEMPO))  # Aguardar 10 segundos entre inserções
        try:
            cliente1 = obj_cliente.get_cliente_random()
            cliente2 = obj_cliente.get_cliente_random()

            # Garantir que um cliente não siga a si mesmo
            if cliente1 != cliente2:
                obj_seguir.create_segue(
                    cliente1, cliente2
                )  # Criar relacionamento de seguir
        except Exception as e:  # pylint: disable=broad-except
            print(f"Erro ao criar relacionamento de seguir: {e}")


if __name__ == "__main__":
    try:
        # Inicializa o banco de dados
        bd = BD()

        # Cria instâncias das classes para operações no banco de dados
        cliente = Cliente(bd)
        seguir = SeguirCliente(bd)
        post = Post(bd)

        # Simulação de concorrência

        # Inicializa a thread para inserir clientes
        thread_clientes1 = Thread(target=inserir_clientes, args=(cliente,))
        thread_clientes2 = Thread(target=inserir_clientes, args=(cliente,))
        thread_clientes3 = Thread(target=inserir_clientes, args=(cliente,))

        thread_clientes1.start()
        thread_clientes2.start()
        thread_clientes3.start()

        # Inicializa a thread para inserir posts
        thread_posts = Thread(target=inserir_posts, args=(cliente, post))
        thread_posts.start()

        # Inicializa a thread para inserir relacionamentos de seguir
        thread_seguir = Thread(target=inserir_seguir, args=(cliente, seguir))
        thread_seguir.start()

    except Exception as e:  # pylint: disable=broad-except
        print(f"Erro ao inicializar o sistema: {e}")
