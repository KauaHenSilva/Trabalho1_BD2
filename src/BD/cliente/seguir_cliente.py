"""
Módulo responsável por criar a relação de amizade entre clientes.
"""

from pyorient.otypes import OrientRecord  # type: ignore
from BD.bd import BD  # pylint: disable=import-error


class SeguirCliente:
    """
    Classe responsável por criar a relação de Seguir entre clientes.
    """

    def __init__(self, db: BD):
        self.client = db.client
        self.set_segue_relationship()

    def set_segue_relationship(self):
        """
        Método responsável por criar a classe Segue e definir suas
        propriedades.
        """
        result = self.client.command(
            "SELECT FROM ( SELECT expand( classes ) FROM metadata:schema ) WHERE name = 'Segue'"
        )

        if not result:
            self.client.command("CREATE CLASS Segue EXTENDS E")
            print("Classe Segue criada com sucesso.")
        else:
            print("Classe Segue existe.")

    def create_segue(self, cliente1: OrientRecord, cliente2: OrientRecord):
        """
        Método responsável por criar uma relação de Segue entre dois
        clientes.
        """

        if not cliente1 or not cliente2:
            print("Um dos clientes não foi encontrado.")
        else:
            cliente1_id = cliente1._rid  # pylint: disable=protected-access
            cliente2_id = cliente2._rid  # pylint: disable=protected-access

            if self.client.query(
                f"SELECT FROM Segue WHERE out = {cliente1_id} AND in = {cliente2_id}"
            ):
                print("Relação de Segue já existe.")
            else:
                try:
                    self.client.command(
                        f"CREATE EDGE Segue FROM {cliente1_id} TO {cliente2_id}"
                    )
                except Exception as e:  # pylint: disable=broad-except
                    print(e)
                    print("Erro ao criar relação de Segue.")
