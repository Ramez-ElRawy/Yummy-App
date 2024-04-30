// HTML Elements 
let row = document.querySelector(".row");

// App Variables
let mealsData;

let nameRegex = /^[a-z0-9_-]{3,15}$/;
let emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
let phoneRegex = /^(\+201|01|00201)[0-2,5]{1}[0-9]{8}$/;
let ageRegex = /^([3-9]|[1-9][0-9])$/;
let passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
let repasswordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

// Functions 
function inputsValidate(regex,element)
{
    if (regex.test(element.value) == true ) 
    {
        element.classList.add("is-valid");
        element.classList.remove("is-invalid");
        $(element).next().addClass("d-none");
        return true;
    }
    else
    {
        element.classList.add("is-invalid");
        element.classList.remove("is-valid");
        $(element).next().removeClass("d-none");
        return false;
    }
}

function passwordInputsMatching(password,repasswrd)
{
    if (password === repasswrd) {
        return true
    }
    else{
        return false;
    }
}

async function getAllMealsData(mealName,firstLitter)
{
    $(".loading-screen").css("display","flex");
    $("body").css("overflow","hidden");
    let response
    if(mealName == "" && firstLitter == "")
    {
        response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
    }
    else if(firstLitter == "")
    {
        response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
    }
    else if(mealName == "")
    {
        response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${firstLitter}`);
    }
    mealsData = await response.json();
    displayMeals(mealsData);
}
getAllMealsData("","");

function displayMeals(mealsArr)
{
    for (let i = 0; i < mealsArr.meals.length ; i++) 
    {
        let colDiv = document.createElement("div");
        colDiv.classList.add("col-md-3");
        row.append(colDiv);

        let item = document.createElement("div");
        item.classList.add("item","rounded-2","overflow-hidden","position-relative");
        item.setAttribute("id",`${mealsArr.meals[i].idMeal}`);
        colDiv.append(item);

        let itemImage = document.createElement("div");
        itemImage.classList.add("item-img");
        
        let img = document.createElement("img");
        img.classList.add("w-100")
        img.setAttribute("src",`${mealsArr.meals[i].strMealThumb}`);
        itemImage.append(img);

        let itemLayer = document.createElement("div");
        itemLayer.classList.add("item-layer","overflow-hidden");

        let mealName = document.createElement("a");
        mealName.textContent = `${mealsArr.meals[i].strMeal}`;
        
        itemLayer.append(mealName);
        item.append(itemImage,itemLayer);
    }

    $(".loading-screen").fadeOut(1000);
    $("body").css("overflow","visible");

    $(".item").on("click",(e)=>{
        let clickedElement = e.target;
        displayMealById($(clickedElement).parents("div.item").attr("id"));
        $(".loading-screen").fadeOut(1000);
        $("body").css("overflow","visible");
    })
    
}

async function getMealById(idMeal)
{
    $(".loading-screen").css("display","flex");
    $("body").css("overflow","hidden");
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
    let data = await response.json();
    return data.meals[0];
}

async function displayMealById(idMeal)
{
    let meal = await getMealById(idMeal);
    
    $(row).empty();

    let mealImageDiv = document.createElement("div");
    mealImageDiv.classList.add("col-md-4");

    let mealImageInnerDiv = document.createElement("div");
    mealImageInnerDiv.classList.add("inner","overflow-hidden","text-white");
    mealImageDiv.append(mealImageInnerDiv);

    let img = document.createElement("img");
    img.classList.add("w-100","rounded-2");
    img.setAttribute("src",`${meal.strMealThumb}`);
    img.setAttribute("alt",`${meal.strMeal} Image`);

    let imageName = document.createElement("h2");
    imageName.classList.add("h4");
    imageName.textContent = `${meal.strMeal}`;
    mealImageInnerDiv.append(img,imageName);

    // ----------------------

    let mealInfo = document.createElement("div");
    mealInfo.classList.add("col-md-8");
    
    let mealInfoInner = document.createElement("div");
    mealInfoInner.classList.add("inner","text-white");
    mealInfo.append(mealInfoInner);

    let instructionsHeading = document.createElement("h2");
    instructionsHeading.classList.add("h4");
    instructionsHeading.textContent = "Instructions";

    let instructionsContent = document.createElement("p");
    instructionsContent.classList.add("instructions");
    instructionsContent.textContent = `${meal.strInstructions}`;

    let area = document.createElement("h3");
    area.innerHTML = `<span class="fw-bolder">Area : </span>${meal.strArea}`;

    let category = document.createElement("h3");
    category.innerHTML = `<span class="fw-bolder">Category : </span>${meal.strCategory}`

    let recipesHeading = document.createElement("h3");
    recipesHeading.textContent = "Recipes :";

    let recipesUl = document.createElement("ul");
    recipesUl.classList.add("list-unstyled","d-flex","flex-wrap");

    for (let i = 1; i < 21; i++) 
    {
        if (`${meal[`strMeasure${i}`]}` && `${meal[`strIngredient${i}`]}`) 
        {
            let recipesLi = document.createElement("li");
            recipesLi.classList.add("alert","alert-info","m-2","p-1");
            recipesLi.textContent = `${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`
            recipesUl.append(recipesLi);
        }
    }

    let tagsHeading = document.createElement("h3");
    tagsHeading.textContent = "Tags :";

    let tagsUl = document.createElement("ul");
    tagsUl.classList.add("list-unstyled","d-flex","flex-wrap");
    let strTags = `${meal.strTags}`;
    let tagsArr = strTags.split(",");
    if (tagsArr.length > 1) 
    {
        for (let i = 0; i < tagsArr.length; i++) 
        {
            let tagsLi = document.createElement("li");
            tagsLi.classList.add("alert","alert-danger","m-2","p-1");
            tagsLi.textContent = tagsArr[i];
            tagsUl.append(tagsLi);
        }   
    }
    else if(strTags != "null"){
        let tagsLi = document.createElement("li");
        tagsLi.classList.add("alert","alert-danger","m-2","p-1");
        tagsLi.textContent = `${meal.strTags}`;
        tagsUl.append(tagsLi);
    }
    
    let source = document.createElement("a");
    source.classList.add("btn","btn-success","me-1");
    source.textContent = "Source";
    source.setAttribute("target","_blank");
    source.setAttribute("href",`${meal.strSource}`);

    let youtube = document.createElement("a");
    youtube.classList.add("btn","btn-danger");
    youtube.textContent = "Youtube";
    youtube.setAttribute("target","_blank");
    youtube.setAttribute("href",`${meal.strYoutube}`);
    mealInfoInner.append(instructionsHeading,instructionsContent,area,category,recipesHeading,recipesUl,tagsHeading,tagsUl,source,youtube)

    row.append(mealImageDiv,mealInfo)
}

async function getAllCategories()
{
    $(row).empty();
    $(".loading-screen").css("display","flex");
    $("body").css("overflow","hidden");
    let response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
    let data = await response.json();
    displayCategory(data)
}

function displayCategory(data)
{
    for (let i = 0; i < data.categories.length; i++) 
    {
        let colDiv = document.createElement("div");
        colDiv.classList.add("col-md-3");
        
        let categoryDiv = document.createElement("div");
        categoryDiv.classList.add("category","rounded-2","overflow-hidden","position-relative");
        categoryDiv.setAttribute("id",`${data.categories[i].idCategory}`);
        categoryDiv.setAttribute("data-category",`${data.categories[i].strCategory}`);
        colDiv.append(categoryDiv);

        let categoryImg = document.createElement("div");
        categoryImg.classList.add("category-img");
        categoryDiv.append(categoryImg);

        let img = document.createElement("img");
        img.classList.add("w-100");
        img.setAttribute("src",`${data.categories[i].strCategoryThumb}`);
        img.setAttribute("alt",`category Image`);
        categoryImg.append(img);

        let categoryLayerDiv = document.createElement("div");
        categoryLayerDiv.classList.add("category-layer","overflow-hidden");
        categoryDiv.append(categoryLayerDiv);

        let categoryLayerHeader = document.createElement("h2");
        categoryLayerHeader.classList.add("h4");
        categoryLayerHeader.textContent = data.categories[i].strCategory;

        let categoryDesc = document.createElement("p");
        categoryDesc.textContent = data.categories[i].strCategoryDescription;
        categoryLayerDiv.append(categoryLayerHeader,categoryDesc);

        row.append(colDiv);
    }
    $(".category").on("click",(e)=>{
        filterByCategory($(e.target).parents("div.category").attr("data-category"));
        $(row).empty();
    })
    $(".loading-screen").fadeOut(1000);
    $("body").css("overflow","visible");
}

async function filterByCategory(category)
{
    $(".loading-screen").css("display","flex");
    $("body").css("overflow","hidden");
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    let data = await response.json();
    displayMeals(data);
}

async function getAllAreas()
{
    $(row).empty();
    $(".loading-screen").css("display","flex");
    $("body").css("overflow","hidden");
    let response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
    let data = await response.json();
    displayAreas(data)
}

function displayAreas(areaArr)
{
    for (let i = 0; i < areaArr.meals.length; i++) 
    {
        let colDiv = document.createElement("div");
        colDiv.classList.add("col-md-3");

        let areaDiv = document.createElement("div");
        areaDiv.classList.add("area","rounded-2","text-white","text-center");
        areaDiv.setAttribute("data-area",`${areaArr.meals[i].strArea}`);
        colDiv.append(areaDiv);

        let areaIcon = document.createElement("i");
        areaIcon.classList.add("fa-solid","fa-house-laptop","fa-4x");
        
        let areaHeading = document.createElement("h3");
        areaHeading.textContent = areaArr.meals[i].strArea;
        areaDiv.append(areaIcon,areaHeading);

        row.append(colDiv)
    }
    $(".area").on("click",(e)=>{
        if ($(e.target).attr("data-area") == undefined) 
        {
            filterByArea($(e.target).parents("div.area").attr("data-area"))
        }
        else
        {
            filterByArea($(e.target).attr("data-area"))
        }
    })
    $(".loading-screen").fadeOut(1000);
    $("body").css("overflow","visible");
}

async function filterByArea(area)
{
    $(row).empty();
    $(".loading-screen").css("display","flex");
    $("body").css("overflow","hidden");
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    let data = await response.json();
    displayMeals(data);
}

async function getAllIngredients()
{
    $(row).empty();
    $(".loading-screen").css("display","flex");
    $("body").css("overflow","hidden");
    let response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
    let data = await response.json();
    displayIngredients(data);
}

function displayIngredients(ingredientArr)
{
    for (let i = 0; i < 20; i++) 
    {
        let colDiv = document.createElement("div");
        colDiv.classList.add("col-md-3");

        let ingredientDiv = document.createElement("div");
        ingredientDiv.classList.add("ingredient","rounded-2","text-white","text-center");
        ingredientDiv.setAttribute("data-ingredient",`${ingredientArr.meals[i].strIngredient}`);
        colDiv.append(ingredientDiv);

        let ingredientIcon = document.createElement("i");
        ingredientIcon.classList.add("fa-solid","fa-drumstick-bite","fa-4x");

        let ingredientHeading = document.createElement("h3");
        ingredientHeading.textContent = ingredientArr.meals[i].strIngredient;

        let ingredientDesc = document.createElement("p");
        ingredientDesc.textContent = ingredientArr.meals[i].strDescription.split(" ").slice(0,20).join(" ");

        ingredientDiv.append(ingredientIcon,ingredientHeading,ingredientDesc);

        row.append(colDiv)
    }
    $(".ingredient").on("click",(e)=>{
        if ($(e.target).attr("data-ingredient") == undefined) 
        {
            filterByIngredient($(e.target).parents("div.ingredient").attr("data-ingredient"));
        }
        else
        {
            filterByIngredient($(e.target).attr("data-ingredient"));
        }
    })
    $(".loading-screen").fadeOut(1000);
    $("body").css("overflow","visible");
}

async function filterByIngredient(mainIngredient)
{
    $(row).empty();
    $(".loading-screen").css("display","flex");
    $("body").css("overflow","hidden");
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${mainIngredient}`);
    let data = await response.json();
    displayMeals(data);
}


// Classes


// Events
$(".side-nav-menu").css({"left":-$(".nav-tab").outerWidth()});

$(".open-close-icon").click(()=>{
    if($(".side-nav-menu").css("left") == "0px")
    {
        $(".side-nav-menu").animate({"left":-$(".nav-tab").outerWidth()},500);
        $(".fa-bars").toggleClass("d-none");
        $(".fa-xmark").toggleClass("d-none");

        $(".links ul li").addClass("animate__fadeOutDownBig");
        $(".links ul li").removeClass("animate__fadeInUpBig");
    }
    else
    {
        $(".side-nav-menu").animate({"left": 0},500);
        $(".fa-bars").toggleClass("d-none");
        $(".fa-xmark").toggleClass("d-none");
        
        for (let i = 0; i < $(".links ul li").length; i++) {
            setTimeout(() => {
                $(".links ul li").eq(i).addClass("animate__fadeInUpBig");
                $(".links ul li").eq(i).removeClass("animate__fadeOutDownBig");
            }, i*50);
        }
    }
});

$(window).on("load",()=>{
    $(".loading-screen").fadeOut(1000);
    $("body").css("overflow","visible");
})

$("ul.links li").on("click",(e)=>{
    switch ($(e.target).attr("id")) {
        case "search":
            
            $(row).empty();
            
            let searchByNameDiv = document.createElement("div");
            searchByNameDiv.classList.add("col-md-6","search");

            let searchByNameInput = document.createElement("input");
            searchByNameInput.classList.add("form-control","bg-transparent","text-white");
            searchByNameInput.setAttribute("id","searchByName");
            searchByNameInput.setAttribute("placeholder","Search By Name");
            searchByNameDiv.append(searchByNameInput);

            let searchByFirstLitterDiv = document.createElement("div");
            searchByFirstLitterDiv.classList.add("col-md-6","search");
            
            let searchByLitter = document.createElement("input");
            searchByLitter.classList.add("form-control","bg-transparent","text-white");
            searchByLitter.setAttribute("id","searchByFirstLitter");
            searchByLitter.setAttribute("placeholder","Search By First Litter");
            searchByLitter.setAttribute("maxlength","1");

            searchByFirstLitterDiv.append(searchByLitter);

            row.append(searchByNameDiv,searchByFirstLitterDiv);

            $(".side-nav-menu").animate({"left":-$(".nav-tab").outerWidth()},500);
            $(".fa-bars").toggleClass("d-none");
            $(".fa-xmark").toggleClass("d-none");

            $("input").eq(0).on("input",(e)=>{
                $("div.col-md-6").eq(1).nextAll().remove();
                getAllMealsData($("input").eq(0).val(),"");
            });

            $("input").eq(1).on("input",(e)=>{
                $("div.col-md-6").eq(1).nextAll().remove();
                getAllMealsData("",$("input").eq(1).val());
            })
            break;
        case "categories":
            $(".side-nav-menu").animate({"left":-$(".nav-tab").outerWidth()},500);
            $(".fa-bars").toggleClass("d-none");
            $(".fa-xmark").toggleClass("d-none");
            getAllCategories();    
            break;
        case "area":
            $(".side-nav-menu").animate({"left":-$(".nav-tab").outerWidth()},500);
            $(".fa-bars").toggleClass("d-none");
            $(".fa-xmark").toggleClass("d-none");
            getAllAreas();  
            break;
        case "ingredients":
            $(".side-nav-menu").animate({"left":-$(".nav-tab").outerWidth()},500);
            $(".fa-bars").toggleClass("d-none");
            $(".fa-xmark").toggleClass("d-none");
            getAllIngredients();
            break;
        case "contact":
            $(".side-nav-menu").animate({"left":-$(".nav-tab").outerWidth()},500);
            $(".fa-bars").toggleClass("d-none");
            $(".fa-xmark").toggleClass("d-none");
            row.innerHTML = `                    
            <div class="contact-us">
                <div class="container w-75 text-center">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <input id="nameInput" class="form-control" type="text" placeholder="Enter Your Name">
                            <div id="nameAlert" class="alert alert-danger d-none w-100 mt-2">
                                Special characters and numbers not allowed
                            </div>
                        </div>
                        <div class="col-md-6">
                            <input id="emailInput" class="form-control" type="email" placeholder="Enter Your Email">
                            <div id="emailAlert" class="alert alert-danger d-none w-100 mt-2">
                                Email not valid *exemple@yyy.zzz
                            </div>
                        </div>
                        <div class="col-md-6">
                            <input id="phoneInput" class="form-control" type="text" placeholder="Enter Your Phone">
                            <div id="phoneAlert" class="alert alert-danger d-none w-100 mt-2">
                                Enter valid Phone Number
                            </div>
                        </div>
                        <div class="col-md-6">
                            <input id="ageInput" class="form-control" type="number" placeholder="Enter Your Age">
                            <div id="ageAlert" class="alert alert-danger d-none w-100 mt-2">
                                Enter valid age
                            </div>
                        </div>
                        <div class="col-md-6">
                            <input id="passwordInput" class="form-control" type="password" placeholder="Enter Your Password">
                            <div id="passwordAlert" class="alert alert-danger d-none w-100 mt-2">
                                Enter valid password *Minimum eight characters, at least one letter and one number:*
                            </div>
                        </div>
                        <div class="col-md-6">
                            <input id="repasswordInput" class="form-control" type="password" placeholder="Repassword">
                            <div id="repasswordAlert" class="alert alert-danger d-none w-100 mt-2">
                                Enter valid repassword
                            </div>
                        </div>
                    </div>
                    <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
                </div>
            </div>`

            let nameValid;
            let emailValid;
            let phoneValid;
            let ageValid;
            let passwordValid;
            let repasswordValid;
            let passwordMatching;

            $("input").eq(0).on("input",(e)=>{
                nameValid = inputsValidate(nameRegex,e.target);
            })
            $("input").eq(1).on("input",(e)=>{
                emailValid = inputsValidate(emailRegex,e.target);
            })
            $("input").eq(2).on("input",(e)=>{
                phoneValid = inputsValidate(phoneRegex,e.target);
            })
            $("input").eq(3).on("input",(e)=>{
                ageValid = inputsValidate(ageRegex,e.target);
            })
            $("input").eq(4).on("input",(e)=>{
                passwordValid = inputsValidate(passwordRegex,e.target);
            })
            $("input").eq(5).on("input",(e)=>{
                repasswordValid = inputsValidate(repasswordRegex,e.target);
            })

            $("input").on("input",()=>{
                if (passwordValid && repasswordValid) {
                    passwordMatching = passwordInputsMatching($("input#passwordInput").val(),$("input#repasswordInput").val());
                    if (nameValid && emailValid && phoneValid && ageValid && passwordMatching) {
                        $("button#submitBtn").attr("disabled",false);
                    }
                    else{
                        $("button#submitBtn").attr("disabled",true)
                    }
                }
                else{
                    $("button#submitBtn").attr("disabled",true);
                }
            })            
            break;
    
        default:
            break;
    }
})
