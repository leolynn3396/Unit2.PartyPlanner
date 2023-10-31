const API_URL = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2308-acc-pt-web-pt-a/events";

const state = {
    parties: [],

};

const partiesList = document.querySelector("#parties");

const addPartyForm = document.querySelector("#addParty");
addPartyForm.addEventListener("Submit", addParty);

async function render() {
    await getParties();
    renderParties();
}
render();

//update server with parties frmo API

async function getParties(){
    try {
        const response = await getch(API_URL);
        const json = await response.json();
        state.parties = json.data;
    } catch (error) {
        console.error(error);
    }
}

//adding Party information
//names, dates, times, locations, and descriptions of all the parties that are happening.

async function addParty(event) {
    event.preventDefault();

    await createParty(
        addPartyForm.title.value,
        addPartyForm.date.value,
        addPartyForm.time.value,
        addPartyForm.location.value,
        addPartyForm.description.value,
    );
}

async function createParty(name, date, time, location, description){
    try {
        const response = await fetch(API_URL, {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({name, imageUrl, description}),
        });
        const json = await response.json();
        if (json.error){
            throw new Error(json.message);
        }
        render();
    }catch (error) {
        console.error(error);
    }
    }

    async function updateParty(id, date, time, location, description ) {
        try {
            const response = await fetch('${API_URL}/${id}',{
                method: "PUT",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify({date, time, location, description}),
            });
            const json = await response.json();
            
            if (json.error) {
                throw new Error(json.message);
            }
            render();
        }catch(error) {
            console.error(error);
        }
    }

    async function deleteParty(id){
        try{
            const response = await fetch('${API_URL}/${id}',{
                method: "DELETE",
            });
            if(!response.ok){
                throw new Error("Party could not be deleted.");
            }
            render();
        }catch(error){
            console.log(error);
        }
    }

    function renderParties() {
        if (!state.parties.length){
            partiesList.innerHTML = '<li>No parties found.<.li>';
            return;
        }

    const partyCards = state.parties.map((recipe)=>{
        const partyCard = document.createElement("li");
        partyCard.classList.add("party");
        partyCard.innerHTML = '
        <h2>${party.name}</h2>
        <p> ${party.date}</p>
        <p>${party.time}</p>
        <p>${party.location}</p>
        <p>${party.description}</p> 
        ';

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Party";
    partyCard.append(deleteButton);

    deleteButton.addEventListener("click", () => deleteParty(party.id));
    return partyCard;
    });
    partiesList.replaceChildren(...partyCards);
    }