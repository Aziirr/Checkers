class UI {
    constructor() {
        this.loginButton()
        this.resetButton()
    }

    loginButton() {
        document.getElementById("login").addEventListener("click", function () {
            let data = {nick: document.getElementById("nickname").value}
            net.loginAction(data)
        })
    }

    resetButton() {
        document.getElementById("reset").addEventListener("click", function () {
            net.resetGame()
            document.getElementById("info").innerHTML = "Zresetowano grę"
            setTimeout(function () {
                location.reload()
            },500)
        })
    }
    loginAfterClick(received_data){
        let status_bar = document.getElementById("info")
        document.getElementById("login_screen").style.display = "none"
        if (received_data.start) {
            if(received_data.user == 1){
                status_bar.innerHTML = "Witaj " + received_data.nick + ", grasz białymi."
                net.secondPlayerReq()
                document.getElementById("waiting").style.display = "block"
            }
            else{
                status_bar.innerHTML = "Witaj " + received_data.nick + ", grasz czarnymi."
                game.createCheckers()
                game.changeCameraPos()
            }
        }
        else{
            status_bar.innerHTML = "W grze jest juz 2 graczy"
        }
    }

}