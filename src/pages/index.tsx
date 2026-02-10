import Link from 'next/link'
import { useEffect } from 'react';

function Gallery() {
    return (
        <div className='gallery'>
            <div className='track'>
                
                <a href="/projects/blockgame"><img src='blockgame/thumbnail.png'/></a>
                <a href="/projects/spacerts"><img src='spacerts/thumbnail.png'/></a>
                <a href="/projects/blockgame"><img src='blockgame/cave.png'/></a>
                <a href="/projects/blockgame"><img src='blockgame/ores.png'/></a>
                <a href="/projects/spacerts"><img src='spacerts/saturn.png'/></a>
                <a href="/projects/spacerts"><img src='spacerts/jupiter.png'/></a>

                <a href="/projects/blockgame"><img src='blockgame/thumbnail.png'/></a>
                <a href="/projects/spacerts"><img src='spacerts/thumbnail.png'/></a>
                <a href="/projects/blockgame"><img src='blockgame/cave.png'/></a>
                <a href="/projects/blockgame"><img src='blockgame/ores.png'/></a>
                <a href="/projects/spacerts"><img src='spacerts/saturn.png'/></a>
                <a href="/projects/spacerts"><img src='spacerts/jupiter.png'/></a>

            </div>
        </div>
    )
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
            Computer graphics, compilers, game engines, and every other kind of programming from Long Island, NY.
            </p>
            <p>
            <b><Link href='/projects'>Check out my projects</Link></b>
            <span> or </span>
            <b><Link href='/resume'>Read my resume</Link></b>
            </p>
        </div> 
    )
}

export default Home;