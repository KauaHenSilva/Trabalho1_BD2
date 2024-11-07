"""
    Módulo responsável por realizar a conexão e operações no banco de dados
"""

from os import getenv
from time import sleep
from pyorient.orient import OrientDB  # type: ignore
from pyorient import DB_TYPE_GRAPH  # type: ignore
from pyorient.exceptions import PyOrientConnectionException  # type: ignore


class BD:
    """
    Classe responsável por realizar a conexão e operações no banco de dados
    OrientDB.
    """

    def __init__(self):
        """
        Método construtor da classe BD. Estabelece a conexão inicial com o
        servidor e tenta reconectar em caso de falha.
        """
        host = getenv("HOST", "10.180.44.13")
        self.client = OrientDB(host, 2424)

        self.try_connection()
        self.start_database_rede_social()
        print("Conexão com o banco de dados estabelecida com sucesso.")

    def try_connection(self):
        """
        Método responsável por tentar estabelecer uma conexão com o servidor.
        """
        while True:
            try:
                password = getenv("PASSWORDBD", "root")
                user = getenv("USERBD", "root")
                print(password, user)
                self.client.connect(user, password)
                break
            except PyOrientConnectionException:
                print("Falha na conexão com o servidor. Tentando novamente...")
                sleep(5)

    def start_database_rede_social(self):
        """
        Método responsável por criar o banco de dados 'alunos' e definir sua
        estrutura.
        """
        if not self.client.db_exists("REDE_SOCIAL"):
            self.client.db_create("REDE_SOCIAL", DB_TYPE_GRAPH)
            self.client.db_open("REDE_SOCIAL", "root", "root")
        else:
            self.client.db_open("REDE_SOCIAL", "root", "root")
