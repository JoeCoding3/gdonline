let githubVersion
registerConsts({
    githubVersionEndpoint: "https://raw.githubusercontent.com/JoeCoding3/versions/main/gdonline.txt",
    gameVersion: 1
})
async function getVersion () {
    let resp = await fetch(githubVersionEndpoint)
    if (resp.ok) {
        let text = await resp.text()
        githubVersion = +text
    }
}
function showVersionInfo () {
    if (githubVersion == undefined) alert("GDOnline by Joe Michael and Jack Rocco\nGame version: " + gameVersion + "\nGitHub version: [unknown]\n    Error: Cannot connect to GitHub.")
    else alert("GDOnline by Joe Michael and Jack Rocco\nGame version: " + gameVersion + "\nGitHub version: " + githubVersion)
}
