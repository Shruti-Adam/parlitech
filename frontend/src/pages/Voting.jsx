import React from 'react';
import { motion } from 'framer-motion';

const Voting = ({ votingResults, partyBreakdown }) => {
  if (!votingResults) {
    return (
      <div className="p-6 text-center text-gray-500">
        <i className="bi bi-check2-square text-4xl"></i>
        <p className="mt-3">No voting data available. Start a debate session.</p>
      </div>
    );
  }

  const { votes, status } = votingResults;
  const totalVotes = votes.for + votes.against + votes.abstain;
  const forPercentage = (votes.for / totalVotes) * 100;
  const againstPercentage = (votes.against / totalVotes) * 100;
  const abstainPercentage = (votes.abstain / totalVotes) * 100;

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h2 className="heading-2">Voting Results</h2>
        <p className="text-gray-400 text-sm">Final voting outcome and analysis</p>
      </div>

      {/* Result Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`rounded-lg p-6 text-center ${
          status === 'PASSED' ? 'bg-success/10 border border-success/30' : 'bg-error/10 border border-error/30'
        }`}
      >
        <div className={`text-4xl md:text-6xl font-bold mb-2 ${status === 'PASSED' ? 'text-success' : 'text-error'}`}>
          {status}
        </div>
        <p className="text-gray-400">
          The bill has been {status === 'PASSED' ? 'approved' : 'rejected'} by the Lok Sabha
        </p>
      </motion.div>

      {/* Vote Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card text-center">
          <div className="text-3xl font-bold text-success">{votes.for}</div>
          <div className="text-gray-400 text-sm">FOR</div>
          <div className="text-xs text-gray-500">{forPercentage.toFixed(1)}%</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-3xl font-bold text-error">{votes.against}</div>
          <div className="text-gray-400 text-sm">AGAINST</div>
          <div className="text-xs text-gray-500">{againstPercentage.toFixed(1)}%</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-3xl font-bold text-warning">{votes.abstain}</div>
          <div className="text-gray-400 text-sm">ABSTAIN</div>
          <div className="text-xs text-gray-500">{abstainPercentage.toFixed(1)}%</div>
        </div>
      </div>

      {/* Vote Bar */}
      <div className="stat-card">
        <div className="h-8 rounded-lg overflow-hidden flex">
          <div className="bg-success" style={{ width: `${forPercentage}%` }}></div>
          <div className="bg-error" style={{ width: `${againstPercentage}%` }}></div>
          <div className="bg-warning" style={{ width: `${abstainPercentage}%` }}></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Majority Required: {votes.required_majority}</span>
          <span>Total Votes: {totalVotes}</span>
          <span>Turnout: {((totalVotes / 245) * 100).toFixed(1)}%</span>
        </div>
      </div>

      {/* Coalition Analysis */}
      {votingResults.coalitions && (
        <div className="stat-card">
          <h3 className="text-sm font-semibold text-white mb-3">Coalition Analysis</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>NDA Coalition</span>
                <span>{votingResults.coalitions.NDA} seats</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(votingResults.coalitions.NDA / 245) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>INDIA Coalition</span>
                <span>{votingResults.coalitions.INDIA} seats</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(votingResults.coalitions.INDIA / 245) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Others / Neutral</span>
                <span>{votingResults.coalitions.Others} seats</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full">
                <div className="h-full bg-gray-500 rounded-full" style={{ width: `${(votingResults.coalitions.Others / 245) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Voting;