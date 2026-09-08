'use client';

import React, { useState, useEffect } from "react";
import {
  Target,
  Sparkles,
  Layers,
  BookOpen,
  Plus,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Zap,
  Search,
  ChevronRight,
  Award,
  Cpu,
  Database,
  Network,
  Shield,
  Code,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ExamCenterViewProps {
  setActiveTab?: (tab: string) => void;
  onSelectTopic?: (topic: string, subject?: string) => void;
  onSelectTopicAction?: (topic: string, action: "study" | "practice" | "test" | "review") => void;
  onTriggerEmergency?: (subject: string) => void;
}

interface TopicItem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  marksWeight: string;
  frequentQuestionType: string;
  summary: string;
}

interface UnitItem {
  unitNumber: number;
  name: string;
  weightagePercentage: number;
  topics: TopicItem[];
}

interface SubjectBlueprint {
  id: string;
  name: string;
  category: string;
  icon: any;
  color: string;
  border: string;
  units: UnitItem[];
}

const ENGINEERING_SUBJECTS: SubjectBlueprint[] = [
  {
    id: "aiml",
    name: "Artificial Intelligence & Machine Learning",
    category: "AI & Data Science",
    icon: Cpu,
    color: "from-purple-500/15 to-indigo-500/15",
    border: "border-purple-500/30",
    units: [
      {
        unitNumber: 1,
        name: "Unit 1: Search Algorithms & Knowledge Representation",
        weightagePercentage: 20,
        topics: [
          { id: "ai_t1", title: "Uninformed & Informed Search (BFS, DFS, A*, Heuristics)", difficulty: "Medium", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Algorithm", summary: "State space search, admissible heuristics, completeness and time complexity." },
          { id: "ai_t2", title: "First-Order Logic & Resolution Refutation", difficulty: "Hard", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Proof", summary: "CNF conversion, unification algorithm, proof by contradiction." },
          { id: "ai_t3", title: "Game Playing & Minimax with Alpha-Beta Pruning", difficulty: "Medium", marksWeight: "5-Mark", frequentQuestionType: "5-Mark Derivation", summary: "Game tree traversal, pruning conditions, evaluation functions." }
        ]
      },
      {
        unitNumber: 2,
        name: "Unit 2: Supervised Learning & Regression Models",
        weightagePercentage: 25,
        topics: [
          { id: "ai_t4", title: "Linear & Logistic Regression with Cost Functions", difficulty: "Medium", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Derivation", summary: "Gradient descent optimization, sigmoid activation, MSE loss vs cross-entropy." },
          { id: "ai_t5", title: "Decision Trees & ID3 / C4.5 Information Gain", difficulty: "Easy", marksWeight: "5-Mark", frequentQuestionType: "5-Mark Numerical", summary: "Entropy calculation, information gain ratio, tree pruning techniques." },
          { id: "ai_t6", title: "Support Vector Machines (SVM) & Kernel Trick", difficulty: "Hard", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Theory", summary: "Maximum margin hyperplane, support vectors, RBF and polynomial kernels." }
        ]
      },
      {
        unitNumber: 3,
        name: "Unit 3: Neural Networks & Deep Learning Architectures",
        weightagePercentage: 25,
        topics: [
          { id: "ai_t7", title: "Multi-Layer Perceptron (MLP) & Backpropagation", difficulty: "Hard", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Derivation", summary: "Forward propagation, chain rule gradient derivation, vanishing gradients." },
          { id: "ai_t8", title: "Convolutional Neural Networks (CNN) for Computer Vision", difficulty: "Medium", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Architecture", summary: "Convolution kernels, pooling layers, feature maps, flattening, and Dense layers." },
          { id: "ai_t9", title: "Recurrent Neural Networks (RNN) & LSTM Gates", difficulty: "Hard", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Diagram", summary: "Sequential data processing, forget gate, input gate, cell state updates." }
        ]
      },
      {
        unitNumber: 4,
        name: "Unit 4: Unsupervised Learning & Dimensionality Reduction",
        weightagePercentage: 15,
        topics: [
          { id: "ai_t10", title: "K-Means Clustering & Hierarchical Dendrograms", difficulty: "Easy", marksWeight: "5-Mark", frequentQuestionType: "5-Mark Step-by-Step", summary: "Centroid initialization, Euclidean distance convergence, agglomerative clustering." },
          { id: "ai_t11", title: "Principal Component Analysis (PCA)", difficulty: "Medium", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Math", summary: "Covariance matrix, eigenvalues, eigenvectors, projection into orthogonal subspace." }
        ]
      },
      {
        unitNumber: 5,
        name: "Unit 5: Model Evaluation, Overfitting & Ethical AI",
        weightagePercentage: 15,
        topics: [
          { id: "ai_t12", title: "Confusion Matrix, Precision, Recall, F1-Score & ROC", difficulty: "Easy", marksWeight: "5-Mark", frequentQuestionType: "5-Mark Numerical", summary: "True positive rates, false alarm trade-offs, AUC-ROC curve interpretation." },
          { id: "ai_t13", title: "Regularization (L1 Lasso, L2 Ridge, Dropout) & Bias-Variance", difficulty: "Medium", marksWeight: "5-Mark", frequentQuestionType: "5-Mark Theory", summary: "Preventing overfitting, weight penalties, cross-validation strategies." }
        ]
      }
    ]
  },
  {
    id: "os",
    name: "Operating Systems & System Software",
    category: "Core Systems",
    icon: Zap,
    color: "from-emerald-500/15 to-teal-500/15",
    border: "border-emerald-500/30",
    units: [
      {
        unitNumber: 1,
        name: "Unit 1: Process Management & CPU Scheduling",
        weightagePercentage: 25,
        topics: [
          { id: "os_t1", title: "Process States, PCB Structure & Context Switching", difficulty: "Easy", marksWeight: "5-Mark", frequentQuestionType: "5-Mark Diagram", summary: "5-state process lifecycle, PCB attributes, interrupt handling mechanics." },
          { id: "os_t2", title: "CPU Scheduling (FCFS, SJF, SRTF, Round Robin, Priority)", difficulty: "Medium", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Gantt Chart", summary: "Average turnaround time, waiting time, response ratio, preemption criteria." },
          { id: "os_t3", title: "Inter-Process Communication & Semaphores", difficulty: "Hard", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Code/Logic", summary: "Critical section problem, Peterson's algorithm, counting vs binary semaphores." }
        ]
      },
      {
        unitNumber: 2,
        name: "Unit 2: Deadlock Handling & Banker's Algorithm",
        weightagePercentage: 20,
        topics: [
          { id: "os_t4", title: "4 Necessary Conditions for Deadlock & Resource Allocation Graphs", difficulty: "Easy", marksWeight: "5-Mark", frequentQuestionType: "5-Mark Theory", summary: "Mutual exclusion, hold & wait, no preemption, circular wait detection." },
          { id: "os_t5", title: "Banker's Algorithm for Deadlock Avoidance", difficulty: "Hard", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Numerical", summary: "Safety check algorithm, resource request sequence, Need Matrix calculation." }
        ]
      },
      {
        unitNumber: 3,
        name: "Unit 3: Memory Management & Virtual Memory",
        weightagePercentage: 25,
        topics: [
          { id: "os_t6", title: "Paging, Segmentation & TLB Effective Access Time", difficulty: "Medium", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Architecture", summary: "Logical to physical address translation, page tables, TLB hit ratio calculations." },
          { id: "os_t7", title: "Page Replacement Algorithms (FIFO, LRU, Optimal) & Thrashing", difficulty: "Medium", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Trace", summary: "Belady's anomaly, page fault count comparison, working set model." }
        ]
      },
      {
        unitNumber: 4,
        name: "Unit 4: File Systems & Directory Implementations",
        weightagePercentage: 15,
        topics: [
          { id: "os_t8", title: "File Allocation Methods (Contiguous, Linked, Indexed / Inodes)", difficulty: "Medium", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Comparison", summary: "Disk block addressing, direct and indirect block pointers in Unix inodes." },
          { id: "os_t9", title: "Free Space Management (Bitmaps, Linked Lists)", difficulty: "Easy", marksWeight: "5-Mark", frequentQuestionType: "5-Mark Short", summary: "Bit vector efficiency, pointer chaining, disk space overhead." }
        ]
      },
      {
        unitNumber: 5,
        name: "Unit 5: Secondary Storage & Disk Scheduling",
        weightagePercentage: 15,
        topics: [
          { id: "os_t10", title: "Disk Arm Scheduling (SSTF, SCAN, C-SCAN, LOOK)", difficulty: "Easy", marksWeight: "5-Mark", frequentQuestionType: "5-Mark Calculation", summary: "Total head movement computation, seek time optimization, cylinder request queues." }
        ]
      }
    ]
  },
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    category: "Core Computing",
    icon: Code,
    color: "from-blue-500/15 to-cyan-500/15",
    border: "border-blue-500/30",
    units: [
      {
        unitNumber: 1,
        name: "Unit 1: Asymptotic Analysis & Linear Structures",
        weightagePercentage: 20,
        topics: [
          { id: "dsa_t1", title: "Big-O, Big-Omega, Theta & Recurrence Relations", difficulty: "Medium", marksWeight: "5-Mark", frequentQuestionType: "5-Mark Proof", summary: "Master Theorem, recursion trees, time & space complexity." },
          { id: "dsa_t2", title: "Singly, Doubly & Circular Linked Lists Operations", difficulty: "Easy", marksWeight: "5-Mark", frequentQuestionType: "5-Mark Implementation", summary: "Insertion, deletion, reversal, cycle detection (Floyd's algorithm)." }
        ]
      },
      {
        unitNumber: 2,
        name: "Unit 2: Stacks, Queues & Expression Parsing",
        weightagePercentage: 20,
        topics: [
          { id: "dsa_t3", title: "Infix to Postfix Conversion & Postfix Evaluation", difficulty: "Easy", marksWeight: "5-Mark", frequentQuestionType: "5-Mark Step-by-Step", summary: "Operator precedence, stack simulation, parenthesis matching." },
          { id: "dsa_t4", title: "Circular Queues & Priority Queues with Heaps", difficulty: "Medium", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Operations", summary: "Array wrapping formulas, binary min/max heapify operations." }
        ]
      },
      {
        unitNumber: 3,
        name: "Unit 3: Trees & Binary Search Trees (BST)",
        weightagePercentage: 25,
        topics: [
          { id: "dsa_t5", title: "Binary Tree Traversals (Inorder, Preorder, Postorder)", difficulty: "Easy", marksWeight: "5-Mark", frequentQuestionType: "5-Mark Traversal", summary: "Recursive and iterative traversals, reconstructing tree from orders." },
          { id: "dsa_t6", title: "AVL Tree Rotations (LL, RR, LR, RL) & B-Trees", difficulty: "Hard", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Derivation", summary: "Balance factor recalculation, single and double rotations, B-tree node splitting." }
        ]
      },
      {
        unitNumber: 4,
        name: "Unit 4: Graph Algorithms & Minimum Spanning Trees",
        weightagePercentage: 20,
        topics: [
          { id: "dsa_t7", title: "Graph Traversals (BFS & DFS) & Topological Sort", difficulty: "Medium", marksWeight: "5-Mark", frequentQuestionType: "5-Mark Algorithm", summary: "Queue vs recursion stack, cycle detection in directed graphs." },
          { id: "dsa_t8", title: "Shortest Paths (Dijkstra) & Minimum Spanning Trees (Prim / Kruskal)", difficulty: "Hard", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Step-by-Step", summary: "Greedy edge selection, disjoint sets union-find, relaxation step." }
        ]
      },
      {
        unitNumber: 5,
        name: "Unit 5: Dynamic Programming & Greedy Paradigms",
        weightagePercentage: 15,
        topics: [
          { id: "dsa_t9", title: "0/1 Knapsack Problem & Longest Common Subsequence (LCS)", difficulty: "Hard", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Matrix", summary: "Memoization table, state transitions, traceback for optimal solution." }
        ]
      }
    ]
  },
  {
    id: "dbms",
    name: "Database Management Systems (DBMS)",
    category: "Data Architecture",
    icon: Database,
    color: "from-amber-500/15 to-orange-500/15",
    border: "border-amber-500/30",
    units: [
      {
        unitNumber: 1,
        name: "Unit 1: ER Modeling & Relational Algebra",
        weightagePercentage: 20,
        topics: [
          { id: "dbms_t1", title: "ER Diagrams, Cardinality, & Conversion to Tables", difficulty: "Easy", marksWeight: "5-Mark", frequentQuestionType: "5-Mark Schema", summary: "Entities, attributes, relationships, foreign key constraints." },
          { id: "dbms_t2", title: "Relational Algebra Operations (Select, Project, Join)", difficulty: "Medium", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Query", summary: "Theta join, natural join, set operations, division operator." }
        ]
      },
      {
        unitNumber: 2,
        name: "Unit 2: SQL Mastery & Stored Procedures",
        weightagePercentage: 20,
        topics: [
          { id: "dbms_t3", title: "Complex Nested Queries, Aggregates & Group By", difficulty: "Medium", marksWeight: "10-Mark", frequentQuestionType: "10-Mark SQL", summary: "Correlated subqueries, HAVING clause, window functions." }
        ]
      },
      {
        unitNumber: 3,
        name: "Unit 3: Normalization & Functional Dependencies",
        weightagePercentage: 25,
        topics: [
          { id: "dbms_t4", title: "1NF, 2NF, 3NF, BCNF & Lossless Decomposition", difficulty: "Hard", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Step-by-Step", summary: "Candidate keys identification, partial dependency, transitive dependency removal." }
        ]
      },
      {
        unitNumber: 4,
        name: "Unit 4: Transaction Processing & ACID Properties",
        weightagePercentage: 20,
        topics: [
          { id: "dbms_t5", title: "Serializability & Conflict Equivalence Schedules", difficulty: "Hard", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Proof", summary: "Precedence graph testing, read-write conflict pairs." },
          { id: "dbms_t6", title: "Two-Phase Locking (2PL) Protocol & Deadlocks", difficulty: "Medium", marksWeight: "5-Mark", frequentQuestionType: "5-Mark Theory", summary: "Growing phase, shrinking phase, strict 2PL, wait-die vs wound-wait." }
        ]
      },
      {
        unitNumber: 5,
        name: "Unit 5: Indexing & Storage Engines",
        weightagePercentage: 15,
        topics: [
          { id: "dbms_t7", title: "B+ Tree Indexing & Hash Indices", difficulty: "Medium", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Diagram", summary: "Clustered vs unclustered indices, leaf node linked chains, search cost." }
        ]
      }
    ]
  },
  {
    id: "cn",
    name: "Computer Networks & Protocols",
    category: "Infrastructure",
    icon: Network,
    color: "from-cyan-500/15 to-blue-500/15",
    border: "border-cyan-500/30",
    units: [
      {
        unitNumber: 1,
        name: "Unit 1: OSI vs TCP/IP Layers & Physical Layer",
        weightagePercentage: 20,
        topics: [
          { id: "cn_t1", title: "OSI 7-Layer Model Responsibilities & PDU Encapsulation", difficulty: "Easy", marksWeight: "5-Mark", frequentQuestionType: "5-Mark Diagram", summary: "Physical to Application layer mapping, headers, packet flow." }
        ]
      },
      {
        unitNumber: 2,
        name: "Unit 2: Data Link Layer & MAC Protocols",
        weightagePercentage: 20,
        topics: [
          { id: "cn_t2", title: "Error Detection (CRC) & Sliding Window Protocols", difficulty: "Medium", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Math", summary: "Polynomial division CRC, Go-Back-N vs Selective Repeat efficiency." }
        ]
      },
      {
        unitNumber: 3,
        name: "Unit 3: Network Layer & IP Routing",
        weightagePercentage: 25,
        topics: [
          { id: "cn_t3", title: "IPv4 Subnetting, CIDR & Address Classes", difficulty: "Medium", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Numerical", summary: "Subnet masks, broadcast address calculation, usable hosts." },
          { id: "cn_t4", title: "Routing Algorithms (Distance Vector & Link State / Dijkstra)", difficulty: "Hard", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Step-by-Step", summary: "Count to infinity problem, Bellman-Ford, OSPF link state advertisements." }
        ]
      },
      {
        unitNumber: 4,
        name: "Unit 4: Transport Layer Protocols (TCP / UDP)",
        weightagePercentage: 20,
        topics: [
          { id: "cn_t5", title: "TCP 3-Way Handshake, Flow Control & AIMD Congestion Control", difficulty: "Hard", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Timing Diagram", summary: "SYN-ACK handshake, sliding window byte counts, slow start, congestion avoidance." }
        ]
      },
      {
        unitNumber: 5,
        name: "Unit 5: Application Layer & Network Security",
        weightagePercentage: 15,
        topics: [
          { id: "cn_t6", title: "DNS Resolution, HTTP/HTTPS & RSA Cryptography", difficulty: "Medium", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Architecture", summary: "Recursive DNS queries, TLS handshake, RSA public/private key generation." }
        ]
      }
    ]
  },
  {
    id: "cloud",
    name: "Cloud Computing & DevOps",
    category: "Modern Software",
    icon: Globe,
    color: "from-rose-500/15 to-pink-500/15",
    border: "border-rose-500/30",
    units: [
      {
        unitNumber: 1,
        name: "Unit 1: Cloud Service & Deployment Models",
        weightagePercentage: 20,
        topics: [
          { id: "cl_t1", title: "IaaS, PaaS, SaaS & Public/Private/Hybrid Clouds", difficulty: "Easy", marksWeight: "5-Mark", frequentQuestionType: "5-Mark Comparison", summary: "Shared responsibility model, elasticity vs scalability." }
        ]
      },
      {
        unitNumber: 2,
        name: "Unit 2: Virtualization & Containerization (Docker)",
        weightagePercentage: 25,
        topics: [
          { id: "cl_t2", title: "Type-1 vs Type-2 Hypervisors and Docker Architecture", difficulty: "Medium", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Diagram", summary: "Namespace and cgroup isolation, container images vs VMs." }
        ]
      },
      {
        unitNumber: 3,
        name: "Unit 3: Container Orchestration with Kubernetes",
        weightagePercentage: 25,
        topics: [
          { id: "cl_t3", title: "Kubernetes Control Plane, Pods, Deployments & Services", difficulty: "Hard", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Architecture", summary: "Kube-apiserver, etcd, kube-scheduler, ingress controllers." }
        ]
      },
      {
        unitNumber: 4,
        name: "Unit 4: CI/CD Pipelines & Automation",
        weightagePercentage: 15,
        topics: [
          { id: "cl_t4", title: "Continuous Integration & Automated Testing Workflows", difficulty: "Easy", marksWeight: "5-Mark", frequentQuestionType: "5-Mark Flowchart", summary: "Build artifacts, deployment strategies (blue-green, canary)." }
        ]
      },
      {
        unitNumber: 5,
        name: "Unit 5: Cloud Security & Serverless Computing",
        weightagePercentage: 15,
        topics: [
          { id: "cl_t5", title: "AWS Lambda / Functions-as-a-Service & IAM Roles", difficulty: "Medium", marksWeight: "10-Mark", frequentQuestionType: "10-Mark Architecture", summary: "Event-driven execution, cold start mitigation, least privilege access." }
        ]
      }
    ]
  }
];

export default function ExamCenterView({
  setActiveTab,
  onSelectTopic,
  onSelectTopicAction,
  onTriggerEmergency,
}: ExamCenterViewProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const currentSubject = ENGINEERING_SUBJECTS.find(s => s.id === selectedSubjectId);

  const filteredSubjects = ENGINEERING_SUBJECTS.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTopicClick = (topicTitle: string, action: "study" | "practice" | "test" | "review") => {
    if (onSelectTopicAction) {
      onSelectTopicAction(topicTitle, action);
    } else if (setActiveTab) {
      if (onSelectTopic) onSelectTopic(topicTitle, currentSubject?.name || "Engineering");
      if (action === "study") setActiveTab("nexa");
      else if (action === "practice") setActiveTab("practice");
      else if (action === "test") setActiveTab("mock_exams");
      else if (action === "review") setActiveTab("flashcards");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-0.5 text-xs font-semibold text-emerald-100 border border-white/20">
              <Target className="h-3.5 w-3.5" />
              <span>University & Diploma Board Blueprints</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Exam Center & Syllabus Blueprints
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Select any engineering subject below to reveal its exact 5-unit curriculum, marks weightages, and high-frequency exam questions.
            </p>
          </div>

          {selectedSubjectId && (
            <button
              onClick={() => setSelectedSubjectId(null)}
              className="rounded-xl bg-white/20 hover:bg-white/30 px-3.5 py-1.5 text-xs font-bold text-white border border-white/30 transition-all cursor-pointer shrink-0"
            >
              ← Choose Another Subject
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {!selectedSubjectId ? (
        /* Subject Selection Grid */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Select Your Engineering Subject
              </h2>
              <p className="text-xs text-slate-500">
                Choose a course module to view its 5-unit breakdown
              </p>
            </div>

            {/* Search filter */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subject or branch..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSubjects.map((sub, idx) => {
              const Icon = sub.icon;
              return (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className={`group relative rounded-2xl border ${sub.border} bg-gradient-to-b ${sub.color} dark:bg-slate-900/70 p-5 backdrop-blur-xl shadow-sm hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white dark:bg-white/10 shadow-sm">
                      <Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="rounded-full bg-slate-100 dark:bg-white/10 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      5 Units
                    </span>
                  </div>

                  <div className="mt-4 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {sub.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                      {sub.name}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <span>Explore Blueprint</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Detailed 5-Unit Breakdown for Selected Subject */
        currentSubject && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Subject Info Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-white/10 p-5 backdrop-blur-xl">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {currentSubject.category}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {currentSubject.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  5 Core Units • 100 Marks Total Weightage
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (onTriggerEmergency) onTriggerEmergency(currentSubject.name);
                  }}
                  className="rounded-xl bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
                >
                  <Flame className="h-3.5 w-3.5 inline mr-1" />
                  24H Survival Sprint
                </button>
              </div>
            </div>

            {/* 5 Units List */}
            <div className="space-y-4">
              {currentSubject.units.map((unit) => (
                <div
                  key={unit.unitNumber}
                  className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-5 backdrop-blur-xl shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-white/5 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {unit.name}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Exam Weightage: ~{unit.weightagePercentage}% of Paper
                      </p>
                    </div>
                    <span className="self-start sm:self-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {unit.topics.length} High-Yield Topics
                    </span>
                  </div>

                  {/* Topics List within Unit */}
                  <div className="grid grid-cols-1 gap-3">
                    {unit.topics.map((topic) => (
                      <div
                        key={topic.id}
                        className="rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 p-4 space-y-2 hover:border-emerald-500/40 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                              {topic.title}
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {topic.summary}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="rounded px-2 py-0.5 text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              {topic.marksWeight}
                            </span>
                            <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                              topic.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                              topic.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                              'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            }`}>
                              {topic.difficulty}
                            </span>
                          </div>
                        </div>

                        {/* Direct Action Triggers */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/40 dark:border-white/5 text-xs">
                          <button
                            onClick={() => handleTopicClick(topic.title, "study")}
                            className="flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 text-[11px] font-bold shadow-sm transition-all cursor-pointer"
                          >
                            <Zap className="h-3 w-3" />
                            <span>Study with Nexa</span>
                          </button>
                          <button
                            onClick={() => handleTopicClick(topic.title, "practice")}
                            className="flex items-center gap-1 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer"
                          >
                            <FileCheck2 className="h-3 w-3" />
                            <span>Practice Answers</span>
                          </button>
                          <button
                            onClick={() => handleTopicClick(topic.title, "review")}
                            className="flex items-center gap-1 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer"
                          >
                            <Layers className="h-3 w-3" />
                            <span>Flashcards</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )
      )}
    </div>
  );
}
