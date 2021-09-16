class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            45,    // kąt patrzenia kamery (FOV - field of view)
            16 / 9,    // proporcje widoku, powinny odpowiadać proporcjom naszego ekranu przeglądarki
            0.1,    // minimalna renderowana odległość
            10000    // maksymalna renderowana odległość od kamery
        );
        this.renderer = new THREE.WebGLRenderer(
            {antialias: true}
        );
        this.createGametable()
        this.resize()
        this.raycaster = new THREE.Raycaster();
        this.mouse_vector = new THREE.Vector2()
        this.nearby_enemies = []
        this.available_squares = []
        this.nearby_friends = []
    }

    createGametable() {
        this.renderer.setClearColor(0xffffff);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("root").appendChild(this.renderer.domElement);
        let xpos = -87.5
        let zpos = -87.5
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let color = {
                    white: false,
                    black: false
                }
                let geometry = new THREE.BoxGeometry(25, 10, 25);
                let materials = [];
                if (j % 2 === 0) {
                    if (i % 2 === 0) {
                        for (let i = 0; i < 6; i++) {
                            materials.push(new THREE.MeshBasicMaterial({
                                side: THREE.DoubleSide,
                                map: new THREE.TextureLoader().load('/black_box')
                            }));
                        }
                        color.black = true
                    } else {
                        for (let i = 0; i < 6; i++) {
                            materials.push(new THREE.MeshBasicMaterial({
                                side: THREE.DoubleSide,
                                map: new THREE.TextureLoader().load('/white_box')
                            }));
                        }
                        color.white = true
                    }

                } else {
                    if (i % 2 !== 0) {
                        for (let i = 0; i < 6; i++) {
                            materials.push(new THREE.MeshBasicMaterial({
                                side: THREE.DoubleSide,
                                map: new THREE.TextureLoader().load('/black_box')
                            }));
                        }
                        color.black = true
                    } else {
                        for (let i = 0; i < 6; i++) {
                            materials.push(new THREE.MeshBasicMaterial({
                                side: THREE.DoubleSide,
                                map: new THREE.TextureLoader().load('/white_box')
                            }));
                        }
                        color.white = true
                    }
                }
                materials.forEach(element => {
                    element.map.magFilter = THREE.NearestFilter;
                });
                let cube = new Pole(geometry, materials);
                if (color.white)
                    cube.white = true
                else if (color.black)
                    cube.black = true
                cube.position.x = xpos
                cube.position.z = zpos
                cube.position.y = 0
                this.scene.add(cube);
                xpos += 25
            }
            zpos += 25
            xpos = -87.5
        }


        this.camera.fov = 50;
        this.camera.updateProjectionMatrix();
        this.camera.position.set(0, 100, 200);
        this.camera.lookAt(this.scene.position);

        let render = () => {


            //w tym miejscu ustalamy wszelkie zmiany w projekcie (obrót, skalę, położenie obiektów)
            //np zmieniająca się wartość rotacji obiektu


            //wykonywanie funkcji bez końca, ok 60 fps jeśli pozwala na to wydajność maszyny

            requestAnimationFrame(render);


            //ciągłe renderowanie / wyświetlanie widoku sceny naszą kamerą

            this.renderer.render(this.scene, this.camera);
        }

        render();

    }

    createCheckers() {
        let xpos = -87.5
        let zpos = -87.5
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 4; j++) {
                let geometry = new THREE.CylinderGeometry(10, 10, 5, 100);
                let materials = [];
                for (let i = 0; i < 6; i++) {
                    materials.push(new THREE.MeshBasicMaterial({
                        side: THREE.DoubleSide,
                        map: new THREE.TextureLoader().load('/dark_pawn')
                    }));
                }
                materials.forEach(element => {
                    element.map.magFilter = THREE.NearestFilter;
                });
                let cylinder = new Pionek(geometry, materials);
                cylinder.black = true
                cylinder.position.x = xpos
                cylinder.position.z = zpos
                cylinder.position.y = 10
                this.scene.add(cylinder);
                xpos += 50
            }
            zpos += 25
            xpos = -62.5
        }
        xpos = -62.5
        zpos = 87.5
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 4; j++) {
                let geometry = new THREE.CylinderGeometry(10, 10, 5, 100);
                let materials = [];
                for (let i = 0; i < 6; i++) {
                    materials.push(new THREE.MeshBasicMaterial({
                        side: THREE.DoubleSide,
                        map: new THREE.TextureLoader().load('/light_pawn')
                    }));
                }
                materials.forEach(element => {
                    element.map.magFilter = THREE.NearestFilter;
                });
                let cylinder = new Pionek(geometry, materials);
                cylinder.white = true
                cylinder.position.x = xpos
                cylinder.position.z = zpos
                cylinder.position.y = 10
                this.scene.add(cylinder);
                xpos += 50
            }
            zpos -= 25
            xpos = -87.5
        }
    }

    changeCameraPos() {
        this.camera.position.set(0, 100, -200);
        this.camera.lookAt(this.scene.position);
    }

    resize() {
        window.addEventListener("resize", () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);

        })
    }

    mouseClick(white) {
        let canvas = document.getElementById("root").children[0]
        let selected = {
            active: false,
            pionek: null
        }
        canvas.addEventListener("click", event => {
            this.mouse_vector.x = (event.offsetX / canvas.width) * 2 - 1
            this.mouse_vector.y = -(event.offsetY / canvas.height) * 2 + 1
            this.raycaster.setFromCamera(this.mouse_vector, this.camera)
            this.intersects = this.raycaster.intersectObjects(this.scene.children)
            if (this.intersects.length > 0) {
                let selected_mesh = this.intersects[0].object
                if (selected.active && selected_mesh.material[0].color.b === 0 && selected_mesh.pole) {
                    let move_obj = {
                        from_x: selected.pionek.position.x,
                        from_z: selected.pionek.position.z,
                        to_x: selected_mesh.position.x,
                        to_z: selected_mesh.position.z
                    }
                    if (Math.abs(move_obj.to_x - move_obj.from_x) === 50) {
                        game.deleteChecker(move_obj)
                        net.checkerDelete()
                    }
                    selected.pionek.position.x = selected_mesh.position.x
                    selected.pionek.position.z = selected_mesh.position.z
                    selected.pionek.setColor("0xFFFFFF")
                    net.playerMove(move_obj)
                    selected = {
                        active: false,
                        pionek: null
                    }
                    game.unColorAvailableSquares()

                } else if (selected_mesh.pionek) {
                    if (white && selected_mesh.white && !selected.active) {
                        selected_mesh.setColor("0xFF0000")
                        selected.active = true
                        selected.pionek = selected_mesh
                        game.checkNearbyEnemies(selected.pionek)
                        game.checkNearbyFriends(selected.pionek)
                        game.checkAvailableSquares(selected.pionek)
                        game.colorAvailableSquares(selected.pionek)

                    } else if (!white && selected_mesh.black && !selected.active) {
                        selected_mesh.setColor("0x#FF0000")
                        selected.active = true
                        selected.pionek = selected_mesh
                        game.checkNearbyEnemies(selected.pionek)
                        game.checkNearbyFriends(selected.pionek)
                        game.checkAvailableSquares(selected.pionek)
                        game.colorAvailableSquares(selected.pionek)
                    }
                }

            }
        })
    }

    checkerMove(move_obj) {
        function findChecker(element) {
            if (element.pionek && element.position.x == parseFloat(move_obj.from_x) && element.position.z == parseFloat(move_obj.from_z))
                return element
        }

        let checker = this.scene.children.find(findChecker)
        if (checker) {
            checker.position.x = move_obj.to_x
            checker.position.z = move_obj.to_z
        }

    }

    checkAvailableSquares(selected_checker) {
        let plus_z
        if (selected_checker.black)
            plus_z = 25
        else
            plus_z = -25
        let s1 = {
            posx: selected_checker.position.x + plus_z,
            posz: selected_checker.position.z + plus_z
        }
        let s2 = {
            posx: selected_checker.position.x - plus_z,
            posz: selected_checker.position.z + plus_z
        }
        game.available_squares.push(s1, s2)
        for (const element1 of game.nearby_friends) {
            game.available_squares.forEach((element2, index) => {
                if (element1.position.x === element2.posx && element1.position.z === element2.posz) {
                    game.available_squares.splice(index, 1)
                }
            })
        }
        for (const element1 of game.nearby_enemies) {
            game.available_squares.forEach((element2) => {
                if (element1.position.x == element2.posx && element1.position.z == element2.posz) {
                    element2.posx += element1.position.x - selected_checker.position.x
                    element2.posz += element1.position.z - selected_checker.position.z
                }
            })
        }
    }

    checkNearbyFriends(selected_checker) {
        game.nearby_friends = []

        function findEnemies(element) {
            if (element.pionek) {
                let white = selected_checker.white
                if (element.white === white && (element.position.x === parseFloat(selected_checker.position.x) + 25 || element.position.x === parseFloat(selected_checker.position.x) - 25) && (element.position.z === parseFloat(selected_checker.position.z) + 25 || element.position.z === parseFloat(selected_checker.position.z) - 25)) {
                    game.nearby_friends.push(element)
                }
            }
        }

        this.scene.children.find(findEnemies)
    }

    checkNearbyEnemies(selected_checker) {
        game.nearby_enemies = []

        function findEnemies(element) {
            if (element.pionek) {
                let white = selected_checker.white
                if (element.white !== white && (element.position.x == parseFloat(selected_checker.position.x) + 25 || element.position.x == parseFloat(selected_checker.position.x) - 25) && (element.position.z == parseFloat(selected_checker.position.z) + 25 || element.position.z == parseFloat(selected_checker.position.z) - 25)) {
                    game.nearby_enemies.push(element)
                }
            }
        }

        this.scene.children.find(findEnemies)
    }

    deleteChecker(move_obj) {
        game.scene.children.forEach((element) => {
            if ((element.position.z == (parseFloat(move_obj.from_z) + parseFloat(move_obj.to_z)) / 2) && (element.position.x == (parseFloat(move_obj.from_x) + parseFloat(move_obj.to_x)) / 2) && element.pionek) {
                game.scene.remove(element)
            }
        })

    }

    colorAvailableSquares() {
        for (const element of game.available_squares) {
            let current_data = element
            let current_square = game.scene.children.find(element => element.pole && element.position.x === current_data.posx && element.position.z === current_data.posz)
            if (current_square)
                current_square.setColor("0x00FF00")
        }
    }

    unColorAvailableSquares() {
        for (const element of game.available_squares) {
            let current_data = element
            let current_square = game.scene.children.find(element => element.pole && element.position.x === current_data.posx && element.position.z === current_data.posz)
            if (current_square)
                current_square.setColor("0xFFFFFF")
        }
        game.available_squares = []
    }

}