
blockgame is a voxel game prototype with global illumination

this page is a WIP

# Overview
 
# Introduction

"BlockGame" is a project a worked on over the course of late 2025 where I experiemented with voxels and real time global illumination on a custom game engine. 
- real time global illumination
- PBR materials & reflections


Tech stack
- C#
- SDL3
- SDL_gpu
- Slang shaders


## Motivation

Like most aspiring gave developers I started this project with a whole fancy game idea. Though I eventually got pulled into the global illumination black hole and didn't escape. Diving into massive projects like this is way above my pay grade, but it's how I learned to program in the first place, so I wasn't really expected to walk away with a finished product. I was just looking for some more knowledge of the systems that would go into it. I also had done a [similar project](/projects/blockgfx) a few years before, so I also wanted to to tackle this kind of project with my since-improved programming skills.

# Project Foundation

For most of my past projects, I've either used [simulationframework](/projects/simulationframework) or the graphics api directly. I decided for this project to try something different and use SDL3 and their new SDL_gpu api. 

## Asset baking

The first rabbit-hole I went down with this project I went down was designing an asset system. It's nothing complicated, just a program that run after the game builds to process all assets into the game's build directory. It compiles shaders (and emits SDL3-compatible reflection), renders the font atlas, and coverts textures into a bitmap form for the game to read. 

## SDL


This was the first project I used SDL for, and overall I've found it to be a really well designed and convenient library. After trying out a few libraries that provided C# bindings, I found they were all either low level (raw pointers, etc) or incomplete. So I decided to write my own. I used [ClangSharp](https://github.com/dotnet/ClangSharp) to generate raw low-level C# bindings for the SDL headers and designed my own high-level idiomatic C# binding library. Ironically it joins the many incomplete ones out there. But it's accomplished what I need it for so that's alright.

## SDL GPU

The SDL GPU API was great to work with. Setting up a window and rendering context is as simple as calling `SDL_CreateWindow` and `SDL_CreateGPUDevice` (or, in my case, `new Window()` and `new Device()`).  

???

## The Voxel World

BlockGame stores voxels as 32^3 chunks. Different block attributes are stored in struct-of-arrays form, where each chunk has a bunch of arrays for each chunk attribute. The different block types are stored as objects in the `BlockRegistry` (which simply maps the block names to the actual objects). The engine supports different block models, such as solid, half (slabs), and empty (air). It also has dynamic models support voxels smaller than one block (engine supports 2x2x2 while the renderer supports 4x4x4). While there is very primitive world generation with simplex noise, I hacked together a python script reads the raw block ids from minecraft worlds using the amulet library to write them to a json file the game read.

# The Renderer

The game uses a deferred renderer to avoid casting primary rays altogether. The GBuffer layout is rather standard:
- World Position - RGBA32
- LabPBR Albedo - RGBA8
- LabPBR Normal - RGBA8
- LabPBR Specular - RGBA8
- Depth - D24S8 (stencil is unused)
The material information is stored in the LabPBR format that minecraft resource packs use. 

## Global Illumination

# Enter 

# Optimization


# References

- [ClangSharp](https://github.com/dotnet/ClangSharp)
- fast dda raytracing paper
- 2x 2020 spatial hashing papers

# Future work
 - lod blending
 - optimization
    - memory efficiency
        - hashmap size
    - greedy meshing
    - culling