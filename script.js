let saveButton = document.getElementById("saveButton")
let formId = document.getElementById("formId")
let table = document.getElementById("table")
let hiddenInput = document.getElementById("hiddenId")


// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: 'AIzaSyCT-B_h6RZM-K2BBRGlywnc0R064sKDCA8',
    authDomain: 'crud-fa456.firebaseapp.com',
    projectId: 'crud-fa456'
});

var db = firebase.firestore();
//agregar datos.  Llamo a la variable que inicia firestore (db)
//Le digo que se va a crear una colección llamada users con las propiedades estáticas, nombre apellido y año nacimiento.
// db.collection("users").add({
//         first: "Ada",
//         last: "Lovelace",
//         born: 1815
//     })

const saveOnClick = () => {
    let id = hiddenInput.value;
    let nameInput = document.getElementById("nameInput").value
    let surnameInput = document.getElementById("surnameInput").value
    let bornYearInput = document.getElementById("bornYearInput").value

    if (id == 0) {
        save(nameInput, surnameInput, bornYearInput)
    } else {
        edit(id, nameInput, surnameInput, bornYearInput)
    }
}
saveButton.addEventListener("click", saveOnClick)

const save = (nameInput, surnameInput, bornYearInput) => {

    db.collection("users").add({
            first: nameInput,
            last: surnameInput,
            born: bornYearInput
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            formId.reset()
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });

}


//Leer datos. Reemplacé en la primer linea ...("users").get() por onSnapshot() para tener una escucha en tiempo real, y elimino el then.
db.collection("users").onSnapshot((querySnapshot) => {
    table.innerHTML = "";
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        table.innerHTML += `
        <tr>
            <th scope="row">${doc.id}</th>
            <td>${doc.data().first}</td>
            <td>${doc.data().last}</td>
            <td>${doc.data().born}</td>
            <th scope="col"><button type="button" class="btn btn-danger" data-delete data-id="${doc.id}">Eliminar</button></th>
            <th scope="col"><button type="button" class="btn btn-warning" data-edit data-id="${doc.id}">Editar</button></th>
        </tr>
        `
    });
    let buttonsDelete = document.querySelectorAll("button[data-delete]")
    for (button of buttonsDelete) {
        button.addEventListener("click", deleteOnClick)
    }

    let buttonsEdit = document.querySelectorAll("button[data-edit]")
    for (button of buttonsEdit) {
        button.addEventListener("click", editOnClick)
    }
});


//Eliminar datos.
const deleteOnClick = (evento) => {
    let id = evento.target.dataset.id

    db.collection("users").doc(id).delete(id).then(function() {
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });

}

//Editar datos.
const editOnClick = (evento) => {
    let id = evento.target.dataset.id
    var docRef = db.collection("users").doc(id);

    docRef.get().then((doc) => {
        if (doc.exists) {
            document.getElementById("nameInput").value = doc.data().first
            document.getElementById("surnameInput").value = doc.data().last
            document.getElementById("bornYearInput").value = doc.data().born
            hiddenInput.value = doc.id
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
    //Cambio la propiedad capital por mis propiedades definidas anteriormente.
    // return washingtonRef.update({
    //     capital: true
    // })
}

const edit = (id, nameInput, surnameInput, bornYearInput) => {
    var userRef = db.collection("users").doc(id);

    userRef.update({
            first: nameInput,
            last: surnameInput,
            born: bornYearInput
        })
        .then(() => {
            console.log("Document successfully updated!");
            formId.reset()

        })
        .catch((error) => {
            //         // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });

}