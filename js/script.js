'use strict';

// Apertura del la IndexDB
const IDBRequest = indexedDB.open('users',1);
IDBRequest.addEventListener('upgradeneeded',()=>{
    const db = IDBRequest.result;
    db.createObjectStore('name',{
        autoIncrement : true
    })
})

IDBRequest.addEventListener('success',()=>{
    readObject()
})

IDBRequest.addEventListener('error',()=> alert('Error inesperado al abrir la base de datos'))


// Creacion de la estructura del documento

const makeStructure = (name, key)=>{

    let div = document.createElement('DIV');
    let h2 = document.createElement('H2');
    let divTwo = document.createElement('DIV');
    let buttonSave = document.createElement('BUTTON');
    let buttonDelete = document.createElement('BUTTON');

    h2.textContent = name;
    h2.contentEditable = true;
    h2.spellcheck = false;

    buttonSave.textContent = 'Guardar';
    buttonDelete.textContent = 'Eliminar';

    div.classList.add('main_container');
    div.classList.add(`${key}`);
    h2.classList.add('user_name');
    divTwo.classList.add('action_buttons_container');
    buttonSave.setAttribute('id','desactive');
    buttonDelete.classList.add('del_button');
    
    divTwo.appendChild(buttonSave);
    divTwo.appendChild(buttonDelete);

    div.appendChild(h2);
    div.appendChild(divTwo);

    // Zona de modificacion y eliminacion de los elementos por el boton y por Drag and Drop

    h2.addEventListener('keyup',()=>{
        buttonSave.setAttribute('id','active');
    })

    buttonSave.addEventListener('click',()=>{
        let value = h2.textContent;
        modifyObject(key,{name:value})
        buttonSave.setAttribute('id','desactive');
    })

    let target = "";
    let getTargetKey = "";

   buttonDelete.addEventListener('click',()=>{
        target = div;
        getTargetKey = parseInt(target.classList[1]);
        delObject(getTargetKey);
        document.querySelector('.main_container-b').removeChild(target);
   })


   div.addEventListener('dragstart',()=>{
        target = div;
        getTargetKey = parseInt(target.classList[1]);
   })

   document.querySelector(".trash").addEventListener("dragover",(e)=>{
       e.preventDefault();
    //    document.querySelector(".trash-img").style = "width:160px";
       

   })

   document.querySelector(".trash").addEventListener("dragleave",(e)=>{
    e.preventDefault();
    // document.querySelector(".trash-img").style = "width:150px";
    
    })

   document.querySelector(".trash").addEventListener("drop",()=>{
        delObject(getTargetKey);
        try {
            document.querySelector('.main_container-b').removeChild(target);
        } catch (error) {

        }
        // document.querySelector(".trash-img").style = "width:150px";
        
    })

   

    return div;
}

// Creacion del CRUD

const makeObjectStore = ()=>{
    const db = IDBRequest.result;
    const IDBtransaction = db.transaction('name','readwrite');
    const objectStore = IDBtransaction.objectStore('name');
    return objectStore;
}

const addObect = object => {
    const objectStore = makeObjectStore();
    objectStore.add(object);
}

const readObject = ()=>{
    const objectStore = makeObjectStore();
    const cursor = objectStore.openCursor();
    const fragment = document.createDocumentFragment();
    document.querySelector('.main_container-b').innerHTML = "";
    cursor.addEventListener('success',()=>{
        if(cursor.result){
            let element = makeStructure(cursor.result.value.name, cursor.result.key);
            fragment.appendChild(element);
            cursor.result.continue();
        }else{
            document.querySelector('.main_container-b').appendChild(fragment);
        }
    });
}

const modifyObject = (key,object)=>{
    const objectStore = makeObjectStore();
    objectStore.put(object,key);
}

const delObject = (key)=>{
    const objectStore = makeObjectStore();
    objectStore.delete(key);
}


document.querySelector('.input_button').addEventListener('click',()=>{
    let inputText = document.getElementById('name').value;
    if(inputText.length > 0){
        if(document.getElementById('active') != undefined){
            if(confirm("Hay elementos modificados sin guardar deseas continuar")){
                addObect({name:inputText});
                readObject()
                document.getElementById("name").value = "";
            }
        }else{
            addObect({name:inputText});
            readObject()
            document.getElementById("name").value = "";
        }   
    }else{
        alert('Introduce un dato correcto');
    }
    
})












