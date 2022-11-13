let celulas = document.querySelectorAll(".celulas")
let mensagens = document.querySelector(".mensagem")
let velha1 = document.querySelector(".vitoria")
let velha2 = document.querySelector('.derrota')
let telajogadores = document.querySelector(".telajog")
let telasimbolo = document.querySelector(".telasimb")
let barra = document.querySelector(".barra")
let empate = 0
let vezjogador = true
let velha = false
let vencedor = false
let simbolorobo
let nome
let quantjogadores
let simbolo;
let clicadoso = [];
let clicadosx = [];
const combinacoes = [
    ["00", "01", "02"],
    ["10", "11", "12"],
    ["20", "21", "22"],
    ["00", "10", "20"],
    ["01", "11", "21"],
    ["02", "12", "22"],
    ["00", "11", "22"],
    ["02", "11", "20"],
];
let nome2 = document.querySelector(".nome2")
let simbjog1
let contajog = 0
let posicao = 0
let alguemvencendo = false
let contatodos = 0
let posicdisp = []
let posicoesdefinidas = []
let aleatorio = Math.floor(Math.random() * 7)
let idrobo
let cronometro = 0
let interval

let contatempo = () => {
    cronometro = 0
    clearInterval(interval)
    if (simbolo == simbjog1) nome = document.querySelector('.nomejog1').value
    else nome = document.querySelector('.nomejog2').value
    interval = setInterval(() => {
        cronometro++
        document.querySelector('.tempo').innerHTML = "Tempo restante: " + (5 - cronometro) + "s"
        if (cronometro == 5) {
            clearInterval(interval)
            if(velha) return
            vencedor = true
            enviarmensagem((nome ? nome : simbolo) + " perdeu")
        }
    }, 1000);
}



function jogadores(quant) {
    if (quant == 1) quantjogadores = 1
    else {
        quantjogadores = 2
        nome2.style.opacity = "1"
    }
    telajogadores.style.display = "none"
    telasimbolo.style.display = "inline"
}
function configurar(estado) {
    if (estado == "comeca") {
        telasimbolo.style.display = "none"
        document.querySelector(".config").style.display = "none"
        document.querySelector(".pag").style.opacity = 1
        document.querySelector(".titulo").style.opacity = 1
    }
    else {
        telajogadores.style.display = "inline"
        document.querySelector(".config").style.display = "inline"
        document.querySelector(".pag").style.opacity = 0.2
        document.querySelector(".titulo").style.opacity = 0.2
    }
}
function definesimbolo(simbolopassa) {
    [simbolo, simbolorobo] = [simbolopassa, simbolopassa == "X" ? "O" : "X"]
    configurar("comeca")
    nome = document.querySelector('.nomejog1').value
    enviarmensagem("Vez de " + (nome ? nome : simbolo))
    simbjog1 = simbolo
    contatempo()
}




function enviarmensagem(mensagem) {
    mensagens.innerHTML = mensagem
    barra.style.animation = ""
    setTimeout(() => {
        barra.style.animation = "barrinha 5s linear"
    }, 5);
}

function verificarsevazio(posicao) {
    return document.getElementById(posicao).innerHTML != ""
}

function marcarsimbolo(posicao, quem) {
    document.getElementById(posicao).innerHTML = quem
}

function trocarsimbolo() {
    simbolo = simbolo == "X" ? "O" : "X"
}

function verificarsevencendo(clicados) {
    return combinacoes.some((comb) => {
        return comb.some((c) => {
            if (clicados.includes(c)) {
                contajog++
                console.log(contajog)
                if (contajog == 2) {
                    for (let i = 0; i <= 2; i++) {
                        if (document.getElementById(comb[i]).innerHTML == "") {
                            contajog = 0
                            posicao = comb[i]
                        }
                        else contatodos++
                    }
                    if (contatodos == 3) return false
                    return true
                }
            }
            else if (comb.indexOf(c) != 1) contajog = 0
            contatodos = 0
        })
    })
}


//jogo sozinho contra "robo" que pega posicoes aleatorias
function robo() {
    if (vencedor || vezjogador) return;
    posicdisp = [];
    posicoesdefinidas = [];

    posicoesdefinidas.push(combinacoes[aleatorio]);
    posicoesdefinidas.some((pos) => {
        for (let i = 0; i <= 2; i++) {
            if (document.getElementById(pos[i]).innerHTML == "") {
                posicdisp.push(document.getElementById(pos[i]).id);
            }
        }
    });
    if (posicdisp.length == 0) {
        celulas.forEach((celula) => {
            if (celula.innerHTML == "") posicdisp.push(celula.id);
        });
    }
    let aleatoriofinalmente = Math.floor(Math.random() * (posicdisp.length - 1));


    if (verificarsevencendo(simbolo == "X" ? clicadosx : clicadoso)) idrobo = posicao
    else idrobo = posicdisp[aleatoriofinalmente];


    if (verificarsevencendo(simbolorobo == "X" ? clicadosx : clicadoso)) idrobo = posicao

    nome = document.querySelector('.nomejog1').value
    if (idrobo != undefined && !vencedor) {
        setTimeout(() => {
            contatempo()
            marcarsimbolo(idrobo, simbolorobo);
            enviarmensagem("Vez de " + (nome ? nome : simbolo))
            casovelha()
            verificarvitoria(idrobo, simbolorobo == "X" ? clicadosx : clicadoso, simbolorobo);
            alguemvencendo = false
        }, 1500);
    }
}

function jogar(posicao) {

    if (verificarsevazio(posicao.id) || !quantjogadores || !vezjogador || vencedor) return
    contatempo()
    marcarsimbolo(posicao.id, simbolo)
    casovelha()
    verificarvitoria(posicao.id, simbolo == "X" ? clicadosx : clicadoso, simbolo)
    if (vencedor || velha) return
    if (quantjogadores == 2) {
        trocarsimbolo()
        if (simbolo == simbjog1) nome = document.querySelector('.nomejog1').value
        else nome = document.querySelector(".nomejog2").value
        enviarmensagem("Vez de " + (nome ? nome : simbolo))
    } else {
        vezjogador = false
        enviarmensagem("Vez de Robô")
        robo()
        setTimeout(() => {
            robojogou = false;
            vezjogador = true;
        }, 1500)
    }

}

function verificarvitoria(posicao, clicados, simbolo) {
    clicados.push(posicao)
    vencedor = combinacoes.some((comb) => {
        return comb.every((c) => {
            return clicados.includes(c)
        })
    })

    if (vencedor) {
        clearInterval(interval)
        if (simbolo == simbjog1) {
            velha1.src = "./velhafeliz.png"
            velha2.src = "./velhatriste.png"
            nome = document.querySelector('.nomejog1').value
        }
        else if (quantjogadores == 1) {
            velha1.src = "./velhatriste.png"
            nome = "Robô"
        }
        else {
            velha1.src = "./velhatriste.png"
            velha2.src = "./velhafeliz.png"
            nome = document.querySelector('.nomejog2').value
        }

        enviarmensagem((nome ? nome : simbolo) + " ganhou")
        velha1.style.opacity = "1"
        if (quantjogadores == 2) velha2.style.opacity = "1"
    }
}

function casovelha() {
    let contavelha = 0
    celulas.forEach((celula) => {
        if (celula.innerHTML != "") contavelha++
    })

    if (contavelha == 9) {
        enviarmensagem("Deu velha!")
        velha = true
    }
}

function reset() {
    if (!vezjogador) return
    configurar()
    cronometro = 0
    clearInterval(interval)
    velha1.style.opacity = "0"
    velha2.style.opacity = "0"
    enviarmensagem("Jogo da veia 2.0")
    celulas.forEach(celula => {
        celula.innerHTML = ""
    })
    nome2.style.opacity = "0"
    simbolo = undefined
    clicadoso = []
    clicadosx = []
    velha = false
    vencedor = false
}