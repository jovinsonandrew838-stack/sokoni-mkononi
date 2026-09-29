import React, { useState } from 'react';
import { Language } from '../../types';
import { sound } from '../../utils/audio';

interface GitHubSyncModalProps {
  onClose: () => void;
  lang: Language;
}

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({
  onClose,
  lang,
}) => {
  const [token, setToken] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const repoUrl = 'https://github.com/jovinsonandrew838-stack/sokoni-mkononi';
  const remoteUrl = 'https://github.com/jovinsonandrew838-stack/sokoni-mkononi.git';

  const cleanToken = token.trim();
  const pushCommandWithToken = cleanToken
    ? `git push https://${cleanToken}@github.com/jovinsonandrew838-stack/sokoni-mkononi.git main`
    : `git push -u origin main`;

  const handleCopy = (text: string, id: string) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl p-6 sm:p-8 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                {lang === 'sw' ? 'Muunganisho wa GitHub' : 'GitHub Repository Connection'}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                jovinsonandrew838-stack/sokoni-mkononi
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Repository Details Card */}
        <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">{lang === 'sw' ? 'Hali ya Git ya Mradi:' : 'Git Status:'}</span>
            <span className="font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              {lang === 'sw' ? 'Imeunganishwa (Configured)' : 'Configured'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Remote Origin:</span>
            <span className="font-mono text-slate-800 text-[11px] truncate max-w-[280px]">
              {remoteUrl}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Branch Kuu:</span>
            <span className="font-mono font-bold text-slate-900">main</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">{lang === 'sw' ? 'Commit ya Mwisho:' : 'Latest Commit:'}</span>
            <span className="font-mono text-[11px] text-slate-700">
              feat: Mfumo wa Sokoni Mkononi - Gawio la 5%
            </span>
          </div>
        </div>

        {/* Push to GitHub Section */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {lang === 'sw' ? 'Sukuma Code Yako Kwenye GitHub' : 'Push Code to GitHub'}
            </h4>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-700 hover:underline font-semibold"
            >
              {lang === 'sw' ? 'Fungua Repository →' : 'Open Repo →'}
            </a>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {lang === 'sw'
              ? 'Ili kusukuma mabadiliko (push) kwenye repository yako ya GitHub, unaweza kuweka GitHub Personal Access Token yako hapa chini au kutumia amri hii moja kwa moja:'
              : 'To push your code to your GitHub repo, run this command or enter your GitHub Personal Access Token below:'}
          </p>

          {/* Token Input */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              {lang === 'sw' ? 'GitHub Personal Access Token (Hiari):' : 'GitHub Personal Access Token (Optional):'}
            </label>
            <input
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              {lang === 'sw'
                ? 'Pata token hii kwenye: GitHub -> Settings -> Developer Settings -> Personal Access Tokens (Tokens classic) yenye ruhusa ya `repo`.'
                : 'Generate a token with `repo` scope at GitHub Settings -> Developer settings -> Personal access tokens.'}
            </p>
          </div>

          {/* Code block to run */}
          <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs flex items-center justify-between gap-3 border border-slate-800">
            <code className="truncate">{pushCommandWithToken}</code>
            <button
              type="button"
              onClick={() => handleCopy(pushCommandWithToken, 'cmd')}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-sans font-semibold cursor-pointer shrink-0 transition-colors"
            >
              {copied === 'cmd' ? (lang === 'sw' ? 'Imenakiliwa!' : 'Copied!') : (lang === 'sw' ? 'Kopi Amri' : 'Copy')}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2.5">
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl text-center transition-colors cursor-pointer"
          >
            {lang === 'sw' ? 'Tazama Kwenye GitHub' : 'View on GitHub'}
          </a>
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            {lang === 'sw' ? 'Funga' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
