let githubVersion
registerConsts({
    githubVersionEndpoint: "https://raw.githubusercontent.com/JoeCoding3/versions/main/versions.json",
    gameVersion: 1
})
async function getVersion () {
    let resp = await fetch(githubVersionEndpoint)
    if (resp.ok) {
        let json = await resp.json()
        githubVersion = json.gdonline
    }
}
function showVersionInfo () {
    if (githubVersion == undefined) alert("Game version: " + gameVersion + "\nGitHub version: [unknown]\n    Error: Cannot connect to GitHub.")
    else alert("Game version: " + gameVersion + "\nGitHub version: " + githubVersion)
}
