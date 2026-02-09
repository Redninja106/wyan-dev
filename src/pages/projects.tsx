import Link from 'next/link'
import { promises as fs } from 'fs'
import type { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from 'next'
import { useEffect, useState } from 'react'

export interface Project {
    name: string
    title: string
    description: string
    startDate: string
    stopDate: string
    repositoryUrl: string
    thumbnailUrl: string
    priority: number
    tags: string[]
}

const allTags = ["Articles", "C#", "C/C++", "Shaders", "Graphics", "Voxels", "Compilers", "Game Development", "Game Engines"]
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function formatDurationString(project: Project, short: boolean = false): string {
    let start = project.startDate.split("/").map(x => parseInt(x))
    var stop = project.stopDate.split("/").map(x => parseInt(x))
    
    let isOngoing = project.stopDate.toLowerCase() == "present"
    if (isOngoing) {
        let date = new Date()
        stop = [date.getMonth(), date.getFullYear() - 2000]
    }
    
    let startMonth = (start[0] - 1) + (start[1] * 12);
    let stopMonth = (stop[0] - 1) + (stop[1] * 12);
    let durationTotalMonth = stopMonth - startMonth + 1; // +1 to include both ends

    let durationMonths = durationTotalMonth % 12;
    let durationYears = Math.floor(durationTotalMonth / 12);

    let startDate = `${months[start[0] - 1]} '${start[1]}`
    let stopDate = isOngoing ? "Present" : `${months[stop[0] - 1]} '${stop[1]}`

    if (short) {
        if (durationMonths == 1) {
            return `${startDate}`
        }
        return `${startDate} - ${stopDate}`
    } else {
        if (durationYears == 0) {
            if (durationMonths == 1) {
                return `${startDate} // ${durationMonths} month`
            }
            return `${startDate} - ${stopDate} // ${durationMonths} months`
        }
        return `${startDate} - ${stopDate} // ${durationYears} year${durationYears > 1 ? "s" : ""} ${durationMonths} month${durationMonths > 1 ? "s" : ""}`
    }
}

function formatTags(array: string[]) {
    var result = array[0]
    for (var i = 1; i < array.length; i++) {
        result += ", " + array[i];
    }
    return result
}

function ProjectWidget(project: Project) {
    return (
        <div key={project.title}>
            <Link href={`projects/${project.name}`} className='project-widget-link'>
                <div className='project-widget'>
                    <img className='project-widget-thumbnail' src={project.thumbnailUrl}/>
                    <div className='project-widget-text-container'>
                        <span className='project-widget-title'>{project.title}</span>
                        <span className='project-widget-date'>{formatDurationString(project, true)}</span>
                        <br/>
                        <span className='project-widget-description'>{project.description}</span>
                    </div>
                    <span className='caption project-widget-tags'>{formatTags(project.tags)}</span>
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
    projects.sort((a: Project, b: Project) => {
        return -(a.priority - b.priority)
    })
    return {
        props: {
            projects: projects
        }
    }
}) satisfies GetStaticProps<{ projects: Project[] }>

function TagButton(tag: string, filter: string|null, setFilter: (x: string|null) => void) {
    const onclick = function() {
        if (filter === tag) {
            setFilter(null)
            
        } else {
            setFilter(tag)
        }
    }
    
    return (
        <div key={tag}>
            <button className={`tag-button ${tag == filter ? "active-filter" : ""}`} onClick={onclick}>
                {tag}
            </button>
        </div>
    )
}

function ProjectsPage({ projects }: InferGetStaticPropsType<typeof getStaticProps>) {
    useEffect(() => {
        document.title = 'Projects - Ryan Andersen'
    })
    var [filter, setFilter] = useState<string|null>(null)

    const tagButtons = allTags.map((tag) => TagButton(tag, filter, (f) => setFilter(f)))

    var shownProjects = projects
    if (filter != null) {
        shownProjects = shownProjects.filter((p) => p.tags.includes(filter))
    }
    const widgets = shownProjects.map(ProjectWidget)

    return (
        <div>
            <p className='caption'>
                <Link href='/'>Ryan Andersen</Link> /
            </p>
            <span className='subtitle'>
                Projects 
            </span>
            <hr/>
            <div className='tag-button-container'> <span className='caption'>tags:</span> {tagButtons}</div>
            {widgets}
        </div>
    )
}

export default ProjectsPage;