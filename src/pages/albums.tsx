import Link from "next/link";


function MusicPage() {
    return (
        <>
            <p className='caption'>
                <Link href='/'>Ryan Andersen</Link> /
            </p>
            <span className='subtitle'>
                Albums
            </span>
            <hr/>
        </>
    )
}

export default MusicPage;