let gameVersion
registerConsts({
    githubVersionEndpoint: "https://raw.githubusercontent.com/JoeCoding3/gdonline/main/assets/version/version.txt?token="
})
function setVersion (ver) {
    gameVersion = ver
}
function getVersion () {
    if (window["githubUserToken"] != undefined) {
        let elem = document.createElement("script")
        elem.src = githubVersionEndpoint + githubUserToken
        document.head.append(elem)
        elem.onload = function () {
            this.remove()
        }
    }
}
