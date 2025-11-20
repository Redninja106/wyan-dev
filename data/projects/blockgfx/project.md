
<p class='caption'>
Note: This is one of my oldest graphics projects, check out my more recent experiements with these ideas <a href='/projects/blockgame'>here</a>
</p>
Experiments with voxel worlds & lighting techniques using C# & Direct3D 11. Each branch is a different experiment:

# A Starting Point

The master branch is a basic unlit voxel world. Includes a basic first person character controller and block breaking/placing. It serves as a nice starting point for other experiments.

![image](https://github.com/Redninja106/BlockGFX/assets/45476006/f1024264-98ff-4b98-91f9-b29c60588b88)

# Branch: deferred

[branch source](https://github.com/Redninja106/BlockGFX/tree/deferred)

The first thing I did was switch to a deferred renderer. I didn't end up doing much with this as I had more interesting ideas (and I wasn't interested in implementing shadow mapping for this project).

![image](https://github.com/Redninja106/BlockGFX/assets/45476006/51989ce4-5ffa-459c-94d3-af016b72e011)

# Branch: raycast-lighting

[branch source](https://github.com/Redninja106/BlockGFX/tree/raycast-lighting)

This branch is some tinkering with path-traced world-space global illumination.

I decided to compute the lighting at the same resolution as the world textures (1/16th the size of a voxel). Each face in a 16^3 voxel chunk is assigned an ID, starting at 0. Each vertex in the face has this ID as an attribute. 

Next, a texture is created to hold the irradiance for the mesh with 16x16 sections such that they can be indexed by the face ID. Then the face information (position, basis, and texture coordinates) is uploaded to a buffer that can be indexed by the face ID. Voxel traversal based off of [this paper](http://www.cs.yorku.ca/~amana/research/grid.pdf). A compute shader samples rays for each pixel in the irradiance texture. I also do some other small optimizations such as ray-box intersection to cull entire chunks.

Next, the chunk's mesh is rendered, and the world-space irradiance is sampled from the texture. The result is (albiet noisy and slow) path traced lighting!

![image](https://github.com/Redninja106/BlockGFX/assets/45476006/9fad9167-fa3b-47a1-99d9-857a9bc973ac)

It's noisy (even at 1000 samples) and very, very slow (about 20 fps). It has to compute 1000 samples for every pixel on every face of every visible block. That's alot.

![image](https://github.com/Redninja106/BlockGFX/assets/45476006/307156a5-9801-463d-a81c-b701c3a19681)

I started brainstorming how to optimize with the goal of running a reasonable real-time speed (>30fps). 

I realized: I'm doing 1000 samples on every pixel in the scene, even for the ones behind camera. These samples have no direct effect on the final image, so what if there was a way to skip them? This led to the idea of using the face texture's alpha channel as a visibily "flag" (ie 1=visible, 0=not visible). If I render the chunk and just set the alpha to 1 from the fragment shader, only the visible pixels will be set. Then I can just skip sampling rays if the alpha is 0.

Once the conceptual stuff was worked out, the implementation came quick. I had to work out a few details (for example a depth prepass was required), but the final product ran at ~50FPS! That's over twice as fast as before!

The next thing I added was light accumulation on the face texture. This was *very* easy to implement, being just a weighted average between this frame's color and the last frame's color. This had astounding results. Since all the lighting was being calculated in world space, It accumulated regardless of camera movement. Any noise vanished after only a few frames and only was invalidated when a block changed. On top of this I was able to reduce the sample count reduced by a factor of 5 (down to 200 samples). Now I was getting ~200 FPS!

![image](https://github.com/Redninja106/BlockGFX/assets/45476006/ed73971b-1d85-46db-8aff-0b0d7285a82e)

There's so much more that could be done here:
- Ray bounces could be skipped entirely if rays use the accumulated light in the face texture.
- The face texture needs a different layout, since the current one fails if there's more than 1024 faces in a chunk (1024*16 = 16384, which is the max texture width in d3d11).
- Other random crashes and problems

# Branch: partial-raycast-lighting

[branch source](https://github.com/Redninja106/BlockGFX/tree/partial-raycast-lighting)

I wanted to see what I could do with raytracing using a more conventional rendering approach, so I made went back to the deferred renderer.

The first thing I do is use a raycast per pixel to add hard shadows. This is really simple to implement (just shoot a ray in the direction of the sun, if it hits anything the pixel is in shadow):

![image](https://github.com/Redninja106/BlockGFX/assets/45476006/e3281e18-3390-472f-8ab3-2c197fb7c0db)

Afterwards I started to run out of ideas for things to do with this approach. I couldn't come up with anything that looked better than the full path traced version.

So I decided to try to add back multiple chunks (i had been doing everything ray tracing related to on one chunk at this point). 

This came with its own set of challenges: now all the code had to account for stuff being across chunk borders. I had commented out enough lighting features such that the only resource that needed to be accessed across chunks was the actual voxel data, which is uploaded to the GPU as a 3D texture. Using multiple textures was impractical, since I wanted to be able to render hundreds of chunks, and you can't bind that many textures at once.

So it seemed there is only option: to keep a really big 3D texture, and copy chunks into sections of it as needed. This probably would've worked but as I researching my options I stumble upon a lesser-used Direct3D 11 feature: tiled resources. 

Tiled resources are not a complicated feature: just create a huge resource and set a flag indicating it's a tiled resource. The resource isn't mapped to physical memory (thus not taking up space in VRAM) and you can make api calls to map chunks of it (usually 64kb) to a buffer. I thought this would be an interesting approach so started messing around with the API until I felt I understood things. Then I got started on actually making it work. I allocate an *outrageously* huge 3D texture (2048^3 float4, that's 64 terabytes), and a more reasonably sized buffer to map the resource to. Some modifications to the shader code to account for the chunk not starting at the origin and voila! 

![image](https://github.com/Redninja106/BlockGFX/assets/45476006/3421f486-2db3-4bdf-9532-c50d055b69e6)

With this approach, recentering the player is just updating some tile mappings. Without it, I'd have to move hundreds of 16kb chunks around in a texture (and reupload the whole thing each time).

My last experiment was casting rays to for reflections. Another simple one, all I needed to do is reflect the vector from the camera to the pixel across its normal. Easy reflections!

![image](https://github.com/Redninja106/BlockGFX/assets/45476006/e79424f9-1ca5-40d7-9201-d12bd9cabf65)

