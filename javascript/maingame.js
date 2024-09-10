let display_card = 1;

let starting_count = 12;
let player_collection = [];
let turn_count = 0;

function preload_images(){
    let images = []
    for (var i = 1; i < Object.keys(dracomania_cards).length; i++) {
        images[i] = new Image();
        images[i].src = "imagens/artes/" + i.toString() + ".jpg";
        //console.log("preloaded " + mythomania_cards[i].nome)
    }
}

function initialize_collection() {
    //load it all at first
    preload_images()

    //Generate the initial list of Cards the player has at the beggining of the game
    while (player_collection.length < starting_count) {
        let rnd_max_fix = (Object.keys(dracomania_cards).length - 1) + 1
        let random_index = Math.ceil(Math.random() * rnd_max_fix)

        if (!player_collection.includes(random_index)) {
            player_collection.push(random_index)
        }
    }
    player_collection.sort((a, b) => a - b) //javascript sort is really dumb. See: https://www.freecodecamp.org/news/how-to-sort-javascript-array-accurately/
    document.getElementById("coleção-contador").innerHTML = "Coleção: " + player_collection.length.toString() +"/"+ Object.keys(dracomania_cards).length.toString()
    //console.log("Player Collection: ", player_collection)

    //Call next phase of code
    update_collection_visuals()
}

function update_collection_visuals() {
    //Force clear of all cards in HTML div container
    document.getElementById("collection").innerHTML = ""

    //Create face up cards for what player has, create facedown for what it doesn't have
    for (let i=1; i <= Object.keys(dracomania_cards).length; i++){
        if (player_collection.includes(i)) {
            create_front_card(i)
        } else {
            create_back_card()
        }
    }
} 

function create_front_card(i){
    let indentifier = "active_card_" + i.toString()

    let front_template = `
    <div class="dracomania-card">
        <div class="borda-draco"></div>
        
        <div class="card-identificação" id="identificação-bg_${indentifier}">
            <div class="card-nome" id="card-nome_${indentifier}">Dragão Branco</div>
            <div class="card-numero" id="card-numero_${indentifier}">6</div>
        </div>

        <div class="card-conteudo">

            <div class="card-arte">
                <img class="arte" id="card-arte_${indentifier}" src="imagens/artes/06.png">
            </div>

            <div class="card-status">
                <div class="status-coluna">
                    <div class="valor-magia" id="valor-magia_${indentifier}">21</div>
                    <div class="icone-txt">magia</div>
                </div>
                <div class="status-coluna">
                    <div class="valor-força" id="valor-força_${indentifier}">15</div>
                    <div class="icone-txt">força</div>
                </div>
                <div class="status-coluna">
                    <div class="valor-fogo" id="valor-fogo_${indentifier}">22</div>
                    <div class="icone-txt">fogo</div>
                </div>
            </div>
        </div>

    </div>
    `

    //Create wrapper div with ID first
    var wrapper = document.createElement('div')
    wrapper.setAttribute('class', "collection_card")
    wrapper.innerHTML = front_template
    document.getElementById("collection").append(wrapper)

    update_card(i, indentifier)
}

function create_back_card(){
    let back_template = `
        <div class="dracomania-card">
             <div class="borda-draco"></div>

            <div class="card-conteudo">
    
                <div class="back-bg">
                    <img class="logo" src="imagens/logo.png">
                </div>
                
            </div>

        </div>
    `

    //Create wrapper div with ID first
    var wrapper = document.createElement('div')
    wrapper.setAttribute('class', "collection_card")
    wrapper.innerHTML = back_template
    //Add to HTML body, inside 'projects_containter'
    document.getElementById("collection").append(wrapper)
}

function update_card(card_id, ref_attribute_id){
    var card_name = dracomania_cards[card_id].nome
    var card_magia = dracomania_cards[card_id].magia
    var card_força = dracomania_cards[card_id].força
    var card_fogo = dracomania_cards[card_id].fogo
  
    document.getElementById("card-numero_" + ref_attribute_id).innerHTML = card_id.toString()
    document.getElementById("card-nome_" + ref_attribute_id).innerHTML = card_name
    document.getElementById("card-arte_" + ref_attribute_id).src = "imagens/artes/" + card_id.toString() + ".jpg"
    document.getElementById("valor-magia_" + ref_attribute_id).innerHTML = card_magia
    document.getElementById("valor-força_" + ref_attribute_id).innerHTML = card_força
    document.getElementById("valor-fogo_" + ref_attribute_id).innerHTML = card_fogo

    if (card_name.length >= 12 && card_name.length < 14){
        document.getElementById("card-nome_" + ref_attribute_id).style.fontSize = "25px"
    } else if (card_name.length >= 14) {
        document.getElementById("card-nome_" + ref_attribute_id).style.fontSize = "22px"
    } else {
        document.getElementById("card-nome_" + ref_attribute_id).style.fontSize = "28px"
    }

}

/* -------------------------------------- */
function add_card(card_id = 0){
    //Safeguard
    if (player_collection.length >= Object.keys(dracomania_cards).length){
        return
    }

    //To add a specific card id
    if (card_id != 0){
        if (!player_collection.includes(card_id)) {
            player_collection.push(card_id)
            update_collection_visuals()
        }

        return
    }

    //For adding a random card
    while (true){
        let rnd_max_fix = (Object.keys(dracomania_cards).length - 1) + 1
        let random_index = Math.ceil(Math.random() * rnd_max_fix)

        if (!player_collection.includes(random_index)) {
            player_collection.push(random_index)
            break
        }
    }

    update_collection_visuals()
}

function remove_card(card_id){
    //Safeguard
    if (!player_collection.includes(card_id)){
        return
    }

    var indexof = player_collection.indexOf(card_id)
    player_collection.splice(indexof, 1)

    update_collection_visuals()
}

/* -------------------------------------- */
let player_active_id
let enemy_active_id

function start_battle(){
    //Force clear of all cards in HTML div container
    document.getElementById("area-de-batalha").innerHTML = ""

    //Get random card from player collection
    player_active_id = player_collection[Math.floor(Math.random()*player_collection.length)];

    //Get random card for Enemy, as long as it is something player does not have
    while(true){
        let rnd_max_fix = (Object.keys(dracomania_cards).length - 1) + 1
        let random_index = Math.ceil(Math.random() * rnd_max_fix)

        if (!player_collection.includes(random_index)) {
            enemy_active_id = random_index
            break
        }
    }

    create_player_card(player_active_id)
    //create_enemy_card(enemy_active_id)
    create_facedown_enemy()

    update_mensagem_de_batalha()
}

function create_player_card(card_id) {
    let indentifier = "player_active_card"

    let front_template = `
    <div class="dracomania-card">
        <div class="borda-draco"></div>
        
        <div class="card-identificação" id="identificação-bg_${indentifier}">
            <div class="card-nome" id="card-nome_${indentifier}">Dragão Branco</div>
            <div class="card-numero" id="card-numero_${indentifier}">6</div>
        </div>

        <div class="card-conteudo">

            <div class="card-arte">
                <img class="arte" id="card-arte_${indentifier}" src="imagens/artes/06.png">
            </div>

            <div class="card-status">
                <div class="status-coluna">
                    <div class="valor-magia" id="valor-magia_${indentifier}">21</div>
                    <div class="icone-txt">magia</div>
                </div>
                <div class="status-coluna">
                    <div class="valor-força" id="valor-força_${indentifier}">15</div>
                    <div class="icone-txt">força</div>
                </div>
                <div class="status-coluna">
                    <div class="valor-fogo" id="valor-fogo_${indentifier}">22</div>
                    <div class="icone-txt">fogo</div>
                </div>
            </div>
        </div>

    </div>
    `

    //Create wrapper div with ID first
    var wrapper = document.createElement('div')
    wrapper.setAttribute('class', "card-de-batalha")
    wrapper.innerHTML = front_template
    document.getElementById("area-de-batalha").append(wrapper)

    update_card(card_id, indentifier)
}

function create_facedown_enemy() {
    let back_template = `
        <div class="dracomania-card">
             <div class="borda-draco"></div>

            <div class="card-conteudo">
    
                <div class="back-bg">
                    <img class="logo" src="imagens/logo.png">
                </div>
                
            </div>

        </div>
    `

    //Create wrapper div with ID first
    var wrapper = document.createElement('div')
    wrapper.setAttribute('class', "card-de-batalha")
    wrapper.innerHTML = back_template
    //Add to HTML body, inside 'projects_containter'
    document.getElementById("area-de-batalha").append(wrapper)
}

function create_enemy_card(card_id) {
    let indentifier = "enemy_active_card"

    let front_template = `
    <div class="dracomania-card">
        <div class="borda-draco"></div>
        
        <div class="card-identificação" id="identificação-bg_${indentifier}">
            <div class="card-nome" id="card-nome_${indentifier}">Dragão Branco</div>
            <div class="card-numero" id="card-numero_${indentifier}">6</div>
        </div>

        <div class="card-conteudo">

            <div class="card-arte">
                <img class="arte" id="card-arte_${indentifier}" src="imagens/artes/06.png">
            </div>

            <div class="card-status">
                <div class="status-coluna">
                    <div class="valor-magia" id="valor-magia_${indentifier}">21</div>
                    <div class="icone-txt">magia</div>
                </div>
                <div class="status-coluna">
                    <div class="valor-força" id="valor-força_${indentifier}">15</div>
                    <div class="icone-txt">força</div>
                </div>
                <div class="status-coluna">
                    <div class="valor-fogo" id="valor-fogo_${indentifier}">22</div>
                    <div class="icone-txt">fogo</div>
                </div>
            </div>
        </div>

    </div>
    `

    //Create wrapper div with ID first
    var wrapper = document.createElement('div')
    wrapper.setAttribute('class', "card-de-batalha")
    wrapper.innerHTML = front_template
    document.getElementById("area-de-batalha").append(wrapper)

    update_card(card_id, indentifier)
}

function update_mensagem_de_batalha(message_type = -1, passed_info = ["magia", -1, -1, 1, 1] ) {
    //passed_info = [power_type, your_value, enemy_value, player_id, enemy_id]
    let power_type = passed_info[0]
    let your_value = passed_info[1].toString()
    let enemy_value = passed_info[2].toString()
    let player_id = passed_info[3]
    let your_name = dracomania_cards[player_id].nome
    let enemy_id = passed_info[4]
    let enemy_name = dracomania_cards[enemy_id].nome

    let final_message = ""
    switch (message_type) {
        case 0:
            final_message = power_type + ": " + your_value + " \{ " + enemy_value + ". Você perdeu \[" + your_name + "\]." 
            break;
        case 1:
            final_message = power_type + ": " + your_value + " \} " + enemy_value + ". Você ganhou \[" + enemy_name + "\]." 
            break;
        
        default:
            final_message = "Escolha entre Magia, Força ou Fogo para atacar."
    }

    document.getElementById("mensagem-de-batalha").innerHTML = final_message
}

let is_battle_over = false
function get_battle_results(type) {
    if (is_battle_over == true){
        return
    }else{
        is_battle_over = true
    }

    let value1 = dracomania_cards[player_active_id][type]
    let value2 = dracomania_cards[enemy_active_id][type]

    if (value1 >= value2){
        //Player Won the battle
        update_mensagem_de_batalha(1, [type, value1, value2, player_active_id, enemy_active_id])
        add_card(enemy_active_id) //add the won card to player collection
    } else {
        //Player Lost the battle
        update_mensagem_de_batalha(0, [type, value1, value2, player_active_id, enemy_active_id])
        remove_card(player_active_id) //remove the lost card from player collection
    }

    //Clearing the container and "recreating" both cards is the easiest way to Flip enemy lol
    document.getElementById("area-de-batalha").innerHTML = ""
    create_player_card(player_active_id)
    create_enemy_card(enemy_active_id)

    //Show a big red square over the loser card
    var wrapper = document.createElement('div')
    wrapper.setAttribute('id', "red-square")
    wrapper.setAttribute('class', "red-square")
    document.getElementById("area-de-batalha").append(wrapper)
    if (value1 >= value2){
        document.getElementById("red-square").style.marginLeft = "260px";
    }

    //Update collection counter
    document.getElementById("coleção-contador").innerHTML = "Coleção: " + player_collection.length.toString() +"/"+ Object.keys(dracomania_cards).length.toString()

    //Show next battle button
    document.getElementById("next-battle-btn").style.visibility = "visible";
    turn_count += 1
}

function prepare_next_battle(){
    //Check for game end
    if (player_collection.length >= Object.keys(dracomania_cards).length) {
        window.alert("Você venceu o jogo coletando todas as " + player_collection.length.toString() + " cartas! \nForam necessárias " + turn_count.toString() + " rodadas para você vencer." );
        return
    } else if (player_collection.length <= 0) { 
        window.alert("Você perdeu o jogo e não tem mais cartas... \nForam necessárias " + turn_count.toString() + " rodadas para você perder." );
        return
    }

    document.getElementById("next-battle-btn").style.visibility = "hidden";
    is_battle_over = false
    start_battle()
}