"""
    Modulo responsável por criar a classe Cliente e definir suas propriedades.
"""

import random
from BD.bd import BD  # pylint: disable=import-error


class Cliente:
    """
    Classe responsável por criar a classe Cliente e definir suas propriedades.
    """

    def __init__(self, db: BD):
        self.client = db.client
        self.set_client_node()

    def set_client_node(self):
        """
        Método responsável por criar a classe Cliente e definir suas
        propriedades.
        """

        result = self.client.command(
            "SELECT FROM ( SELECT expand( classes ) FROM metadata:schema ) WHERE name = 'Cliente'"
        )

        if not result:
            print("Classe Cliente não existe, criando...")
            self.client.command("CREATE CLASS Cliente EXTENDS V")
            self.client.command("CREATE PROPERTY Cliente.userName STRING")
            self.client.command("CREATE PROPERTY Cliente.idade INTEGER")
            self.client.command("CREATE INDEX Cliente.userName UNIQUE")
            print("Classe Cliente criada com sucesso.")
        else:
            print("Classe Cliente já existe.")

    def create_client(self, nome: str, idade: int) -> bool:
        """
        Método responsável por criar um nó Cliente no banco de dados.
        """
        self.client.command(
            f"CREATE VERTEX Cliente SET userName = '{nome}', idade = {idade}"
        )

    def get_client(self, user_mame: str):
        """
        Método responsável por buscar um cliente no banco de dados.
        """
        return self.client.query(f"SELECT FROM Cliente WHERE userName = '{user_mame}'")

    def get_cliente_random(self):
        """
        Método responsável por buscar um cliente aleatório no banco de dados.
        """
        clientes = self.client.query("SELECT FROM Cliente")
        return clientes[random.randint(0, len(clientes) - 1)]
