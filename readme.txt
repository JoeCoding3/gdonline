index.html:
    Controls:
        space: Jump
        e: Toggle editor
        p: Toggle pause
    Editor Controls:
        WASD: Fly
        Scroll: Select block
        Left-Click: Place block
        Middle-Click: Remove block
        Right-Click: Place block rotated 180 degrees
        Enter: Export level
    Level Exporting:
        Level will auto-export when exiting editor mode, this is the small freeze that you may notice.
        When Exporting:
            Input the name of the level and click OK.
            To cancel exporting, click Cancel.
            Save the level file in gdonline/assets/level/levels.
            The level will download with a .js extension, don't change it.
            You can rename the file to change the level name.
    Config:
        File is gdonline/assets/options.js.
        Options:
            targetFps: Speed of the game. Does not make the game run better.
            showHitboxes: Draw hitboxes or not.
            levelName: Name of the level to load on startup.
    Cursor:
        Invisible while playing.
        Default when paused.
        Pointer when editing.
    Notes:
        Does not need to be run on a server.
        FPS counter and game status indicator in top left corner.
Enjoy!
