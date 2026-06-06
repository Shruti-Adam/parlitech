import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const API_URL = 'https://parlitech.onrender.com';

const Reports = ({ debateData, speeches }) => {
  const [generating, setGenerating] = useState(false);

  const downloadFile = async (endpoint, filename, isBlob = true) => {
    if (!debateData) {
      toast.error('No debate data available');
      return;
    }
    
    setGenerating(true);
    try {
      const response = await axios.post(`${API_URL}/api/reports/${endpoint}`, debateData, {
        responseType: isBlob ? 'blob' : 'text'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(`${filename} downloaded successfully`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error(`Failed to download ${filename}`);
    } finally {
      setGenerating(false);
    }
  };

  const downloadPDF = () => downloadFile('pdf', `debate_report_${new Date().toISOString().slice(0,19)}.pdf`, true);
  const downloadExcel = () => downloadFile('excel', `debate_report_${new Date().toISOString().slice(0,19)}.xlsx`, true);
  const downloadCSV = () => downloadFile('csv', `debate_report_${new Date().toISOString().slice(0,19)}.csv`, false);
  const downloadResearchPaper = () => downloadFile('research-paper', `research_paper_${new Date().toISOString().slice(0,19)}.pdf`, true);

  if (!debateData) {
    return (
      <div className="p-6 text-center text-gray-500">
        <i className="bi bi-file-text text-4xl"></i>
        <p className="mt-3">Complete a debate to generate reports</p>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h2 className="heading-2">Reports & Documentation</h2>
        <p className="text-gray-400 text-sm">Exportable reports and analysis documents</p>
      </div>

      {/* Report Options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={downloadPDF}
          disabled={generating}
          className="stat-card text-center hover:border-primary-500 transition-all disabled:opacity-50 cursor-pointer"
        >
          <i className="bi bi-file-pdf text-3xl text-red-500"></i>
          <p className="mt-2 font-medium text-white">PDF Report</p>
          <p className="text-xs text-gray-500">Complete debate analysis</p>
        </button>
        
        <button
          onClick={downloadExcel}
          disabled={generating}
          className="stat-card text-center hover:border-primary-500 transition-all disabled:opacity-50 cursor-pointer"
        >
          <i className="bi bi-file-excel text-3xl text-green-500"></i>
          <p className="mt-2 font-medium text-white">Excel Export</p>
          <p className="text-xs text-gray-500">Raw data and metrics</p>
        </button>
        
        <button
          onClick={downloadCSV}
          disabled={generating}
          className="stat-card text-center hover:border-primary-500 transition-all disabled:opacity-50 cursor-pointer"
        >
          <i className="bi bi-file-text text-3xl text-blue-500"></i>
          <p className="mt-2 font-medium text-white">CSV Export</p>
          <p className="text-xs text-gray-500">Voting records</p>
        </button>
        
        <button
          onClick={downloadResearchPaper}
          disabled={generating}
          className="stat-card text-center hover:border-primary-500 transition-all disabled:opacity-50 cursor-pointer"
        >
          <i className="bi bi-journal-bookmark text-3xl text-yellow-500"></i>
          <p className="mt-2 font-medium text-white">Research Paper</p>
          <p className="text-xs text-gray-500">Academic format (PDF)</p>
        </button>
      </div>

      {/* Report Preview */}
      <div className="stat-card">
        <h3 className="text-sm font-semibold text-white mb-3">Report Preview</h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-gray-500">Executive Summary</p>
            <p className="text-gray-300 mt-1">
              Parliamentary debate on the proposed legislation concluded with a {debateData.voting_results?.status} outcome.
              Total speeches: {speeches?.length || 0}. Average sentiment: {((debateData.sentiment_analysis?.average || 0) * 100).toFixed(1)}%.
            </p>
          </div>
          <div>
            <p className="text-gray-500">Key Participants</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {debateData.agent_participation?.slice(0, 5).map(agent => (
                <span key={agent.agent_id} className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-300">
                  {agent.name} (INF: {agent.influence_score})
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-gray-500">Voting Summary</p>
            <div className="grid grid-cols-3 gap-2 mt-1 text-center">
              <div className="bg-green-900/20 rounded p-2">
                <div className="text-green-500 font-bold">{debateData.voting_results?.votes?.for || 0}</div>
                <div className="text-xs text-gray-500">For</div>
              </div>
              <div className="bg-red-900/20 rounded p-2">
                <div className="text-red-500 font-bold">{debateData.voting_results?.votes?.against || 0}</div>
                <div className="text-xs text-gray-500">Against</div>
              </div>
              <div className="bg-yellow-900/20 rounded p-2">
                <div className="text-yellow-500 font-bold">{debateData.voting_results?.votes?.abstain || 0}</div>
                <div className="text-xs text-gray-500">Abstain</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generation Indicator */}
      {generating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <i className="bi bi-hourglass-split text-3xl text-primary-500 animate-spin"></i>
            <p className="mt-3 text-white">Generating report...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;