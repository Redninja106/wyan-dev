import Link from 'next/link'
import { promises as fs } from 'fs'
import type { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from 'next'

export interface Project {
    name: string
    title: string
    description: string
    date: string
    repositoryUrl: string
    thumbnailUrl: string
}

function ProjectWidget(project: Project) {
    return (
        <div key={project.title}>
            <Link href={`projects/${project.name}`} className='project-widget-link'>
                <div className='project-widget'>
                    <img className='project-widget-thumbnail' src={project.thumbnailUrl}/>
                    <div>
                        <span className='project-widget-title'>{project.title}</span>
                        <span className='project-widget-date'>{project.date}</span>
                        <br/>
                        <span className='project-widget-description'>{project.description}</span>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export const getStaticProps = (async (context) => {
    const projectNames = await fs.readdir('./data/projects', 'utf8')
    const projects = [];
    for (const name of projectNames) {
        const json = await fs.readFile(`./data/projects/${name}/project.json`, 'utf8')
        const project = JSON.parse(json)
        project.name = name
        projects.push(project)
    }
    projects.sort((a, b) => {
        const dateA = Date.parse(a.date)
        const dateB = Date.parse(b.date)
        return -(dateA - dateB)
    })
    return {
        props: {
            projects: projects
        }
    }
}) satisfies GetStaticProps<{ projects: Project[] }>


function ProjectsPage({ projects }: InferGetStaticPropsType<typeof getStaticProps>) {
    const widgets = projects.map(ProjectWidget)
    return (
        <div>
            <p className='caption'>
                <Link href='/'>Ryan Andersen</Link> /
            </p>
            <span className='subtitle'>
                Projects 
            </span>
            <hr/>
            {widgets}
        </div>
    )
}

export default ProjectsPage;