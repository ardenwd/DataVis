// DOM #main div element
var main = document.getElementById('main');

// **** Your JavaScript code goes here ****
var characters = [{
	 "name": "Bran Stark",
	 "status": "Alive",
	 "current_location": "Fleeing White Walkers",
	 "power_ranking": 7,
	 "house": "stark",
	 "probability_of_survival": 98
},
{
	 "name": "Arya Stark",
	 "status": "Alive",
	 "current_location": "Back in Westeros",
	 "power_ranking": 8,
	 "house": "stark",
	 "probability_of_survival": 99
},
{
	 "name": "Sansa Stark",
	 "status": "Alive",
	 "current_location": "Winterfell",
	 "power_ranking": 10,
	 "house": "stark",
	 "probability_of_survival": 83
},
{
	 "name": "Robb Stark",
	 "status": "Dead - Red Wedding S3E9",
	 "current_location": "-",
	 "power_ranking": -1,
	 "house": "stark",
	 "probability_of_survival": 0
},
{
	 "name": "Jon Snow",
	 "status": "Alive",
	 "current_location": "The Wall",
	 "power_ranking": 10,
	 "house": "stark",
	 "probability_of_survival": 90
}

]

debugCharacters();

function halfSurvival(character){
    //if(favorite)
    return character.probability_of_survival/2;
}

function debugCharacters(){
   for (var i = 0; i < characters.length; i++) {
    console.log(characters[i].name)
    console.log(halfSurvival(characters[i]));
}
}
// document is the DOM, select the #main div
var main = document.getElementById("main");

// Create a new DOM element
var header = document.createElement("h3");
// Append the newly created <h3> element to #main
main.appendChild(header);
// Set the textContent to:
header.textContent = "My Favorite GoT Characters";

// Create a new <div> element	
var div1 = document.createElement("div");
// Append the newly created <div> element to #main
main.appendChild(div1);

// Create a new <h5> element
var name1 = document.createElement("h5");
// Append the newly created <h5> element to your new div
div1.appendChild(name1);
// Set the textContent to the first characters name
name1.textContent = characters[0]["name"];

// Create a new <p> element
var survival1= document.createElement("p");
// Append the newly created <p> element to your new div
div1.appendChild(survival1);
// Set the textContent to the first characters survival prob.
survival1.textContent = "Survival %: " +characters[0]["probability_of_survival"] +"%";

printInfo();
//create a div for each character
function printInfo(){
    for (var i = 0; i < characters.length; i++) {
        var info = document.createElement("div");
        // Append the newly created <div> element to #main
        main.appendChild(info);
        info.textContent = characters[i].name + " is in the " + characters[i].house + " house with survival " + characters[i]["probability_of_survival"] +"% and is currently  " + characters[i].status + "\n";
    }
}
