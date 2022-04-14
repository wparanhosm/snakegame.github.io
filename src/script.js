
const cobrinha = {
    
    snakeArray: undefined,
    dimensao : 30,
    direction : 0,
    initial: 0, 
    grid: undefined,
    snakeLength: 0,
    lastDirection: 0,
    tick: false,
    interval: undefined,
    comidaPos: 0,
    timer: 0,
    points : 0,
    positions: [],
    getPositionValue : (pos) => {
        return cobrinha.positions.find( (e) => e.pos == pos).value;
    },
    getPositionName : (value) => {
        try {
            return cobrinha.positions.find( (e) => e.value == value).pos;
        } catch(e){
            console.log(e);
        }
    },
    getInvertedPosition : (positionName) => {
        switch(positionName){
            case 'up': {
                return 'down';
            }
            case 'down': {
                return 'up';
            }
            case 'left': {
                return 'right';
            }
            case 'right': {
                return 'left';
            }
        }
    },
    defineValores : () => {

        cobrinha.positions = [
            {pos: 'up', value:  -cobrinha.dimensao},
            {pos:'down', value : cobrinha.dimensao},
            {pos:'left', value : -1},
            {pos:'right', value : 1}
        ]

        cobrinha.initial = cobrinha.isOdd(cobrinha.dimensao) ? Math.pow(cobrinha.dimensao,2)/2 : Math.pow(cobrinha.dimensao,2)/2 - (cobrinha.dimensao/2);
        cobrinha.direction = cobrinha.getPositionValue('right');
        cobrinha.lastDirection = cobrinha.direction;
        cobrinha.snakeArray = [parseInt(cobrinha.initial)];
        cobrinha.comidaPos = parseInt(Math.random() * Math.pow(cobrinha.dimensao,2));
        cobrinha.timer = 300;
        cobrinha.snakeLength = 6;
        cobrinha.points = 0;
    },

    removeAllChildNodes: (parent)  =>{
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    },

    verifyDirection : (direction) => {
        if(cobrinha.getPositionName(cobrinha.direction) == cobrinha.getInvertedPosition(direction))
        {
            return false;
        }

        return true;
    },

    move : () => {
        if(!cobrinha.tick)
            cobrinha.tick = true;

        var pos = cobrinha.getNextPosition();

        if(pos == cobrinha.comidaPos){
            cobrinha.points += 50;
            cobrinha.grid.children[pos].classList.remove("comida");
            cobrinha.snakeLength++;

            do{
                cobrinha.comidaPos = parseInt(Math.random() * Math.pow(cobrinha.dimensao,2));
            }while(cobrinha.snakeArray.includes(cobrinha.comidaPos));

            cobrinha.grid.children[cobrinha.comidaPos].classList.add("comida");

            if(cobrinha.timer > 34) {
                cobrinha.timer = cobrinha.timer - Math.log(cobrinha.timer);
                clearInterval(cobrinha.interval);
                cobrinha.interval = setInterval(function () {cobrinha.move()}, cobrinha.timer);
            }
        }

        cobrinha.snakeArray.push(pos);

        if(cobrinha.checkColision()){
            cobrinha.stopGame();
        } else {

            if(cobrinha.snakeArray.length > cobrinha.snakeLength){
                cobrinha.grid.children[cobrinha.snakeArray[0]].classList.remove("cobrinha");
                cobrinha.grid.children[cobrinha.snakeArray[0]].style = '';
                cobrinha.snakeArray.splice(0, 1); 
            }

            cobrinha.grid.children[pos].classList.add("cobrinha");

            cobrinha.mountSnakeLayout(pos);
            //define direção que a cobrinha vai 
            

            cobrinha.points += 10;
            cobrinha.refreshInformations();
            cobrinha.lastDirection = cobrinha.direction;
        }
         
    },

    mountSnakeLayout : (pos) => {
        const posicaoNome =  cobrinha.getPositionName(cobrinha.lastDirection) + cobrinha.getPositionName(cobrinha.direction);
        let arqName = '';

        switch (posicaoNome){

            case 'upup':
            case 'downdown': 
            {
                arqName = 'body_vertical';
                break;
            }

            case 'leftleft':
            case 'rightright': {
                arqName= 'body_horizontal';
                break;
            }


            case 'rightdown':
            case 'upleft': {
                    arqName= 'body_bottomleft';
                    break;
            }

            case 'leftdown':
            case 'upright': {
                    arqName= 'body_bottomright';
                    break;
            }

            case 'rightup':
            case 'downleft': {
                    arqName= 'body_topleft';
                    break;
            }

            case 'leftup':
            case 'downright': {
                    arqName= 'body_topright';
                    break;
            }

            default: {
                arqName = `body_${posicaoNome}`;
                break;
            }
        }

        arqName = `${arqName}.png`;

        //cabeça
        cobrinha.grid.children[pos].style = `background-image: url('./img/head_${cobrinha.getPositionName(cobrinha.direction)}.png');background-size: cover;background-position: center;`;
        
        
        if(cobrinha.snakeArray.length > 1){
            //corpo
            let antPenul = cobrinha.snakeArray[cobrinha.snakeArray.length - 2];
            cobrinha.grid.children[antPenul].style = `background-image: url('./img/${arqName}');background-size: cover;background-position: center;`;


            //cauda 
            try{
                let namePosition = cobrinha.snakeArray[1] - cobrinha.snakeArray[0]; 
                if(namePosition == 0)
                    namePosition = cobrinha.snakeArray[0];

                let directionTail = cobrinha.getPositionName(namePosition);
                cobrinha.grid.children[cobrinha.snakeArray[0]].style = `background-image: url('./img/tail_${cobrinha.getInvertedPosition(directionTail)}.png');background-size: cover;background-position: center;`;
            } catch (e){
                console.log(e);
            }
        }



        
    },

    initGame : (grid) => {
        cobrinha.defineValores();
        cobrinha.montaCampos(grid);
        cobrinha.createEventsAttributes();
        cobrinha.interval = setInterval(function () {cobrinha.move()}, cobrinha.timer);
    },  

    montaCampos: (grid) => {
        cobrinha.grid = grid;

        cobrinha.removeAllChildNodes(cobrinha.grid);

        var campos = Math.pow(cobrinha.dimensao,2);
        for(i = 0; i < campos; i++){
            var node = document.createElement("div");

            if(i < cobrinha.dimensao) {
                if(cobrinha.isOdd(i))
                    node.classList.add("dark");
            }else{
                if(!cobrinha.grid.children[i - cobrinha.dimensao].classList.value.includes('dark'))
                    node.classList.add("dark");
            }
           

            node.classList.add("campo");
            grid.appendChild(node);
        }

        var template = `grid-template-columns: repeat(${cobrinha.dimensao}, 1fr)`;
        grid.setAttribute('style',template);


        cobrinha.grid.children[cobrinha.comidaPos].classList.add("comida");

    },

    isOdd : (num) => { 
        return num % 2;
    },

    createEventsAttributes: () => {
        document.addEventListener('keydown', (event) => {
            if(cobrinha.tick){
                const keyName = event.key;

                if(keyName.includes("Arrow")) {
                    cobrinha.lastDirection = cobrinha.direction;

                    const direction = keyName.split("Arrow")[1].toLowerCase();

                    if(cobrinha.verifyDirection(direction)){
                        cobrinha.direction = cobrinha.getPositionValue(direction);
                        cobrinha.tick = false;
                    }
                    
                }

            }
        });
    },
    
    

    checkColision : () => {
        var uniq = cobrinha.snakeArray
            .map((name) => {
                return {
                count: 1,
                name: name
                }
            })
            .reduce((a, b) => {
                a[b.name] = (a[b.name] || 0) + b.count
                return a
            }, {})

        var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1);

        return duplicates.length > 0;
    }, 

    getNextPosition : () => {

        //verifica se a próxima jogada vai jogar a cobra para o final do tabuleiro 
        var proximaPosicao = cobrinha.snakeArray[cobrinha.snakeArray.length -1] + cobrinha.direction

        //verifica horizontalmente
        //direita

        if(cobrinha.getPositionName(cobrinha.direction) == 'right' && (proximaPosicao % cobrinha.dimensao == 0)){
            proximaPosicao = proximaPosicao - cobrinha.dimensao;
        }
        //esquerda
        if(cobrinha.getPositionName(cobrinha.direction) == 'left' && (proximaPosicao < 0 || ( proximaPosicao + 1 ) % cobrinha.dimensao == 0 )){
            proximaPosicao = proximaPosicao + cobrinha.dimensao;
        }

        //acima 
        if(cobrinha.getPositionName(cobrinha.direction) == 'up' && proximaPosicao < 0){
            proximaPosicao = Math.pow(cobrinha.dimensao,2) + proximaPosicao;
        }

        //abaixo 

        if(cobrinha.getPositionName(cobrinha.direction) == 'down' && proximaPosicao >= Math.pow(cobrinha.dimensao,2)){
            proximaPosicao = proximaPosicao - Math.pow(cobrinha.dimensao,2) ;
        }

        return proximaPosicao;

    },

    refreshInformations : () => {
        document.querySelector("#idVelocidade").innerHTML = (1000/ cobrinha.timer).toFixed(3) + 'blocos/s' ;
        document.querySelector("#idPontuacao").innerHTML = cobrinha.points ;
        document.querySelector('#idTamanho').innerHTML = cobrinha.snakeArray.length;
        document.querySelector('#idDimensao').innerHTML = `${cobrinha.dimensao} x ${cobrinha.dimensao}`;

    },
    stopGame : () => {
        clearInterval(cobrinha.interval);
        cobrinha.grid.classList.add('gameover');
        document.querySelector('.offGame').style = 'display:flex;';
        document.querySelector('.offGame').classList.add('gameoverin');
    }
}

window.onload = () => {
    const grade = document.getElementsByClassName("grade")[0];
    cobrinha.initGame(grade);

    document.querySelector('#playagain').addEventListener('click', (e) => {
        cobrinha.grid.classList.remove('gameover');
        document.querySelector('.offGame').style = 'display:none;';
        document.querySelector('.offGame').classList.remove('gameoverin');
        cobrinha.initGame(grade);
    });
};