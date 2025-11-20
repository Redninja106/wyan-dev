import Link from "next/link";
import { useEffect } from "react";

function ResumePage() {
    useEffect(() => {
        document.title = 'Resume - Ryan Andersen'
    })

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