
import { InlineCode } from "@/once-ui/components";

const person = {
    firstName: 'Franck',
    lastName:  'Kengne',
    get name() {
        return `${this.firstName} ${this.lastName}`;
    },
    role:      'Principal Cloud & DevSecOps Architect | Entrepreneur',
    avatar:    '/images/avatar.jpg',
    location:  'America/New_York',
    languages: ['English', 'Spanish', 'German']
}

const newsletter = {
    display: true,
    title: <>Subscribe to {person.firstName}'s Newsletter</>,
    description: <>Principal-level technical content on FedRAMP automation, Azure GCC High, AKS hardening, Platform One, and DoD cloud architecture — with real code.</>
}

const social = [
    {
        name: 'GitHub',
        icon: 'github',
        link: 'https://github.com/cloudcwfranck',
    },
    {
        name: 'LinkedIn',
        icon: 'linkedin',
        link: 'https://www.linkedin.com/in/franck-kengne-cloud-advocate-0822a6233/',
    },
    {
        name: 'X',
        icon: 'x',
        link: 'https://x.com/cloudcwfranck',
    },
    {
        name: 'Email',
        icon: 'email',
        link: 'mailto:frakengne5991@gmail.com',
    },
]

const home = {
    label: 'Home',
    title: `Franck Kengne | Principal Cloud & DevSecOps Architect`,
    description: `Principal Cloud & DevSecOps Architect. FedRAMP automation, Azure Landing Zones, AKS, Platform One, DoD IL4/IL5. Automation-first. Code-first.`,
    headline: <>Principal Cloud & DevSecOps Architect</>,
    subline: <>Where principal engineers come to automate commercial and government cloud.<br/>Building <InlineCode>Civedra</InlineCode>, <InlineCode>Amakili</InlineCode>, and <InlineCode>Kelly Research</InlineCode>.</>
}

const about = {
    label: 'About',
    title: 'About me',
    description: `Meet ${person.name}, ${person.role} from ${person.location}`,
    tableOfContent: {
        display: true,
        subItems: false
    },
    avatar: {
        display: true
    },
    calendar: {
        display: true,
        link: 'https://cal.com/cloudcraftwithfranck'
    },
    intro: {
        display: true,
        title: 'Introduction',
        description: <>I am a 6X Azure and 4X AWS certified and US-based Cloud Advocate with a passion for transforming complex cloud challenges into simple, and straightforward solutions. My work spans cloud challenges, problem solving, and critical thinking as well as interviews tips in cloud technology.</>
    },
    work: {
        display: true, // set to false to hide this section
        title: 'Work Experience',
        experiences: [
            {
                company: 'CSE',
                timeframe: '2023 - Present',
                role: 'Senior Azure Cloud Engineer',
                achievements: [
                    <>Advanced experience with Docker for containerization, optimizing microservices deployments with fully automated CI/CD pipelines through Azure DevOps for seamless application delivery.</>,
                    <>Specialized in architecting and managing Microsoft PowerApps solutions in enterprise Azure environments, integrating custom APIs, automation workflows, and complex logic apps.</>
                ],
                images: [ // optional: leave the array empty if you don't want to display images
                    {
                        src: '/images/projects/project-01/cover-18.jpg',
                        alt: 'CSE Project',
                        width: 16,
                        height: 9
                    }
                ]
            },
            {
                company: 'The OpenNMS Group',
                timeframe: '2022 - 2023',
                role: 'Senior IT Operations Engineer',
                achievements: [
                    <>Expert in deploying and managing AWS cloud solutions, leveraging EC2, S3, VPC, and IAM for scalable, secure, and cost-effective cloud operations</>,
                    <>Proficient in Infrastructure as Code (IaC) using Terraform, automating infrastructure provisioning and configuration for both on-premises and cloud environments.</>
                ],
                images: [ // optional: leave the array empty if you don't want to display images
                    {
                        src: '/images/projects/project-01/cover-17.jpg',
                        alt: 'OpenNMS Project',
                        width: 16,
                        height: 9
                    }
                ]
            }
        ]
    },
    studies: {
        display: true, // set to false to hide this section
        title: 'Studies',
        institutions: [
            {
                name: 'University of Maryland Global Campus',
                description: <>Studied software engineering and cybersecurity.</>,
            },
            {
                name: 'Rowan College Burlington Count',
                description: <>Studied information insurance and cybersecurity.</>,
            }
        ]
    },
    technical: {
        display: true, // set to false to hide this section
        title: 'Technical skills',
        skills: [
            {
                title: 'Personal Deployments',
                description: <>Able to configure, deploy, and manage any service to cloud.</>,
                // optional: leave the array empty if you don't want to display images
                images: [
                    {
                        src: '/images/projects/project-01/cover-01.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },
                    {
                        src: '/images/projects/project-01/cover-02.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },
                    {
                        src: '/images/projects/project-01/cover-03.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },
                    {
                        src: '/images/projects/project-01/cover-04.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },
                ]
            },
            {
                title: 'Certifications',
                description: <>Proven skills through Certifications.</>,
                // optional: leave the array empty if you don't want to display images
                images: [
                    {
                        src: '/images/projects/project-01/badge-04.jpg',
                        alt: 'Certification image',
                        width: 16,
                        height: 9
                    },
                    {
                        src: '/images/projects/project-01/badge-03.jpg',
                        alt: 'Certification image',
                        width: 16,
                        height: 9
                    },
                    {
                        src: '/images/projects/project-01/badge-02.jpg',
                        alt: 'Certification image',
                        width: 16,
                        height: 9
                    },
                    {
                        src: '/images/projects/project-01/badge-01.jpg',
                        alt: 'Certification image',
                        width: 16,
                        height: 9
                    },
                    {
                        src: '/images/projects/project-01/badge-05.jpg',
                        alt: 'Certification image',
                        width: 16,
                        height: 9
                    },
                    {
                        src: '/images/projects/project-01/badge-06.jpg',
                        alt: 'Certification image',
                        width: 16,
                        height: 9
                    },
                    {
                        src: '/images/projects/project-01/badge-07.jpg',
                        alt: 'Certification image',
                        width: 16,
                        height: 9
                    },
                    {
                        src: '/images/projects/project-01/badge-08.jpg',
                        alt: 'Certification image',
                        width: 16,
                        height: 9
                    },
                    {
                        src: '/images/projects/project-01/badge-09.jpg',
                        alt: 'Certification image',
                        width: 16,
                        height: 9
                    },
                    {
                        src: '/images/projects/project-01/badge-10.jpg',
                        alt: 'Certification image',
                        width: 16,
                        height: 9
                    },
                    {
                        src: '/images/projects/project-01/badge-11.jpg',
                        alt: 'Certification image',
                        width: 16,
                        height: 9
                    },
                    {
                        src: '/images/projects/project-01/badge-12.jpg',
                        alt: 'Certification image',
                        width: 16,
                        height: 9
                    },
                    {
                        src: '/images/projects/project-01/badge-13.jpg',
                        alt: 'Certification image',
                        width: 16,
                        height: 9
                    },
                    {
                        src: '/images/projects/project-01/badge-14.jpg',
                        alt: 'Certification image',
                        width: 16,
                        height: 9
                    },              
                ]
            }
        ]
    }
}

const blog = {
    label: 'Blog',
    title: 'Technical Blog — GovCloud Automation & DevSecOps',
    description: `Principal-level technical writing on FedRAMP automation, Azure GCC High, AKS hardening, Platform One, Bicep IaC, NIST 800-53, and DoD cloud architecture. Code included.`
}

const work = {
    label: 'Work',
    title: 'My projects',
    description: `Design and dev projects by ${person.name}`
    // Create new project pages by adding a new .mdx file to app/blog/posts
    // All projects will be listed on the /home and /work routes
}

const gallery = {
    label: 'Gallery',
    title: 'My photo gallery',
    description: `A photo collection by ${person.name}`,
    // Images from https://pexels.com
    images: [
        { 
            src: '/images/gallery/img-01.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-02.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-03.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-04.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-05.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-06.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-07.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-08.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-09.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-10.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-11.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-12.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-13.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-14.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
    ]

}


export { person, social, newsletter, home, about, blog, work, gallery };
