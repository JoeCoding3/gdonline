registerConsts({
    defaultObjInfo: {
        bg: {
            hitX: 0,
            hitY: 0,
            hitW: "innerWidth * 3",
            hitH: "innerHeight",
            imgX: "innerWidth * 1.5",
            imgY: "innerHeight / 2",
            resizeW: "innerHeight",
            repeat: true,
            spd: 0.2,
            type: "deco",
            texture: "ground/bg",
            zIndex: 0,
            noEditor: true,
            auto: true
        },
        ground: {
            hitX: "-playerW",
            hitY: "innerHeight - 128",
            hitW: "innerWidth + playerW",
            hitH: 128,
            imgX: "innerWidth / 2",
            imgY: "innerHeight - 64",
            imgW: "innerWidth + 256",
            resizeW: 128,
            repeat: true,
            type: "ground",
            texture: "ground/ground",
            zIndex: 1000,
            noEditor: true,
            auto: true
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
        coin: {
            hitW: 80,
            hitH: 80,
            type: "coin",
            texture: "coin/coin",
            noAlign: true
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
        noEditor: false,
        noAlign: false,
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
        editor: "gray"
    }
})
