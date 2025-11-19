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
        <embed src="/RyanAndersenResume.pdf" type="application/pdf"></embed>
        </>
    )
}

export default ResumePage;