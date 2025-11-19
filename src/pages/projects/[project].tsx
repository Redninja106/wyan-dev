import { useRouter } from 'next/router'
import type { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from 'next'
import { Project } from '../projects'
import { marked } from 'marked';
import { promises as fs } from 'fs'
import Link from 'next/link';

export const getStaticPaths = (async () => {
    const projects = await fs.readdir('./data/projects', 'utf8')
    return {
        paths: projects.map((p) => {
            return { params: { project: p } }
        }),
        fallback: false,
    }
}) satisfies GetStaticPaths

export const getStaticProps = (async (context) => {
    const projectName = context.params!.project as string;

    const projectJson = await fs.readFile(`./data/projects/${projectName}/project.json`, 'utf8')
    const projectMarkdown = await fs.readFile(`./data/projects/${projectName}/project.md`, 'utf8')

    return {
        props: {
            name: projectName,
            project: JSON.parse(projectJson),
            content: await marked.parse(projectMarkdown) 
        }
    }
}) satisfies GetStaticProps<{ name: string, project: Project, content: string }>

function ProjectPage({ project, content }: InferGetStaticPropsType<typeof getStaticProps>) {
    const router = useRouter()
    return (
        <div>
            <p className='caption'>
                <Link href='/'>Ryan Andersen</Link> / <Link href='/projects'>Projects</Link> /
            </p>
            <span className='subtitle'>
                {project.title}
            </span>
            <hr />
            <span className='caption'>
                <span className='caption'>{project.date}</span> // <Link href={project.repositoryUrl} className='caption'>View project source</Link>
            </span>
            <div className='markdown-content' dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>
    )
}
export default ProjectPage;