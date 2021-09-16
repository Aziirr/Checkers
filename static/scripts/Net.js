class Net {
    constructor() {
    }

    loginAction(data) {
        $.ajax({
            url: "/login",
            data: data,
            type: "POST",
            success: function (data) {
                let received_data = JSON.parse(data)
                ui.loginAfterClick(received_data)
                if (received_data.user === 1) {
                    game.mouseClick(true)
                } else if (received_data.user === 2) {
                    game.mouseClick(false)
                    net.playersTurn()
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }

    resetGame() {
        $.ajax({
            url: "/reset",
            type: "POST",
            success: function (data) {
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }

    secondPlayerReq() {
        let intid = setInterval(function () {
            $.ajax({
                url: "/secondplayer",
                type: "POST",
                success: function (data) {
                    let secondplayer = JSON.parse(data)
                    if (secondplayer.active) {
                        clearInterval(intid)
                        game.createCheckers()
                        document.getElementById("waiting").style.display = "none"
                        document.getElementById("info").innerHTML += " Podłączył się gracz " + secondplayer.enemy_nick + " , gra czarnymi."
                    }
                },
                error: function (xhr, status, error) {
                    console.log(xhr);
                },
            });

        }, 500)
    }

    playersTurn() {
        let time = 30
        let timid = setInterval(function () {
            document.getElementById("timer").innerHTML = time
            document.getElementById("overlay").style.display = "block"
            if (time == 0.00) {
                clearInterval(timid)
                document.getElementById("overlay").style.display = "none"
                document.getElementById("info").innerHTML = "GRATULACJE WYGRAŁEŚ, PRZECIWNIK NIE WYKONAŁ RUCHU W REGULAMINOWYM CZASIE"
                net.resetGame()
            }
            $.ajax({
                url: "/playersturn",
                type: "POST",
                success: function (data) {
                    data = JSON.parse(data)
                    let next_turn = data.next_turn
                    if (next_turn) {
                        clearInterval(timid)
                        document.getElementById("overlay").style.display = "none"
                        game.checkerMove(data.change)
                        if (data.remove)
                            game.deleteChecker(data.change)
                    }
                },
                error: function (xhr, status, error) {
                    console.log(xhr);
                },
            });
            time -= 0.1
            time = time.toPrecision(3)
        }, 100)

    }

    playerMove(move_obj) {
        $.ajax({
            url: "/playersmove",
            type: "POST",
            data: move_obj,
            success: function (data) {
                net.playersTurn()
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }

    checkerDelete() {
        $.ajax({
            url: "/checkerdelete",
            type: "POST",
            success: function (data) {
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }
}