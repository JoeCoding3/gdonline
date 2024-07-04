registerConsts({
    gdToJsonProps: {
        "values": [
            null,
            ["id", "number"],
            ["x", "number"],
            ["y", "number"],
            ["flipX", "bool"],
            ["flipY", "bool"],
            ["rotation", "number"],
            ["red", "number"],
            ["green", "number"],
            ["blue", "number"],
            ["duration", "number"],
            ["touchTriggered", "bool"],
            ["coin", "number"],
            ["checked", "bool"],
            ["tintGround", "bool"],
            ["pCol1", "bool"],
            ["pCol2", "bool"],
            ["blending", "bool"],
            null,
            null,
            ["layer", "number"],
            ["baseCol", "channel"],
            ["decorCol", "channel"],
            ["color", "channel"],
            ["z", "number"],
            ["order", "number"],
            null,
            null,
            ["moveX", "number"],
            ["moveY", "number"],
            ["easing", "list"],
            ["message", "string"],
            ["scale", "number"],
            null,
            ["parent", "bool"],
            ["opacity", "number"],
            null,
            null,
            null,
            null,
            null,
            ["hsvEnabled1", "bool"],
            ["hsvEnabled2", "bool"],
            ["hsv1", "hsv"],
            ["hsv2", "hsv"],
            ["fadeIn", "number"],
            ["hold", "number"],
            ["fadeOut", "number"],
            ["pulseType", "list"],
            ["copiedHSV", "hsv"],
            ["copiedID", "number"],
            ["targetGroupID", "number"],
            ["targetPulseType", "list"],
            null,
            ["separation", "number"],
            null,
            ["activateGroup", "number"],
            ["triggerGroups", "array"],
            ["followX", "bool"],
            ["followY", "bool"],
            ["copyOpacity", "bool"],
            ["layer2", "number"],
            ["spawnTriggered", "bool"],
            ["spawnDelay", "number"],
            ["dontFade", "bool"],
            ["mainOnly", "bool"],
            ["detailOnly", "bool"],
            ["dontEnter", "bool"],
            ["degrees", "number"],
            ["times360", "number"],
            ["lockRotation", "bool"],
            ["followID", "number"],
            ["xFollow", "number"],
            ["yFollow", "number"],
            null,
            ["shakeStrength", "number"],
            ["animationID", "number"],
            ["count", "number"],
            ["subtractCount", "bool"],
            ["pickupMode", "list"],
            ["itemA", "number"],
            ["holdMode", "bool"],
            ["touchToggle", "list"],
            null,
            ["shakeInterval", "number"],
            ["easingRate", "number"],
            ["exclusive", "bool"],
            ["multiTrigger", "bool"],
            ["countComparison", "list"],
            ["dualMode", "bool"],
            ["followSpeed", "number"],
            ["followDelay", "number"],
            ["followOffset", "number"],
            ["onExit", "bool"],
            ["dynamic", "bool"],
            ["itemB", "number"],
            ["noGlow", "bool"],
            ["rotationSpeed", "number"],
            ["noRotate", "bool"],
            ["multiActivate", "bool"],
            ["useTarget", "bool"],
            ["targetCoords", "list"],
            ["disabled", "bool"],
            ["highDetail", "bool"],
            null,
            ["followMaxSpeed", "number"],
            ["randomizeStart", "bool"],
            ["animationSpeed", "number"],
            ["linkedGroup", "number"]
        ],

        "channels": {
            "1000": "BG",
            "1001": "G",
            "1002": "Line",
            "1003": "3DL",
            "1004": "Obj",
            "1005": "P1",
            "1006": "P2",
            "1007": "Light BG",
            "1009": "G2",
            "1010": "Black",
            "1011": "White",
            "1012": "Lighter"
        },
        "easings": [
            "None",
            "Ease In Out",
            "Ease In",
            "Ease Out",
            "Elastic In Out",
            "Elastic In",
            "Elastic Out",
            "Bounce In Out",
            "Bounce In",
            "Bounce Out",
            "Exponential In Out",
            "Exponential In",
            "Exponential Out",
            "Sine In Out",
            "Sine In",
            "Sine Out",
            "Back In Out",
            "Back In",
            "Back Out"
        ],
        "pulseTypes": ["color", "hsv"],
        "targetPulseTypes": ["channel", "group"],
        "pickupModes": ["none", "pickup", "toggle"],
        "touchToggles": ["default", true, false],
        "countComparisons": ["equals", "larger", "smaller"],
        "targetCoordss": ["both", "x", "y"]
    },
    gdToJsonColorProps: {
        "values": [null,
            ["r", "number"],
            ["g", "number"],
            ["b", "number"],
            ["pColor", "list"],
            ["blending", "bool"],
            ["channel", "channel"],
            ["opacity", "number"],
            null,
            ["copiedChannel", "channel"],
            ["copiedHSV", "hsv"],
            null,
            null,
            null,
            null,
            null,
            null,
            ["copyOpacity", "bool"]
        ],

        "channels": {
            "1000": "BG",
            "1001": "G",
            "1002": "Line",
            "1003": "3DL",
            "1004": "Obj",
            "1005": "P1",
            "1006": "P2",
            "1007": "Light BG",
            "1009": "G2",
            "1010": "Black",
            "1011": "White",
            "1012": "Lighter"
        },

        "pColors": {
            "-1": "None",
            "1": "P1",
            "2": "P2"
        }
    },
    gdToJsonIds: {
        block: ["1", "2", "3", "6", "7", "146"],
        halfBlock: ["40", "147", "215", "662", "1903"],
        spike: ["8", "144", "177", "216"],
        halfSpike: ["9", "39", "178", "205", "217"],
        smallSpike: ["103", "145","179", "218"],
        tinySpike: ["392", "458", "459"],
        coin: ["1329"],
        cubePortal: ["12"],
        shipPortal: ["13"]
    }
})
