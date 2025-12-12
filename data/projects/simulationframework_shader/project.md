About a year after I started developing SimulationFramework, someone on the discord server suggested adding programmable shaders. I thought this would be a really powerful feature (and it would be very interesting to implement) so I started looking into it. I ended up with a pretty unique and powerful solution, done in a way I haven't seen anywhere else.

## The Problems with the Usual Suspects

My first thought was to simply allow the user to provide the library some HLSL or GLSL code to run (like p5.js). However, I found this didn't align with SimulationFramework's developer-friction-free design philosophy:
- Requires the user to learn another programming language
- Binding uniforms by name is annoying
- Keeping struct definitions in sync between host and shader code is annoying
- IDE support in shaders is not very good
- Not cross-platform (without bringing in a dependency on a shader cross-compiler)

# C#

After evaluating a few options I realized only one language checked every box: C#! 
- The user already programming in C#
- It's cross-platform and has great IDE support
- everything being the same language means that:
    - uniforms can be set directly
    - struct definitions don't need to be duplicated. 
    
Sounds great! except, there are no graphics APIs that accept C# as a shader language. So, like anyone else would in this situation, I wrote my own compiler.

## The Plan

The problem was simple: convert C# to GLSL shader code to run on the GPU. The solution however, was not.

First, I had to decide between compile-time and runtime compilation. I found compile-time projects involved a lot of build system or source generator trickery. I didn't want to wrestle with that, and I especially didn't want to force any of that wrestling upon the user. Also, a lot of its benefits (ie skipping compile times at startup) didn't really matter in the context of SimulationFramework, which is meant for small quickly-built prototypes. Runtime compilation would give me full control over the compilation process, allowing me to ensure the user didn't have to deal with managing shaders or build systems.

Next I had to figure out how to actually retrieve the user's code. At first I looked into `System.Linq.Expressions`'s expression capturing, but found that only worked for lambdas with a single line. I ultimately decided on `MethodBody.GetILAsByteArray` for a few reasons:
- Simple code from libraries can be included in shaders
- I avoided needing to parse anything
- I got support for some high level language features (ie switch expressions) for free

## Compiling a Method
### Disassembly

First, the IL byte array from `MethodBody.GetILAsByteArray` is disassembled into a stream CIL instructions. This was pretty simple to implement since CIL has a relatively simple format and there are a ton of good resources online about it.

### Control Flow Reconstruction

The next step is the most complicated step of the whole process. The problem is that in CIL essentially only has gotos (`br` and related instructions) while shading languages only have high-level control flow and *explicitly do not include gotos*. My compiler problem had turned into a decompiler problem! I solved this by doing a little control flow recontruction:
- The CIL is broken into basic blocks (sections with linear control flow), creating a control flow graph
- Return blocks (nodes that point to the end of the method) are marked as such
- Loops (any node that dominates its predecessor) are replaced with a loop subgraph, consisting of all nodes between the head and tail of the loop. Continue and break statements are nodes that point to the head and tail node of the loop, respectively. Then, control flow is recontructed recursively inside the loop (to allow nesting).
- Conditional statements are any node with more than one predecessor. They are replaced with a conditional subgraph, consisting of every node between the original node and point where the program flow reconverges. The same recursive reconstruction applied to loops is then done here. 

By the end of this process, all loops are in a standard form and all conditional statements are one of two standard forms (if-style or if-else style). 

#### Debugging Control Flow Graphs

Some of the control flow algorithms came to be pretty complicated and hard to debug. So I added the ability to dump the shader graphs to a `.dgml` file so they could be opened in visual studio.

<!--TODO image of dgml-->

### Expression Reconstruction

The reconstructed control flow graph along with the basic blocks are then passed the the expression builder. This stage walks the graph, creating a language-agnostic shader syntax tree. It emits control flow as it visits the nodes, then reconstructs full expression from the stack-based IL. 

#### Tangent: Intrinsics & Intercepts

One problem with users writing shaders in C# is that they will want to use all of their familiar types (ex. `MathF`). In shader languages most of the functions here (ie `sqrt`, `sin`) are considered intrinsic and provided by the language. I settled on a compromise: I define a set of intrinsics for shader code, but these intrinsics can be decorated with *shader intercepts* which tells the compiler to replace any calls to the target method with a call to the decorated one.

This way, if the user uses `MathF.Sqrt`, the compiler simply resolves it to `ShaderIntrinsics.Sqrt` so the shader code emitter can map it to the `sqrt` glsl intrinsic.

This behavior is implemented in the expression builder which resolves methods as soon as `call` instructions are reached. If the method is the target of an intercept it is replaced with the intercept source method.

### Post-Processing

The post processing stage simplifies and optimizes the syntax tree before the emit stage. It does things like remove redundant variables (variables that are set & used once, often output by the C# compiler) and fix ternary expressions which can get incorrectly reconstructed from compiler optimizations.

### Shader Language Emit

The final step is to walk the shader syntax tree generated by the expression builder and convert to shader code for the target platform. This just walks the tree and emits the code as it sees it, with some special care to prefix identifiers that conflict with keywords or map intrinsic methods to their language-specific names.


<!--
TODO
- figure out the narration (first half is like a story, second half is a spec)
- discuss other aspects: the shader api, compiling uniforms, structs, etc
- show my testing examples
- add pics

- discuss incompatable features
- discuss performance

- code blocks (!?)
- 

-->