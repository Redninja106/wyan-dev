import Link from 'next/link'
import type { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from 'next'
import { useEffect, useState } from 'react'
import { Project, formatDurationString, formatTags, ProjectWidget, TagButton } from '@/common'
import { loadProjectPageInfo } from '@/server_common'

export const getStaticProps = (async (context) => {
    return {
        props: await loadProjectPageInfo('./data/articles', 'article.json')
    }
}) satisfies GetStaticProps<{ projects: Project[], tags: string[] }>

function ProjectsPage({ projects, tags }: InferGetStaticPropsType<typeof getStaticProps>) {
    useEffect(() => {
        document.title = 'Projects - Ryan Andersen'
    })
    var [filter, setFilter] = useState<string|null>(null)

    const tagButtons = tags.map((tag) => TagButton(tag, filter, (f) => setFilter(f)))

    var shownProjects = projects
    if (filter != null) {
        shownProjects = shownProjects.filter((p) => p.tags.includes(filter))
    }
    const widgets = shownProjects.map((p) => ProjectWidget(p, 'articles'))

    return (
        <div>
            <p className='caption'>
                <Link href='/'>Ryan Andersen</Link> /
            </p>
            <span className='subtitle'>
                Articles 
            </span>
            <hr/>
            <div className='tag-button-container'> <span className='caption'>tags:</span> {tagButtons}</div>
            {widgets}
        </div>
    )
}

export default ProjectsPage;