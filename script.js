const captcha = document.getElementById('captchaImage');
window.captchaInput = document.getElementById("captchaInput");
const loginText = document.getElementById("loginText");
const stat = document.getElementById("status");
const loginButton = document.getElementById("loginButton");
const loginDiv = document.getElementById("loginDiv");
const modalDiv = document.getElementById("modal-content");
const modelsDiv = document.getElementById("models");
const modal = document.getElementById('id01');
const dealertext = document.getElementById('dealertext');
var buying = false;
window.onclick = function(event) {if (event.target == modal) {modal.style.display = "none";}}
var user;
var models,dealers,choosen_ix=[-1,-1,-1], choosen ={
    
};
var isLoggedIn = false;
var regn = {
    "1":"Toshkent shaxar",
    "2":"Andijon viloyati",
    "3":"Buxoro viloyati",
    "4":"Jizzax viloyati",
    "5":"Qashkadaryo viloyati",
    "6":"Navoi viloyati",
    "7":"Namangan viloyati",
    "8":"Samarkand viloyati",
    "9":"Surxondaryo viloyati",
    "10":"Sirdaryo viloyati",
    "11":"Toshkent viloyati",
    "12":"Farg'ona viloyati",
    "13":"Xorazm viloyati",
    "14":"Qoraqalpog'iston Respublikasi"
}
document.addEventListener('DOMContentLoaded', (event) => {
    if (!localStorage.getItem("rtoken")) {
        localStorage.setItem("rtoken", makeid(32));
    }
    window.rtoken = localStorage.getItem("rtoken");
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
        loginButton.textContent = "LogOut";
        isLoggedIn = true;
    }
    document.cookie = "lang=uz";
    getDealers();
});
captchaInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        checkCaptcha();
    }
});
function onLoginButton(){
    loginText.textContent = "Please enter the text you see below";
    if(isLoggedIn){
        localStorage.removeItem('userinfo');
        localStorage.removeItem('token');
        location.reload();
        return;
    }else{
        buying = false;
        loginDiv.style.display='block';
        refreshCaptcha();
    }
}
function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
function refreshCaptcha() {
    captcha.src = `https://savdo.uzavtosanoat.uz/t/captcha?token=${window.rtoken}&t=${Date.now()}`;
}
function refreshCaptchaBuy() {
    document.getElementById('buyCaptchaImage').src = `https://savdo.uzavtosanoat.uz/t/captcha?token=${window.rtoken}&t=${Date.now()}`;
}
function checkCaptcha() {
    
    loginText.textContent = "Validating CAPTCHA...";
    const captchaValue = document.getElementById("captchaInput").value;
    if(!buying){
        stat.textContent = 'Logging in...'
        const requestUrl = `https://savdo.uzavtosanoat.uz/t/core/m$oauth2_gen_params?code=oneid&company_code=savdo_uzavtosanoat_uz",lang_code: "uz"})}`;
        fetch(requestUrl, {
            headers: {
                referer:'https://savdo.uzavtosanoat.uz/',
                'Sec-Fetch-Site':'same-origin',
                rcode: window.rtoken,
                captcja: captchaValue,
            }})
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                let temp = loginText.textContent;
                loginText.textContent = "Error Validating CAPTCHA";
                loginText.style.color = 'red';
                setTimeout(() => {
                    loginText.style.color = 'white';
                    loginText.textContent = temp;
                }, 1500);
            } else {
                window.secret_key = data.secret_key;
                openOneid(data);
                loginDiv.style.display = 'none';
            }
        })
    }else{
        // var qwe = fetch("", {
        // method: "POST",
        // headers: {
        //     'lang_code':'uz',
        //     'oauth2_token': window.token,
        //     'rcode': window.rtoken,
        // },
        // body: JSON.stringify(),}).then((result) => {
            
        // });



        ///////////////////////////////////////////////////////////////
        const xhr = new XMLHttpRequest();

        // Configure the request
        xhr.open('POST', 'https://savdo.uzavtosanoat.uz/t/ap/stream/ph$order_save_', true);

        // Set headers (important for JSON)
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.setRequestHeader('lang_code', 'uz');
        xhr.setRequestHeader('oauth2_token', window.token);
        xhr.setRequestHeader('priority', 'u=1, i');
        xhr.setRequestHeader('rcode', window.rtoken);


        // Create the JSON data
        const dataToSend = {
            "modification_id":choosen.modification_id.toString(),
            "color_id": choosen.color_id.toString(),
            "dealer_id": choosen.dealer_id.toString(),
            "captcha": captchaValue,
            "filial_id":100,
        };
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log(xhr.responseText); 
                
                let ttt = setInterval(() => {
                    fetch("https://savdo.uzavtosanoat.uz/t/ap/runorder?mod=" + choosen.modification_id.toString() + "&token=" + window.rtoken,).then(e => e.json()).then(e => {
                        if (e.status == 1) {
                            clearInterval(ttt)
                            loginText.textContent = "SUCCESS";
                            return;

                        } else if (e.status == -1) {
                            clearInterval(ttt)
                            confirm("Попробуйте перезагрузить страницу.-1")
                        }
                        else if (e.status == -2) {
                            clearInterval(ttt);
                            confirm("Попробуйте перезагрузить страницу.-2");
                        }
                        loginText.textContent = "ERROR buying...";
                    })
                }, 3000);
            } else {
                loginText.textContent=xhr.responseText;
            }
        };
        xhr.send(JSON.stringify(dataToSend)); 

    }
    refreshCaptcha();
}
function openOneid(urlOauth2OneId) {
    loginText.textContent = "Logging in with ONE ID...";
    var width = 800, height = 600;
    setTimeout(()=>{
        var tokenWindow = window.open("oneid/index.html", 'token_window', 'status=no,scrollbars=yes,resizable=yes,width=' + width + ',height=' + height + ',top=' + Math.floor((screen.height - height) / 2 - 14) + ',left=' + Math.floor((screen.width - width) / 2 - 5));
        tokenWindow.url = urlOauth2OneId.url
        var checkInterval = setInterval(function() {
            if (tokenWindow && tokenWindow.closed) {
                clearInterval(checkInterval);
                userInfo();
            }
        }, 1000);
    }
    )
}
Be = e => {
    const t = e + "=",
        n = document.cookie.split(";");
    for (let r = 0; r < n.length; r++) {
        let l = n[r];
        for (; l.charAt(0) == " ";) l = l.substring(1);
        if (l.indexOf(t) == 0) return l.substring(t.length, l.length)
    }
    return ""
}
function userInfo() {
    loginText.textContent = "Getting TOKEN...";
    if (window.secret_key) {
        fetch("https://savdo.uzavtosanoat.uz/t/core/m$oauth2_token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    rcode: window.rtoken,
                },
                body: JSON.stringify({
                    token: window.secret_key
                }),
            }).then((response) => response.text())
            .then((ee) => {
                loginText.textContent = "Loading user info...";
                localStorage.setItem("token", ee);
                fetch("https://savdo.uzavtosanoat.uz/t/ap/stream/ph$user_info", {
                        method: "POST",
                        headers: {
                            "oauth2_token": ee,
                            rcode: window.rtoken,
                        },
                    })
                    .then((response) => response.json())
                    .then((result) => {
                        loginText.textContent = "Logged in";
                        localStorage.setItem("userinfo", JSON.stringify(result));
                        stat.textContent = result.name;
                        isLoggedIn=true;
                        loginButton.textContent='LogOut';
                        setTimeout(() => {
                            loginDiv.style.display = 'none';
                        }, 1500);
                        console.log(result);
                    })
                    .catch((error) => {
                        stat.textContent = "Error logging in...";
                        loginText.textContent = "Error fetching user info:" + error;
                    });
            })
            .catch((error) => {
                loginText.textContent = "Error exchanging token:" + error;
                stat.textContent = "Error logging in...";
            });
        return;
    }else{
        
        loginText.textContent = "Loading user info...";
        ee = localStorage.getItem("token");
        fetch("https://savdo.uzavtosanoat.uz/t/ap/stream/ph$user_info", {
                method: "POST",
                headers: {
                    "oauth2_token": ee,
                    rcode: window.rtoken,
                },
            })
            .then((response) => response.json())
            .then((result) => {
                loginText.textContent = "Logged in";
                localStorage.setItem("userinfo", JSON.stringify(result));
                stat.textContent = "Loaded";
                isLoggedIn=true;
                loginButton.textContent='LogOut';
                setTimeout(() => {
                    stat.textContent = result.name;
                    loginDiv.style.display = 'none';
                }, 1500);
                console.log(result);
            })
            .catch((error) => {
                stat.textContent = "Error logging in...";
                loginText.textContent = "Error fetching user info:" + error;
            });
    }
}
function getModels() {
    modelsDiv.innerHTML = "Loading...";
    var text = "";

    fetch("https://savdo.uzavtosanoat.uz/t/ap/stream/ph&models", {
        method: "POST",
        headers: {
            'fillial_id':100,
            'lang_code':'uz',
            'rcode': window.rtoken,
        },
        body: JSON.stringify({
            'fillial_id':100,
            'tis_web':"Y",
        }),
    }).then((response) => response.json())
    .then((ee) => {



        models = ee;
        for(let i=0; i<models.length; i++){
            let model = models[i];
            let t = '';
            
            t+=model.name;
            text+=`<button class="collapsible">${t}</button>\n`
            text+='<div class="collapsed">\n';
            ////////////////////////////////////////////////////////////////////////////////

            for(let l=0; l<model.modifications.length;l++){
                mod = model.modifications[l];
                text+= `<p>${mod.name + " - " + price(mod.price)}</p>\n`;
                for(let c=0; c<mod.colors.length; c++){
                    let col = mod.colors[c];
                    let contrast = getContrastColor(col.hex_value);
                    text+=`<button class="colorButton" onclick="chooseDealer(${model.model_id},${mod.modification_id},${col.color_id});" style="background-color: ${col.hex_value}; color:${contrast};">${col.name}</button>\n`;
                }
                text+='<br>\n';
            }
            text+='</div>\n';
        }
        modelsDiv.innerHTML = text;
        set_collapsibles();
    })
    // ''
    // fillial_id
}
function getDealers() {
    fetch("https://savdo.uzavtosanoat.uz/t/ap/stream/ph&dealers", {
        method: "POST",
        headers: {
            'lang_code':'uz',
            'rcode': window.rtoken,
        },
        body: JSON.stringify({
            'fillial_id':100,
        }),
    }).then((response) => response.json())
    .then((ee) => {
        dealers=ee;
        show_dealers();
    })
}
function chooseDealer(model_id, modification_id, color_id) {
    console.log("Clicked: ",model_id,modification_id, color_id);
    for(let i1=0; i1<models.length; i1++){
        let model = models[i1];
        if(model.model_id == model_id){
            console.log("model");
            for(let i2=0; i2<model.modifications.length; i2++){
                let mod=model.modifications[i2];
                if(mod.modification_id==modification_id){
                    console.log("mod");
                    for(let i3=0; i3<mod.colors.length;i3++){
                        let color = mod.colors[i3];
                        console.log(color.color_id,color_id)
                        if(color.color_id == color_id){
                            console.log("color");
                            choosen_ix=[i1,i2,i3]
                            dealertext.style.color = getContrastColor(color.hex_value);
                            let txt='';
                            var va = '<span style="border-radius: 10px;border: none;margin: 4px 2px;padding: 10px 20px;background-color: ';
                            txt += va+color.hex_value+';">'+model.name+'</span>'
                            txt += va+color.hex_value+';">'+mod.name+'</span>'
                            txt += va+color.hex_value+';">'+color.name+'</span>'
                            txt += va+ '#f00;color:#fff">'+price(mod.price)+'</span>'
                            dealertext.innerHTML = txt;
                            show_dealers(model.dealer_exist, color.stock_data);
                            document.getElementById('id01').style.display='block';
                            break;
                        }
                    }
                    break;
                }
            }
            break;
        }
    }
}
function show_dealers(dealer_exist,stock_data) {
    modalDiv.innerHTML="Loading...";
    var text = "";
    let regions={
        "1":[],
        "2":[],
        "3":[],
        "4":[],
        "5":[],
        "6":[],
        "7":[],
        "8":[],
        "9":[],
        "10":[],
        "11":[],
        "12":[],
        "13":[],
        "14":[],
    }
    for(let i=0; i<dealers.length; i++){
        for(let l=0; l<dealers[i].dealers.length; l++){
            let dealer = dealers[i].dealers[l];
            if(dealer_exist){
                if(dealer_exist.includes(dealer.dealer_id)){
                    regions[dealer.region].push(dealer);
                }
            }else{
                regions[dealer.region].push(dealer);
            }
        }
    }
    for(const [id, value] of Object.entries(regions)){
        if(value.length>0){
            add="";
            if(stock_data && stock_data.length>0){
                for(let i=0; i<stock_data.length; i++){
                    let item = stock_data[i];
                    if(id==item.region_id){
                        add+=`(${item.stock})`
                    }
                }
            }
            text+=`<button class="region">${regn[id]+add}</button>\n<div class="collapsedregion">\n`;
            for(let l=0; l<value.length; l++){
                let dealer = value[l];
                text+=`<button class="buyButton" onclick="buy(${dealer.dealer_id})"><span style="font-size: large;">${dealer.name}</span><br>${dealer.address}<br>${dealer.phone_number}</button>\n`;
                text+='<br>\n';
            }
            text+="</div>";
        }
    }
    modalDiv.innerHTML = text;
    set_collapsible_regions();
}
function buy(dealer_id){
    if(choosen_ix[0]!=-1 && choosen_ix[1]!=-1 && choosen_ix[2]!=-1){
        loginText.textContent = "Please enter the text you see below";
        buying = true;
        loginDiv.style.display='block';
        document.getElementById('id01').style.display='none';
        refreshCaptcha();
        choosen['color_id'] = models[choosen_ix[0]].modifications[choosen_ix[1]].colors[choosen_ix[2]].color_id;
        choosen['dealer_id'] = dealer_id;
        choosen['modification_id'] = models[choosen_ix[0]].modifications[choosen_ix[1]].modification_id
    }else{
        alert("Choose a car first...");
    }
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
function set_collapsible_regions() {
    var coll = document.getElementsByClassName("region");
    var i;
    
    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        var temp = document.getElementsByClassName("activeregion");
        for (l = 0; l < temp.length; l++) {
            var t = temp.item(l);
            if(t!=this){
                t.classList.toggle("activeregion");
                var content = t.nextElementSibling;
                content.style.maxHeight = null;
            }
        }
        this.classList.toggle("activeregion");
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
    const digits = number.toString().split('').reverse();
  
    let formatted = '';
    for (let i = 0; i < digits.length; i++) {
      formatted = digits[i] + formatted;
      if ((i + 1) % 3 === 0 && i !== digits.length - 1) {
        formatted = ' ' + formatted; 
      }
    }
  
    return formatted+" so'm";
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