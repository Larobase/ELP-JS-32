const inquirer = require("inquirer");
const { exec } = require("child_process");

let processes = {}; //pour conserver les processes en cours

async function lireTerminal(){ //fonction asynchrone pour les promesses
    await inquirer
    .prompt([
        {
        type: "input",
        name: "input",
        message: __dirname + ">>>"
        }
    ])
    .then((answers) => {
        execTerminal(answers.input); //si on a reçu une réponse, on lance l'exécution
    });
    
}

function execution(str){ //pour exécuter les commandes dans le shell linux
        exec(str, (error, stdout, stderr) => {
            if (error) {
            console.error(`exec error: ${error}`);
            return;
            }
            const processId = Date.now();
            processes[processId] = {
                process: process,
                detached: false,
            }
            console.log(`\n${stdout}`);
            if (stderr!= ''){
                console.log(`stderr: ${stderr}`);
            }
            else {
                console.log(`Pas d'erreur pendant exécution\nAppuyez sur une touche pour continuer...`);
            }   
        });
}

function execTerminal(input){ //construit le string à exécuter dans le shell linux
    if(input.endsWith("!")){
        input = input.slice (0,-1)+" &"
    }
    let commande=input.split(" ")
    commandes_simples = ["ls","pwd","rm","cd","mkdir","rmdir","dir"]
    if (commandes_simples.includes(commande[0])){
        execution(input)


    }else if (commande[0]=="open"){
        exec("node "+commande[1])




    }else if (commande[0] === "lp") {
        execution("ps -e -o pid,comm")



    }else if(commande[0]=="bing"){
        if (commande[1]=="-k"){
            execution("kill", commande[2])
        }else if(commande[1]=="-p"){
            execution("kill -STOP",commande[2])
        }else if(commande[1]=="-c"){
            execution("kill -CONT",commande[2])
        }




    }else if(commande[0]=="keep"){
        const processId = commande[1];
        if (!processes[processId]) {
            console.log("Aucun processus avec cet ID n'a été trouvé.\n Voici la liste de process en cours : ",processes);
            return;
          }
        processes[processId].detached = true;
        processes[processId].process.unref();





    }else if(commande[0]=="help"){
        console.log("ls : liste tous les fichiers\n"+
            "pwd : affiche le path\n"+
            "cd : change le path\n"+
            "rm <nom_fichier> :  supprime un fichier dans le dossier actuel\n"+
            "mv <nom_fichier> <chemin_destination> :  déplace un fichier\n"+ 
            "dir :  affiche le dossier actuel\n"+
            "mkdir <nom_dossier>:  crée un nouveau dossier\n"+
            "rmdir <nom_dossier>:  supprime un dossier\n"+
            "open <nom_fichier> : lance le fichier\n"+
            "bing <-k|-p|-c> <pid> :  kill|pause|continue un process\n"+ 
            "keep <nom_fichier> :  lance un programme en background\n"+
            "new <nom_fichier> :  crée un nouveau fichier dans le dossier actuel\n")
    } 
}




function exitCommand(){ //Permet de quitter le programme en appuyant sur ctrl+P
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', function (key) {
      if (key[0] === 16) { // 16 est le code ASCII pour Ctrl+P
        process.exit();
      }
    });    
    }




async function main(){ //asynchrone pour utiliser les promesses
    exitCommand()
    await lireTerminal()
    main()
    
}

main()

