function enviarDinheiro(){
    var input_money = document.getElementById("valueSend");
    var errorValue = document.getElementById("errorValue");
    
    function verificaTexto(){
        var input_name = document.getElementById("userSend");
        var errorName = document.getElementById("errorName");
        verif = 1;

        if(input_name.value == ""){
            errorName.innerHTML = "Nao deixe o campo vazio";
            errorName.style.display = "inline";
            verif = 0;
        }else{
            errorName.style.display = "none";
        }

        return verif;
    }

    function verificaNumero(){
        verif = 1;

        if(isNaN(parseFloat(input_money.value))){
            errorValue.innerHTML = "Digite só valores";
            errorValue.style.display = "inline";
            verif = 0;
        }else{
            value = parseFloat(input_money.value);
            if(value < 0){
                errorValue.innerHTML = "Digite valores positivos";
                errorValue.style.display = "inline";
                verif = 0;
            }else{
                errorValue.style.display = "none";
            }
        }
        return verif;
    }

    function verificaSaldo(){
        verif = 1;
        var saldo = parseFloat(document.getElementById("saldo").textContent);
        valor = parseFloat(input_money.value);
        if(!isNaN(valor)){
            if(saldo < valor){
                alert("Saldo insuficiente!");
                verif = 0;
            }
        }
        return verif;
    }
    
    verificaTexto();
    verificaNumero();
    verificaSaldo();

    if(verificaTexto() && verificaNumero() && verificaSaldo()){
        document.getElementById("sendForm").submit();
    }
}