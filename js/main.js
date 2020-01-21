const serverUrl= "https://secret-cliffs-75145.herokuapp.com/api";
let saleData=[];
let page=1;
const perPage=10;


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

const saleModelBodyTemplate= _.template(`
    <% _.forEach(saleData, function(data){ %>
        <%- data.total=0 %>
        <% _.forEach(data.items, function(item){ %>
            <%- data.total= _.add(data.total,item.price) %>
        <% }); %>
        <h4>Customer</h4>
        <strong>email:</strong> <%- data.customer.email %> <br>
        <strong>age:</strong> <%- data.customer.age %> <br>
        <strong>satisfaction:</strong> <%- data.customer.satisfaction %>/5
        <br><br>
        <h4>Items:$<%- data.total.toFixed(2) %> </h4>
            <table class="table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    <% _.forEach(data.items, function(item){ %>
                            <tr>
                                <td> <%- item.name %> </td>
                                <td> <%- item.quantity %> </td>
                                <td> <%- item.price %> </td>
                            </tr>
                    <% }); %>
                </tbody>
            </table>
        <% }); %>
`);




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
        let saleTemplate= saleTableTemplate(saleData);
        $("#sale-table tbody").html(saleTableTemplate);
        $("#current-page").html(page);
    }
}


$(function(){
    loadSaleData();
});




