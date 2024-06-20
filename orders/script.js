const listDiv = document.getElementById("list");
const stat = document.getElementById("status");
var user,orders;
document.addEventListener('DOMContentLoaded', (event) => {
    if (!localStorage.getItem("rtoken")) {
        stat.textContent = "Site is not configured";

    }
    else window.rtoken = localStorage.getItem("rtoken");
    //try to get user credentials
    //if can't relogin
    var temp = localStorage.getItem("userinfo");
    var token = localStorage.getItem("token");
    if (!(temp && token)) {
        stat.textContent = "Not logged in, please Log in"
    }else{
        user = JSON.parse(temp);
        stat.textContent = user.name;
        window.token = token;
    }
    getOrders();
    // set_collapsibles();
});
function getOrders() {
    listDiv.innerHTML = "Loading...";
    const xhr = new XMLHttpRequest();

    xhr.open('POST', 'https://savdo.uzavtosanoat.uz/t/ap/stream/ph$load_orders', true);

    xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.setRequestHeader('lang_code', 'uz');
    xhr.setRequestHeader('oauth2_token', window.token);
    xhr.setRequestHeader('priority', 'u=1, i');
    xhr.setRequestHeader('rcode', window.rtoken);

    const dataToSend = {
        "filial_id":100,
    };
    xhr.onload = () => {
        if(xhr.status >= 200 && xhr.status < 300){
            const response = JSON.parse(xhr.responseText);
            orders = response;
            let text = '';
            for(let i=0; i<orders.length;i++){
                let order = orders[i];
                var state = order.state
                var states={
                    "N": "New",
                    "Q": "Queued",
                    "P": "Planned",
                    "W": "Waiting",
                    "B": "Binding",
                    "C": "Completed",
                    "A": "Arrived",
                    "R": "Reserved"}
                if(state in states){
                    state = states[order.state];
                }
                text+=`<button class="collapsible" style="color: ${getContrastColor(order.color.hex_value)};">\n`
                text+=`<span class="detail" style="display: inline;background-color: ${order.color.hex_value};">${order.model_name}</span>\n`
                text+=`<span class="detail" style="display: inline;background-color: ${order.color.hex_value};">${order.modification.name}</span>\n`
                text+=`<span class="detail" style="display: inline;background-color: ${order.color.hex_value};">${order.color.name}</span>\n`
                text+=`<span class="detail" style="display: inline;background-color: #f00; color: #fff">${price(order.remain_amount)} / ${price(order.price)} so'm</span>\n`
                text+=`</button>\n`
                text+=`<div class="collapsed">\n`
                text+=`<p><b>Contract: ${order.contract_code}</b></p>\n`
                text+=`<p>Dealer: ${order.dealer_name}</p>\n`
                text+=`<p>Queue: ${order.queue_no}</p>\n`
                text+=`<p>Ordered: ${order.order_date}</p>\n`
                text+=`VIN number: ${order.vin_code}<br>\n`
                text+=`<span style="width:25%; display:inline-block;">State: ${state}</span>${order.state_html}`
                text+=`<br>Kind: ${order.kind}\n<br>`
                text+=`<p>Order kind: ${order.order_kind}</p>\n`
                var command = "alert('error');";
                var txt = "ERROR UNKNOWN";
                if(order.contract_generated=='Y'){
                    var tc = '#090';
                    var t = 'Contract generated';
                    command = `downloadContract('${order.contract_code}');`;
                    txt  = "DOWNLOAD CONTRACT";
                }else if(order.contract_generated=='N'){
                    var tc = '#900';
                    var t = 'Contract not generated';
                    command = `generateContract('${order.contract_code}');`;
                    txt  = "GENERATE CONTRACT";
                }else{
                    var tc = '#900';
                    var t = 'Is contract generated: '+order.contract_generated;
                }
                text+=`<b class="detail" style="background-color: ${tc};">${t}</b>`
                if(order.contract_approved=='Y'){
                    var tc = '#090';
                    var t = 'Contract approved';
                }else if(order.contract_approved=='N'){
                    var tc = '#900';
                    var t = 'Contract not approved';
                }else{
                    var tc = '#900';
                    var t = 'Contract approved: '+order.contract_approved;
                }
                
                text+=`<b class="detail" style="background-color: ${tc};">${t}</b>`
                if(order.dealer_approved=='Y'){
                    var tc = '#090';
                    var t = 'Dealer approved';
                }else if(order.dealer_approved=='N'){
                    var tc = '#900';
                    var t = 'Dealer not approved';
                }else{
                    var tc = '#900';
                    var t = 'Dealer approved: '+order.dealer_approved;
                }
                text+=`<b class="detail" style="background-color: ${tc};">${t}</b>`
                text+=`<div style="margin-top:5px;padding:10px;outline:2px solid #4bf150;"><b style="width:30%; display:inline-block;">Price: ${price(order.price)} so'm</b>\n`
                text+=`<b style="width:30%; display:inline-block;">Paid: ${price(order.paid_amount)} so'm</b>\n`
                text+=`<b style="width:30%; display:inline-block;">Remaining: ${price(order.remain_amount)} so'm</b></div>\n`
                text+=`<br>Expected date: <b class="detail" style="background-color: #333;">${order.expect_date}</b> <b class="detail" style="background-color: #900;">${price(order.payment_amount)} so'm</b><br>`
                var list = [
                    "order_id",
                    "filial_id",
                    "code",
                    "model_id",
                    "model_name",
                    "photo_sha",
                    "modification",
                    "color",
                    "interior_photos",
                    "exterior_photos",
                    "dealer_id",
                    "dealer_name",
                    "queue_no",
                    "order_date",
                    "vin_code",
                    "contract_code",
                    "state",
                    "state_html",
                    "kind",
                    "contract_generated",
                    "contract_approved",
                    "dealer_approved",
                    "order_kind",
                    "price",
                    "paid_amount",
                    "remain_amount",
                    "expect_date",
                    "payment_amount",
                    "hint",
                    "hint_class",
                    "photo_sha666"
                ];
                for(const [id, value] of Object.entries(order)){
                    if(!list.includes(id) && value){
                        var st = id.charAt(0).toUpperCase() + id.slice(1);
                        text+=`<br>${st.replace("_"," ")}: ${value}`;
                    }
                }
                text+=`<p><b>${order.hint}</b></p>\n<br>\n`
                text+=`<button class="colorButton" onclick="${command}" style="background-color: #080707; color:#FFFFFF;">${txt}</button>`
                text+='\n<br>\n</div>'
            }
            listDiv.innerHTML = text;
            set_collapsibles();
        }else{
            listDiv.innerHTML = `Request failed with status: ${xhr.status}`;
        }
    };
    err = (ev) => {
        listDiv.innerHTML = "Error while loading: "+xhr.statusText;
        console.log(ev);
    }
    xhr.onerror = err;
    xhr.ontimeout = err;
    xhr.send(JSON.stringify(dataToSend));
}
function generateContract(contract_code) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://savdo.uzavtosanoat.uz/uzavto_contract/generate?contract_code='+contract_code.toString(), true);
    
    xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
    xhr.setRequestHeader('oauth2_token', window.token);
    xhr.setRequestHeader('priority', 'u=1, i');
    
    xhr.onload = () => {
        if(xhr.status >= 200 && xhr.status < 300){
            alert("Generated! Reload orders to see the effect.");
        }else{
            alert("Error:",xhr.status);
        }
    };
    xhr.send();
}
function downloadContract(contract_code) {
    window.open(`https://savdo.uzavtosanoat.uz/backend/download-order?id=${contract_code}&token=${window.token}`);
}
function set_collapsibles() {
    var coll = document.getElementsByClassName("collapsible");
    var i;
    
    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight){
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
        } 
      });
    }
}
function price(number) {
    // Convert the number to a string and split it into groups of 3 digits
    if(number){
            const digits = number.toString().split('').reverse();
    
        let formatted = '';
        for (let i = 0; i < digits.length; i++) {
        formatted = digits[i] + formatted;
        if ((i + 1) % 3 === 0 && i !== digits.length - 1) {
            formatted = ' ' + formatted; 
        }
        }
        return formatted;
    }else{
        return "0";
    }
}
function getContrastColor(hexColor) {
    // Remove the '#' if it exists
    hexColor = hexColor.replace("#", "");
  
    // Convert hex to RGB
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);
  
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
    // Choose black or white based on luminance
    return luminance > 0.5 ? "#000000" : "#FFFFFF"; 
}