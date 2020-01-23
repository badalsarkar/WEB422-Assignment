/*********************************************************************************
 * * WEB422 – Assignment 2
 * * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * * No part of this assignment has been copied manually or electronically from any other source
 * * (including web sites) or distributed to other students.
 * *
 * * Name: Badal Sarkar             Student ID: 13722618       Date: January 22, 2020
 * ********************************************************************************/
let saleData=[];
let page=1;
const perPage=10;
const serverUrl= "https://secret-cliffs-75145.herokuapp.com/api";



//on document ready
$(function(){
    loadSaleData();
    displaySaleModal();
    activatePagination();
});


/* load sale data function
 * makes fetch request to get sale data
 * use saleTableTemplate to generate html code 
 * with the sale data and then render to table
*/
async function loadSaleData(){
    try{
        let response= await fetch(`${serverUrl}/sales?page=${page}&perPage=${perPage}`);
        saleData= await response.json();
    }
    catch(err){
        console.log(err);
    }
    
    //now the saleData array should not be empty
    //so call the saleTAbleTemplate with the data
    if(saleData.length>0){
        //create template
        $("#sale-table tbody").html(saleTableTemplate(saleData));
        $("#current-page").html(page);
    }
}





//function to display saleModal window on click event
//parameter: none
//process: 1. attach click event
//         2. get the data-id on click
//         3. calculate total sale amount and attach
//              as new property to the clicked object
//         4. generate saleModal template
//         5. attach template to DOM
function displaySaleModal(){
    let saleId;
    let clickedSale;
    $("#sale-table tbody").on("click", "tr", function(){
        saleId=$(this).attr("data-id");
        clickedSale=saleData.find(data=>data["_id"]==saleId);
        if(clickedSale && clickedSale.items){
            $(".modal-title").html(`Sale: ${saleId}`);
            clickedSale.total=0;
            clickedSale.items.forEach(item=>clickedSale.total+=(item.price*item.quantity));
            $(".modal-body").html(saleModelBodyTemplate(clickedSale));
            $("#sale-modal").modal({
                keyboard: false,
                backdrop: 'static'
            });
        }
        else{
            $(".modal-title").html("Error loading sale data");
        }
    });

}





//pagination function
function activatePagination(){
    //previous page button
    $("#previous-page").on('click',function(){
        if(page>0){
            page--;
            loadSaleData();
        }
    });


    //next page button
    $("#next-page").on('click', function(){
        page++;
        loadSaleData();
    });
}





//Sale table template
const saleTableTemplate= _.template(`
    <% _.forEach(saleData, function(data){ %>
        <tr data-id= "<%- data["_id"] %>" >
            <td> <%- data.customer.email %> </td>
            <td> <%- data.storeLocation %> </td>
            <td> <%- data.items.length %> </td>
            <td> <%- moment.utc(data.saleDate).local().format('LLLL') %> </td>
        </tr>
    <% }); %>
`);






//Sale modal template
const saleModelBodyTemplate= _.template(`
        <h4>Customer</h4>
        <strong>email:</strong> <%- customer.email %> <br>
        <strong>age:</strong> <%- customer.age %> <br>
        <strong>satisfaction:</strong> <%- customer.satisfaction %>/5
        <br><br>
        <h4>Items: $<%- total.toFixed(2) %> </h4>
            <table class="table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    <% _.forEach(items, function(item){ %>
                            <tr>
                                <td> <%- item.name %> </td>
                                <td> <%- item.quantity %> </td>
                                <td> <%- item.price %> </td>
                            </tr>
                    <% }); %>
                </tbody>
            </table>
`);






