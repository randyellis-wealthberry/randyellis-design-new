import { Calendar, ExternalLink, Mail, Phone, MessageCircle } from "lucide-react";
import { ModalContent, ModalFooter } from "@/components/ui/animated-modal";

interface BookingModalProps {
  onBookingClick?: () => void;
}

export const BookingModal = ({ onBookingClick }: BookingModalProps) => {
  return (
    <>
      <ModalContent>
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="relative inline-flex">
              {/* Neumorphic avatar container */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 shadow-[inset_2px_2px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_8px_rgba(0,0,0,0.1)] dark:shadow-[inset_2px_2px_8px_rgba(255,255,255,0.05),inset_-2px_-2px_8px_rgba(0,0,0,0.2)] flex items-center justify-center">
                <MessageCircle className="w-7 h-7 sm:w-9 sm:h-9 text-gray-600/70 dark:text-gray-300/70" />
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/10 to-purple-400/10" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-light text-gray-800 dark:text-gray-100 tracking-wide">
                Let's Connect
              </h2>
              <p className="text-sm sm:text-base text-gray-600/80 dark:text-gray-300/80 font-light leading-relaxed max-w-sm mx-auto">
                Ready to discuss your next project? Book a call or reach out directly.
              </p>
            </div>
          </div>
          
          {/* Contact Cards */}
          <div className="space-y-4">
            {/* Email Card */}
            <div className="group relative rounded-2xl bg-white/8 dark:bg-black/15 backdrop-blur-sm border border-white/15 dark:border-white/8 p-4 sm:p-5 shadow-[2px_2px_8px_rgba(0,0,0,0.08),-2px_-2px_8px_rgba(255,255,255,0.08)] dark:shadow-[2px_2px_8px_rgba(0,0,0,0.15),-2px_-2px_8px_rgba(255,255,255,0.02)] hover:shadow-[1px_1px_6px_rgba(0,0,0,0.1),-1px_-1px_6px_rgba(255,255,255,0.1)] dark:hover:shadow-[1px_1px_6px_rgba(0,0,0,0.2),-1px_-1px_6px_rgba(255,255,255,0.03)] transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-400/20 dark:bg-blue-400/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600/80 dark:text-blue-400/80" />
                </div>
                <span className="text-gray-700 dark:text-gray-200 font-light text-sm sm:text-base">hello@randyellis.design</span>
              </div>
            </div>
            
            {/* Phone Card */}
            <div className="group relative rounded-2xl bg-white/8 dark:bg-black/15 backdrop-blur-sm border border-white/15 dark:border-white/8 p-4 sm:p-5 shadow-[2px_2px_8px_rgba(0,0,0,0.08),-2px_-2px_8px_rgba(255,255,255,0.08)] dark:shadow-[2px_2px_8px_rgba(0,0,0,0.15),-2px_-2px_8px_rgba(255,255,255,0.02)] hover:shadow-[1px_1px_6px_rgba(0,0,0,0.1),-1px_-1px_6px_rgba(255,255,255,0.1)] dark:hover:shadow-[1px_1px_6px_rgba(0,0,0,0.2),-1px_-1px_6px_rgba(255,255,255,0.03)] transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-green-400/20 dark:bg-green-400/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600/80 dark:text-green-400/80" />
                </div>
                <span className="text-gray-700 dark:text-gray-200 font-light text-sm sm:text-base">Available for calls worldwide</span>
              </div>
            </div>
            
            {/* Calendar Card */}
            <div className="group relative rounded-2xl bg-white/8 dark:bg-black/15 backdrop-blur-sm border border-white/15 dark:border-white/8 p-4 sm:p-5 shadow-[2px_2px_8px_rgba(0,0,0,0.08),-2px_-2px_8px_rgba(255,255,255,0.08)] dark:shadow-[2px_2px_8px_rgba(0,0,0,0.15),-2px_-2px_8px_rgba(255,255,255,0.02)] hover:shadow-[1px_1px_6px_rgba(0,0,0,0.1),-1px_-1px_6px_rgba(255,255,255,0.1)] dark:hover:shadow-[1px_1px_6px_rgba(0,0,0,0.2),-1px_-1px_6px_rgba(255,255,255,0.03)] transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-purple-400/20 dark:bg-purple-400/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600/80 dark:text-purple-400/80" />
                </div>
                <span className="text-gray-700 dark:text-gray-200 font-light text-sm sm:text-base">15-30 minute discovery calls</span>
              </div>
            </div>
          </div>
          
          {/* Discussion Points */}
          <div className="space-y-5">
            <h3 className="text-lg font-light text-gray-800 dark:text-gray-100 text-center">
              What we'll discuss
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { text: "Project goals & timeline", color: "purple" },
                { text: "GenAI opportunities", color: "blue" },
                { text: "Technical requirements", color: "green" },
                { text: "Next steps", color: "orange" }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3 text-sm">
                  <div className={`w-2 h-2 rounded-full bg-${item.color}-400/60 dark:bg-${item.color}-400/40`} />
                  <span className="text-gray-600 dark:text-gray-300 font-light">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ModalContent>
      
      <ModalFooter>
        <button
          onClick={onBookingClick}
          className="group relative w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-4 sm:px-6 sm:py-3 rounded-2xl font-light text-white overflow-hidden bg-gradient-to-br from-blue-500/80 to-purple-600/80 backdrop-blur-sm border border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] min-h-[48px]"
        >
          {/* Glassmorphic overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
          
          {/* Button content */}
          <Calendar className="w-5 h-5 relative z-10" />
          <span className="relative z-10 text-base sm:text-sm">Book a Call</span>
          <ExternalLink className="w-4 h-4 relative z-10 opacity-70" />
        </button>
      </ModalFooter>
    </>
  );
};