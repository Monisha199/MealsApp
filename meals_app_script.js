let xmlReq = new XMLHttpRequest();
var foodList=new Set();
let char_press;

// fetching data and storing to foodList 
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

// populating categories
function chooseCategory(char_press){
    let xmlReq = new XMLHttpRequest();
    xmlReq.open("get", char_press,false);

    // removing all childs from cat div 
    const myNode = document.getElementById("cat-list");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.lastChild);
    }
    xmlReq.onload = function() {
        data = JSON.parse(xmlReq.response);

        // iterating on all data 
        for(let meal of data.meals){


            parent=document.createElement("div");
            parent.id="cat-items";
            // parent item 
            div=document.createElement("div");
            img=document.createElement("img");
            img.src=meal.strMealThumb;
            div.appendChild(img);

            // title of meal 
            title=document.createElement("h5");
            a=document.createElement("a");
            title.id=meal.idMeal;
            title.innerHTML = meal.strMeal;
            
            a.setAttribute("href", "meals_details.html");
            a.appendChild(title);
            title.setAttribute("onclick", "showDetails(this.id)");

            // add favorites button
            button=document.createElement("button");
            button.innerHTML = "Add to Favorite";
            button.id= meal.idMeal;
            
            button.setAttribute("onclick", "markAsFav(this.id)" );

            // adding child to parent 
            parent.appendChild(div);
            parent.appendChild(a);
            parent.appendChild(button);
            
            document.getElementById("cat-list").appendChild(parent);
        }

    }
    xmlReq.send();
}

// loading all categories
xmlReq.open("get", "https://www.themealdb.com/api/json/v1/1/list.php?c=list", false);
var mySelectNode = document.getElementById("select-cat");

xmlReq.onload = function() {
        data = JSON.parse(xmlReq.response);
        for(let category of data.meals){
            node=document.createElement("option");
            node.innerHTML = category.strCategory;
            node.setAttribute("value", category.strCategory );
            node.setAttribute("onclick", "cat_click(this.value)" );
            mySelectNode.appendChild(node);
        }

}
xmlReq.send();

// category is clicked 
function cat_click(char){
    char_press ="https://www.themealdb.com/api/json/v1/1/filter.php?c="+ char;
    chooseCategory(char_press);
}

// add favorite button is clicked 
function markAsFav(name){
    if(foodList.size==0){
        const myNode = document.getElementById("fav-list");
        myNode.removeChild(myNode.lastChild);
    }
    if(!foodList.has(name)){
        foodList.add(name);
        localStorage.setItem("list",localStorage.getItem("list")+name+"-" );
        char_press ="https://www.themealdb.com/api/json/v1/1/lookup.php?i="+ name;
        getFavData(char_press);
    }    
}

chooseCategory("https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood");
getData("https://www.themealdb.com/api/json/v1/1/search.php?f=s");

var searchSet=new Set();
// searching data and reloading data

// search bar key up handle 
function keyupHandle() {
    const myNode = document.getElementById("search-result");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.lastChild);
        }
    searchText=document.getElementById("searchtext").value;
    
    if(searchText.length!=0){
        if(searchText.length==1){
            loadSearchedData("https://www.themealdb.com/api/json/v1/1/search.php?f="+searchText);
        }else{
            loadSearchedData("https://www.themealdb.com/api/json/v1/1/search.php?s="+searchText);
        }   
    }        
}

// loading searched data 
function loadSearchedData(char_press){
    
    xmlReq.open("get", char_press, true);
    searchSet=new Set(); 
    // console.log(char_press);
    xmlReq.onload = function() {
        data = JSON.parse(xmlReq.response);
        for(let meal of data.meals){
            searchSet.add(meal.strMeal);
            li=document.createElement("li");
            a1=document.createElement("a");
            a1.innerHTML = meal.strMeal;
            a1.id=meal.idMeal;
            a1.setAttribute("onclick", "showDetails(this.id)");
            a1.setAttribute("href", "meals_details.html");
            a1.setAttribute("target", "_blank");
            p=document.createElement("p");
            p.id=meal.idMeal;
            p.innerHTML = "Add to Favourites";
            p.setAttribute("onclick", "markAsFav(this.id)");
            li.appendChild(a1);
            li.appendChild(p)
            document.getElementById("search-result").appendChild(li);
        }
    }
    xmlReq.send();
}
 
function showDetails(id){
    localStorage.setItem("id", id);
}