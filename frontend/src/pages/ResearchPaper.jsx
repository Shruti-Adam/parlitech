import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const ResearchPaper = ({ debateData, speeches }) => {
  const [generating, setGenerating] = useState(false);

  const generateResearchPaper = () => {
    if (!debateData) {
      toast.error('No debate data available');
      return;
    }

    setGenerating(true);
    
    // Simulate research paper generation
    setTimeout(() => {
      const paperContent = generatePaperContent();
      downloadPaper(paperContent);
      setGenerating(false);
      toast.success('Research paper generated successfully');
    }, 2000);
  };

  const generatePaperContent = () => {
    const topic = debateData.topic || 'Parliamentary Debate Analysis';
    const status = debateData.voting_results?.status || 'Pending';
    const forVotes = debateData.voting_results?.votes?.for || 0;
    const againstVotes = debateData.voting_results?.votes?.against || 0;
    const abstainVotes = debateData.voting_results?.votes?.abstain || 0;
    const avgSentiment = ((debateData.sentiment_analysis?.average || 0) * 100).toFixed(1);
    const publicOpinion = ((debateData.public_opinion || 0) * 100).toFixed(1);
    const totalSpeeches = speeches?.length || 0;
    
    return `================================================================================
                    RESEARCH PAPER
        AI-Powered Multi-Agent Parliamentary Intelligence System
================================================================================

TITLE: ${topic}: A Multi-Agent AI Analysis of Parliamentary Debate Dynamics

AUTHORS: ParliTech Research Team
DATE: ${new Date().toLocaleDateString()}
VERSION: 2.0 | M.Tech Research Project

================================================================================
ABSTRACT
================================================================================

This research paper presents a comprehensive analysis of the parliamentary debate 
on "${topic}" using the ParliTech AI-powered Multi-Agent Parliamentary Intelligence 
System. The system employs 15 distinct AI agents representing various political 
ideologies, simulating a realistic Lok Sabha debate environment.

The debate concluded with a ${status} outcome, with ${forVotes} votes in favor, 
${againstVotes} against, and ${abstainVotes} abstentions. The sentiment analysis 
revealed an average sentiment score of ${avgSentiment}%, while public opinion 
stood at ${publicOpinion}% approval. A total of ${totalSpeeches} speeches were 
delivered by the AI agents, providing rich data for analysis.

================================================================================
1. INTRODUCTION
================================================================================

1.1 Background
The Indian Parliament, particularly the Lok Sabha, represents one of the world's 
largest democratic deliberative bodies. Understanding the dynamics of parliamentary 
debate is crucial for political science research, policy analysis, and democratic 
governance studies.

1.2 Problem Statement
Traditional parliamentary analysis relies on manual observation and subjective 
interpretation. There is a need for an objective, data-driven approach to analyze 
debate dynamics, sentiment patterns, and voting behaviors.

1.3 Proposed Solution
ParliTech introduces a Multi-Agent AI System that simulates parliamentary debates 
using 15 intelligent agents, each with unique political ideologies, memory systems, 
and decision-making capabilities.

================================================================================
2. LITERATURE REVIEW
================================================================================

2.1 Multi-Agent Systems in Political Science
Multi-agent systems have been increasingly applied to political simulation. 
Research by Wooldridge (2009) established foundational frameworks for agent-based 
political modeling.

2.2 Sentiment Analysis in Parliamentary Discourse
Natural Language Processing techniques have revolutionized the analysis of 
political speeches. Liu (2015) demonstrated the effectiveness of sentiment 
analysis in mining political opinions.

2.3 Decision Intelligence in Policy Making
Recent advances in decision intelligence have enabled more sophisticated analysis 
of voting patterns and coalition formation (Russell & Norvig, 2020).

================================================================================
3. METHODOLOGY
================================================================================

3.1 System Architecture
The ParliTech system comprises three primary layers:

3.1.1 Multi-Agent Layer
- 15 AI agents representing key parliamentary roles
- Each agent has distinct political ideology (Left, Right, Centrist, Regional)
- Memory system for tracking previous arguments
- Influence scoring based on debate performance

3.1.2 Debate Orchestration Layer
- Sequential speech generation with real-time delivery
- Sentiment analysis using TextBlob NLP
- Public opinion simulation based on speech sentiment
- 245 MP voting simulation using coalition-based algorithms

3.1.3 Analytics and Visualization Layer
- 3D Parliament chamber visualization
- Real-time analytics dashboard
- Report generation (PDF, Excel, CSV)

3.2 Agent Personas
${debateData.agent_participation?.slice(0, 5).map(agent => `
- ${agent.name} (${agent.role}): ${agent.party}, Influence Score: ${agent.influence_score}`).join('')}

3.3 Voting Simulation
The voting simulation incorporates:
- Party seat distribution (Lok Sabha 2024 composition)
- Coalition alignment (NDA, INDIA)
- Debate sentiment impact
- Public opinion influence

================================================================================
4. RESULTS
================================================================================

4.1 Voting Outcome
- Final Status: ${status}
- Votes in Favor: ${forVotes} (${((forVotes/245)*100).toFixed(1)}%)
- Votes Against: ${againstVotes} (${((againstVotes/245)*100).toFixed(1)}%)
- Abstentions: ${abstainVotes} (${((abstainVotes/245)*100).toFixed(1)}%)

4.2 Sentiment Analysis
- Average Sentiment: ${avgSentiment}%
- Sentiment Trend: ${debateData.sentiment_analysis?.trend?.toUpperCase() || 'Neutral'}
- Volatility: ${((debateData.sentiment_analysis?.volatility || 0) * 100).toFixed(1)}%

4.3 Public Opinion
- Initial Public Opinion: 50.0%
- Final Public Opinion: ${publicOpinion}%
- Net Change: ${(publicOpinion - 50).toFixed(1)}%

4.4 Agent Performance
Most Influential Agent: ${debateData.agent_participation?.[0]?.name || 'N/A'}
Highest Sentiment Score: ${Math.max(...(debateData.sentiment_history || [0])) * 100}%

================================================================================
5. DISCUSSION
================================================================================

5.1 Key Findings
1. The multi-agent approach successfully simulated realistic parliamentary debates
2. Sentiment analysis effectively tracked debate polarity changes
3. Voting simulation accurately reflected coalition dynamics
4. Public opinion showed sensitivity to agent influence scores

5.2 Limitations
1. Limited to text-based analysis without non-verbal cues
2. Agent memory bounded to recent speeches
3. Simplified coalition dynamics

5.3 Future Work
1. Incorporate real-time fact-checking
2. Add multi-language support
3. Implement reinforcement learning for agents
4. Integrate real parliamentary data

================================================================================
6. CONCLUSION
================================================================================

This research demonstrates that Multi-Agent AI Systems can effectively simulate 
and analyze parliamentary debates. The ParliTech system provides a scalable 
framework for political analysis, offering insights into:
- Voting pattern prediction
- Sentiment dynamics
- Coalition formation
- Policy impact assessment

The system successfully processed ${totalSpeeches} speeches, analyzed sentiment 
patterns, and generated comprehensive voting predictions. The ${status} outcome 
aligns with the simulated coalition strengths and public opinion metrics.

================================================================================
7. REFERENCES
================================================================================

[1] Wooldridge, M. (2009). An Introduction to MultiAgent Systems. Wiley.
[2] Russell, S., & Norvig, P. (2020). Artificial Intelligence: A Modern Approach.
[3] Liu, B. (2015). Sentiment Analysis: Mining Opinions, Sentiments, and Emotions.
[4] LeCun, Y., Bengio, Y., & Hinton, G. (2015). Deep learning. Nature.
[5] Vaswani, A., et al. (2017). Attention is All You Need. NeurIPS.
[6] Devlin, J., et al. (2019). BERT: Pre-training of Deep Bidirectional Transformers.

================================================================================
ACKNOWLEDGMENTS
================================================================================

This research was conducted as part of an M.Tech project in Artificial Intelligence 
and Machine Learning. The authors acknowledge the guidance of faculty advisors 
and the support of the research committee.

================================================================================
APPENDIX A: Complete Voting Breakdown
================================================================================

${Object.entries(debateData.voting_results?.party_breakdown || {}).map(([party, data]) => 
  `${party}: ${data.for} For | ${data.against} Against | ${data.abstain} Abstain (${data.support_percentage}% Support)`
).join('\n')}

================================================================================
APPENDIX B: Speech Timeline
================================================================================

${speeches?.slice(0, 10).map((speech, i) => 
  `${i+1}. ${speech.agent_name} (${speech.agent_role}) - Sentiment: ${(speech.sentiment_score * 100).toFixed(1)}%`
).join('\n')}
${speeches?.length > 10 ? `\n... and ${speeches.length - 10} more speeches` : ''}

================================================================================
END OF RESEARCH PAPER
================================================================================
`;
  };

  const downloadPaper = (content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research_paper_${new Date().toISOString().slice(0, 19)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!debateData) {
    return (
      <div className="p-6 text-center text-gray-500">
        <i className="bi bi-journal-bookmark text-4xl"></i>
        <p className="mt-3">Complete a debate to generate research paper</p>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h2 className="heading-2">Research Paper Generator</h2>
        <p className="text-gray-400 text-sm">Generate academic research paper from debate data</p>
      </div>

      {/* Paper Preview Card */}
      <div className="stat-card">
        <h3 className="text-sm font-semibold text-white mb-3">Paper Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Title:</span>
            <span className="text-gray-300">{debateData.topic || 'Parliamentary Debate Analysis'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status:</span>
            <span className={`${debateData.voting_results?.status === 'PASSED' ? 'text-green-500' : 'text-red-500'}`}>
              {debateData.voting_results?.status || 'Pending'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Total Speeches:</span>
            <span className="text-gray-300">{speeches?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Average Sentiment:</span>
            <span className="text-gray-300">{((debateData.sentiment_analysis?.average || 0) * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Public Opinion:</span>
            <span className="text-gray-300">{((debateData.public_opinion || 0) * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Paper Sections Preview */}
      <div className="stat-card">
        <h3 className="text-sm font-semibold text-white mb-3">Paper Sections</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="bg-gray-800 rounded p-2 text-center">
            <i className="bi bi-file-text text-primary-400"></i>
            <p className="text-xs text-gray-400 mt-1">Abstract</p>
          </div>
          <div className="bg-gray-800 rounded p-2 text-center">
            <i className="bi bi-info-circle text-primary-400"></i>
            <p className="text-xs text-gray-400 mt-1">Introduction</p>
          </div>
          <div className="bg-gray-800 rounded p-2 text-center">
            <i className="bi bi-book text-primary-400"></i>
            <p className="text-xs text-gray-400 mt-1">Literature Review</p>
          </div>
          <div className="bg-gray-800 rounded p-2 text-center">
            <i className="bi bi-diagram-3 text-primary-400"></i>
            <p className="text-xs text-gray-400 mt-1">Methodology</p>
          </div>
          <div className="bg-gray-800 rounded p-2 text-center">
            <i className="bi bi-bar-chart text-primary-400"></i>
            <p className="text-xs text-gray-400 mt-1">Results</p>
          </div>
          <div className="bg-gray-800 rounded p-2 text-center">
            <i className="bi bi-chat-dots text-primary-400"></i>
            <p className="text-xs text-gray-400 mt-1">Discussion</p>
          </div>
          <div className="bg-gray-800 rounded p-2 text-center">
            <i className="bi bi-check-lg text-primary-400"></i>
            <p className="text-xs text-gray-400 mt-1">Conclusion</p>
          </div>
          <div className="bg-gray-800 rounded p-2 text-center">
            <i className="bi bi-bookmarks text-primary-400"></i>
            <p className="text-xs text-gray-400 mt-1">References</p>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateResearchPaper}
        disabled={generating}
        className="btn-primary w-full py-3 disabled:opacity-50"
      >
        {generating ? (
          <><i className="bi bi-hourglass-split animate-spin mr-2"></i>Generating Research Paper...</>
        ) : (
          <><i className="bi bi-journal-bookmark-fill mr-2"></i>Generate Research Paper (TXT)</>
        )}
      </button>

      {/* Note */}
      <div className="text-center text-xs text-gray-500">
        <i className="bi bi-info-circle mr-1"></i>
        Research paper includes abstract, methodology, results, discussion, and references
      </div>
    </div>
  );
};

export default ResearchPaper;