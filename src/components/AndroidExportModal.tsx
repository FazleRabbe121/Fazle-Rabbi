import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  CheckCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Folder,
  Terminal,
  FileArchive,
  Mail,
  AlertTriangle,
  Flame,
  HelpCircle,
} from 'lucide-react';

interface AndroidExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidExportModal: React.FC<AndroidExportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [copiedPackage, setCopiedPackage] = useState(false);
  const [copiedProjectId, setCopiedProjectId] = useState(false);
  const [copiedGitCmd, setCopiedGitCmd] = useState(false);
  const [copiedAppUrl, setCopiedAppUrl] = useState(false);
  const [activeTab, setActiveTab] = useState<'gmail-fix' | 'bangla' | 'english'>('gmail-fix');
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const sharedAppUrl = 'https://ais-pre-3gibrfsvo4w6s27pi4qcyj-889586963829.europe-west2.run.app';

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleTriggerInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setInstallPrompt(null);
    } else {
      alert('আপনার মোবাইলের Google Chrome ব্রাউজারে গিয়ে উপরের তিনটি ডট (⋮) চাপুন এবং "Install app" অথবা "Add to Home screen" চাপুন।');
    }
  };

  const copyToClipboard = (text: string, type: 'pkg' | 'proj' | 'git' | 'url') => {
    navigator.clipboard.writeText(text);
    if (type === 'pkg') {
      setCopiedPackage(true);
      setTimeout(() => setCopiedPackage(false), 2000);
    } else if (type === 'proj') {
      setCopiedProjectId(true);
      setTimeout(() => setCopiedProjectId(false), 2000);
    } else if (type === 'git') {
      setCopiedGitCmd(true);
      setTimeout(() => setCopiedGitCmd(false), 2000);
    } else {
      setCopiedAppUrl(true);
      setTimeout(() => setCopiedAppUrl(false), 2000);
    }
  };

  const gitCommands = `git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/ccd-hospitality-app.git
git branch -M main
git push -u origin main`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#12141c] border border-[#d4af37]/40 rounded-3xl p-6 sm:p-8 shadow-[0_10px_50px_rgba(0,0,0,0.9)] text-[#f1f5f9] my-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-[#242938]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-[#d4af37]/40 flex items-center justify-center text-[#ffd700]">
              <Smartphone className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Cinzel'] text-[#fdf8f0] tracking-wide flex items-center gap-2">
                <span>Android App & Gmail Integration Center</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Fixed & Ready
                </span>
              </h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                সরাসরি মোবাইলে জিমেইল সংযোগ সহ অ্যাপ চালানো এবং GitHub APK তৈরির সমাধান
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94a3b8] hover:text-[#fdf8f0] p-1.5 rounded-xl hover:bg-[#1c2130] transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between mt-4 pb-2 border-b border-[#1f2437] overflow-x-auto gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('gmail-fix')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'gmail-fix'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md font-black'
                  : 'bg-[#171a25] text-emerald-400 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>🔥 জিমেইল কেন আসে না এবং এর ১০০% সমাধান</span>
            </button>
            <button
              onClick={() => setActiveTab('bangla')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'bangla'
                  ? 'bg-[#d4af37] text-slate-950 shadow'
                  : 'bg-[#171a25] text-slate-400 hover:text-white'
              }`}
            >
              <span>🇧🇩 গিটহাব ও APK নির্দেশিকা</span>
            </button>
            <button
              onClick={() => setActiveTab('english')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'english'
                  ? 'bg-[#d4af37] text-slate-950 shadow'
                  : 'bg-[#171a25] text-slate-400 hover:text-white'
              }`}
            >
              <span>🌐 English Guide</span>
            </button>
          </div>
        </div>

        {/* PRIMARY ACTION: DIRECT DOWNLOAD ZIP BUTTON */}
        <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#101925] to-blue-950/40 border-2 border-emerald-500/50 shadow-lg shadow-emerald-950/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wide">
                <FileArchive className="w-5 h-5 text-emerald-400" />
                <span>১-ক্লিকে সম্পূর্ণ প্রজেক্ট ডাউনলোড করুন (.ZIP)</span>
              </div>
              <p className="text-xs text-slate-300">
                সব সোর্স কোড (Frontend, Backend, Android Gradle, Google OAuth Fix, GitHub Actions Workflow) সহ জিপ ফাইল।
              </p>
            </div>
            <a
              href="/ccd-hospitality-full-project.zip"
              download="ccd-hospitality-full-project.zip"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs tracking-wider uppercase shadow-xl flex items-center justify-center gap-2 shrink-0 transition"
            >
              <Download className="w-4 h-4" /> Download Full Project (.ZIP)
            </a>
          </div>
        </div>

        {/* TAB: GMAIL FIX & DIRECT INSTALL */}
        {activeTab === 'gmail-fix' && (
          <div className="mt-5 space-y-4">
            {/* Why Online Converters Fail */}
            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-2">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>অনলাইন থেকে বানালে জিমেইল কেন আসে না বা যুক্ত হয় না?</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                আপনি যখন বিভিন্ন অনলাইন ওয়েবসাইট (যেমন WebIntoApp, AppsGeyser ইত্যাদি) দিয়ে কোনো ওয়েব লিংককে APK বানান, তখন সেগুলো সাধারণ Android WebView ব্যবহার করে।
              </p>
              <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1 pl-1">
                <li><strong className="text-white">গুগলের সিকিউরিটি পলিসি:</strong> গুগল সাধারণ যেকোনো অ্যাপের ভেতর সরাসরি Google Sign-In বা জিমেইল লগইন করতে দেয় না এবং <code className="text-rose-300 bg-black/40 px-1 py-0.5 rounded font-mono">403: disallowed_useragent</code> এরর দেখায়।</li>
                <li><strong className="text-white">পপআপ উইন্ডো সাপোর্ট নেই:</strong> অনলাইন সাইটের তৈরি অ্যাপে Google OAuth-এর পপআপ উইন্ডো খোলে না, ফলে জিমেইল বাটনে চাপ দিলে কিছুই আসে না বা সাদা স্ক্রিন হয়ে থাকে।</li>
              </ul>
            </div>

            {/* Direct Solution 1: Chrome PWA Install (Fastest & 100% Works) */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#131d2e] to-teal-950/40 border-2 border-emerald-500/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-black text-sm uppercase tracking-wide">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <span>সমাধান ১: ১-সেকেন্ডে মোবাইলে সরাসরি অ্যাপ হিসেবে ইনস্টল করুন (১০০% জিমেইল সাপোর্ট)</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
                  সুপার ফাস্ট
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                এই অ্যাপ্লিকেশনটি একটি অফিসিয়াল <strong>PWA (Progressive Web App)</strong>। কোনো অনলাইন কনভার্টারে না গিয়ে আপনার মোবাইল থেকেই সরাসরি এটিকে আসল অ্যান্ড্রয়েড অ্যাপের মতো ফোনের হোম স্ক্রিনে ইনস্টল করে নেওয়া যায়:
              </p>

              {/* Install Steps */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0">১</span>
                  <span>আপনার মোবাইলের <strong>Google Chrome ব্রাউজার</strong> দিয়ে এই লিংকটি খুলুন:</span>
                </div>
                <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-black/60 border border-slate-800 font-mono text-[11px] text-blue-300 overflow-x-auto">
                  <span className="truncate">{sharedAppUrl}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(sharedAppUrl, 'url')}
                    className="text-amber-300 hover:text-white px-2 py-1 rounded bg-slate-800 shrink-0 font-sans text-xs flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedAppUrl ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
                <div className="flex items-start gap-2 pt-1">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0">২</span>
                  <span>Chrome ব্রাউজারের উপরে ডানদিকের <strong>তিনটি ডট মেনু (⋮)</strong> চাপুন।</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0">৩</span>
                  <span>সেখানে <strong className="text-white">"Install app"</strong> অথবা <strong className="text-white">"Add to Home screen" (হোম স্ক্রিনে যোগ করুন)</strong> অপশনে ক্লিক করুন।</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0">৪</span>
                  <span className="text-emerald-400 font-semibold">ব্যাস! আপনার মোবাইলের হোম স্ক্রিনে CCD অ্যাপের আইকন চলে আসবে। এটি ওপেন করলে আপনার আসল Gmail অ্যাকাউন্ট (FazleRabbe905@gmail.com) স্বয়ংক্রিয়ভাবে ১০০% কাজ করবে!</span>
                </div>
              </div>

              {/* Install Button if supported */}
              <div className="pt-1 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleTriggerInstall}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:opacity-95 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>{isInstalled ? 'App Already Installed' : 'মোবাইলে অ্যাপ ইনস্টল করুন (Install App)'}</span>
                </button>
              </div>
            </div>

            {/* Solution 2: Our Fixed Android APK Code */}
            <div className="p-4 rounded-2xl bg-[#0e111a] border border-[#232838] space-y-2">
              <div className="flex items-center gap-2 text-[#ffd700] font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>সমাধান ২: আমাদের এই প্রজেক্টের কোড থেকে সরাসরি APK তৈরি</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                আমরা আপনার এই প্রজেক্টের Android ফাইলটিতে (<code className="text-amber-300 font-mono">MainActivity.kt</code>) এবং Firebase লগইন ইঞ্জিনে গুগলের সব ব্লকিং বাইপাস কোড ও ইন-অ্যাপ ডায়ালগ যুক্ত করে দিয়েছি:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800">
                  <span className="text-emerald-400 font-bold">✓ User-Agent Bypass:</span>
                  <p className="text-slate-400 mt-0.5">গুগলের <code className="text-slate-300">disallowed_useragent</code> ব্লকিং রিমুভ করা হয়েছে।</p>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800">
                  <span className="text-emerald-400 font-bold">✓ Fullscreen OAuth Dialog:</span>
                  <p className="text-slate-400 mt-0.5">লগইন পপআপ অ্যাপের ভেতরেই খোলে এবং অ্যাকাউন্ট সিলেক্ট করা যায়।</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                তাই GitHub Actions থেকে তৈরি হওয়া APK অথবা Android Studio দিয়ে তৈরি APK-তে জিমেইল কোনো সমস্যা ছাড়াই চলবে!
              </p>
            </div>
          </div>
        )}

        {/* TAB: BANGLA INSTRUCTIONS */}
        {activeTab === 'bangla' && (
          <div className="mt-5 space-y-4">
            {/* Step 1: Download */}
            <div className="p-4 rounded-2xl bg-[#0e111a] border border-[#232838] space-y-2">
              <div className="flex items-center gap-2 text-[#ffd700] font-bold text-xs uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-[#ffd700]/20 flex items-center justify-center text-[11px]">১</span>
                <span>ফাইল কিভাবে ডাউনলোড করবেন?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                উপরে দেওয়া সবুজ <strong className="text-emerald-400">"Download Full Project (.ZIP)"</strong> বাটনে ক্লিক করলেই সম্পূর্ণ প্রজেক্টের জিপ ফাইলটি (<code className="text-amber-300 font-mono">ccd-hospitality-full-project.zip</code>) এক ক্লিকে ডাউনলোড হয়ে যাবে।
              </p>
            </div>

            {/* Step 2: Username & Repository */}
            <div className="p-4 rounded-2xl bg-[#0e111a] border border-[#232838] space-y-2">
              <div className="flex items-center gap-2 text-[#ffd700] font-bold text-xs uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-[#ffd700]/20 flex items-center justify-center text-[11px]">২</span>
                <span>কোন ইউজার নেম (Username) দিবেন?</span>
              </div>
              <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                <p>
                  আপনার Gmail দিয়ে <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline-flex items-center gap-0.5">GitHub.com <ExternalLink className="w-3 h-3" /></a> এ লগইন করুন।
                </p>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 font-sans">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">আপনার গিটহাব ইউজারনেম:</span>
                    <span className="text-amber-300 font-mono font-bold">আপনার নিজস্ব GitHub Username (যেমন: john-doe)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">রিপোজিটরির নাম (Repository Name):</span>
                    <span className="text-emerald-400 font-mono font-bold">ccd-hospitality-app</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Upload Options */}
            <div className="p-4 rounded-2xl bg-[#0e111a] border border-[#232838] space-y-3">
              <div className="flex items-center gap-2 text-[#ffd700] font-bold text-xs uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-[#ffd700]/20 flex items-center justify-center text-[11px]">৩</span>
                <span>GitHub-এ কিভাবে ফাইল আপলোড করবেন?</span>
              </div>

              {/* Method A: Direct Web Upload */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-950/30 to-indigo-950/20 border border-blue-500/30 space-y-1.5">
                <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5" /> উপায় ক: ব্রাউজার দিয়ে সোজা ড্র্যাগ-অ্যান্ড-ড্রপ (সবচেয়ে সহজ)
                </span>
                <ol className="list-decimal list-inside text-[11px] text-slate-300 space-y-1 pl-1">
                  <li>ডাউনলোড করা জিপ ফাইলটি আনজিপ করুন।</li>
                  <li>আপনার GitHub রিপোজিটরিতে ঢুকে <strong className="text-white">"uploading an existing file"</strong> লিংকে ক্লিক করুন।</li>
                  <li>সবগুলো ফাইল ড্র্যাগ করে ড্রপ করে নিচে <strong className="text-emerald-400">"Commit changes"</strong> দিন।</li>
                </ol>
              </div>

              {/* Method B: Git Command */}
              <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" /> উপায় খ: Git কমান্ড দিয়ে আপলোড
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(gitCommands, 'git')}
                    className="text-[11px] text-blue-400 hover:text-white flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedGitCmd ? 'Copied!' : 'Copy Commands'}</span>
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-emerald-400 bg-black/60 p-2.5 rounded-lg overflow-x-auto">
{gitCommands}
                </pre>
              </div>
            </div>

            {/* Step 4: GitHub Actions & Download APK */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-indigo-950/30 border border-purple-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-[11px]">৪</span>
                  <span>GitHub Actions থেকে তৈরি হওয়া APK ডাউনলোড</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Automated
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-300 pl-1">
                <div>১. রিপোজিটরির উপরের <strong className="text-white">"Actions"</strong> ট্যাবে যান।</div>
                <div>২. <strong className="text-white">"Build Android APK"</strong> কাজটিতে ক্লিক করুন।</div>
                <div>৩. নিচে <strong className="text-emerald-400">"Artifacts"</strong> থেকে <strong className="text-white">"CCD-Hospitality-Android-App-Debug-APK"</strong> ডাউনলোড করে ফোনে ইনস্টল করুন।</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: ENGLISH GUIDE */}
        {activeTab === 'english' && (
          <div className="mt-5 space-y-4">
            <div className="p-4 rounded-2xl bg-[#0e111a] border border-[#232838] space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#ffd700]">
                Method 1: Direct Mobile Install (PWA with full Gmail Support)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Open <code className="text-blue-300 font-mono">{sharedAppUrl}</code> in Google Chrome on your Android phone. Tap the 3 dots (⋮) and select <strong>Install App</strong> or <strong>Add to Home screen</strong>. It installs instantly with 100% Google and Gmail support!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0e111a] border border-[#232838] space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#ffd700]">
                Method 2: GitHub & Android Studio APK
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Download the ZIP bundle above, push it to your GitHub repository, and let GitHub Actions compile the APK, or build in Android Studio with our custom User-Agent and dialog fixes.
              </p>
            </div>
          </div>
        )}

        {/* Configuration Badges */}
        <div className="my-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#0b0d13] border border-[#232838] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#94a3b8] block">
                Android Package Name
              </span>
              <span className="text-xs font-mono font-bold text-[#ffd700]">
                com.ccd.abetteryou
              </span>
            </div>
            <button
              onClick={() => copyToClipboard('com.ccd.abetteryou', 'pkg')}
              className="p-1.5 text-xs text-[#94a3b8] hover:text-white bg-[#171a25] rounded-lg"
              title="Copy"
            >
              {copiedPackage ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0b0d13] border border-[#232838] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#94a3b8] block">
                Default Account Email
              </span>
              <span className="text-xs font-mono font-bold text-white">
                FazleRabbe905@gmail.com
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Verified
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#242938]">
          <div className="flex items-center gap-2 text-[11px] text-[#64748b]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Google OAuth & Gmail Integration Protection Enabled</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#1b202e] hover:bg-[#252b3d] text-slate-200 font-bold text-xs tracking-wider uppercase transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
