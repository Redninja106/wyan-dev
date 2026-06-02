import Link from "next/link"

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
    archived: boolean|undefined
}

export interface Article extends Project {
    projectUrl: string
}

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

export function wordCountFromHtml(html: string) {
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

export function TagButton(tag: string, filter: string|null, setFilter: (x: string|null) => void) {
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
export function formatTags(array: string[]) {
    var result = array[0]
    for (var i = 1; i < array.length; i++) {
        result += ", " + array[i];
    }
    return result
}

export function ProjectWidget(project: Project, section: string) {
    return (
        <div key={project.title}>
            <Link href={`${section}/${project.name}`} className='project-widget-link'>
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