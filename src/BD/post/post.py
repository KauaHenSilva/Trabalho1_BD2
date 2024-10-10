"""
    Modulo responsável por criar a classe Post e definir suas propriedades.
"""

from pyorient.otypes import OrientRecord  # type: ignore
from BD.bd import BD  # pylint: disable=import-error


class Post:
    """
    Classe responsável por interagir com a entidade Post no banco de dados,
    usando arestas para relacionar clientes e posts.
    """

    def __init__(self, db: BD):
        """
        Inicializa a classe Post e cria sua estrutura no banco de dados,
        caso ainda não exista.
        """
        self.client = db.client
        self.set_post_node()

    def set_post_node(self):
        """
        Define a classe Post e suas propriedades no banco de dados.
        Se a classe já existir, nenhuma ação é tomada.
        """

        result = self.client.command(
            "SELECT FROM ( SELECT expand( classes ) FROM metadata:schema ) WHERE name = 'Post'"
        )

        if not result:
            self.client.command("CREATE CLASS Post EXTENDS V")
            self.client.command("CREATE PROPERTY Post.texto STRING")
            self.client.command("CREATE PROPERTY Post.cliente LINK Cliente")
            print("Classe Post criada com sucesso.")
        else:
            print("Classe Post já existe.")

    def create_post(self, texto: str, user_name: str):
        """
        Cria um novo registro Post no banco de dados e cria uma aresta
        `Criou` entre o cliente e o post.
        """

        is_postado = True

        cliente: OrientRecord = self.client.query(
            f"SELECT FROM Cliente WHERE userName = '{user_name}'"
        )

        if not cliente:
            is_postado = False
        else:
            try:
                self.client.command(
                    f"CREATE VERTEX Post SET texto = '{texto}', cliente = {cliente[0]._rid}"  # pylint: disable=protected-access
                )
            except Exception as e:  # pylint: disable=broad-except
                print(f"Erro ao criar post: {e}")
                is_postado = False

        return is_postado
