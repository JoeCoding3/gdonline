let needsUpdate = false
registerConsts({
    githubVersionEndpoint: "https://raw.githubusercontent.com/JoeCoding3/versions/main/gdonline.txt",
    gameVersion: 1
})
async function getVersion () {
    let resp = await fetch(githubVersionEndpoint)
    let text = await resp.text()
    let githubVersion = +text
    needsUpdate = githubVersion != gameVersion
}
