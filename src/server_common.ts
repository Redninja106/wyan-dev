import { promises as fs } from "fs"
import { Project } from "./common";

export const loadProjectPageInfo = (async (path: string, jsonName: string) => {
    const projectNames = await fs.readdir(path, 'utf8')
    const projects = [];
    const tags = [];
    for (const name of projectNames) {
        const json = await fs.readFile(`${path}/${name}/${jsonName}`, 'utf8')
        const project = JSON.parse(json)
        project.name = name
        projects.push(project)
        tags.push(...project.tags)
    }
    projects.sort((a: Project, b: Project) => {
        return -(a.priority - b.priority)
    })
    return {
        projects: projects,
        tags: [...new Set(tags)]
    }
})
