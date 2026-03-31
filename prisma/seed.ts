import { PrismaClient, ExperienceLevel, BudgetType, JobStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding Jobs...');

  // Using 'any' for the array or defining the specific Prisma JobCreateInput type 
  // ensures the compiler accepts the structure while utilizing your specific IDs.
  const jobs: any[] =[
  {
    "title": "Lead Product Manager for AI-Driven EdTech Platform",
    "description": "We are seeking a visionary Product Manager to lead the development of our personalized learning path feature. You will work at the intersection of pedagogy and AI, defining user stories for an adaptive engine that adjusts curriculum based on student performance. Responsibilities include conducting user interviews with educators, managing the product roadmap in Jira, and collaborating with data scientists to refine recommendation algorithms. Experience in the EdTech space and a data-backed approach to product growth are essential.",
    "budget": 5500,
    "budgetType": "FIXED",
    "category": "Digital Marketing",
    "skillsRequired": ["Product Roadmap", "Jira", "User Research", "Agile", "Market Analysis"],
    "experienceLevel": "EXPERT",
    "status": "OPEN",
    "clientId": "69b19cd04aae7a8aa4176241"
  },
  {
    "title": "Embedded Systems Engineer for IoT Smart Home Gateway",
    "description": "Seeking an engineer to develop firmware for a next-generation smart home hub. The project involves writing low-level C/C++ code for ESP32 and ARM Cortex-M microcontrollers. You will implement Zigbee and Matter protocol stacks, optimize power consumption for battery-operated sensors, and ensure secure boot and OTA (Over-the-Air) update capabilities. Familiarity with RTOS (FreeRTOS) and hardware debugging using logic analyzers is required.",
    "budget": 85,
    "budgetType": "HOURLY",
    "category": "Web Development",
    "skillsRequired": ["C++", "IoT", "Embedded Systems", "Zigbee", "Firmware"],
    "experienceLevel": "EXPERT",
    "status": "OPEN",
    "clientId": "69b1a065807ea19f00e517d5"
  },
  {
    "title": "Senior Salesforce Developer for Global CRM Customization",
    "description": "Our enterprise client needs a Salesforce expert to customize their Sales Cloud environment for a global team of 500+ users. You will be responsible for developing custom Apex classes, Lightning Web Components (LWC), and complex Flow orchestrations. The project includes integrating Salesforce with an external ERP via REST API and cleaning up technical debt in a legacy Org. Salesforce Platform Developer II certification is highly preferred.",
    "budget": 75,
    "budgetType": "HOURLY",
    "category": "Web Development",
    "skillsRequired": ["Salesforce", "Apex", "LWC", "REST API", "CRM"],
    "experienceLevel": "EXPERT",
    "status": "OPEN",
    "clientId": "69b1ac51b79cb1d1b8794630"
  },
  {
    "title": "High-Ticket Sales Closer for B2B Tech Consulting",
    "description": "We are looking for a sharp, persuasive Sales Professional to handle inbound leads for our high-ticket software consulting packages. You will be responsible for conducting discovery calls, delivering tailored presentations, and closing deals ranging from $10k to $50k. You must have a proven track record in consultative selling, excellent objection-handling skills, and experience using HubSpot CRM to manage your pipeline. This role is perfect for a high-energy closer who thrives on commission-based structures.",
    "budget": 3000,
    "budgetType": "FIXED",
    "category": "Digital Marketing",
    "skillsRequired": ["Sales", "B2B", "Negotiation", "HubSpot", "Public Speaking"],
    "experienceLevel": "INTERMEDIATE",
    "status": "OPEN",
    "clientId": "69b1b24d1b02cfe82ac77432"
  },
  {
    "title": "Golang Backend Developer for High-Throughput Microservices",
    "description": "Seeking a backend specialist to join our core infrastructure team. We are building a real-time bidding engine that processes over 100k requests per second. You will write highly optimized Go code, utilize gRPC for inter-service communication, and manage state using Redis and Apache Kafka. Deep understanding of concurrency patterns (goroutines/channels) and memory management in Go is required for this performance-critical role.",
    "budget": 110,
    "budgetType": "HOURLY",
    "category": "Web Development",
    "skillsRequired": ["Golang", "gRPC", "Kafka", "Redis", "Microservices"],
    "experienceLevel": "EXPERT",
    "status": "OPEN",
    "clientId": "69b5877d47324130217ea065"
  },
  {
    "title": "Human Resources Consultant for Startup Culture & Hiring",
    "description": "A Series A startup needs an HR Consultant to build their people operations from scratch. You will draft the employee handbook, define the hiring process, and lead the recruitment for five key engineering roles. Additionally, you will advise the founders on competitive salary benchmarking and equity distribution (ESOP). The ideal candidate has experience scaling tech startups from 10 to 50 employees while maintaining a strong, inclusive company culture.",
    "budget": 2500,
    "budgetType": "FIXED",
    "category": "Digital Marketing",
    "skillsRequired": ["HR Strategy", "Recruiting", "Employee Relations", "Startup Operations", "Policy Writing"],
    "experienceLevel": "INTERMEDIATE",
    "status": "OPEN",
    "clientId": "69b592562f87b22e14702518"
  },
  {
    "title": "Professional Book Cover Designer for Sci-Fi Novel Series",
    "description": "Looking for an elite digital illustrator/designer to create three book covers for an upcoming space opera trilogy. You must be able to create epic, cinematic scenes featuring futuristic starships and alien landscapes. The project requires custom illustration, professional typography for the titles, and print-ready files for both Amazon KDP (Paperback/Hardcover) and Audible. A portfolio showing high-end genre fiction covers is a prerequisite.",
    "budget": 2000,
    "budgetType": "FIXED",
    "category": "Graphic Design",
    "skillsRequired": ["Digital Illustration", "Typography", "Adobe Photoshop", "Print Design", "Concept Art"],
    "experienceLevel": "EXPERT",
    "status": "OPEN",
    "clientId": "69b592cc2f87b22e1470251a"
  },
  {
    "title": "Lead QA Automation Engineer for Financial Portal (Cypress)",
    "description": "We need a QA leader to establish an automated testing framework for our banking web portal. You will be responsible for writing end-to-end (E2E) tests using Cypress and TypeScript, integrating them into our CircleCI pipeline, and performing load testing to ensure stability during peak traffic. You will also manage a small team of manual testers, guiding them on how to write effective bug reports and regression test cases.",
    "budget": 65,
    "budgetType": "HOURLY",
    "category": "Web Development",
    "skillsRequired": ["Cypress", "TypeScript", "Automation", "Load Testing", "QA Strategy"],
    "experienceLevel": "EXPERT",
    "status": "OPEN",
    "clientId": "69b6d9c6b7cceb3514e24504"
  },
  {
    "title": "Video Content Creator for Tech Review YouTube Channel",
    "description": "Seeking a charismatic and tech-savvy individual to host and produce 2 videos per week for a growing YouTube channel. You will research the latest gadgets, write engaging scripts, film high-quality 4K footage in your own studio setup, and perform basic editing. We provide the products; you provide the personality and production. You must have a deep understanding of YouTube SEO and how to create 'clickable' thumbnails and titles.",
    "budget": 40,
    "budgetType": "HOURLY",
    "category": "Graphic Design",
    "skillsRequired": ["Video Production", "YouTube SEO", "Scriptwriting", "Public Speaking", "Video Editing"],
    "experienceLevel": "INTERMEDIATE",
    "status": "OPEN",
    "clientId": "69b6d9d6b7cceb3514e24506"
  },
  {
    "title": "Unity 3D Developer for VR Training Simulation",
    "description": "Develop an immersive VR training simulation for industrial safety protocols using Unity 3D and the Oculus SDK. The project involves creating interactive 3D environments where users can practice handling hazardous materials in a risk-free virtual space. You will implement realistic physics interactions, spatial audio, and a performance-optimized UI for the Quest 3 headset. Experience with C# and VR design patterns is mandatory.",
    "budget": 4800,
    "budgetType": "FIXED",
    "category": "Mobile Development",
    "skillsRequired": ["Unity 3D", "C#", "Virtual Reality", "Oculus SDK", "3D Interaction"],
    "experienceLevel": "EXPERT",
    "status": "OPEN",
    "clientId": "69b6d9e4b7cceb3514e24508"
  }
]

  // 3. Bulk Insert
  // Note: createMany is supported in MongoDB starting from Prisma 4.5.0+
  const result = await prisma.job.createMany({
    data: jobs,
  });

  console.log(`✅ Successfully seeded ${result.count} jobs.`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding jobs:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });