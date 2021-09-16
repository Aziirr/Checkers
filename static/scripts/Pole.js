class Pole extends THREE.Mesh {

    constructor(material, geometry) {
        super(material, geometry) // wywołanie konstruktora klasy z której dziedziczymy czyli z Mesha
        this.pole = true
        this.black = false
        this.white = false
    }

    setColor(value) {
        for (const element of this.material) {
            element.color.setHex(value)
        }
    }

    getColor() {
        return this.material.color
    }

}

