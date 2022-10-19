const form = document.getElementById("transactionForm");
    
    form.addEventListener("submit", function(event){
        event.preventDefault();
        if(form.transactionAmount.value > 0) {
            let transactionFormData = new FormData(form);
            let transactionObj = convertFomrDataToTransactionObj (transactionFormData)
            saveTransactionObj (transactionObj)
            //guarda objetos en el localstorage
            insertRowTransactionTable(transactionObj)
            //inserta filas en la tabla
            form.reset();
        }
        else{
            alert("Estás ingresando un número menor a cero")

        }    
    })

    function draw_category() {
        let allCategories = ["Alquiler", "Comida", "Salario"
    ]
    for(let index = 0;index < allCategories.length; index++){
        insertCategory (allCategories[index])
    }


    }

    function insertCategory(categoryName) {
        const selectElement = document.getElementById("transactionCategory")
        let htmlToInsert = `<option> ${categoryName} </option>`
        selectElement.insertAdjacentHTML("beforeend", htmlToInsert)

    }
    
    document.addEventListener("DOMContentLoaded", function(event) {
        draw_category()
          let transactionObjArr = JSON.parse(localStorage.getItem("transactionData")) || [];
        transactionObjArr.forEach(
            function(arrayElement){
                insertRowTransactionTable(arrayElement)
                // el eproblema es cuando esta vacío el LocalStorage, te tira un error, deberías decirlq eu si est vacío no traiga nada
            })
            
        })
        
        function getNewTransactionId () {
            let lastTransactionId = localStorage.getItem ("lastTransactionId") || "-1";
      let newTransactionId = JSON.parse (lastTransactionId) + 1;
      localStorage.setItem("lastTransactionId",JSON.stringify (newTransactionId))
      return newTransactionId;
    }
    
    
    function convertFomrDataToTransactionObj (transactionFormData) {
        let transactionType = transactionFormData.get ("transactionType")
        let transactionDescription = transactionFormData.get ("transactionDescription")
        let transactionAmount = transactionFormData.get ("transactionAmount");
        let transactionCategory = transactionFormData.get ("transactionCategory");
        let transactionId = getNewTransactionId ();
        return{
            "transactionType": transactionType,
            "transactionDescription": transactionDescription,
            "transactionAmount": transactionAmount,
            "transactionCategory": transactionCategory,
            "transactionID" : transactionId
            
        }
    }
    
    function insertRowTransactionTable(transactionObj){
        let transactionTableRef = document.getElementById ("transactionTable");
        
        let newTransactionRowRef = transactionTableRef.insertRow(-1);
        newTransactionRowRef.setAttribute ("data-transaction-Id", transactionObj, ["transactionId"])
        
        let newTypeCellRef = newTransactionRowRef.insertCell(0);
        newTypeCellRef.textContent = transactionObj ["transactionType"];
        
      newTypeCellRef = newTransactionRowRef.insertCell(1);
      newTypeCellRef.textContent = transactionObj ["transactionDescription"];
      
      newTypeCellRef = newTransactionRowRef.insertCell(2);
      newTypeCellRef.textContent = transactionObj ["transactionAmount"];
      
      newTypeCellRef = newTransactionRowRef.insertCell(3);
      newTypeCellRef.textContent = transactionObj ["transactionCategory"];
      
      let newDeleteCell = newTransactionRowRef.insertCell(4);
      let deleteButton = document.createElement ("button");
      deleteButton.textContent = "Eliminar";
      newDeleteCell.appendChild(deleteButton);
      
      deleteButton.addEventListener("click",(event) => {
          let transactionRow = event.target.parentNode.parentNode;
          let transactionId = transactionRow.getAttribute("data-transaction-Id");
          transactionRow.remove();
          deleteTransactionObj(transactionId)
          
        })
    }
    
    function deleteTransactionObj (transactionId) {
      let transactionObjArr = JSON.parse(localStorage.getItem("transactionData")) || [];
      //tomo el array transactiondata del localstorage
      let transactionIndexInArray = transactionObjArr.findIndex(element => element.transactionId == transactionId);
      //busco el indice (la posicion)
      transactionObjArr.splice(transactionIndexInArray, 1);
      //elimino el objeto selecionado
      let transactionArrayjJSON = JSON.stringify (transactionObjArr);
      // convierto el objeto en JSON
      localStorage.setItem("transactionData", transactionArrayjJSON);
      // Guardo mi array de transaccion en formato JSON nuevamente localstorage
    
    }


    function saveTransactionObj (transactionObj) {
        let myTransactionArray = JSON.parse(localStorage.getItem("transactionData")) || [];
        // || esto significa que si el array esta vacio, [] y esto que me traiga un array vacio. sino aparece null y no me trae nada y se rompe todo
        //tomo el JSON anterior cargado para agregar el nuevo      
        myTransactionArray.push(transactionObj)
        //convierto mi array a JSON
        let transactionArrayjJSON = JSON.stringify (myTransactionArray) ;
      // Guardo mi array de transaccion en formato JSON en el localstorage
      localStorage.setItem("transactionData", transactionArrayjJSON)
    }