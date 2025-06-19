import { Timestamp } from 'firebase/firestore';
import { 
  Course, 
  Lesson, 
  Task, 
  TaskType, 
  QuizQuestion, 
  TestCase, 
  RubricCriteria,
  Achievement,
  UserEnrollment,
  UserProgress,
  UserTaskCompletion
} from '../types/curriculum';
import { 
  XPConstants, 
  DifficultyLevel, 
  XPSourceType, 
  XPCategory,
  AchievementType,
  AchievementTier 
} from '../types/xpSystem';

// Utility function to create timestamp
const createTimestamp = (date?: Date) => 
  Timestamp.fromDate(date || new Date());

// Sample Course Data
export const sampleCourses: Course[] = [
  {
    id: 'intro-to-ai',
    title: 'Introduction to AI',
    description: 'A comprehensive introduction to Artificial Intelligence concepts, history, and applications. Perfect for beginners looking to understand the fundamentals of AI and its impact on society.',
    shortDescription: 'Learn AI fundamentals, history, and real-world applications in this beginner-friendly course.',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
    difficulty: 'beginner',
    category: 'AI Fundamentals',
    tags: ['artificial-intelligence', 'beginner', 'foundations', 'history', 'applications'],
    content: {
      estimatedHours: 12,
      lessonCount: 5,
      taskCount: 20,
      prerequisites: []
    },
    progression: {
      totalXP: 500,
      passingScore: 70,
      certificateEligible: true
    },
    metadata: {
      createdAt: createTimestamp(new Date('2024-01-01')),
      updatedAt: createTimestamp(),
      createdBy: 'system',
      version: '1.0.0',
      isPublished: true,
      publishedAt: createTimestamp(new Date('2024-01-15'))
    },
    settings: {
      allowRetakes: true,
      showProgress: true,
      randomizeQuestions: false,
      timeLimit: undefined
    }
  },
  {
    id: 'ml-fundamentals',
    title: 'Machine Learning Fundamentals',
    description: 'Dive deep into machine learning algorithms, data preprocessing, model training, and evaluation. Build practical skills with hands-on projects using popular ML frameworks.',
    shortDescription: 'Master machine learning algorithms and build real ML models with hands-on projects.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    difficulty: 'intermediate',
    category: 'Machine Learning',
    tags: ['machine-learning', 'algorithms', 'data-science', 'python', 'sklearn'],
    content: {
      estimatedHours: 25,
      lessonCount: 6,
      taskCount: 30,
      prerequisites: ['intro-to-ai']
    },
    progression: {
      totalXP: 1200,
      passingScore: 75,
      certificateEligible: true
    },
    metadata: {
      createdAt: createTimestamp(new Date('2024-01-15')),
      updatedAt: createTimestamp(),
      createdBy: 'system',
      version: '1.0.0',
      isPublished: true,
      publishedAt: createTimestamp(new Date('2024-02-01'))
    },
    settings: {
      allowRetakes: true,
      showProgress: true,
      randomizeQuestions: true,
      timeLimit: undefined
    }
  },
  {
    id: 'deep-learning-apps',
    title: 'Deep Learning Applications',
    description: 'Explore advanced deep learning architectures including CNNs, RNNs, and transformers. Build sophisticated AI applications for computer vision, NLP, and more.',
    shortDescription: 'Build advanced AI applications using deep learning and neural networks.',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
    difficulty: 'advanced',
    category: 'Deep Learning',
    tags: ['deep-learning', 'neural-networks', 'tensorflow', 'pytorch', 'computer-vision', 'nlp'],
    content: {
      estimatedHours: 40,
      lessonCount: 8,
      taskCount: 35,
      prerequisites: ['ml-fundamentals']
    },
    progression: {
      totalXP: 2000,
      passingScore: 80,
      certificateEligible: true
    },
    metadata: {
      createdAt: createTimestamp(new Date('2024-02-01')),
      updatedAt: createTimestamp(),
      createdBy: 'system',
      version: '1.0.0',
      isPublished: true,
      publishedAt: createTimestamp(new Date('2024-02-15'))
    },
    settings: {
      allowRetakes: true,
      showProgress: true,
      randomizeQuestions: true,
      timeLimit: 180 // 3 hours for coding projects
    }
  },
  {
    id: 'ai-ethics',
    title: 'AI Ethics & Responsible AI',
    description: 'Examine the ethical implications of AI development and deployment. Learn about bias, fairness, transparency, and responsible AI practices for building ethical AI systems.',
    shortDescription: 'Learn to build ethical AI systems and understand the societal impact of AI.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    difficulty: 'intermediate',
    category: 'AI Ethics',
    tags: ['ethics', 'responsible-ai', 'bias', 'fairness', 'transparency', 'governance'],
    content: {
      estimatedHours: 18,
      lessonCount: 5,
      taskCount: 25,
      prerequisites: ['intro-to-ai']
    },
    progression: {
      totalXP: 800,
      passingScore: 75,
      certificateEligible: true
    },
    metadata: {
      createdAt: createTimestamp(new Date('2024-02-15')),
      updatedAt: createTimestamp(),
      createdBy: 'system',
      version: '1.0.0',
      isPublished: true,
      publishedAt: createTimestamp(new Date('2024-03-01'))
    },
    settings: {
      allowRetakes: true,
      showProgress: true,
      randomizeQuestions: false,
      timeLimit: undefined
    }
  }
];

// Sample Lessons for Introduction to AI Course
export const sampleLessons: Lesson[] = [
  // Introduction to AI Course Lessons
  {
    id: 'intro-ai-lesson-1',
    courseId: 'intro-to-ai',
    title: 'What is Artificial Intelligence?',
    description: 'Understanding the definition, scope, and basic concepts of artificial intelligence.',
    order: 1,
    content: {
      type: 'mixed',
      videoUrl: 'https://example.com/videos/intro-ai-what-is-ai.mp4',
      videoDuration: 15,
      textContent: `
# What is Artificial Intelligence?

Artificial Intelligence (AI) is a branch of computer science that aims to create intelligent machines capable of performing tasks that typically require human intelligence. These tasks include learning, reasoning, problem-solving, perception, and language understanding.

## Key Concepts

**Intelligence**: The ability to acquire and apply knowledge and skills.

**Machine Learning**: A subset of AI that enables machines to learn and improve from experience without being explicitly programmed.

**Deep Learning**: A subset of machine learning based on artificial neural networks.

## Types of AI

1. **Narrow AI (Weak AI)**: Designed to perform specific tasks
2. **General AI (Strong AI)**: Hypothetical AI with human-level intelligence
3. **Superintelligence**: AI that surpasses human intelligence

## Real-World Examples

- Virtual assistants (Siri, Alexa)
- Recommendation systems (Netflix, YouTube)
- Image recognition (Google Photos)
- Autonomous vehicles
- Medical diagnosis systems
      `,
      resources: [
        {
          type: 'pdf',
          title: 'AI History Timeline',
          url: 'https://example.com/resources/ai-history-timeline.pdf',
          description: 'A comprehensive timeline of AI development milestones'
        },
        {
          type: 'link',
          title: 'What is AI? - MIT Technology Review',
          url: 'https://www.technologyreview.com/what-is-ai/',
          description: 'In-depth article on AI definitions and concepts'
        }
      ]
    },
    progression: {
      xpReward: 25,
      estimatedMinutes: 45,
      requiredForProgress: true
    },
    metadata: {
      createdAt: createTimestamp(),
      updatedAt: createTimestamp(),
      isPublished: true
    }
  },
  {
    id: 'intro-ai-lesson-2',
    courseId: 'intro-to-ai',
    title: 'History of AI',
    description: 'Explore the evolution of AI from its inception to modern breakthroughs.',
    order: 2,
    content: {
      type: 'mixed',
      videoUrl: 'https://example.com/videos/ai-history.mp4',
      videoDuration: 20,
      textContent: `
# The History of Artificial Intelligence

The journey of AI has been marked by periods of excitement, breakthroughs, and setbacks known as "AI winters."

## Timeline of AI Development

### 1940s-1950s: The Birth of AI
- **1943**: McCulloch-Pitts artificial neuron
- **1950**: Alan Turing's "Computing Machinery and Intelligence" paper
- **1956**: Dartmouth Conference - AI term coined

### 1960s-1970s: Early Enthusiasm
- Expert systems development
- First AI programs (Logic Theorist, General Problem Solver)
- Early neural network research

### 1980s-1990s: AI Winter and Revival
- Expert systems boom and bust
- Backpropagation algorithm
- Chess programs advancement

### 2000s-Present: Modern AI Renaissance
- **2006**: Deep learning breakthrough
- **2011**: IBM Watson wins Jeopardy!
- **2016**: AlphaGo defeats world champion
- **2020s**: Large language models (GPT, ChatGPT)

## Key Figures

- **Alan Turing**: Turing Test
- **John McCarthy**: Coined "Artificial Intelligence"
- **Marvin Minsky**: AI pioneer and co-founder of MIT AI Lab
- **Geoffrey Hinton**: "Father of Deep Learning"
      `,
      resources: [
        {
          type: 'link',
          title: 'AI Timeline - Computer History Museum',
          url: 'https://www.computerhistory.org/timeline/ai-robotics/',
          description: 'Interactive timeline of AI and robotics history'
        }
      ]
    },
    progression: {
      xpReward: 30,
      estimatedMinutes: 50,
      requiredForProgress: true
    },
    metadata: {
      createdAt: createTimestamp(),
      updatedAt: createTimestamp(),
      isPublished: true
    }
  },
  {
    id: 'intro-ai-lesson-3',
    courseId: 'intro-to-ai',
    title: 'Types of AI Systems',
    description: 'Learn about different categories and approaches to AI systems.',
    order: 3,
    content: {
      type: 'text',
      textContent: `
# Types of AI Systems

Understanding the different types of AI systems helps us categorize and compare various AI approaches.

## By Capability Level

### 1. Narrow AI (Weak AI)
- Designed for specific tasks
- Cannot generalize beyond trained domain
- Examples: Chess programs, image recognition, voice assistants

### 2. General AI (Strong AI)
- Hypothetical AI with human-level intelligence
- Can understand, learn, and apply knowledge across domains
- Currently does not exist

### 3. Superintelligence
- AI that surpasses human intelligence in all domains
- Theoretical concept
- Subject of much debate and research

## By Learning Approach

### 1. Machine Learning
- Learns from data without explicit programming
- Includes supervised, unsupervised, and reinforcement learning

### 2. Deep Learning
- Uses artificial neural networks with multiple layers
- Excellent for pattern recognition tasks

### 3. Symbolic AI
- Uses symbols and logic to represent knowledge
- Rule-based systems and expert systems

### 4. Hybrid Approaches
- Combines multiple AI techniques
- Neuro-symbolic AI

## By Application Domain

### 1. Computer Vision
- Image and video analysis
- Object detection and recognition
- Medical imaging

### 2. Natural Language Processing
- Text analysis and generation
- Machine translation
- Chatbots and virtual assistants

### 3. Robotics
- Autonomous navigation
- Manipulation and control
- Human-robot interaction

### 4. Expert Systems
- Domain-specific knowledge representation
- Decision support systems
- Diagnostic tools
      `,
      resources: [
        {
          type: 'pdf',
          title: 'AI Classification Guide',
          url: 'https://example.com/resources/ai-classification.pdf',
          description: 'Detailed guide to AI system classifications'
        }
      ]
    },
    progression: {
      xpReward: 35,
      estimatedMinutes: 40,
      requiredForProgress: true
    },
    metadata: {
      createdAt: createTimestamp(),
      updatedAt: createTimestamp(),
      isPublished: true
    }
  },
  {
    id: 'intro-ai-lesson-4',
    courseId: 'intro-to-ai',
    title: 'AI Applications in Daily Life',
    description: 'Discover how AI is already integrated into our everyday experiences.',
    order: 4,
    content: {
      type: 'mixed',
      videoUrl: 'https://example.com/videos/ai-daily-life.mp4',
      videoDuration: 18,
      textContent: `
# AI Applications in Daily Life

AI has become ubiquitous in our daily lives, often working behind the scenes to enhance our experiences.

## Entertainment and Media

### Streaming Services
- **Netflix**: Recommendation algorithms
- **Spotify**: Music discovery and playlist generation
- **YouTube**: Content recommendations and automated captions

### Gaming
- Intelligent NPCs (Non-Player Characters)
- Procedural content generation
- Anti-cheat systems

## Communication and Social Media

### Social Platforms
- **Facebook**: News feed algorithm, photo tagging
- **Instagram**: Filter effects, content moderation
- **Twitter**: Trend detection, spam filtering

### Messaging
- Smart reply suggestions
- Language translation
- Spam detection

## Transportation

### Navigation
- **Google Maps**: Route optimization, traffic prediction
- **Waze**: Real-time traffic updates
- Real-time public transit information

### Autonomous Vehicles
- Tesla Autopilot
- Waymo self-driving cars
- Advanced driver assistance systems (ADAS)

## Shopping and E-commerce

### Online Shopping
- **Amazon**: Product recommendations, price optimization
- **eBay**: Search ranking, fraud detection
- Personalized advertisements

### Physical Retail
- Inventory management
- Cashier-less stores (Amazon Go)
- Dynamic pricing

## Healthcare

### Diagnostic Tools
- Medical imaging analysis
- Symptom checkers
- Drug discovery acceleration

### Wearable Devices
- Fitness tracking and analysis
- Heart rate monitoring
- Fall detection

## Smart Home Technology

### Voice Assistants
- **Amazon Alexa**: Smart home control, information queries
- **Google Assistant**: Task automation, calendar management
- **Apple Siri**: Device integration, personal assistance

### Home Automation
- Smart thermostats (Nest)
- Security systems with facial recognition
- Automated lighting and appliances

## Financial Services

### Banking
- Fraud detection
- Credit scoring
- Algorithmic trading

### Personal Finance
- Budgeting apps with AI insights
- Investment recommendations
- Insurance risk assessment
      `,
      resources: [
        {
          type: 'link',
          title: 'AI in Everyday Life - Examples',
          url: 'https://example.com/ai-daily-examples',
          description: 'Interactive examples of AI in daily applications'
        }
      ]
    },
    progression: {
      xpReward: 40,
      estimatedMinutes: 55,
      requiredForProgress: true
    },
    metadata: {
      createdAt: createTimestamp(),
      updatedAt: createTimestamp(),
      isPublished: true
    }
  },
  {
    id: 'intro-ai-lesson-5',
    courseId: 'intro-to-ai',
    title: 'Future of AI',
    description: 'Explore potential future developments and implications of AI technology.',
    order: 5,
    content: {
      type: 'text',
      textContent: `
# The Future of AI

As AI continues to advance rapidly, it's important to consider potential future developments and their implications for society.

## Emerging Trends

### 1. Large Language Models
- Continued growth in model size and capability
- Better understanding of context and nuance
- Integration with other AI systems

### 2. Multimodal AI
- Systems that can process text, images, audio, and video together
- More natural human-AI interaction
- Enhanced creative capabilities

### 3. Edge AI
- AI processing on local devices
- Reduced latency and improved privacy
- IoT integration

### 4. Explainable AI (XAI)
- Making AI decisions more transparent
- Regulatory compliance
- Building trust in AI systems

## Potential Breakthroughs

### Artificial General Intelligence (AGI)
- Timeline: Highly debated (2030s-2070s)
- Challenges: Common sense reasoning, transfer learning
- Implications: Transformative impact on all industries

### Quantum AI
- Quantum computing acceleration of AI algorithms
- Solving currently intractable problems
- New types of AI applications

### Brain-Computer Interfaces
- Direct interaction between AI and human brains
- Enhanced human cognitive abilities
- Medical applications for neurological conditions

## Societal Implications

### Employment and Economy
- Job displacement and creation
- Need for reskilling and education
- Universal basic income discussions
- New economic models

### Privacy and Security
- Increased surveillance capabilities
- Deepfakes and misinformation
- Cybersecurity challenges
- Data protection regulations

### Governance and Regulation
- AI safety standards
- International cooperation
- Ethical guidelines
- Liability and accountability

## Challenges Ahead

### Technical Challenges
- **Alignment Problem**: Ensuring AI goals align with human values
- **Robustness**: Making AI systems reliable and safe
- **Interpretability**: Understanding how AI makes decisions
- **Bias and Fairness**: Eliminating discriminatory outcomes

### Societal Challenges
- **Digital Divide**: Ensuring equitable access to AI benefits
- **Education**: Preparing workforce for AI-augmented future
- **Democracy**: Protecting democratic processes from AI manipulation
- **Human Agency**: Maintaining human control and purpose

## Preparing for the Future

### Individual Level
- Develop AI literacy
- Learn complementary skills
- Stay adaptable and curious
- Engage in lifelong learning

### Organizational Level
- Invest in AI education and training
- Develop ethical AI practices
- Foster human-AI collaboration
- Prepare for regulatory changes

### Societal Level
- Create inclusive AI policies
- Invest in education and reskilling
- Foster international cooperation
- Maintain focus on human welfare

The future of AI is not predetermined – it will be shaped by the choices we make today. By understanding the possibilities and challenges ahead, we can work together to ensure AI develops in ways that benefit all of humanity.
      `,
      resources: [
        {
          type: 'pdf',
          title: 'Future of AI Report 2024',
          url: 'https://example.com/resources/future-ai-2024.pdf',
          description: 'Comprehensive report on AI future trends and predictions'
        },
        {
          type: 'link',
          title: 'AI Safety Research',
          url: 'https://www.aisafety.org/',
          description: 'Resources on AI alignment and safety research'
        }
      ]
    },
    progression: {
      xpReward: 45,
      estimatedMinutes: 60,
      requiredForProgress: true
    },
    metadata: {
      createdAt: createTimestamp(),
      updatedAt: createTimestamp(),
      isPublished: true
    }
  }
];

// Continue with more lessons for other courses...
// Machine Learning Fundamentals Course Lessons
export const mlFundamentalsLessons: Lesson[] = [
  {
    id: 'ml-lesson-1',
    courseId: 'ml-fundamentals',
    title: 'Introduction to Machine Learning',
    description: 'Understanding what machine learning is and how it differs from traditional programming.',
    order: 1,
    content: {
      type: 'mixed',
      videoUrl: 'https://example.com/videos/ml-intro.mp4',
      videoDuration: 25,
      textContent: `
# Introduction to Machine Learning

Machine Learning (ML) is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every scenario.

## Traditional Programming vs Machine Learning

### Traditional Programming
- Input: Data + Program → Output
- Explicit rules and logic
- Deterministic outcomes
- Limited adaptability

### Machine Learning
- Input: Data + Expected Output → Program (Model)
- Learns patterns from data
- Probabilistic outcomes
- Adapts to new data

## Core Concepts

### 1. Data
- The fuel of machine learning
- Quality and quantity matter
- Features and labels

### 2. Algorithms
- Mathematical procedures for finding patterns
- Different algorithms for different problems
- No single algorithm works best for all problems

### 3. Models
- The output of algorithms trained on data
- Can make predictions on new, unseen data
- Require evaluation and validation

### 4. Training
- Process of teaching the algorithm using data
- Finding optimal parameters
- Iterative improvement

## The Machine Learning Workflow

1. **Problem Definition**: What are we trying to solve?
2. **Data Collection**: Gathering relevant data
3. **Data Preparation**: Cleaning and preprocessing
4. **Model Selection**: Choosing appropriate algorithms
5. **Training**: Teaching the model
6. **Evaluation**: Testing model performance
7. **Deployment**: Using the model in production
8. **Monitoring**: Ensuring continued performance

## Why Machine Learning Matters

- **Automation**: Automate complex decision-making
- **Scale**: Handle large amounts of data
- **Personalization**: Tailor experiences to individuals
- **Discovery**: Find patterns humans might miss
- **Efficiency**: Optimize processes and resources
      `,
      resources: [
        {
          type: 'pdf',
          title: 'ML Workflow Guide',
          url: 'https://example.com/resources/ml-workflow.pdf',
          description: 'Step-by-step guide to the ML workflow'
        }
      ]
    },
    progression: {
      xpReward: 50,
      estimatedMinutes: 60,
      requiredForProgress: true
    },
    metadata: {
      createdAt: createTimestamp(),
      updatedAt: createTimestamp(),
      isPublished: true
    }
  },
  {
    id: 'ml-lesson-2',
    courseId: 'ml-fundamentals',
    title: 'Types of Machine Learning',
    description: 'Explore supervised, unsupervised, and reinforcement learning approaches.',
    order: 2,
    content: {
      type: 'text',
      textContent: `
# Types of Machine Learning

Machine learning algorithms can be categorized into three main types based on how they learn from data.

## 1. Supervised Learning

Learning with labeled examples - both input and correct output are provided.

### Characteristics
- Uses labeled training data
- Goal: Learn a mapping from inputs to outputs
- Performance can be measured against known correct answers

### Types of Supervised Learning

#### Classification
- Predicts discrete categories or classes
- **Examples**: Email spam detection, image recognition, medical diagnosis
- **Algorithms**: Decision Trees, Random Forest, SVM, Neural Networks

#### Regression
- Predicts continuous numerical values
- **Examples**: Stock price prediction, house price estimation, temperature forecasting
- **Algorithms**: Linear Regression, Polynomial Regression, Ridge Regression

### Common Supervised Learning Algorithms
- **Linear Regression**: Predicts continuous values using linear relationships
- **Logistic Regression**: Classification using logistic function
- **Decision Trees**: Tree-like model for classification and regression
- **Random Forest**: Ensemble of decision trees
- **Support Vector Machines (SVM)**: Finds optimal decision boundaries
- **Neural Networks**: Inspired by biological neural networks

## 2. Unsupervised Learning

Learning patterns from data without labeled examples.

### Characteristics
- No labeled training data
- Goal: Discover hidden patterns or structures
- More exploratory in nature

### Types of Unsupervised Learning

#### Clustering
- Groups similar data points together
- **Examples**: Customer segmentation, gene analysis, market research
- **Algorithms**: K-Means, Hierarchical Clustering, DBSCAN

#### Association Rule Learning
- Finds relationships between different variables
- **Examples**: Market basket analysis ("people who buy X also buy Y")
- **Algorithms**: Apriori, FP-Growth

#### Dimensionality Reduction
- Reduces the number of features while preserving important information
- **Examples**: Data visualization, feature selection, noise reduction
- **Algorithms**: PCA, t-SNE, UMAP

### Common Unsupervised Learning Algorithms
- **K-Means Clustering**: Partitions data into k clusters
- **Hierarchical Clustering**: Creates tree-like cluster structures
- **Principal Component Analysis (PCA)**: Reduces dimensionality
- **DBSCAN**: Density-based clustering

## 3. Reinforcement Learning

Learning through interaction with an environment using rewards and penalties.

### Characteristics
- Learns through trial and error
- Receives feedback in the form of rewards or penalties
- Goal: Maximize cumulative reward over time

### Key Concepts
- **Agent**: The learner or decision maker
- **Environment**: The world the agent interacts with
- **Actions**: What the agent can do
- **States**: Situations the agent can be in
- **Rewards**: Feedback from the environment
- **Policy**: Strategy for choosing actions

### Applications
- **Game Playing**: Chess, Go, video games
- **Robotics**: Robot navigation, manipulation
- **Autonomous Vehicles**: Self-driving cars
- **Finance**: Algorithmic trading
- **Recommendation Systems**: Personalized content

### Common Reinforcement Learning Algorithms
- **Q-Learning**: Value-based method for discrete actions
- **Deep Q-Networks (DQN)**: Q-learning with neural networks
- **Policy Gradient**: Directly optimize the policy
- **Actor-Critic**: Combines value and policy methods

## Semi-Supervised Learning

A hybrid approach that uses both labeled and unlabeled data.

### When to Use
- Limited labeled data available
- Labeling is expensive or time-consuming
- Large amounts of unlabeled data

### Applications
- Web page classification
- Speech recognition
- Medical diagnosis with limited expert annotations

## Choosing the Right Approach

### Factors to Consider
1. **Data Availability**: Do you have labeled data?
2. **Problem Type**: Classification, regression, clustering, or optimization?
3. **Data Size**: How much data do you have?
4. **Interpretability**: Do you need to understand how decisions are made?
5. **Performance Requirements**: Speed vs. accuracy trade-offs

### Decision Framework
- **Supervised Learning**: When you have labeled data and clear objectives
- **Unsupervised Learning**: When exploring data or finding hidden patterns
- **Reinforcement Learning**: When learning through interaction and optimization
      `,
      resources: [
        {
          type: 'link',
          title: 'ML Algorithm Comparison',
          url: 'https://example.com/ml-algorithms-comparison',
          description: 'Interactive comparison of ML algorithms'
        }
      ]
    },
    progression: {
      xpReward: 60,
      estimatedMinutes: 70,
      requiredForProgress: true
    },
    metadata: {
      createdAt: createTimestamp(),
      updatedAt: createTimestamp(),
      isPublished: true
    }
  }
  // More ML lessons would continue here...
];

// Sample Tasks for Lessons
export const sampleTasks: Task[] = [
  // Introduction to AI Course Tasks
  {
    id: 'intro-ai-task-1-reading',
    lessonId: 'intro-ai-lesson-1',
    courseId: 'intro-to-ai',
    title: 'Reading: AI Definitions and Concepts',
    description: 'Read the comprehensive guide to AI definitions and key concepts.',
    order: 1,
    type: 'reading',
    content: {
      text: `
Please read through the lesson content above carefully. Pay special attention to:

1. The definition of Artificial Intelligence
2. The difference between Narrow AI and General AI
3. Real-world examples of AI applications
4. The relationship between AI, Machine Learning, and Deep Learning

Take notes on key concepts as you read. You'll need this information for the upcoming quiz.
      `
    },
    progression: {
      xpReward: 10,
      estimatedMinutes: 15,
      isRequired: true
    },
    metadata: {
      createdAt: createTimestamp(),
      updatedAt: createTimestamp(),
      isPublished: true
    }
  },
  {
    id: 'intro-ai-task-1-quiz',
    lessonId: 'intro-ai-lesson-1',
    courseId: 'intro-to-ai',
    title: 'Quiz: AI Fundamentals',
    description: 'Test your understanding of basic AI concepts.',
    order: 2,
    type: 'quiz',
    content: {
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: 'What is the main difference between Narrow AI and General AI?',
          options: [
            'Narrow AI is faster than General AI',
            'Narrow AI is designed for specific tasks, while General AI can perform any intellectual task',
            'General AI is cheaper to develop',
            'There is no difference between them'
          ],
          correctAnswer: 'Narrow AI is designed for specific tasks, while General AI can perform any intellectual task',
          explanation: 'Narrow AI (Weak AI) is designed to perform specific tasks and cannot generalize beyond its trained domain, while General AI (Strong AI) would have human-level intelligence across all domains.',
          points: 2
        },
        {
          id: 'q2',
          type: 'multiple-choice',
          question: 'Which of the following is NOT an example of AI in daily life?',
          options: [
            'Netflix recommendations',
            'Google Maps navigation',
            'Traditional calculator',
            'Spam email filtering'
          ],
          correctAnswer: 'Traditional calculator',
          explanation: 'A traditional calculator performs arithmetic operations using predetermined rules, without learning or adapting. It does not exhibit intelligence or learning capabilities.',
          points: 2
        },
        {
          id: 'q3',
          type: 'true-false',
          question: 'Machine Learning is a subset of Artificial Intelligence.',
          options: ['True', 'False'],
          correctAnswer: 'True',
          explanation: 'Machine Learning is indeed a subset of Artificial Intelligence that focuses on algorithms that can learn and improve from data.',
          points: 1
        },
        {
          id: 'q4',
          type: 'short-answer',
          question: 'Name three real-world applications of AI mentioned in the lesson.',
          correctAnswer: ['Virtual assistants', 'Recommendation systems', 'Image recognition', 'Autonomous vehicles', 'Medical diagnosis'],
          explanation: 'Any three of the mentioned applications: Virtual assistants (Siri, Alexa), Recommendation systems (Netflix, YouTube), Image recognition (Google Photos), Autonomous vehicles, or Medical diagnosis systems.',
          points: 3
        }
      ]
    },
    progression: {
      xpReward: 25,
      estimatedMinutes: 10,
      passingScore: 70,
      maxAttempts: 3,
      isRequired: true
    },
    metadata: {
      createdAt: createTimestamp(),
      updatedAt: createTimestamp(),
      isPublished: true
    }
  },
  {
    id: 'intro-ai-task-1-discussion',
    lessonId: 'intro-ai-lesson-1',
    courseId: 'intro-to-ai',
    title: 'Discussion: AI Impact on Society',
    description: 'Share your thoughts on how AI might impact society in the next decade.',
    order: 3,
    type: 'discussion',
    content: {
      text: `
**Discussion Prompt:**

Based on what you've learned about AI, discuss the following questions:

1. How do you think AI will change the way we work in the next 10 years?
2. What are some potential benefits and risks of AI becoming more prevalent in society?
3. Can you think of any areas where AI should or should not be used? Why?

**Guidelines:**
- Write at least 150 words
- Support your opinions with examples or reasoning
- Be respectful of different viewpoints
- Feel free to respond to other students' posts

**Grading Criteria:**
- Thoughtful analysis (40%)
- Use of examples or evidence (30%)
- Clarity of writing (20%)
- Engagement with the topic (10%)
      `
    },
    progression: {
      xpReward: 20,
      estimatedMinutes: 20,
      isRequired: false
    },
    metadata: {
      createdAt: createTimestamp(),
      updatedAt: createTimestamp(),
      isPublished: true
    }
  },
  {
    id: 'intro-ai-task-1-reflection',
    lessonId: 'intro-ai-lesson-1',
    courseId: 'intro-to-ai',
    title: 'Reflection: Personal AI Experiences',
    description: 'Reflect on your personal experiences with AI technology.',
    order: 4,
    type: 'reflection',
    content: {
      text: `
**Reflection Exercise:**

Take a moment to think about your daily interactions with AI technology. Write a short reflection (100-200 words) addressing the following:

1. **Awareness**: Before this lesson, how aware were you of AI in your daily life?
2. **Examples**: What AI technologies do you use most frequently?
3. **Surprises**: Was there anything in this lesson that surprised you about AI?
4. **Future Learning**: What aspects of AI are you most curious to learn more about?

**Purpose:**
This reflection helps you connect the course material to your personal experiences and identify areas of interest for future learning.

**Submission:**
- Minimum 100 words
- No maximum word limit
- Be honest and thoughtful
- This is for your personal learning - there are no wrong answers
      `
    },
    progression: {
      xpReward: 15,
      estimatedMinutes: 15,
      isRequired: false
    },
    metadata: {
      createdAt: createTimestamp(),
      updatedAt: createTimestamp(),
      isPublished: true
    }
  },

  // Machine Learning Fundamentals Tasks
  {
    id: 'ml-task-1-reading',
    lessonId: 'ml-lesson-1',
    courseId: 'ml-fundamentals',
    title: 'Reading: ML vs Traditional Programming',
    description: 'Study the fundamental differences between machine learning and traditional programming approaches.',
    order: 1,
    type: 'reading',
    content: {
      text: `
Read through the lesson content and focus on understanding:

1. **Key Differences**: How ML differs from traditional programming
2. **Workflow**: The 8-step machine learning workflow
3. **Core Concepts**: Data, algorithms, models, and training
4. **Applications**: Why ML is useful and when to apply it

**Study Questions to Consider:**
- What makes machine learning "learn" from data?
- Why is data quality so important in ML?
- What are the trade-offs between traditional programming and ML?
- In what situations would you choose ML over traditional programming?

Take notes and prepare for the hands-on coding exercise.
      `
    },
    progression: {
      xpReward: 20,
      estimatedMinutes: 25,
      isRequired: true
    },
    metadata: {
      createdAt: createTimestamp(),
      updatedAt: createTimestamp(),
      isPublished: true
    }
  },
  {
    id: 'ml-task-1-coding',
    lessonId: 'ml-lesson-1',
    courseId: 'ml-fundamentals',
    title: 'Coding: Simple ML Model',
    description: 'Build your first machine learning model using Python and scikit-learn.',
    order: 2,
    type: 'coding',
    content: {
      codeTemplate: `
# Simple Linear Regression Example
# TODO: Complete the missing parts

import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import matplotlib.pyplot as plt

# Generate sample data: house sizes (sq ft) and prices
np.random.seed(42)
house_sizes = np.random.normal(2000, 500, 100).reshape(-1, 1)
# TODO: Create house prices with some linear relationship to size
house_prices = # YOUR CODE HERE

# TODO: Split the data into training and testing sets
X_train, X_test, y_train, y_test = # YOUR CODE HERE

# TODO: Create and train a linear regression model
model = # YOUR CODE HERE
# YOUR CODE HERE (fit the model)

# TODO: Make predictions on the test set
predictions = # YOUR CODE HERE

# TODO: Calculate the mean squared error
mse = # YOUR CODE HERE

print(f"Mean Squared Error: {mse}")
print(f"Model coefficient: {model.coef_[0]}")
print(f"Model intercept: {model.intercept_}")

# Visualization (provided)
plt.scatter(X_test, y_test, color='blue', label='Actual')
plt.scatter(X_test, predictions, color='red', label='Predicted')
plt.xlabel('House Size (sq ft)')
plt.ylabel('House Price ($)')
plt.legend()
plt.title('Linear Regression: House Size vs Price')
plt.show()
      `,
      testCases: [
        {
          input: 'house_sizes.shape[0]',
          expectedOutput: '100',
          hidden: false
        },
        {
          input: 'len(X_train)',
          expectedOutput: '75',
          hidden: false
        },
        {
          input: 'len(X_test)',
          expectedOutput: '25',
          hidden: false
        },
        {
          input: 'type(model).__name__',
          expectedOutput: 'LinearRegression',
          hidden: false
        },
        {
          input: 'mse < 50000000',
          expectedOutput: 'True',
          hidden: true
        }
      ]
    },
    progression: {
      xpReward: 100,
      estimatedMinutes: 45,
      passingScore: 80,
      maxAttempts: 5,
      isRequired: true
    },
    metadata: {
      createdAt: createTimestamp(),
      updatedAt: createTimestamp(),
      isPublished: true
    }
  },
  {
    id: 'ml-task-2-project',
    lessonId: 'ml-lesson-2',
    courseId: 'ml-fundamentals',
    title: 'Project: ML Algorithm Comparison',
    description: 'Compare different machine learning algorithms on a classification dataset.',
    order: 1,
    type: 'project',
    content: {
      requirements: [
        'Use the provided dataset (iris or wine dataset from sklearn)',
        'Implement at least 3 different classification algorithms',
        'Compare their performance using appropriate metrics',
        'Create visualizations to show the results',
        'Write a brief report summarizing your findings',
        'Submit your code and report as separate files'
      ],
      submissionFormat: 'file',
      rubric: [
        {
          criteria: 'Code Quality and Implementation',
          points: 30
        },
        {
          criteria: 'Algorithm Selection and Justification',
          points: 25
        },
        {
          criteria: 'Performance Analysis and Metrics',
          points: 25
        },
        {
          criteria: 'Visualizations and Presentation',
          points: 15
        },
        {
          criteria: 'Report and Documentation',
          points: 25
        }
      ]
    },
    progression: {
      xpReward: 200,
      estimatedMinutes: 120,
      passingScore: 75,
      isRequired: true
    },
    metadata: {
      createdAt: createTimestamp(),
      updatedAt: createTimestamp(),
      isPublished: true
    }
  }
];

// Sample Achievements
export const sampleAchievements: Achievement[] = [
  {
    id: 'first-lesson-complete',
    title: 'First Step',
    description: 'Complete your first lesson',
    iconUrl: 'https://example.com/icons/first-step.svg',
    category: 'progress',
    requirements: {
      type: 'custom',
      threshold: 1,
      additionalCriteria: { lessonsCompleted: 1 }
    },
    rewards: {
      xpBonus: 50,
      title: 'Learner',
      badgeUrl: 'https://example.com/badges/learner.svg'
    },
    rarity: 'common',
    metadata: {
      createdAt: createTimestamp(),
      isActive: true
    }
  },
  {
    id: 'quiz-master',
    title: 'Quiz Master',
    description: 'Score 100% on 5 quizzes',
    iconUrl: 'https://example.com/icons/quiz-master.svg',
    category: 'skill',
    requirements: {
      type: 'custom',
      threshold: 5,
      additionalCriteria: { perfectQuizzes: 5 }
    },
    rewards: {
      xpBonus: 200,
      title: 'Quiz Master',
      badgeUrl: 'https://example.com/badges/quiz-master.svg'
    },
    rarity: 'rare',
    metadata: {
      createdAt: createTimestamp(),
      isActive: true
    }
  },
  {
    id: 'streak-warrior',
    title: 'Streak Warrior',
    description: 'Maintain a 7-day learning streak',
    iconUrl: 'https://example.com/icons/streak.svg',
    category: 'progress',
    requirements: {
      type: 'streak',
      threshold: 7
    },
    rewards: {
      xpBonus: 150,
      title: 'Consistent Learner',
      badgeUrl: 'https://example.com/badges/streak.svg'
    },
    rarity: 'uncommon',
    metadata: {
      createdAt: createTimestamp(),
      isActive: true
    }
  },
  {
    id: 'ai-novice',
    title: 'AI Novice',
    description: 'Complete the Introduction to AI course',
    iconUrl: 'https://example.com/icons/ai-novice.svg',
    category: 'progress',
    requirements: {
      type: 'courses',
      threshold: 1,
      courseIds: ['intro-to-ai']
    },
    rewards: {
      xpBonus: 300,
      title: 'AI Novice',
      badgeUrl: 'https://example.com/badges/ai-novice.svg'
    },
    rarity: 'uncommon',
    metadata: {
      createdAt: createTimestamp(),
      isActive: true
    }
  },
  {
    id: 'ml-practitioner',
    title: 'ML Practitioner',
    description: 'Complete the Machine Learning Fundamentals course',
    iconUrl: 'https://example.com/icons/ml-practitioner.svg',
    category: 'progress',
    requirements: {
      type: 'courses',
      threshold: 1,
      courseIds: ['ml-fundamentals']
    },
    rewards: {
      xpBonus: 500,
      title: 'ML Practitioner',
      badgeUrl: 'https://example.com/badges/ml-practitioner.svg'
    },
    rarity: 'rare',
    metadata: {
      createdAt: createTimestamp(),
      isActive: true
    }
  },
  {
    id: 'code-warrior',
    title: 'Code Warrior',
    description: 'Complete 10 coding tasks',
    iconUrl: 'https://example.com/icons/code-warrior.svg',
    category: 'skill',
    requirements: {
      type: 'tasks',
      threshold: 10,
      additionalCriteria: { taskType: 'coding' }
    },
    rewards: {
      xpBonus: 400,
      title: 'Code Warrior',
      badgeUrl: 'https://example.com/badges/code-warrior.svg'
    },
    rarity: 'rare',
    metadata: {
      createdAt: createTimestamp(),
      isActive: true
    }
  },
  {
    id: 'ai-scholar',
    title: 'AI Scholar',
    description: 'Complete all four AI courses',
    iconUrl: 'https://example.com/icons/ai-scholar.svg',
    category: 'progress',
    requirements: {
      type: 'courses',
      threshold: 4,
      courseIds: ['intro-to-ai', 'ml-fundamentals', 'deep-learning-apps', 'ai-ethics']
    },
    rewards: {
      xpBonus: 1000,
      title: 'AI Scholar',
      badgeUrl: 'https://example.com/badges/ai-scholar.svg'
    },
    rarity: 'legendary',
    metadata: {
      createdAt: createTimestamp(),
      isActive: true
    }
  }
];

// XP Progression Mapping
export const xpLevelMapping = {
  1: { minXP: 0, maxXP: 100, title: 'Beginner', color: '#10B981' },
  2: { minXP: 100, maxXP: 250, title: 'Learner', color: '#3B82F6' },
  3: { minXP: 250, maxXP: 500, title: 'Student', color: '#6366F1' },
  4: { minXP: 500, maxXP: 850, title: 'Practitioner', color: '#8B5CF6' },
  5: { minXP: 850, maxXP: 1300, title: 'Skilled', color: '#A855F7' },
  6: { minXP: 1300, maxXP: 1850, title: 'Advanced', color: '#EC4899' },
  7: { minXP: 1850, maxXP: 2500, title: 'Expert', color: '#EF4444' },
  8: { minXP: 2500, maxXP: 3250, title: 'Master', color: '#F59E0B' },
  9: { minXP: 3250, maxXP: 4100, title: 'Guru', color: '#F97316' },
  10: { minXP: 4100, maxXP: 5000, title: 'Legend', color: '#DC2626' }
};

// Learning Path Recommendations
export const learningPaths = [
  {
    id: 'ai-fundamentals-path',
    title: 'AI Fundamentals Path',
    description: 'Start your AI journey with the basics',
    courses: ['intro-to-ai', 'ai-ethics'],
    estimatedDuration: '30 hours',
    difficulty: 'beginner',
    prerequisites: []
  },
  {
    id: 'ml-specialist-path',
    title: 'Machine Learning Specialist Path',
    description: 'Become proficient in machine learning techniques',
    courses: ['intro-to-ai', 'ml-fundamentals', 'deep-learning-apps'],
    estimatedDuration: '77 hours',
    difficulty: 'intermediate',
    prerequisites: []
  },
  {
    id: 'complete-ai-path',
    title: 'Complete AI Mastery Path',
    description: 'Master all aspects of AI from basics to advanced applications',
    courses: ['intro-to-ai', 'ml-fundamentals', 'deep-learning-apps', 'ai-ethics'],
    estimatedDuration: '95 hours',
    difficulty: 'advanced',
    prerequisites: []
  }
];