import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  User,
  Mail,
  BookOpen,
  CheckCircle,
  BarChart3,
  TrendingUp,
  Users,
  Award,
  Target
} from 'lucide-react';
import { db } from './firebase';
import './styles.css';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import WelcomePage from './WelcomePage';

const NEPSurvey = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [allResponses, setAllResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const surveySteps = [
    {
      title: "Personal Information",
      subtitle: "Let's get to know you (optional)",
      fields: [
        {
          id: 'fullName',
          label: 'Full Name',
          type: 'text',
          placeholder: 'Enter your full name',
          icon: User,
          required: false
        },
        {
          id: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'Enter your email address',
          icon: Mail,
          required: false
        }
      ]
    },
    {
      title: "Academic Background",
      subtitle: "Tell us about your academic journey",
      question: "What is your academic stream?",
      questionId: 1,
      type: 'radio',
      options: ['Arts', 'Commerce', 'Science']
    },
    {
      title: "Current Status",
      subtitle: "Help us understand your current situation",
      question: "Which of the following best describes your status?",
      questionId: 2,
      type: 'radio',
      options: ['Current student (3rd year)', 'Alumni (studied before NEP)', 'Other']
    },
    {
      title: "NEP Awareness",
      subtitle: "Let's assess your knowledge about NEP 2020",
      question: "Are you aware of the National Education Policy (NEP) 2020?",
      questionId: 3,
      type: 'radio',
      options: ['Yes', 'No']
    },
    {
      title: "Awareness Level",
      subtitle: "Rate your understanding",
      question: "How would you rate your awareness of the National Education Policy (NEP) 2020?",
      questionId: 4,
      type: 'radio',
      options: ['Very aware', 'Somewhat aware', 'Not very aware', 'Unaware']
    },
    {
      title: "Overall Opinion",
      subtitle: "Share your perspective on NEP changes",
      question: "Overall, how do you feel about the changes brought by the NEP 2020?",
      questionId: 5,
      type: 'radio',
      options: ['Very Positive', 'Somewhat Positive', 'Neutral', 'Somewhat Negative', 'Very Negative']
    },
    {
      title: "Skill-Based Learning",
      subtitle: "Your thoughts on practical experience",
      question: "Do you agree that the NEP's focus on skill-based learning and practical experience will help students in their future careers?",
      questionId: 6,
      type: 'radio',
      options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree']
    },
    {
      title: "New Subjects",
      subtitle: "Evaluate curriculum additions",
      question: "To what extent do you agree that the new subjects introduced by NEP 2020 (e.g., Indian Culture, IKS) are a valuable addition to the curriculum?",
      questionId: 7,
      type: 'radio',
      options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree']
    },
    {
      title: "Practical Opportunities",
      subtitle: "Internships and hands-on training",
      question: "Has NEP 2020 increased your opportunities for internships or hands-on training?",
      questionId: 8,
      type: 'radio',
      options: ['Yes', 'No', "I'm not sure"]
    },
    {
      title: "Implementation Quality",
      subtitle: "Rate your college's performance",
      question: "How well do you believe your college has implemented the NEP 2020?",
      questionId: 9,
      type: 'radio',
      options: ['Very well', 'Adequately', 'Poorly', 'I am not sure']
    },
    {
      title: "Syllabus Evaluation",
      subtitle: "Assess the workload",
      question: "How would you describe the syllabus under the NEP 2020 framework?",
      questionId: 10,
      type: 'radio',
      options: ['Manageable', 'Slightly burdensome', 'Very burdensome']
    },
    {
      title: "Technology Focus",
      subtitle: "Digital transformation in education",
      question: "Do you believe the NEP's focus on technology in education is a step in the right direction?",
      questionId: 11,
      type: 'radio',
      options: ['Yes, definitely', 'Yes, to some extent', 'No, not really', 'No, not at all']
    },
    {
      title: "Implementation Challenges",
      subtitle: "Identify the biggest obstacles",
      question: "In your opinion, which of the following is the biggest challenge of the NEP's implementation?",
      questionId: 12,
      type: 'radio',
      options: [
        'Heavy syllabus',
        'Lack of adequate infrastructure',
        'Lack of awareness among students',
        'Transportation issues',
        'Other (please specify)'
      ],
      hasOther: true
    },
    {
      title: "Academic Routine Changes",
      subtitle: "Impact on your daily academic life",
      question: "How much has the NEP 2020 changed your academic routine (e.g., subject selection, class structure)?",
      questionId: 13,
      type: 'radio',
      options: ['A lot', 'Somewhat', 'Not much', 'Not at all']
    },
    {
      title: "Academic Flexibility",
      subtitle: "For current students",
      question: "Do you feel your academic experience is more flexible than what you've heard about the pre-NEP system?",
      questionId: 14,
      type: 'radio',
      options: ['Yes, much more flexible', 'Yes, slightly more flexible', 'No, it is about the same', 'No, it is less flexible'],
      conditional: (data) => data[2] === 'Current student (3rd year)'
    },
    {
      title: "Retrospective View",
      subtitle: "For alumni",
      question: "Do you feel that your education would have been better with the inclusion of practical training and internships as emphasized by NEP 2020?",
      questionId: 15,
      type: 'radio',
      options: ['Yes, definitely', 'Yes, probably', 'No, probably not', 'No, definitely not'],
      conditional: (data) => data[2] === 'Alumni (studied before NEP)'
    }
  ];

  const getVisibleSteps = () => {
    return surveySteps.filter((step, index) => {
      if (index === 0) return true; // Always show personal info
      if (!step.conditional) return true;
      return step.conditional(formData);
    });
  };

  const visibleSteps = getVisibleSteps();

  // Fetch all responses for statistics
  const fetchAllResponses = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, 'survey_responses'), orderBy('submittedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const responses = [];
      querySnapshot.forEach((doc) => {
        responses.push(doc.data());
      });
      setAllResponses(responses);
    } catch (error) {
      console.error('Error fetching responses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate statistics for each question
  const calculateStats = (questionId) => {
    if (allResponses.length === 0) return {};
    const questionResponses = allResponses
      .map((response) => response[questionId])
      .filter((answer) => answer);
    const stats = {};
    questionResponses.forEach((answer) => {
      stats[answer] = (stats[answer] || 0) + 1;
    });
    const total = questionResponses.length;
    Object.keys(stats).forEach((key) => {
      stats[key] = Math.round((stats[key] / total) * 100);
    });
    return stats;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < visibleSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const submissionData = {
        ...formData,
        submittedAt: new Date().toISOString(),
        timestamp: Date.now()
      };
      await addDoc(collection(db, 'survey_responses'), submissionData);
      setIsSubmitted(true);
      await fetchAllResponses();
      setTimeout(() => {
        setShowStats(true);
      }, 2000);
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('There was an error submitting your response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    const currentStepData = visibleSteps[currentStep];
    if (currentStepData.fields) return true; // Personal info is optional
    return currentStepData.questionId && formData[currentStepData.questionId];
  };

  // Stats chart (uses .stat-* classes from styles.css)
  const StatChart = ({ questionId, title }) => {
    const stats = calculateStats(questionId);
    const userAnswer = formData[questionId];
    if (!stats || Object.keys(stats).length === 0) return null;

    return (
      <div className="stat-chart-card">
        <div className="stat-chart-header">
          <BarChart3 size={24} color="#c4b5fd" />
          <h3 className="stat-chart-title">{title}</h3>
        </div>

        <div>
          {Object.entries(stats).map(([option, percentage]) => {
            const selected = option === userAnswer;
            return (
              <div key={option} className="stat-item">
                <div className="stat-row">
                  <span className={`stat-label ${selected ? 'selected' : ''}`}>
                    {option} {selected ? '👤' : ''}
                  </span>
                  <span className="stat-percentage">{percentage}%</span>
                </div>
                <div className="stat-bar-bg">
                  <div
                    className={`stat-bar ${selected ? 'selected' : ''}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Welcome page screen
  if (!isStarted) {
    return (
      <div className="survey-container">
        {/* background glow blobs */}
        <div className="bg-element-1" />
        <div className="bg-element-2" />
        <div className="bg-element-3" />

        <WelcomePage onStart={() => setIsStarted(true)} />
      </div>
    );
  }

  // Final statistics dashboard
  if (isSubmitted && showStats) {
    return (
      <div className="stats-dashboard">
        {/* background glow blobs */}
        <div className="bg-element-1" />
        <div className="bg-element-2" />
        <div className="bg-element-3" />

        <div className="stats-content">
          <div className="stats-main-header">
            <div className="stats-main-title">
              <Award size={36} color="#facc15" />
              <span>Survey Results Dashboard</span>
            </div>
            <p className="stats-main-subtitle">
              See how your responses compare with {allResponses.length} other participants
            </p>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div className="loading-spinner loading-spinner-large" style={{ color: '#c4b5fd' }} />
              <p className="stats-main-subtitle" style={{ marginTop: '1rem' }}>
                Loading statistics...
              </p>
            </div>
          ) : (
            <div className="stats-grid">
              {visibleSteps.filter((s) => s.questionId).map((step) => (
                <StatChart key={step.questionId} questionId={step.questionId} title={step.question} />
              ))}
            </div>
          )}

          {/* summary tiles */}
          <div className="summary-grid">
            <div className="summary-card">
              <Users size={28} color="#60a5fa" style={{ margin: '0 auto 0.75rem' }} />
              <div className="summary-number">{allResponses.length}</div>
              <div className="summary-label">Total Responses</div>
            </div>

            <div className="summary-card">
              <Target size={28} color="#34d399" style={{ margin: '0 auto 0.75rem' }} />
              <div className="summary-number">{visibleSteps.length - 1}</div>
              <div className="summary-label">Questions Answered</div>
            </div>

            <div className="summary-card">
              <TrendingUp size={28} color="#a78bfa" style={{ margin: '0 auto 0.75rem' }} />
              <div className="summary-number">100%</div>
              <div className="summary-label">Survey Completion</div>
            </div>
          </div>

          {/* Thank you band */}
          <div className="stats-container" style={{ marginTop: '2rem', textAlign: 'center' }}>
            <div className="thank-you-emoji">🎉</div>
            <div className="stats-title">Thank You for Your Participation!</div>
            <p className="stats-main-subtitle" style={{ marginTop: '0.5rem' }}>
              Your feedback helps shape the future of education and contributes to meaningful policy discussions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Intermediate thank-you while loading stats
  if (isSubmitted && !showStats) {
    return (
      <div className="thank-you-container">
        <div className="thank-you-card">
          <div className="thank-you-emoji">🎉</div>
          <h1 className="thank-you-title">Thank You!</h1>
          <p className="thank-you-text">
            Thanks for participating! Your feedback helps shape the future of education.
          </p>

          {isSubmitting ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
              <div className="loading-spinner" style={{ color: 'white' }} />
              <span style={{ color: 'white' }}>Submitting your response...</span>
            </div>
          ) : (
            <div className="stats-container">
              <div className="success-box" style={{ marginBottom: '0.75rem' }}>
                <CheckCircle size={32} color="#86efac" style={{ display: 'block', margin: '0 auto 0.5rem' }} />
                <p className="success-text" style={{ textAlign: 'center' }}>
                  Response submitted successfully!
                </p>
              </div>
              <div className="success-box" style={{ background: 'rgba(59,130,246,0.2)', borderColor: 'rgba(147,197,253,0.3)' }}>
                <BarChart3 size={32} color="#93c5fd" style={{ display: 'block', margin: '0 auto 0.5rem' }} />
                <p className="success-text" style={{ color: '#bfdbfe', textAlign: 'center' }}>
                  Loading survey statistics...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentStepData = visibleSteps[currentStep];
  const progress = ((currentStep + 1) / visibleSteps.length) * 100;

  return (
    <div className="survey-container">
      {/* background glow blobs */}
      <div className="bg-element-1" />
      <div className="bg-element-2" />
      <div className="bg-element-3" />

      <div className="main-content">
        {/* progress */}
        <div className="progress-container">
          <div className="progress-info">
            <span className="progress-text">Step {currentStep + 1} of {visibleSteps.length}</span>
            <span className="progress-text">{Math.round(progress)}% Complete</span>
          </div>
          <div className="progress-bg">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* form card */}
        <div className="form-card">
          <div className="form-header">
            <h1 className="form-title">{currentStepData.title}</h1>
            <p className="form-subtitle">{currentStepData.subtitle}</p>
          </div>

          {/* Personal info */}
          {currentStepData.fields && (
            <div>
              {currentStepData.fields.map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.id} className="field-container">
                    <label className="field-label">
                      {field.label} {field.required && <span style={{ color: '#f87171' }}>*</span>}
                    </label>
                    <div className="input-wrapper">
                      <Icon className="input-icon" />
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Question */}
          {currentStepData.question && (
            <div>
              <h2 className="question-title">{currentStepData.question}</h2>
              <div className="options-container">
                {currentStepData.options.map((option, index) => (
                  <div key={index} className="option-item">
                    <label className="option-label">
                      <input
                        type="radio"
                        className="option-radio"
                        name={`question-${currentStepData.questionId}`}
                        value={option}
                        checked={formData[currentStepData.questionId] === option}
                        onChange={(e) => handleInputChange(currentStepData.questionId, e.target.value)}
                      />
                      <span className="option-text">{option}</span>
                    </label>

                    {option.includes('Other') && formData[currentStepData.questionId] === option && (
                      <input
                        type="text"
                        className="other-input"
                        placeholder="Please specify..."
                        value={formData[`${currentStepData.questionId}_other`] || ''}
                        onChange={(e) => handleInputChange(`${currentStepData.questionId}_other`, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="navigation">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="btn btn-previous"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            {currentStep === visibleSteps.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid() || isSubmitting}
                className="btn btn-submit"
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner" style={{ color: 'white' }} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Submit Survey
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={currentStepData.questionId && !isStepValid()}
                className="btn btn-next"
              >
                Next
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NEPSurvey;
