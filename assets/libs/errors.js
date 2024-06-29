class CustomError extends Error {
    constructor (...args) {
        super()

        this.name = this.constructor.name
        this.message = this.message(...args)
        this.stack = this.name + (this.message == "" ? "" : ": " + this.message)
    }
    message (arg = "") {
        return arg
    }
}
