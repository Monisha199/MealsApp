let xmlReq = new XMLHttpRequest();
var foodList=new Set();


let char_press;
// retriving data from local stoarge and storing it in Set 
try{
    let list=localStorage.getItem("list").split("-");
    for(let id of list){
        if(id!=""){
            foodList.add(id);
        }
    }
}catch(err){
    localStorage.setItem("list", "");
}

// remove element clicked 
function favDel(name){
    if(foodList.has(name)){

        // removing from item set 
        foodList.delete(name);
        let list="";
        // iteraring over foodList and reappending it into string 
        for(let id of foodList){
            list+=id+"-";
        }

        // storing again to list in local storage 
        localStorage.setItem("list",list);
    }
    listAllFav();
}

// fetching fav data 
function getFavData(char_press){
    let xmlReq = new XMLHttpRequest();
    xmlReq.open("get", char_press,false);

    xmlReq.onload = function() {
        data = JSON.parse(xmlReq.response);

        // populating fetched data to dom elements
        let meal = data.meals[0];
        parent=document.createElement("div");
        parent.id="fav-items";

        div=document.createElement("div");
        img=document.createElement("img");
        img.src=meal.strMealThumb;
        div.appendChild(img);

        title=document.createElement("h5");
        a=document.createElement("a");
        title.id=meal.idMeal;
        title.innerHTML = meal.strMeal;
            
        a.setAttribute("href", "meals_details.html");
        a.appendChild(title);
        title.setAttribute("onclick", "detailsClicked(this.id)");
        button=document.createElement("button");
        button.innerHTML = "Remove from Favorite";
        button.id= meal.idMeal;
        button.setAttribute("onclick", "favDel(this.id)" );
        parent.appendChild(div);
        parent.appendChild(a);
        parent.appendChild(button);
        document.getElementById("fav-list").appendChild(parent);
    }
    xmlReq.send();
}

// load all the data in list 
function listAllFav(){

    // removing all existing child 
    const myNode = document.getElementById("fav-list");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.lastChild);
    }
    
    // iterating on foodList 
    for(var name of foodList){
        char_press ="https://www.themealdb.com/api/json/v1/1/lookup.php?i="+ name;
        getFavData(char_press);
    }

    // if size is 0 then so empty message 
    if(foodList.size==0){
        heading=document.createElement("h2");
        heading.innerHTML = "No meals added to Favourites!";
        heading.style.color="white";
        document.getElementById("fav-list").appendChild(heading);
    }
}

listAllFav();

