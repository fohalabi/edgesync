'use client';

interface ComingSoonProps {
  darkMode: boolean;
}

export default function ComingSoon({ darkMode }: ComingSoonProps) {
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`${cardBg} p-6 rounded-xl border-2 border-dashed ${borderColor} relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-5 rounded-full -mr-16 -mt-16"></div>
      <div className="relative">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          Coming Soon: Rule Builder
        </h2>
        <p className={`${textSecondary} mb-4`}>
          Create custom personalization rules with visual conditions and actions
        </p>
        <div className={`${darkMode ? 'bg-gray-900' : 'bg-gray-100'} p-4 rounded-lg font-mono text-sm`}>
          <span className="text-blue-500">IF</span> location <span className="text-orange-500">==</span>{' '}
          <span className="text-green-500"> `Nigeria`</span>{' '}
          <span className="text-blue-500">THEN</span> showBanner(<span className="text-green-500">`₦ Pricing`</span>)
        </div>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Join Waitlist →
        </button>
      </div>
    </div>
  );
}