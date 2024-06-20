var LOGIN;
var PASSWORD;

const text = document.getElementById("text");

document.addEventListener('DOMContentLoaded', (event) => {
    temp = localStorage.getItem("username")
    if(temp){
        document.getElementById('login').value = temp;
        document.getElementById('password').value = localStorage.getItem("password");
    }
    document.getElementById("submitbutton").addEventListener("click",openOneid);
    document.getElementById('password').type = "text";
});

document.getElementById('password').addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        openOneid();
    }
});

function openOneid() {
    LOGIN = document.getElementById('login').value;
    PASSWORD = document.getElementById('password').value;
    urlOauth2OneId = window.url;
    if(!urlOauth2OneId){
        text.textContent = "Please try logging in again(page refreshed)"
        return;
    }
    console.log(urlOauth2OneId);
    fetch(urlOauth2OneId, { method: 'HEAD', })
    .then(response => {
        const url = new URL(response.url);
        console.log(response.url);
        const L = url.searchParams.get("token_id");
        const y = url.searchParams.get("client_id");
        console.log(L);
        console.log(y);
        fetch("https://id-cloud.egov.uz/api/v1/secure/signIn", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({
                login: LOGIN,
                password: PASSWORD,
                otp: "808092"
            })
        })
        .then(response => response.json())
        .then(response => {
            text.textContent = response.status.message;
            if (response.status.code == 0) {
                localStorage.setItem("username", LOGIN);
                localStorage.setItem("password", PASSWORD);
                const pinfl = response.data.pinfl;
                const idtoken = response.data.accessToken;
                generate(L,y,idtoken);
                return;
            }
        });

    });
}

function generate(L,y, idtoken){
    fetch("https://id-cloud.egov.uz/api/oauth/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            Authorization: "Bearer " + idtoken
        },
        body: JSON.stringify({
            uuid: L,
            scope: y
        })
    })
    .then(response => response.json())
    .then(I => {
        let url = I.callbackUrl + "?code=" + I.code + "&state=" + I.state;
        window.location.href = url;
        // checkauth(url);
        // setTimeout(window.close, 1000);
    })
}

function checkauth(url){
    fetch(url)
    .then(response => response.text())
    .then(t => {
        const key = t.split('let key = "')[1].split('"')[0];
        console.log(key);
        fetch("https://savdo.uzavtosanoat.uz/t/ap/check?key="+key).then(e => e.json()).then(e => {
            if (e.status == 1) {
                console.log("done");
            } else {
                console.log("nope");
            }
        });
    })
}