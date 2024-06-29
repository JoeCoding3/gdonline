const constDefaults = {}
function registerConsts (props) {
    Object.assign(constDefaults, props)
}
resetConst = () => {}
function assignConsts () {
    for (let def of Object.keys(constDefaults)) window[def] = constDefaults[def]
    Object.freeze(constDefaults)

    registerConsts = () => {}
    resetConst = name => window[name] = constDefaults[name]
}
