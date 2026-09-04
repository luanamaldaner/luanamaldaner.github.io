PANORAMA BACKGROUNDS
====================

Drop four Minecraft screenshots in this folder, named EXACTLY as below.
The site picks them up automatically -- no code changes needed.

  act1_day.jpg     Cherry grove, daytime      <- the hero shot
  act1_night.jpg   Same spot at NIGHT         <- dark mode
  act2.jpg         Underground stone / cave
  act3.jpg         Lush cave (moss, glow berries, azalea)

CAPTURE SETTINGS
----------------
Resolution : 2560x1440 or wider. Bigger is better -- these are stretched
             to fill the whole browser window. Below ~1920 wide it gets soft.
Shaders    : Complementary, BSL, or SEUS. The soft bloom and lighting in your
             reference images is entirely the shader -- vanilla will not look
             like that.
Framing    : Landscape, horizon roughly a third from the top. Leave the middle
             of the frame reasonably calm -- your text panels sit there.
HUD        : Press F1 to hide the hotbar/crosshair before screenshotting.
Format     : .jpg at high quality. PNG works too, just rename the extension
             in css/minecraft-theme.css if you use it.

act1_day and act1_night should be the SAME viewpoint so the theme toggle
reads as time passing rather than teleporting somewhere else.

For act2 and act3 there is no separate night file -- the CSS cools and dims
them for dark mode, since caves look the same regardless of time of day.

Until these files exist each act falls back to a flat colour, so the layout
still works, it just is not scenic yet.
