import { useRouter } from 'next/router'
import type { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from 'next'
import { Project, formatDurationString } from '../projects'
import { promises as fs } from 'fs'
import Link from 'next/link';
import { useEffect } from 'react';
import markdownit from 'markdown-it';
import Shiki from '@shikijs/markdown-it'

const md = markdownit({
    html: true,
})

md.use(await Shiki({
    theme: "dark-plus",
    langs: [
        "c#",
        "c",
        "c++",
        "glsl",
        "hlsl",
        "json"
    ]
}))

export const getStaticPaths = (async () => {
    const projects = await fs.readdir('./data/projects', 'utf8')
    return {
        paths: projects.map((p) => {
            return { params: { project: p } }
        }),
        fallback: false,
    }
}) satisfies GetStaticPaths

function wordCountFromHtml(html: string) {
  html = html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, "");
  let text = html.replace(/<[^>]+>/g, " ");
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
  text = text.trim().replace(/\s+/g, " ");
  return text ? text.split(" ").length : 0;
}

export const getStaticProps = (async (context) => {
    const projectName = context.params!.project as string;

    const projectJson = await fs.readFile(`./data/projects/${projectName}/project.json`, 'utf8')
    const projectMarkdown = await fs.readFile(`./data/projects/${projectName}/project.md`, 'utf8')

    const pageContent = md.render(projectMarkdown)
    return {
        props: {
            name: projectName,
            project: JSON.parse(projectJson),
            content: pageContent,
            wordCount: wordCountFromHtml(pageContent)
        }
    }
}) satisfies GetStaticProps<{ name: string, project: Project, content: string }>

function ProjectPage({ project, content, wordCount }: InferGetStaticPropsType<typeof getStaticProps>) {
    const router = useRouter()
    useEffect(() => {
        document.title = `${project.title} - Ryan Andersen`
    })

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
                <span className='caption'>{Math.ceil(wordCount/250)} min read</span> // <span className='caption'>{formatDurationString(project)}</span> // <Link href={project.repositoryUrl} className='caption'>View project source</Link>
            </span>
            <div className='markdown-content' dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>
    )
}
export default ProjectPage;