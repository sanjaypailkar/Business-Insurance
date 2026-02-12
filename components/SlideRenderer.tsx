
import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { SlideData } from '../types';
import { 
  Briefcase, 
  ChevronRight,
  ShieldCheck, 
  CheckCircle2,
  XCircle,
  TrendingUp,
  Target,
  Users,
  AlertCircle,
  Quote as QuoteIcon
} from 'lucide-react';

interface Props {
  slide: SlideData;
  direction: number;
}

const containerVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 500 : -500,
    opacity: 0,
    scale: 0.98
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.3 }
    }
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 500 : -500,
    opacity: 0,
    scale: 0.98,
    transition: {
      opacity: { duration: 0.2 }
    }
  })
};

const itemVariants: Variants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
};

export const SlideRenderer: React.FC<Props> = ({ slide, direction }) => {
  // Utility to determine font sizes based on content density
  const getFontSizeClass = (count: number, type: 'title' | 'body' | 'list') => {
    if (type === 'title') {
      if (slide.title.length > 40) return 'text-2xl lg:text-3xl';
      return 'text-3xl lg:text-4xl';
    }
    if (type === 'list') {
      if (count > 12) return 'text-xs lg:text-sm';
      if (count > 8) return 'text-sm lg:text-base';
      return 'text-base lg:text-lg';
    }
    return 'text-base';
  };

  const renderContent = () => {
    switch (slide.layout) {
      case 'title':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-4 overflow-hidden">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="maroon-bg p-4 rounded-2xl shadow-lg shrink-0"
            >
              <Briefcase className="w-12 h-12 text-white" />
            </motion.div>
            <div className="space-y-2 max-w-4xl">
              <motion.h1 
                className="text-4xl lg:text-6xl font-black maroon-text leading-tight tracking-tighter"
                variants={itemVariants}
              >
                {slide.title}
              </motion.h1>
              {slide.subtitle && (
                <motion.p 
                  className="text-lg lg:text-xl text-gray-500 font-semibold max-w-2xl mx-auto"
                  variants={itemVariants}
                >
                  {slide.subtitle}
                </motion.p>
              )}
            </div>
            {slide.content.length > 0 && (
              <motion.div 
                className="flex flex-wrap justify-center gap-2 mt-4 w-full max-w-3xl"
                variants={itemVariants}
              >
                {slide.content.map((line, i) => (
                  <div key={i} className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-full shadow-sm">
                    <p className="text-sm lg:text-base maroon-text font-bold uppercase tracking-wide">{line}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        );

      case 'bullets':
        const items = slide.content;
        const itemCount = items.length;
        const bulletTextSize = getFontSizeClass(itemCount, 'list');
        let bulletCols = 'grid-cols-1';
        if (itemCount > 10) bulletCols = 'grid-cols-2 lg:grid-cols-3';
        else if (itemCount > 5) bulletCols = 'grid-cols-1 lg:grid-cols-2';

        return (
          <div className="flex flex-col h-full space-y-3 min-h-0">
            <motion.div variants={itemVariants} className="shrink-0">
               <h2 className={`${getFontSizeClass(0, 'title')} font-black maroon-text leading-tight tracking-tight border-l-8 maroon-border pl-4`}>
                {slide.title}
              </h2>
            </motion.div>

            <div className="flex-grow min-h-0 overflow-y-auto custom-scrollbar pr-2">
              <div className={`grid ${bulletCols} gap-2 py-2`}>
                {items.map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-start space-x-2 bg-gray-50 p-2 lg:p-3 rounded-xl border border-gray-100 h-full shadow-sm"
                  >
                    <div className="mt-1 shrink-0">
                      <ChevronRight className="w-4 h-4 maroon-text" />
                    </div>
                    <span className={`${bulletTextSize} text-gray-800 font-bold leading-tight`}>
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {slide.highlight && (
              <motion.div 
                variants={itemVariants}
                className="bg-maroon-bg px-4 py-3 rounded-xl shadow-md shrink-0 mt-2"
              >
                <p className="text-sm lg:text-base text-white font-black text-center italic uppercase tracking-wider">
                  {slide.highlight}
                </p>
              </motion.div>
            )}
          </div>
        );

      case 'process':
        const steps = slide.points || [];
        const isDenseProcess = steps.length > 4;
        const processTextSize = steps.length > 4 ? 'text-xs' : 'text-sm';

        return (
          <div className="flex flex-col h-full space-y-2 min-h-0">
            <div className="shrink-0">
              <h2 className={`${getFontSizeClass(0, 'title')} font-black maroon-text tracking-tight`}>{slide.title}</h2>
              {slide.subtitle && <p className="text-sm lg:text-base text-gray-500 font-bold italic">{slide.subtitle}</p>}
            </div>

            <div className="flex-grow min-h-0 overflow-y-auto custom-scrollbar pr-2 flex flex-col justify-center">
              <div className={`grid ${steps.length > 4 ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'} gap-3 py-4`}>
                {steps.map((point, i) => (
                  <motion.div 
                    key={i}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white p-3 lg:p-4 rounded-xl border border-gray-200 flex flex-col items-center text-center space-y-2 h-full shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-lg maroon-bg text-white flex items-center justify-center text-sm font-black shrink-0">
                      {i + 1}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs lg:text-sm font-black maroon-text uppercase tracking-tight leading-tight">{point.title}</h3>
                      <p className={`text-gray-700 ${processTextSize} lg:text-sm font-bold leading-tight`}>{point.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {slide.content.length > 0 && (
              <div className="flex justify-center shrink-0 mt-2">
                <div className="bg-gray-900 text-white px-4 py-1.5 rounded-full text-[10px] lg:text-xs font-black uppercase tracking-widest">
                   {slide.content[0]}
                </div>
              </div>
            )}
          </div>
        );

      case 'stat':
        const stats = slide.points || [];
        const statGridCols = stats.length > 4 ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2';
        const statFontSize = stats.length > 6 ? 'text-sm' : 'text-base';

        return (
          <div className="flex flex-col h-full space-y-4 min-h-0">
            <h2 className={`${getFontSizeClass(0, 'title')} font-black maroon-text text-center tracking-tight shrink-0`}>{slide.title}</h2>
            
            <div className="flex-grow min-h-0 overflow-y-auto custom-scrollbar flex items-center justify-center">
              <div className={`grid ${statGridCols} gap-3 w-full py-2`}>
                {stats.map((point, i) => (
                  <motion.div 
                    key={i}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col space-y-1 h-full justify-center border-l-4 maroon-border"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <h3 className="text-[10px] lg:text-xs font-black text-gray-500 uppercase tracking-wider">{point.title}</h3>
                    <p className={`${statFontSize} lg:text-lg text-maroon-bg font-extrabold leading-tight tracking-tight`}>{point.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {slide.content.length > 0 && (
              <div className="bg-gray-50 p-2 rounded-lg border-t-2 maroon-border shrink-0">
                <p className="text-[10px] lg:text-xs font-bold text-gray-600 text-center uppercase tracking-wide">{slide.content[0]}</p>
              </div>
            )}
          </div>
        );

      case 'table':
        return (
          <div className="flex flex-col h-full space-y-3 min-h-0">
            <h2 className={`${getFontSizeClass(0, 'title')} font-black maroon-text tracking-tight shrink-0`}>{slide.title}</h2>
            <div className="flex-grow min-h-0 overflow-auto border border-gray-200 rounded-xl shadow-inner bg-white custom-scrollbar">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="maroon-bg text-white">
                    {slide.tableData?.headers.map((h, i) => (
                      <th key={i} className="p-2 lg:p-3 text-[10px] lg:text-xs font-black uppercase text-left border-r border-white/10 last:border-0">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {slide.tableData?.rows.map((row, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      {row.map((cell, j) => (
                        <td key={j} className={`p-2 lg:p-3 text-[10px] lg:text-sm ${j === 0 ? 'font-bold maroon-text' : 'text-gray-700 font-medium'}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'comparison':
        return (
          <div className="flex flex-col h-full space-y-3 min-h-0">
            <div className="shrink-0">
              <h2 className={`${getFontSizeClass(0, 'title')} font-black maroon-text tracking-tight`}>{slide.title}</h2>
              {slide.subtitle && <p className="text-xs lg:text-sm text-gray-400 font-black uppercase tracking-widest">{slide.subtitle}</p>}
            </div>

            <div className="flex-grow min-h-0 flex items-center justify-center overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full py-2">
                {slide.points?.map((point, i) => (
                  <motion.div 
                    key={i}
                    className={`p-4 lg:p-5 rounded-2xl shadow-md border-2 flex flex-col space-y-3 h-full ${i === 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <div className="flex items-center space-x-2 shrink-0">
                      {i === 0 ? <XCircle className="text-red-500 w-5 h-5 lg:w-6 lg:h-6" /> : <CheckCircle2 className="text-green-500 w-5 h-5 lg:w-6 lg:h-6" />}
                      <h3 className="text-sm lg:text-base font-black text-gray-900 uppercase tracking-tight">{point.title}</h3>
                    </div>
                    <p className="text-xs lg:text-sm text-gray-700 font-bold leading-tight flex-grow">{point.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {slide.highlight && (
              <div className="bg-gray-900 text-white p-3 lg:p-4 rounded-xl text-center shadow shrink-0 mt-2">
                <p className="text-xs lg:text-sm font-black uppercase tracking-[0.2em]">{slide.highlight}</p>
              </div>
            )}
          </div>
        );

      case 'quote':
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-8 px-4 overflow-hidden">
            <h2 className="text-2xl lg:text-5xl font-black maroon-text uppercase tracking-tighter text-center leading-none">
              {slide.title}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-5xl">
               {slide.points?.map((point, i) => (
                 <motion.div 
                    key={i}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`p-6 lg:p-10 rounded-2xl text-center shadow-lg border-2 flex flex-col justify-center h-full ${i === 0 ? 'bg-white border-red-50' : 'maroon-bg text-white border-maroon-bg'}`}
                 >
                    <div className={`text-[10px] lg:text-xs font-black uppercase tracking-widest mb-2 opacity-60`}>
                      {point.title}
                    </div>
                    <div className="text-lg lg:text-2xl font-black italic leading-tight">
                      "{point.desc}"
                    </div>
                 </motion.div>
               ))}
            </div>
          </div>
        );

      case 'thank-you':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 px-6 overflow-hidden">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="maroon-bg p-6 lg:p-8 rounded-full shadow-2xl shrink-0"
            >
              <ShieldCheck className="w-12 h-12 lg:w-20 lg:h-20 text-white" />
            </motion.div>
            
            <div className="space-y-1">
              <h1 className="text-4xl lg:text-7xl font-black maroon-text tracking-tighter">Thank You</h1>
              <p className="text-base lg:text-xl font-black text-gray-800 uppercase tracking-widest">{slide.subtitle}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 max-w-4xl">
              {slide.content.map((item, i) => (
                <div key={i} className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-sm lg:text-base text-gray-700 font-bold italic tracking-tight">{item}</p>
                </div>
              ))}
            </div>

            <div className="flex space-x-6 pt-2 shrink-0 opacity-50">
              <div className="flex items-center space-x-1">
                <Users size={16} className="maroon-text" />
                <span className="text-[10px] font-black uppercase text-gray-400">Team</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp size={16} className="maroon-text" />
                <span className="text-[10px] font-black uppercase text-gray-400">Strategy</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target size={16} className="maroon-text" />
                <span className="text-[10px] font-black uppercase text-gray-400">Results</span>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-300">
            <AlertCircle size={60} className="mb-4 opacity-20" />
            <p className="text-xl font-black uppercase tracking-widest opacity-20">Layout Unavailable</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full p-8 lg:p-12 flex flex-col relative overflow-hidden bg-white rounded-[1.5rem] shadow-xl selection:bg-maroon-bg selection:text-white">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #80000040; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #80000080; }
      `}</style>
      
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          variants={containerVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="w-full h-full overflow-hidden"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
