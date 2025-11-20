import Link from 'next/link'

function Home() {
    return (
        <div>
            <div className='title'>
                Ryan Andersen
            </div>
            <hr/>
            <p>
            Computer graphics, compilers, game engines, and every other kind of programming from Long Island, NY.
            </p>
            <p>
            <Link href='/projects'>Check out my projects</Link>
            <span> or </span>
            <Link href='/resume'>Read my resume</Link>
            </p>
            <p>
            My links:
            </p>
            <ul>
                <li><Link href='https://github.com/Redninja106'>GitHub</Link></li>
                <li><Link href='https://www.linkedin.com/in/ryan-andersen1/'>LinkedIn</Link></li>
            </ul>
        </div>
    )
}

export default Home;