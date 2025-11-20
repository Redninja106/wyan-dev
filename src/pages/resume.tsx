import Link from "next/link";

function ResumePage() {
    return (
        <>
        <p className='caption'>
            <Link href='/'>Ryan Andersen</Link> /
        </p>
        <span className='subtitle'>
            Resume 
        </span>
        <hr/>
        <Link href="/RyanAndersenResume.pdf" download>download</Link>
        <iframe src="/RyanAndersenResume.pdf"></iframe>
        </>
    )
}

export default ResumePage;