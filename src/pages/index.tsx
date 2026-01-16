import Link from 'next/link'
import { useEffect } from 'react';

function Gallery() {
    return (
        <div className='gallery'>
            <div className='track'>
                
                <a href="/projects/blockgame"><img src='blockgame/thumbnail.png'/></a>
                <a href="/projects/spacerts"><img src='spacerts/thumbnail.png'/></a>
                <a href="/projects/spacerts"><img src='spacerts/gameplay.png'/></a>

                <a href="/projects/blockgame"><img src='blockgame/thumbnail.png'/></a>
                <a href="/projects/spacerts"><img src='spacerts/thumbnail.png'/></a>
                <a href="/projects/spacerts"><img src='spacerts/gameplay.png'/></a>
            
            </div>
        </div>
    )
}

function Home() {
    useEffect(() => {
        document.title = "Home - Ryan Andersen"
    });
    
    return (
        <div>
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
            <p>
            My links:
            </p>
            <ul>
                <li><Link href='https://github.com/Redninja106'>GitHub</Link></li>
                <li><Link href='https://www.linkedin.com/in/ryan-andersen1/'>LinkedIn</Link></li>
                <li><Link href='https://x.com/whos_wyan'>X/Twitter</Link></li>
            </ul>
        </div>
    )
}

export default Home;