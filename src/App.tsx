import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, Calendar, ChevronLeft, User, Lock, X, ArrowRight } from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showReservation, setShowReservation] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex justify-center font-sans text-gray-900 selection:bg-gray-200">
      {/* Mobile Container */}
      <div className="w-full max-w-[414px] bg-white relative overflow-hidden shadow-2xl sm:rounded-[2.5rem] sm:my-8 sm:h-[896px] h-screen flex flex-col">
        
        {/* Status Bar Mock (Optional, for realism on desktop) */}
        <div className="h-12 hidden sm:flex justify-between items-center px-6 text-xs font-medium text-gray-900">
          <span>{currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}</span>
          <div className="flex space-x-2">
            <div className="w-4 h-4 rounded-full bg-gray-900" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col relative">
          <AnimatePresence mode="wait">
            {!isLoggedIn ? (
              <motion.div 
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                {/* Header */}
                <div className="pt-20 pb-12 px-8">
                  <div className="flex items-center space-x-1 mb-2">
                    <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center p-2">
                      <img 
                        src="https://www.nio.cn/cdn-static/mynio/nextjs/images/icons/nio-logo-white.svg" 
                        alt="NIO Logo" 
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <h1 className="text-3xl font-semibold tracking-tight">NIO</h1>
                  </div>
                  <p className="text-gray-500 text-sm tracking-widest mt-4">Blue Sky Coming</p>
                  <h2 className="text-2xl font-medium mt-8">欢迎登入</h2>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="px-8 space-y-8">
                  <div className="space-y-6">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                      </div>
                      <input 
                        type="text" 
                        required
                        placeholder="请输入账号" 
                        className="w-full pl-10 pr-4 py-4 border-b border-gray-200 outline-none text-lg bg-transparent focus:border-gray-900 transition-colors placeholder:text-gray-300"
                      />
                    </div>
                    
                    <div className="relative group flex items-end">
                      <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                      </div>
                      <input 
                        type="password" 
                        required
                        placeholder="请输入密码" 
                        className="w-full pl-10 pr-4 py-4 border-b border-gray-200 outline-none text-lg bg-transparent focus:border-gray-900 transition-colors placeholder:text-gray-300"
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-full text-lg font-medium tracking-widest hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center space-x-2">
                    <span>登入</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-start space-x-2 text-xs text-gray-400 pt-4">
                    <input type="checkbox" required className="mt-0.5 rounded border-gray-300 text-gray-900 focus:ring-gray-900" defaultChecked />
                    <span className="leading-relaxed">
                      我已阅读并同意 <a href="#" className="text-gray-900 underline underline-offset-2">《用户协议》</a> 与 <a href="#" className="text-gray-900 underline underline-offset-2">《隐私政策》</a>
                    </span>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center px-8"
              >
                <div className="text-center space-y-3 mb-16">
                  <div className="w-20 h-20 bg-gray-50 rounded-full mx-auto flex items-center justify-center border border-gray-100 shadow-sm">
                    <User className="w-10 h-10 text-gray-300" />
                  </div>
                  <h2 className="text-2xl font-medium tracking-wide">欢迎回来</h2>
                  <p className="text-gray-500 text-sm tracking-widest">愉悦生活，由此开启</p>
                </div>

                <div className="flex justify-center space-x-8 w-full max-w-sm">
                  <button 
                    onClick={() => setShowQR(true)}
                    className="flex-1 flex flex-col items-center space-y-4 group"
                  >
                    <div className="w-24 h-24 rounded-[2rem] bg-gray-50 flex items-center justify-center shadow-sm border border-gray-100 group-hover:bg-gray-100 group-active:scale-95 transition-all">
                      <QrCode className="w-10 h-10 text-gray-700" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 tracking-wider">牛屋二维码</span>
                  </button>

                  <button 
                    onClick={() => setShowReservation(true)}
                    className="flex-1 flex flex-col items-center space-y-4 group"
                  >
                    <div className="w-24 h-24 rounded-[2rem] bg-gray-50 flex items-center justify-center shadow-sm border border-gray-100 group-hover:bg-gray-100 group-active:scale-95 transition-all">
                      <Calendar className="w-10 h-10 text-gray-700" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 tracking-wider">虹桥牛屋预约</span>
                  </button>
                </div>

                <button 
                  onClick={() => setIsLoggedIn(false)}
                  className="absolute bottom-12 text-sm text-gray-400 hover:text-gray-900 transition-colors underline underline-offset-4"
                >
                  退出登入
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* QR Code Modal */}
        <AnimatePresence>
          {showQR && (
            <motion.div 
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 250 }}
              className="absolute inset-0 bg-[#1a1a1a] z-50 flex flex-col"
            >
              <div className="pt-16 px-6 pb-6 flex justify-between items-center text-white">
                <button onClick={() => setShowQR(false)} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
                <span className="text-lg font-medium tracking-widest">NIO House</span>
                <div className="w-10" /> {/* Spacer */}
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
                <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full flex flex-col items-center relative overflow-hidden">
                  {/* Decorative background elements */}
                  <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-50 to-transparent" />
                  
                  <h3 className="text-2xl font-semibold mb-1 relative z-10">进入牛屋</h3>
                  <p className="text-gray-500 text-sm mb-10 relative z-10">向工作人员出示此二维码</p>
                  
                  {/* Mock QR Code */}
                  <div className="w-56 h-56 bg-white border border-gray-100 shadow-sm rounded-2xl flex items-center justify-center relative overflow-hidden z-10 p-4">
                    <QrCode className="w-full h-full text-gray-900" strokeWidth={1} />
                    {/* Scanning animation line */}
                    <motion.div 
                      animate={{ y: ['0%', '200%', '0%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute top-0 left-0 w-full h-0.5 bg-gray-900 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                    />
                  </div>
                  
                  <div className="mt-10 flex flex-col items-center space-y-2 relative z-10">
                    <span className="font-mono text-2xl tracking-widest font-medium text-gray-900">
                      {formatTime(currentTime)}
                    </span>
                    <p className="text-xs text-gray-400">动态二维码每分钟自动刷新</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reservation Modal */}
        <AnimatePresence>
          {showReservation && (
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 250 }}
              className="absolute inset-0 bg-white z-50 flex flex-col"
            >
              <div className="pt-16 px-4 pb-4 flex items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <button onClick={() => setShowReservation(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <span className="text-lg font-medium ml-2">虹桥机场牛屋预约</span>
              </div>
              
              <div className="flex-1 overflow-y-auto pb-32">
                <div className="px-6 py-4">
                  <div className="aspect-[4/3] bg-gray-100 rounded-3xl overflow-hidden relative shadow-sm">
                    <img 
                      src="https://picsum.photos/seed/niohouse/800/600" 
                      alt="NIO House Hongqiao" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 flex flex-col justify-end p-6">
                      <div className="bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-full text-white text-xs mb-2 border border-white/30">
                        上海虹桥国际机场 T2
                      </div>
                      <h3 className="text-white font-medium text-xl">NIO House | 虹桥机场</h3>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-6 space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <h4 className="font-medium text-gray-900 text-lg">选择预约时间</h4>
                      <span className="text-sm text-gray-500">今天</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {['10:00', '11:00', '13:00', '14:00', '15:00', '16:00'].map((time, i) => (
                        <button 
                          key={time} 
                          className={`py-3.5 rounded-2xl border text-sm font-medium transition-all active:scale-95 ${
                            i === 2 
                              ? 'border-gray-900 bg-gray-900 text-white shadow-md' 
                              : 'border-gray-200 text-gray-600 hover:border-gray-900 bg-white'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 text-lg">出行信息</h4>
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        placeholder="航班号 (选填)" 
                        className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-gray-200 transition-colors placeholder:text-gray-400" 
                      />
                      <input 
                        type="text" 
                        placeholder="同行人数 (选填)" 
                        className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-gray-200 transition-colors placeholder:text-gray-400" 
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 w-full p-6 bg-white border-t border-gray-100 pb-safe">
                <button className="w-full bg-gray-900 text-white py-4 rounded-full text-lg font-medium tracking-widest hover:bg-gray-800 active:scale-[0.98] transition-all shadow-lg shadow-gray-900/20">
                  确认预约
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
