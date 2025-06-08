import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Progress } from '../components/ui/progress';
import { Star, Clock, Target, BookOpen, Lightbulb, CheckCircle } from 'lucide-react';
import { mockApi } from '../data/mockData';

const PromptLearning = () => {
  const [user, setUser] = useState<any>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null);
  const [userInput, setUserInput] = useState('');
  const [userOutput, setUserOutput] = useState('');
  const [selfRating, setSelfRating] = useState<number>(0);
  const [feedback, setFeedback] = useState({ whatWorked: '', whatDidntWork: '', improvements: '' });
  const [startTime, setStartTime] = useState<number | null>(null);

  // Load sample user data
  useEffect(() => {
    mockApi.users.getSampleUser().then(setUser);
  }, []);

  // Mock prompts for demonstration
  const mockPrompts = [
    {
      _id: "prompt1",
      title: "Creative Story Starter",
      category: "creative",
      difficulty: "beginner" as const,
      tags: ["storytelling", "creativity", "writing"],
      prompt: {
        instruction: "Write a creative story beginning based on the given scenario. Focus on setting the scene and introducing an interesting character.",
        context: "You'll be given a simple scenario. Your job is to expand it into an engaging story opening that hooks the reader.",
        examples: [
          {
            input: "A person finds a mysterious key in their grandmother's attic",
            output: "Sarah's fingers trembled as she lifted the ornate brass key from beneath the dusty photo albums. The metal was warm to the touch, almost pulsing with an energy that made her skin tingle.",
            explanation: "This example shows how to take a simple premise and add sensory details, emotion, and mystery."
          }
        ],
        tips: [
          "Use sensory details to make the scene vivid",
          "Create immediate intrigue or questions",
          "Establish the character's emotional state"
        ]
      },
      learningObjectives: ["Practice creative writing", "Learn story structure", "Develop character voice"],
      estimatedTime: 15,
      xpReward: 100,
    },
    {
      _id: "prompt2",
      title: "Problem-Solution Analysis",
      category: "analytical",
      difficulty: "intermediate" as const,
      tags: ["analysis", "problem-solving", "critical-thinking"],
      prompt: {
        instruction: "Analyze a given problem and propose a structured solution. Break down the problem into components and provide a step-by-step approach.",
        context: "You'll receive a real-world problem scenario. Your task is to demonstrate analytical thinking by identifying root causes and proposing actionable solutions.",
        examples: [
          {
            input: "A small business is losing customers to online competitors",
            output: "**Problem Analysis:**\n1. Root causes: Limited online presence, higher prices, outdated customer experience\n2. Impact: 30% revenue decline\n\n**Solution Framework:**\n1. Digital transformation\n2. Competitive pricing strategy\n3. Enhanced customer service",
            explanation: "This shows structured problem-solving with clear analysis and actionable solutions."
          }
        ],
        tips: [
          "Always identify root causes, not just symptoms",
          "Propose specific, actionable solutions",
          "Consider implementation feasibility"
        ]
      },
      learningObjectives: ["Develop analytical thinking", "Learn problem-solving frameworks", "Practice structured communication"],
      estimatedTime: 25,
      xpReward: 150,
    }
  ];

  const handleStartPrompt = (prompt: any) => {
    setSelectedPrompt(prompt);
    setUserInput('');
    setUserOutput('');
    setStartTime(Date.now());
    setSelfRating(0);
    setFeedback({ whatWorked: '', whatDidntWork: '', improvements: '' });
  };

  const handleCompleteAttempt = async () => {
    if (!userOutput.trim() || !startTime) return;

    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const result = await mockApi.learning.completePromptAttempt({
        attemptId: "mock-attempt",
        userOutput: userOutput.trim(),
        timeSpent,
        selfRating: selfRating > 0 ? selfRating : undefined,
        feedback: selfRating > 0 ? feedback : undefined,
      });

      alert(`Congratulations! You earned ${result.xpEarned} XP!`);
      
      // Reset state
      setSelectedPrompt(null);
      setUserInput('');
      setUserOutput('');
      setStartTime(null);
      setSelfRating(0);
      setFeedback({ whatWorked: '', whatDidntWork: '', improvements: '' });
    } catch (error) {
      console.error('Failed to complete attempt:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Prompt Learning Lab</h1>
        <p className="text-gray-600">Practice and improve your prompting skills with personalized exercises</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Prompt Selection */}
        <div className="lg:col-span-2">
          {!selectedPrompt ? (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Available Prompts</h2>
              <div className="space-y-4">
                {mockPrompts.map((prompt) => (
                  <Card key={prompt._id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{prompt.title}</CardTitle>
                          <CardDescription className="mt-1">{prompt.prompt.instruction}</CardDescription>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getDifficultyColor(prompt.difficulty)}>
                            {prompt.difficulty}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            {prompt.estimatedTime}m
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {prompt.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            {prompt.xpReward} XP
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {prompt.learningObjectives.length} objectives
                          </span>
                        </div>
                        <Button onClick={() => handleStartPrompt(prompt)}>
                          Start Prompt
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            /* Prompt Workspace */
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">{selectedPrompt.title}</h2>
                <Button variant="ghost" onClick={() => setSelectedPrompt(null)}>
                  Back to Prompts
                </Button>
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{selectedPrompt.prompt.instruction}</p>
                  {selectedPrompt.prompt.context && (
                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-blue-800">{selectedPrompt.prompt.context}</p>
                    </div>
                  )}
                  
                  {selectedPrompt.prompt.examples.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Example:</h4>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="mb-2">
                          <span className="font-medium text-sm">Input: </span>
                          <span className="text-sm">{selectedPrompt.prompt.examples[0].input}</span>
                        </div>
                        <div className="mb-2">
                          <span className="font-medium text-sm">Output: </span>
                          <span className="text-sm">{selectedPrompt.prompt.examples[0].output}</span>
                        </div>
                        {selectedPrompt.prompt.examples[0].explanation && (
                          <div className="text-xs text-gray-600 italic">
                            {selectedPrompt.prompt.examples[0].explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Tips:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedPrompt.prompt.tips.map((tip: string, index: number) => (
                        <li key={index} className="text-sm text-gray-700">{tip}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Input Section */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Your Input</CardTitle>
                  <CardDescription>
                    Provide your input for this prompt exercise
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter your input here..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="min-h-[100px] mb-4"
                  />
                </CardContent>
              </Card>

              {/* Output Section */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Your Response</CardTitle>
                  <CardDescription>
                    Write your response based on the input above
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Write your response here..."
                    value={userOutput}
                    onChange={(e) => setUserOutput(e.target.value)}
                    className="min-h-[200px] mb-4"
                  />
                  
                  {/* Self-Rating */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Rate your performance:</h4>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setSelfRating(rating)}
                          className={`p-1 ${selfRating >= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        >
                          <Star className="h-5 w-5 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feedback */}
                  {selfRating > 0 && (
                    <div className="space-y-3 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">What worked well?</label>
                        <Textarea
                          placeholder="What aspects of your response were effective?"
                          value={feedback.whatWorked}
                          onChange={(e) => setFeedback(prev => ({ ...prev, whatWorked: e.target.value }))}
                          className="min-h-[60px]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">What could be improved?</label>
                        <Textarea
                          placeholder="What would you do differently next time?"
                          value={feedback.improvements}
                          onChange={(e) => setFeedback(prev => ({ ...prev, improvements: e.target.value }))}
                          className="min-h-[60px]"
                        />
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleCompleteAttempt}
                    disabled={!userOutput.trim()}
                    className="w-full"
                  >
                    Complete Exercise
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">No attempts yet. Start your first prompt!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PromptLearning;