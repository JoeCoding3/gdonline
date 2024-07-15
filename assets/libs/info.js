registerConsts({
    defaultObjInfo: {
        bg: {
            hitX: 0,
            hitY: 0,
            hitW: "innerWidth",
            hitH: "innerHeight",
            imgX: "innerWidth / 2",
            imgY: "innerHeight / 2",
            imgW: "innerWidth + (innerHeight * 4)",
            resizeW: "innerHeight",
            repeat: true,
            spd: 0.15,
            type: "deco",
            texture: "ground/bg",
            zIndex: -1,
            noEditor: true,
            auto: true,
            repeatL: "innerHeight * -3",
            repeatR: "innerWidth + (innerHeight * 3)"
        },
        ground: {
            hitX: 0,
            hitY: "innerHeight - 128",
            hitW: "innerWidth + (playerW * 2)",
            hitH: 128,
            imgX: "innerWidth / 2",
            imgY: "innerHeight - 64",
            imgW: "innerWidth + 1024",
            resizeW: 128,
            repeat: true,
            type: "ground",
            texture: "ground/ground",
            zIndex: 1001,
            noEditor: true,
            auto: true,
            repeatL: -768,
            repeatR: "innerWidth + 768"
        },
        fixer: {
            hitW: 60,
            hitH: 60,
            type: "deco",
            texture: "block/block",
            noEditor: true,
            auto: true,
            zIndex: 0
        },
        ending: {
            hitW: 60,
            hitH: "innerHeight",
            imgY: "innerHeight / 2",
            type: "ending",
            texture: "ending/ending",
            resizeH: 60,
            noEditor: true,
            zIndex: 1000,
            special: {
                spacing: 500
            }
        },
        block: {
            hitW: 60,
            hitH: 60,
            type: "ground",
            texture: "block/block"
        },
        halfBlock: {
            imgH: 60,
            hitY: -30,
            hitW: 60,
            hitH: 27,
            type: "ground",
            texture: "block/halfBlock"
        },
        largeHalfBlock: {
            imgH: 60,
            hitY: -30,
            hitW: 60,
            hitH: 32,
            type: "ground",
            texture: "block/largeHalfBlock"
        },
        spike: {
            hitW: 10,
            hitH: 20,
            imgW: 60,
            imgH: 60,
            type: "spike",
            texture: "spike/spike"
        },
        halfSpike: {
            hitW: 15,
            hitH: 10,
            imgW: 60,
            imgH: 27,
            type: "spike",
            texture: "spike/halfSpike"
        },
        smallSpike: {
            hitY: -4,
            hitW: 7,
            hitH: 14,
            imgW: 40,
            imgH: 38,
            type: "spike",
            texture: "spike/smallSpike"
        },
        tinySpike: {
            hitY: -2,
            hitW: 5,
            hitH: 10,
            imgW: 25,
            imgH: 24,
            type: "spike",
            texture: "spike/tinySpike"
        },
        cubePortal: {
            hitW: 100,
            hitH: 180,
            type: "portal",
            texture: "portal/cubePortal",
            noAlign: true,
            special: {
                mode: "cube"
            }
        },
        shipPortal: {
            hitW: 100,
            hitH: 180,
            type: "portal",
            texture: "portal/shipPortal",
            noAlign: true,
            special: {
                mode: "ship"
            }
        },
        bluePortal: {
            hitW: 100,
            hitH: 180,
            type: "portal",
            texture: "portal/bluePortal",
            noAlign: true,
            special: {
                mode: "grav_blue"
            }
        },
        yellowPortal: {
            hitW: 100,
            hitH: 180,
            type: "portal",
            texture: "portal/yellowPortal",
            noAlign: true,
            special: {
                mode: "grav_yellow"
            }
        },
        yellowPad: {
            imgW: 50,
            hitW: 60,
            hitH: 8,
            type: "pad",
            texture: "pad/yellowPad",
            special: {
                mode: "yellow"
            }
        },
        bluePad: {
            imgW: 50,
            hitW: 60,
            hitH: 12,
            type: "pad",
            texture: "pad/bluePad",
            special: {
                mode: "blue"
            }
        },
        yellowOrb: {
            imgW: 60,
            imgH: 60,
            hitW: 72,
            hitH: 72,
            type: "orb",
            texture: "orb/yellowOrb",
            special: {
                mode: "yellow"
            }
        },
        coin: {
            hitW: 80,
            hitH: 80,
            type: "coin",
            texture: "coin/coin",
            noAlign: true
        }
    },
    defaultObjGlobalInfo: {
        hitW: 0,
        hitH: 0,
        spd: 1,
        rot: 0,
        zIndex: 1,
        type: "",
        texture: "",
        repeat: false,
        repeatL: 0,
        repeatR: 0,
        noEditor: false,
        noAlign: false,
        noRender: false,
        auto: false,
        special: {}
    },
    objTypeHitCols: {
        player: "lightgreen",
        deco: "darkviolet",
        ground: "blue",
        spike: "red",
        portal: "orange",
        coin: "yellow",
        pad: "lightgreen",
        orb: "lightgreen",
        ending: "brown",
        editor: "gray",
        text: "lightgray",
        outline: "white"
    }
})
let objImgs = {}
