
#### Table of Contents
- [Gameplay](#gameplay)
- [Multiplayer](#multiplayer)
- [Large World](#large_worlds)
- [Serialization](#serialization)
- [Saving/Loading](#saving_loading)
- [Fog of War](#fog_of_war)
- [Shaders](#shaders)
- [GUI](#gui)
- [Building](#building)
- [Asset Pipeline](#asset_pipeline)
- [Prototypes](#prototypes)
- [Collision](#collision)

SpaceRTS is a data-driven RTS prototype I worked on over the course of 2024 and 2025.

<h2 id="gameplay">Gameplay</h2>

![gameplay](/spacerts/gameplay.png)
While most of the my time went into the game systems, I did add some basic gameplay systems:
- ships the player can move around
- certain ships can build structures
- ships that have weapons will automatically attack enemy ships

![main menu](/spacerts/mainmenu.png)
<p class='caption'>The game's main menu</p>

<h2 id="large_worlds">Large Worlds</h2>

I use double precision floats for all units, so the game supports an absolutely massive map. The current play area is 2^17 (131,072) units of all sides (for reference, the small ship is ~.5 units).

![map](/spacerts/map.png)
<p class='caption'>Each cluster here is a star system, each 1000+ units wide and with dozens of planets</p>

<h2 id="multiplayer">Multiplayer</h2>

The game supports multiplayer among a reasonable number of players. It uses deterministic lockstep, with each turn being 10 ticks and input having a 2-turn delay. This it meant once the core lockstep logic was implemented, most 

<h2 id="serialization">Serialization</h2>

<h2 id="shaders">Shaders</h2>

I wrote some shaders for game using [SimulationFramework's canvas shaders](). I'm happy with how they came out and I think they add a lot to the look and feel of the game.

<h3 id="black_hole">Black Hole</h3>

![black hole](/spacerts/blackhole.png)
<p class='caption'>You might think this black hole is sideways. Well, I say the camera is.</p>

The black hole shader uses raymarching to produce accurate lensing effects. The SDF consists only of the (perfectly cylindrical) eccretion disk, but after each step every ray's direction is distorted towards the black hole (by "gravity"), yielding a wicked looking black hole.


![black hole 2](/spacerts/blackhole2.png)
<p class='caption'>Kind of looks like M87... no? just me?</p>

Check out the black hole shader source [here](https://github.com/Redninja106/SpaceRTS/blob/sf3/SpaceGameAgain/Planets/BlackHole.cs).

<h3 id="star_shader">Star</h3>

![sun](/spacerts/sun.png)
<p class='caption'>The star shader</p>

The star shader is actually two shaders in a trechcoat: One for the star itself and another for the corona. 

The main star uses 12 layers of random noise, each having 3/4 the scale and 2/3 the brightness of the last. The noise is slightly compressed toward the edges to give it the appearance of a ball.

The corona also uses layers of random noise (5 layers), but it samples based on the angle of the vector from the center of the star to the current pixel.   

Check out the star shader source [here](https://github.com/Redninja106/SpaceRTS/blob/sf3/SpaceGameAgain/Planets/Star.cs).

<h3 id="galaxy_shader">Galaxy</h3>

The galaxy shader is again built on random noise (aren't all good shaders?). 

![galaxy](/spacerts/galaxy.png)
<p class='caption'>A long time ago in a galaxy far, far away...</p>

For each NxN world cell (size is determined by integer zoom level) the star density is calculated and used to sample a few stars.

The "stars" are generated using the cell coordinates and zoom level indexed into random noise. For each star a random temperature is generated based on real star density & brightness data, then that temperature is converted to a color. The actual star sample is just that color scaled multiplied a distance falloff.

This is done for the integer above and below the actual zoom level, then interpolated (for a smooth transition between low and high densities).

![galaxy2](/spacerts/galaxy2.png)
<p class='caption'>The galaxy's arm count, curve, shape and more can be modified. In game they are randomly generated.</p>
