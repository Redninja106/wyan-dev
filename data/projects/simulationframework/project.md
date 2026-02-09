
## Background

I first started teaching myself game development during 9th grade, using [Processing](https://processing.org/). As my knowledge broadened, I started exploring more technologies for my projects, such as Unity or Monogame (even writing my own game template using UWP's CoreWindow and the Win2D graphics library). While these were obviously more capable than Processing, they all had one major problem - developer friction! getting anything done was a chore: 
- The unity editor would freeze and crash. 
- Any 2D rendering in MonoGame beyond sprites was a nightmare involving vertex buffers and effects (I just want to draw a circle!).
- My own template involved a lot of fighting with UWP and working around the limitations of Win2D. 

I wanted to write cool games, but all these tools that were supposed to make it easier were getting in the way!

Developer friction is caused by a lot of things, but the main problem seemed to be that I wasn't the target audience of these tools. I was just a teenager trying to prototype fun game ideas, using tools designed for teams, shipping high-caliber games.

The more it bothered me, the more looked for alternatives, though ultimately to no avail. So, in November of 2021, SimulationFramework got its first commit (after a few false starts).

## The Pitch

SimulationFramework is a game development framework designed to minimize developer friction. This means no boilerplate and a stupid simple API, letting the developer make the important descisions. 

Here is a basic SimulationFramework program that draws a circle to the screen:

```cs
using SimulationFramework;
using SimulationFramework.Drawing;
using SimulationFramework.Input;

Start<Program>();

partial class Program : Simulation
{
    public override unsafe void OnInitialize()
    {
    }

    public override void OnRender(ICanvas canvas)
    {
        canvas.DrawCircle(canvas.Width / 2, canvas.Height / 2, 100, Color.White);
    }
}
```

## Core Features

SimulationFramework at its core provides the basic systems required to write a game (windowing, input, graphics, etc.).

### Windowing

### Graphics

### Input

## Unique features

// there are not a lot of "unique" features for core SF because it is *designed* that way
### Fixed Resolution

### 3D (other page)

### Shaders (other page)

## API Design

When designing SimulationFramework one of my biggest time sinks was making sure the code I exposed publicly reflected the design philosophy of the library. From a developer friction standpoint, how the API exposes the library's features is just as important as the features themselves. 

### Overloads

Types like `ICanvas` see a very large number of calls in all sorts of situations. Providing adequate overloads for all these situations is one of the best ways to prevent tedious code and keep the developer focused on writing their game. Things like providing a `float x, float y` overload wherever a vector is expected. These little developer time saves add up and go a long way in reducing friction.

### Consistency


## Usage in Other Projects

SimulationFramework is, by far, the most *useful* project I've written. Since its inception I've used it in dozens of my own projects and prototypes. 

### Torch (GMTK 2023)
### SpaceRTS
### Uno



