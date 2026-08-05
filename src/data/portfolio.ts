export interface Link {
	href: string;
	label: string;
}

export interface Shot {
	src: string;
	alt: string;
}

export interface Project {
	name: string;
	meta: string;
	body: string[];
	shots?: Shot[];
	links: Link[];
}

export const PROJECTS: Project[] = [
	{
		name: 'Anovi, a nutrition and meal planning app',
		meta: 'Founder & Product Engineer · End-to-end architecture, mobile, backend and release · Germany',
		body: [
			'Anovi plans meals around what someone already has, what they like, and what their nutrition targets still need. It connects pantry stock, grocery lists, recipes and nutrient gaps into a single flow, with an LLM pipeline that turns free-text meal logs into structured ingredients, and a generator that ranks recipes against several competing objectives at once.',
			'The work covered the PostgreSQL schema and FastAPI backend, the React Native app, the subscription and paywall layer, German and English localisation, and the privacy, consumer law and App Store requirements that decide whether a product in this space can launch at all.',
		],
		shots: [
			{
				src: '/media/anovi/cook-me-quick.webp',
				alt: 'Recipes ranked by pantry match, with soon-to-expire ingredients flagged',
			},
		],
		links: [{ href: 'https://www.anoviwellness.com', label: 'Visit the site' }],
	},
	{
		name: 'Tracing a React Native iOS recycling bug',
		meta: 'Production debugging · React Native · iOS · Open source',
		body: [
			'A production UI failure caused newly opened screens to scroll into persistent blank space. I traced the behaviour into React Native’s Fabric implementation and found that keyboard-inset state could survive native ScrollView recycling.',
			'I reduced the failure to a dependency-free reproducer with automated detection, verified it across multiple React Native releases, documented the source-level mechanism and control cases, and filed the investigation upstream as React Native issue #57755.',
		],
		shots: [
			{
				src: '/media/rn-recycling/harness.webp',
				alt: 'The reproducer harness reporting a dirty view pool and a log of corrupt inset readings',
			},
		],
		links: [
			{
				href: 'https://github.com/facebook/react-native/issues/57755',
				label: 'Read the investigation',
			},
			{ href: 'https://github.com/PragathiJ/rn-aaki-recycle-repro', label: 'Explore the reproducer' },
		],
	},
];

export interface Role {
	period: string;
	title: string;
	summary: string;
	body: string[];
	tags: string;
}

export const EXPERIENCE: Role[] = [
	{
		period: '2026–now',
		title: 'Senior AI Systems Consultant, Surge AI',
		summary:
			'Freelance. Evaluation and benchmarking environments for coding-focused reinforcement learning and SDLC benchmarks.',
		body: [
			'Develop software environments, codebases and technical scenarios used in coding-focused reinforcement learning and SDLC benchmarking. I build and adapt applications across TypeScript, React, Node.js, Python and PostgreSQL, introducing realistic implementation and debugging challenges, and design reproducible failure cases, test conditions and expected behaviours across unfamiliar repositories and architectures.',
			'Run containerised development and evaluation workflows, debugging dependency, memory, permission, environment and test-execution issues. Review implementations for correctness, completeness, maintainability and adherence to requirements, and contribute to benchmark design by defining the specifications and grading criteria that decide what counts as real-world software engineering quality.',
		],
		tags: 'Evaluation & benchmarking · Reinforcement learning · TypeScript · Python · Containerised workflows',
	},
	{
		period: '2025–now',
		title: 'Founder & Product Engineer, Anovi',
		summary:
			'Building a connected nutrition product independently across product, mobile, backend, AI and release.',
		body: [
			'Building a connected nutrition and meal-planning product independently from product architecture to release. My work spans data and backend architecture, recommendation and LLM systems, the React Native application, subscriptions, localisation, privacy and App Store delivery.',
		],
		tags: 'Product strategy · Applied AI · React Native · FastAPI · PostgreSQL',
	},
	{
		period: '2022–2024',
		title: 'Applied AI Engineer, Mercedes-Benz Tech Motion',
		summary:
			'Real-time computer vision, multimodal AI, explainability, sensor fusion and transformer-based systems.',
		body: [
			'Developed real-time perception and multimodal AI systems for driver and wearable interaction, including static and dynamic gesture recognition, explainable gaze estimation, sensor-fusion-based pose estimation, and transformer-based OCR and speech processing.',
			'Built synthetic-data workflows and ROS-based multi-camera inference pipelines for continuous testing, worked with product and UI teams on user studies, and mentored junior engineers.',
		],
		tags: 'Computer vision · Multimodal AI · Explainable AI · Sensor fusion · Transformers',
	},
	{
		period: '2018–2022',
		title: 'MSc & Embedded ML Research, Technical University of Munich',
		summary:
			'Radar-based gesture recognition, TinyML deployment and applied AI projects with Bosch.',
		body: [
			'Focused on applied AI, sensing and embedded systems, alongside project work at Bosch Sensortec and Robert Bosch.',
			'My master’s thesis covered the complete pipeline for radar-based hand-gesture classification: data collection, static-clutter removal, time-frequency processing, DCNN design, quantisation, C-code generation and deployment work for a highly resource-constrained ARM Cortex-M0 microcontroller. The selected model achieved 97% classification accuracy, while the deployment work investigated the practical flash and RAM limits of running neural-network inference on the target hardware.',
			'I then continued at TUM as a student research assistant in Embedded Machine Learning and TinyML, generating and optimising C code from trained machine-learning models to reduce memory consumption on microcontrollers.',
			'At Bosch Sensortec, I developed a CNN-LSTM approach for classifying badminton shots from IMU data. At Robert Bosch, I worked on computer vision for distinguishing weeds from crops in field imagery.',
		],
		tags: 'Radar · Signal processing · Embedded ML · Computer vision · Time-series modelling',
	},
	{
		period: '2015–2018',
		title: 'Software Engineer, Robert Bosch',
		summary:
			'Embedded automotive diagnostics in C and C++, with customer and cross-team delivery responsibility.',
		body: [
			'Developed automotive diagnostic software in embedded C and C++ in alignment with ISO 14229-1 and Classical AUTOSAR.',
			'Worked directly with customers, clarified technical requirements and coordinated delivery across teams, building the systems and stakeholder foundation behind my later work in applied AI and product engineering.',
		],
		tags: 'Embedded C/C++ · Automotive diagnostics · AUTOSAR · Customer delivery',
	},
];

export const BUILDING: string[] = [
	'Evidence-Grounded Nutrition Research Copilot. Retrieval and citation design for nutrition evidence, built to refuse questions the sources cannot answer.',
	'Cycle-aware nutrition flow. Symptom and phase aware planning, scoped to stay non-medical.',
];
