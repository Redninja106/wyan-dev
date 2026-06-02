import Link from 'next/link'
import { useEffect } from 'react';

function GalleryImage(key: number, src: string, href: string, name: string) {
    return (
        <a className='gallery-box' href={href} key={key}>
            <img src={src} />
            <span className='gallery-caption caption'>{name}</span>
        </a>
    )
}

function Gallery() {
    const items = [
        { src: '/projects/blockgame/thumbnail.png', href: '/projects/blockgame', title: 'BlockGame' },
        { src: '/projects/spacerts/thumbnail.png', href: '/projects/spacerts', title: 'SpaceRTS' },
        { src: '/projects/blockgame/cave.png', href: '/projects/blockgame', title: 'BlockGame' },
        { src: '/projects/spacerts/saturn.png', href: '/projects/spacerts', title: 'SpaceRTS' },
        { src: '/projects/blockgame/ores.png', href: '/projects/blockgame', title: 'BlockGame' },
        { src: '/projects/spacerts/jupiter.png', href: '/projects/spacerts', title: 'SpaceRTS' },
    ];

    const loopItems = [...items, ...items];

    return (
        <div className="gallery">
            <div className="track">
                {loopItems.map((item, i) => GalleryImage(i, item.src, item.href, item.title))}
            </div>
        </div>
    );
}

function Home() {
    useEffect(() => {
        document.title = "Home - Ryan Andersen"
    });
    
    return (
        <div className="main-page-content">
            <div className='title'>
                Ryan Andersen
            </div>
            <hr/>
            <Gallery></Gallery>
            <p>
                Computer graphics, compilers, and game engines from Long Island, NY.
            </p>
            <p>
                <b><Link href='/projects'>Check out my projects</Link></b>
                <span>, </span>
                <b><Link href='/articles'>read my articles</Link></b>
                <span>, or </span>
                <b><Link href='/resume'>view my resume</Link></b>.
            </p>
            <p className='featured'>
                Featured: 
                <br/>
                - <Link href='/articles/simulationframework_shader'>Compiling C# to HLSL</Link> <span className='caption'>(Programmable Shaders in SimulationFramework)</span>
                <br/>
                - <Link href='/projects/blockgame'>Block Game</Link> <span className='caption'>(Voxel renderer with path-traced global illumination and irradiance caching)</span>
                <br/>
                - <Link href='/articles/spaceexplorationgame'>SpaceExplorationGame</Link> <span className='caption'>(1:1 scale physically based planet rendering with atmospheres and clouds)</span>
                <br/>
                - <Link href='/projects/spacerts'>SpaceRTS</Link> <span className='caption'>(deterministic multiplayer RTS engine)</span>
            </p>
        </div> 
    )
}

export default Home;